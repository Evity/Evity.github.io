/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return process.env.VERCEL_ENV === 'preview'
      ? [
          {
            source: '/:path*',
            headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
          }
        ]
      : []
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/feed', destination: '/feed.xml', permanent: true },
      { source: '/rss/feed.xml', destination: '/feed.xml', permanent: true },
      { source: '/category', destination: '/articles', permanent: true },
      { source: '/tag', destination: '/articles', permanent: true },
      {
        source: '/page/:page',
        destination: '/articles?page=:page',
        permanent: true
      }
    ]
  }
}
