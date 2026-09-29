import { getCatalog } from '../lib/notion'
import { escapeXml } from '../lib/public-content.cjs'
import { site } from '../lib/site'
export default function Feed() {
  return null
}
export async function getServerSideProps({ res }) {
  if (!site.url) {
    res.statusCode = 503
    res.end('Set NEXT_PUBLIC_SITE_URL to enable the RSS feed.')
    return { props: {} }
  }
  try {
    const posts = (await getCatalog()).filter(p => p.type === 'Post')
    const items = posts
      .map(
        p =>
          `<item><title>${escapeXml(p.title)}</title><link>${escapeXml(`${site.url}/${p.slug}`)}</link><guid isPermaLink="true">${escapeXml(`${site.url}/${p.slug}`)}</guid><description>${escapeXml(p.summary)}</description><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate></item>`
      )
      .join('')
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    res.end(
      `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Evity · 代码与生活</title><link>${escapeXml(site.url)}</link><description>${escapeXml(site.description)}</description><language>zh-CN</language>${items}</channel></rss>`
    )
  } catch (_) {
    res.statusCode = 503
    res.setHeader('Cache-Control', 'no-store')
    res.end('Feed temporarily unavailable')
  }
  return { props: {} }
}
