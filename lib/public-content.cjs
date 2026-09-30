// One publication boundary shared by listings, detail routes, feeds and tests.
const normalizeId = value =>
  String(value || '')
    .replace(/-/g, '')
    .toLowerCase()
function cleanSlug(value) {
  const slug = String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
  if (
    !slug ||
    /[?#\\:]/.test(slug) ||
    slug.split('/').some(part => !part || part === '.' || part === '..')
  )
    return null
  return slug
}
function isPublic(row, now = Date.now()) {
  if (
    !row ||
    row.status !== 'Published' ||
    !['Post', 'Page'].includes(row.type) ||
    !row.title?.trim() ||
    row.password
  )
    return false
  const start = row.date?.start_date
  const end = row.date?.end_date
  const stamp = (day, time) => {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
      !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/.test(time)
    )
      return NaN
    const value = Date.parse(`${day}T${time}+08:00`)
    // Date.parse normalizes impossible dates such as February 30.
    return Number.isFinite(value) &&
      new Date(value + 8 * 60 * 60 * 1000).toISOString().slice(0, 10) === day
      ? value
      : NaN
  }
  const startAt = start ? stamp(start, row.date.start_time || '00:00:00') : null
  const endAt = end ? stamp(end, row.date.end_time || '23:59:59.999') : null
  if (startAt !== null && (!Number.isFinite(startAt) || startAt > now))
    return false
  if (endAt !== null && (!Number.isFinite(endAt) || endAt < now)) return false
  return !!cleanSlug(row.slug || row.id)
}
function findPublicPage(rows, path) {
  const slug = cleanSlug(path)
  if (!slug) return null
  return (
    rows.find(
      row =>
        isPublic(row) &&
        (row.slug === slug || normalizeId(row.id) === normalizeId(slug))
    ) || null
  )
}
function publicSummary(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    summary: row.summary || '',
    category: row.category || '',
    tags: row.tags || [],
    publishedAt: row.publishedAt || null,
    updatedAt: row.updatedAt || null,
    cover: row.cover || '',
    featured: !!row.featured,
    order: Number(row.order) || 0
  }
}
function escapeXml(value) {
  return String(value || '').replace(
    /[<>&'"]/g,
    c =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;'
      })[c]
  )
}
function pruneRecordMap(raw, rootId) {
  const blocks = {}
  function visit(id) {
    if (blocks[id]) return
    const block = raw.block?.[id]?.value
    if (
      !block ||
      block.alive === false ||
      (id !== rootId &&
        [
          'page',
          'collection_view',
          'collection_view_page',
          'transclusion_reference'
        ].includes(block.type))
    )
      return
    const { permissions, created_by_id, last_edited_by_id, ...value } = block
    // Database columns may include private editorial notes, even on a public row.
    if (id === rootId)
      value.properties = { title: block.properties?.title || [] }
    blocks[id] = { value: { ...value } }
    for (const child of block.content || []) visit(child)
    if (block.content)
      blocks[id].value.content = block.content.filter(child => blocks[child])
  }
  visit(rootId)
  if (!blocks[rootId]) throw new Error('Article body is unavailable')
  return {
    block: blocks,
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: Object.fromEntries(
      Object.entries(raw.signed_urls || {}).filter(([id]) => blocks[id])
    )
  }
}
module.exports = {
  pruneRecordMap,
  normalizeId,
  cleanSlug,
  isPublic,
  findPublicPage,
  publicSummary,
  escapeXml
}
