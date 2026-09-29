import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Meta from '../components/Meta'
import PostList from '../components/PostList'
export default function Articles({
  posts = [],
  unavailable = false,
  search = false
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  useEffect(() => {
    setQuery(typeof router.query.q === 'string' ? router.query.q : '')
  }, [router.asPath, router.query.q])
  const category =
    typeof router.query.category === 'string' ? router.query.category : ''
  const tag = typeof router.query.tag === 'string' ? router.query.tag : ''
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))]
  const keyword = query.trim().toLowerCase()
  const filtered = posts.filter(
    p =>
      (!category || p.category === category) &&
      (!tag || p.tags.includes(tag)) &&
      (!keyword ||
        [p.title, p.summary, ...p.tags, p.category]
          .join(' ')
          .toLowerCase()
          .includes(keyword))
  )
  const page = Math.max(
    1,
    Math.min(
      Math.ceil(filtered.length / 10) || 1,
      (query !== (router.query.q || '') ? 1 : Number(router.query.page)) || 1
    )
  )
  const pageLink = n => ({
    pathname: search ? '/search' : '/articles',
    query: {
      ...(category ? { category } : {}),
      ...(tag ? { tag } : {}),
      ...(keyword ? { q: keyword } : {}),
      page: n
    }
  })
  return (
    <>
      <Meta title={search ? '搜索' : '文章'} noindex={search || !!keyword} />
      <header className='page-heading'>
        <span className='eyebrow'>
          {search ? 'FIND A NOTE' : 'WRITING & NOTES'}
        </span>
        <h1>{search ? '找到你感兴趣的内容。' : '留下一些值得记住的事。'}</h1>
        <p>技术实践、工具探索，以及日常生活中的思考。</p>
      </header>
      <div className='article-toolbar'>
        <div className='filter-tabs'>
          <Link
            href='/articles'
            aria-current={!category && !tag ? 'page' : undefined}
          >
            全部
          </Link>
          {categories.map(c => (
            <Link
              key={c}
              href={`/articles?category=${encodeURIComponent(c)}`}
              aria-current={category === c ? 'page' : undefined}
            >
              {c}
            </Link>
          ))}
          <Link href='/archive'>按年归档 ↗</Link>
        </div>
        <label className='search-field'>
          <span className='sr-only'>搜索标题、摘要与标签</span>
          <input
            type='search'
            placeholder='搜索标题、摘要与标签…'
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
      </div>
      {tag && (
        <div className='active-filter'>
          标签：{tag} <Link href='/articles'>清除 ×</Link>
        </div>
      )}
      <p className='result-count' aria-live='polite'>
        {filtered.length} 篇记录
      </p>
      {!filtered.length && posts.length > 0 ? (
        <div className='empty-state'>
          <div>
            <h3>没有找到匹配的文章</h3>
            <p>试试其他关键词，或清除筛选条件。</p>
          </div>
        </div>
      ) : (
        <PostList
          posts={filtered.slice((page - 1) * 10, page * 10)}
          unavailable={unavailable}
        />
      )}
      <nav className='pagination' aria-label='文章分页'>
        {page > 1 && <Link href={pageLink(page - 1)}>← 上一页</Link>}
        {filtered.length > 10 && (
          <span>
            {page} / {Math.ceil(filtered.length / 10)}
          </span>
        )}
        {page * 10 < filtered.length && (
          <Link href={pageLink(page + 1)}>下一页 →</Link>
        )}
      </nav>
    </>
  )
}
export { getStaticProps } from './index'
