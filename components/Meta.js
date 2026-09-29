import Head from 'next/head'
import { useRouter } from 'next/router'
import { site } from '../lib/site'
export default function Meta({
  title,
  description = site.description,
  image,
  article = false,
  noindex = false
}) {
  const { asPath } = useRouter()
  const fullTitle = title ? `${title} · Evity` : site.title
  const canonical = site.url ? `${site.url}${asPath.split('?')[0]}` : null
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#f7f7f2' />
      <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
      <link
        rel='alternate'
        type='application/rss+xml'
        title='Evity RSS'
        href='/feed.xml'
      />
      {canonical && <link rel='canonical' href={canonical} />}
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={article ? 'article' : 'website'} />
      {canonical && <meta property='og:url' content={canonical} />}
      <meta
        name='twitter:card'
        content={image ? 'summary_large_image' : 'summary'}
      />
      {image && <meta property='og:image' content={image} />}
      <meta
        name='robots'
        content={noindex ? 'noindex,follow' : 'index,follow'}
      />
    </Head>
  )
}
