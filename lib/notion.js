import { NotionAPI } from 'notion-client'
import { getDateValue, getTextContent, idToUuid } from 'notion-utils'
import config from '../blog.config'
import { normalizeCollection, normalizePageBlock } from './normalize'
import { adapterNotionBlockMap } from './record-map'
import {
  cleanSlug,
  isPublic,
  normalizeId,
  publicSummary,
  pruneRecordMap
} from './public-content.cjs'

const client = new NotionAPI({
  apiBaseUrl: config.API_BASE_URL,
  authToken: config.NOTION_TOKEN_V2 || undefined,
  activeUser: config.NOTION_ACTIVE_USER || undefined,
  userTimeZone: 'Asia/Hong_Kong',
  kyOptions: {
    timeout: 15000,
    retry: { limit: 1 },
    hooks: {
      beforeRequest: [
        request =>
          request.url.includes('/api/v3/syncRecordValues')
            ? new Request(
                request.url.replace(
                  '/api/v3/syncRecordValues',
                  '/api/v3/syncRecordValuesMain'
                ),
                request
              )
            : request
      ]
    }
  }
})
let cached
let inflight

function imageUrl(source, id) {
  if (!source) return ''
  if (source.startsWith('/')) return `https://www.notion.so${source}`
  if (
    source.startsWith('attachment:') ||
    source.includes('prod-files-secure') ||
    source.includes('secure.notion-static.com')
  ) {
    return `https://www.notion.so/image/${encodeURIComponent(source)}?table=block&id=${id}&width=1600`
  }
  return /^https?:\/\//.test(source) ? source : ''
}

async function readDatabase() {
  const databaseId = idToUuid(config.NOTION_PAGE_ID.split(',')[0])
  const map = await client.getPage(databaseId)
  const root = normalizePageBlock(map.block?.[databaseId])
  if (!root?.collection_id)
    throw new Error('Notion blog database is unavailable')
  const collection = normalizeCollection(map.collection?.[root.collection_id])
  if (!collection.schema) throw new Error('Notion blog schema is unavailable')
  const ids = new Set()
  for (const view of Object.values(
    map.collection_query?.[root.collection_id] || {}
  )) {
    for (const id of view?.collection_group_results?.blockIds ||
      view?.blockIds ||
      [])
      ids.add(id)
  }
  // Only direct children of this database may enter the publication boundary.
  for (const [id, item] of Object.entries(map.block || {})) {
    const block = normalizePageBlock(item)
    if (normalizeId(block?.parent_id) === normalizeId(root.collection_id))
      ids.add(id)
  }
  const missing = [...ids].filter(id => !normalizePageBlock(map.block?.[id]))
  if (missing.length) {
    const extra = await client.getBlocks(missing)
    Object.assign(map.block, extra?.recordMap?.block || {})
  }
  const rows = []
  for (const id of ids) {
    const block = normalizePageBlock(map.block?.[id])
    if (
      !block ||
      block.alive === false ||
      normalizeId(block.parent_id) !== normalizeId(root.collection_id)
    )
      continue
    const values = {}
    for (const [key, schema] of Object.entries(collection.schema)) {
      const raw = block.properties?.[key]
      if (!raw) continue
      values[schema.name] =
        schema.type === 'date' ? getDateValue(raw) : getTextContent(raw)
    }
    const rawSlug = cleanSlug(values.slug || id)
    const prefix = cleanSlug(config.POST_URL_PREFIX)
    const row = {
      id,
      title: values.title || '',
      type: values.type,
      status: values.status,
      password: values.password || '',
      date: values.date || {},
      slug:
        values.type === 'Post' &&
        prefix &&
        rawSlug &&
        !rawSlug.startsWith(`${prefix}/`)
          ? `${prefix}/${rawSlug}`
          : rawSlug,
      summary: values.summary || '',
      category: values.category || '',
      tags: values.tags
        ? values.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        : [],
      publishedAt:
        values.date?.start_date ||
        new Date(block.created_time).toISOString().slice(0, 10),
      updatedAt: new Date(
        block.last_edited_time || block.created_time
      ).toISOString(),
      cover: imageUrl(block.format?.page_cover, id),
      featured: ['Yes', 'true', '1'].includes(
        values['精选'] || values.featured
      ),
      order: Number(values['排序'] || values.order) || 0
    }
    if (isPublic(row)) rows.push(row)
  }
  rows.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  return rows
}

export async function getCatalog() {
  if (process.env.BLOG_TEST_FIXTURE === 'true' && !process.env.VERCEL) {
    const { fixtureRows } = await import('../tests/fixtures.cjs')
    return fixtureRows.filter(row => isPublic(row))
  }
  if (cached && Date.now() - cached.at < 30000)
    return cached.rows.filter(row => isPublic(row))
  if (!inflight)
    inflight = readDatabase()
      .then(rows => {
        cached = { at: Date.now(), rows }
        return rows
      })
      .finally(() => {
        inflight = null
      })
  return inflight
}

export async function listingProps() {
  try {
    const rows = await getCatalog()
    return {
      props: {
        posts: rows.filter(row => row.type === 'Post').map(publicSummary),
        unavailable: false
      },
      revalidate: config.REVALIDATE_SECONDS
    }
  } catch (error) {
    console.error('[blog] Notion listing unavailable:', error.message)
    // Do not convert an outage into a successful empty ISR refresh.
    // Build-independent pages still work; content pages show the shared error boundary.
    throw error
  }
}

export async function getArticleBody(id) {
  if (process.env.BLOG_TEST_FIXTURE === 'true' && !process.env.VERCEL) {
    const { fixtureMap } = await import('../tests/fixtures.cjs')
    return fixtureMap
  }
  const raw = adapterNotionBlockMap(await client.getPage(id))
  return pruneRecordMap(raw, idToUuid(id))
}
