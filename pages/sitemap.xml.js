import { getCatalog } from '../lib/notion'
import { escapeXml } from '../lib/public-content.cjs'
import { site } from '../lib/site'
export default function Sitemap() {
  return null
}
export async function getServerSideProps({ res }) {
  if (!site.url) {
    res.statusCode = 503
    res.end('Set NEXT_PUBLIC_SITE_URL to enable sitemap.')
    return { props: {} }
  }
  try {
    const rows = await getCatalog()
    const paths = [
      ...new Set([
        '',
        'articles',
        'projects',
        'about',
        'archive',
        ...rows.filter(p => p.slug !== 'home').map(p => p.slug)
      ])
    ]
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    res.end(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>${escapeXml(`${site.url}/${p}`)}</loc></url>`).join('')}</urlset>`
    )
  } catch (_) {
    res.statusCode = 503
    res.setHeader('Cache-Control', 'no-store')
    res.end('Sitemap temporarily unavailable')
  }
  return { props: {} }
}
