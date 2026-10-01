import Link from 'next/link'
import Image from 'next/image'
import { getTextContent } from 'notion-utils'
import ArticleBody from '../components/ArticleBody'
import CopyButton from '../components/CopyButton'
import Meta from '../components/Meta'
import PostList from '../components/PostList'
import { site } from '../lib/site'
export default function Article({ post, recordMap, pageLinks, related = [] }) {
  const headings = Object.values(recordMap.block)
    .map(x => x.value)
    .filter(x => ['header', 'sub_header', 'sub_sub_header'].includes(x.type))
    .map(x => ({
      id: x.id.replace(/-/g, ''),
      text: getTextContent(x.properties?.title),
      level: x.type === 'header' ? 0 : x.type === 'sub_header' ? 1 : 2
    }))
  return (
    <>
      <Meta
        title={post.title}
        description={post.summary || undefined}
        image={post.cover}
        article
      />
      <section className='article-heading' aria-label='文章标题'>
        <Link className='back-link' href='/articles'>
          ← 所有文章
        </Link>
        <div className='eyebrow'>
          {post.category || '记录'}
          {post.publishedAt && (
            <>
              {' '}
              / <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </>
          )}
        </div>
        <h1>{post.title}</h1>
        {post.summary && <p>{post.summary}</p>}
        <div className='post-tags'>
          {post.tags.map(tag => (
            <Link key={tag} href={`/articles?tag=${encodeURIComponent(tag)}`}>
              #{tag}
            </Link>
          ))}
        </div>
      </section>
      <div className='reading-grid'>
        <div className='article-body'>
          {post.cover && (
            <Image
              className='article-cover'
              src={post.cover}
              alt=''
              width={1520}
              height={850}
              unoptimized
            />
          )}
          <ArticleBody
            recordMap={recordMap}
            pageId={post.id}
            pageLinks={pageLinks}
          />
          <div className='article-end' role='region' aria-label='文章信息'>
            <span>写于 {post.publishedAt}</span>
            <CopyButton
              className='text-link'
              getText={() =>
                `${site.url || window.location.origin}/${post.slug}`
              }
              successLabel='链接已复制'
            >
              复制文章链接 ↗
            </CopyButton>
          </div>
        </div>
        {headings.length > 0 && (
          <aside className='article-toc'>
            <details open>
              <summary>本文目录</summary>
              <nav aria-label='文章目录'>
                {headings.map(h => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    style={{ paddingLeft: `${h.level * 12}px` }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </details>
          </aside>
        )}
      </div>
      {related.length > 0 && (
        <section className='section related' aria-labelledby='related-title'>
          <div className='section-heading'>
            <div>
              <span className='eyebrow'>KEEP READING</span>
              <h2 id='related-title'>继续阅读</h2>
            </div>
          </div>
          <PostList posts={related} compact />
        </section>
      )}
    </>
  )
}
export function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}
export async function getStaticProps({ params }) {
  const path = params.slug.join('/')
  // Keep useful old category, tag, search and pagination URLs reachable.
  if (
    ['category', 'tag', 'search'].includes(params.slug[0]) &&
    params.slug[1]
  ) {
    const key = params.slug[0] === 'search' ? 'q' : params.slug[0]
    return {
      redirect: {
        destination: `/articles?${key}=${encodeURIComponent(params.slug[1])}`,
        permanent: true
      }
    }
  }
  const { getCatalog, getArticleBody } = await import('../lib/notion')
  const { findPublicPage, publicSummary, normalizeId } =
    await import('../lib/public-content.cjs')
  const rows = await getCatalog()
  const found = findPublicPage(rows, path.replace(/\.html$/, ''))
  if (!found) return { notFound: true, revalidate: 60 }
  if (path !== found.slug)
    return { redirect: { destination: `/${found.slug}`, permanent: true } }
  const recordMap = await getArticleBody(found.id)
  const pageLinks = Object.fromEntries(
    rows.map(p => [normalizeId(p.id), `/${p.slug}`])
  )
  const related = rows
    .filter(
      p =>
        p.type === 'Post' &&
        p.id !== found.id &&
        (p.category === found.category ||
          p.tags.some(t => found.tags.includes(t)))
    )
    .slice(0, 3)
    .map(publicSummary)
  return {
    props: { post: publicSummary(found), recordMap, pageLinks, related },
    revalidate: 60
  }
}
