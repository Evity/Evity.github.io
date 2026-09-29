import Meta from '../components/Meta'
import PostList, { EmptyPosts } from '../components/PostList'
export default function Archive({ posts = [], unavailable = false }) {
  const years = [
    ...new Set(posts.map(p => p.publishedAt?.slice(0, 4) || '未标注日期'))
  ]
  return (
    <>
      <Meta title='文章归档' />
      <header className='page-heading'>
        <span className='eyebrow'>THROUGH THE YEARS</span>
        <h1>时间里的记录。</h1>
        <p>沿着时间，回看每一次思考与探索。</p>
      </header>
      {!years.length && <EmptyPosts unavailable={unavailable} />}{' '}
      {years.map(year => (
        <section className='archive-year' key={year}>
          <h2>{year}</h2>
          <PostList
            posts={posts.filter(
              p => (p.publishedAt?.slice(0, 4) || '未标注日期') === year
            )}
            compact
          />
        </section>
      ))}
    </>
  )
}
export { getStaticProps } from './index'
