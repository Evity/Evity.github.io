import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import Meta from '../components/Meta'
import PostList from '../components/PostList'
import {
  createPostIndex,
  filterPosts,
  paginatePosts,
  articleListHref
} from '../lib/article-list.cjs'

export default function Articles(props) {
  const router = useRouter()
  // Reset input on navigation, including Back/Forward, without an effect race.
  return (
    <ArticleDirectory
      key={router.isReady ? router.asPath : 'initial'}
      {...props}
    />
  )
}

function ArticleDirectory({ posts = [], unavailable = false, search = false }) {
  const router = useRouter()
  const basePath = search ? '/search' : '/articles'
  const urlQuery = typeof router.query.q === 'string' ? router.query.q : ''
  const [query, setQuery] = useState(urlQuery)
  const category =
    typeof router.query.category === 'string' ? router.query.category : ''
  const tag = typeof router.query.tag === 'string' ? router.query.tag : ''
  const categories = useMemo(
    () => [...new Set(posts.map(p => p.category).filter(Boolean))],
    [posts]
  )
  const index = useMemo(() => createPostIndex(posts), [posts])
  const filtered = useMemo(
    () => filterPosts(index, { query, category, tag }),
    [index, query, category, tag]
  )
  const {
    page,
    totalPages,
    posts: visiblePosts
  } = paginatePosts(
    filtered,
    query.trim() !== urlQuery.trim() ? 1 : router.query.page
  )
  const href = overrides =>
    articleListHref(basePath, { query, category, tag, ...overrides })
  function clearFilters() {
    setQuery('')
    void router.replace(basePath, undefined, { shallow: true, scroll: false })
  }
  function submitSearch(event) {
    event.preventDefault()
    void router.push(href({ page: 1 }), undefined, {
      shallow: true,
      scroll: false
    })
  }
  return (
    <>
      <Meta
        title={search ? '搜索' : '文章'}
        noindex={search || !!query.trim()}
      />
      <header className='page-heading'>
        <span className='eyebrow'>
          {search ? 'FIND A NOTE' : 'WRITING & NOTES'}
        </span>
        <h1>{search ? '找到你感兴趣的内容。' : '留下一些值得记住的事。'}</h1>
        <p>技术实践、工具探索，以及日常生活中的思考。</p>
      </header>
      <div className='article-toolbar'>
        <nav className='filter-tabs' aria-label='文章分类'>
          <Link
            href={href({ category: '' })}
            aria-current={!category ? 'page' : undefined}
          >
            全部
          </Link>
          {categories.map(c => (
            <Link
              key={c}
              href={href({ category: c })}
              aria-current={category === c ? 'page' : undefined}
            >
              {c}
            </Link>
          ))}
          <Link href='/archive'>按年归档 ↗</Link>
        </nav>
        <form
          className='search-form'
          role='search'
          action={basePath}
          onSubmit={submitSearch}
        >
          {category && <input type='hidden' name='category' value={category} />}
          {tag && <input type='hidden' name='tag' value={tag} />}
          <label className='search-field'>
            <span className='sr-only'>搜索标题、摘要与标签</span>
            <input
              name='q'
              type='search'
              placeholder='搜索标题、摘要与标签…'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </label>
          <button type='submit' className='search-submit'>
            搜索
          </button>
        </form>
      </div>
      {(tag || category || query.trim()) && (
        <div className='active-filter'>
          {tag && (
            <span>
              标签：{tag}{' '}
              <Link href={href({ tag: '' })} aria-label={`清除标签 ${tag}`}>
                ×
              </Link>
            </span>
          )}
          <button
            type='button'
            className='clear-filters'
            onClick={clearFilters}
          >
            清除筛选
          </button>
        </div>
      )}
      {!unavailable && (
        <p className='result-count' aria-live='polite'>
          {filtered.length} 篇记录
        </p>
      )}
      {!filtered.length && posts.length > 0 ? (
        <div className='empty-state'>
          <div>
            <h2>没有找到匹配的文章</h2>
            <p>试试其他关键词，或清除筛选条件。</p>
          </div>
        </div>
      ) : (
        <PostList posts={visiblePosts} unavailable={unavailable} headingLevel={2} />
      )}
      {totalPages > 1 && (
        <nav className='pagination' aria-label='文章分页'>
          {page > 1 && <Link href={href({ page: page - 1 })}>← 上一页</Link>}
          <span>
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={href({ page: page + 1 })}>下一页 →</Link>
          )}
        </nav>
      )}
    </>
  )
}
export { getStaticProps } from './index'
