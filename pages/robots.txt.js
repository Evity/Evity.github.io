import { site } from '../lib/site'
export default function Robots() {
  return null
}
export function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(
    process.env.VERCEL_ENV === 'preview'
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nDisallow: /search\n${site.url ? `Sitemap: ${site.url}/sitemap.xml\n` : ''}`
  )
  return { props: {} }
}
