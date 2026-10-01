import Link from 'next/link'
import { Arrow } from './Icons'
export function EmptyPosts({ unavailable = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  return (
    <div className='empty-state'>
      <span className='empty-symbol' aria-hidden='true'>
        ✳
      </span>
      <div>
        <Heading>{unavailable ? '文章暂时无法加载' : '新的记录，正在酝酿。'}</Heading>
        <p>
          {unavailable
            ? '请稍后再试，或先看看我的项目。'
            : '这里会陆续分享技术实践与日常思考。先从项目里认识我吧。'}
        </p>
      </div>
      <Link href='/projects'>
        探索项目 <Arrow />
      </Link>
    </div>
  )
}
export default function PostList({
  posts = [],
  unavailable = false,
  compact = false,
  headingLevel = 3
}) {
  const Heading = `h${headingLevel}`
  if (!posts.length)
    return <EmptyPosts unavailable={unavailable} headingLevel={headingLevel} />
  return (
    <div className={compact ? 'post-list compact' : 'post-list'}>
      {posts.map(post => (
        <article key={post.id} className='post-row'>
          <time dateTime={post.publishedAt}>{post.publishedAt || '随笔'}</time>
          <div>
            <span className='eyebrow'>{post.category || '记录'}</span>
            <Heading>
              <Link href={`/${post.slug}`}>{post.title}</Link>
            </Heading>
            {!compact && post.summary && <p>{post.summary}</p>}
            <div className='post-tags'>
              {post.tags?.map(tag => (
                <Link
                  key={tag}
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
          <Link
            className='post-arrow'
            href={`/${post.slug}`}
            aria-label={`阅读 ${post.title}`}
          >
            <Arrow />
          </Link>
        </article>
      ))}
    </div>
  )
}
