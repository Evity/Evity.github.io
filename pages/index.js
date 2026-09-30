import Link from 'next/link'
import Meta from '../components/Meta'
import ProjectCards from '../components/ProjectCards'
import PostList from '../components/PostList'
import { Arrow } from '../components/Icons'
import { site } from '../lib/site'
export default function Home({ posts = [], unavailable = false }) {
  const featured = posts
    .filter(post => post.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)
  return (
    <>
      <Meta />
      <section className='hero'>
        <div className='hero-main'>
          <span className='eyebrow'>
            <span className='status-dot' /> EVITY’S PERSONAL SPACE
          </span>
          <h1>
            在代码之外，
            <br />
            <span>保持好奇。</span>
          </h1>
          <p className='hero-description'>
            我是 Evity，一名 Go 工程师。
            <br />
            在这里记录技术实践，也探索咖啡、游戏和生活里的有趣事物。
          </p>
          <div className='hero-links'>
            <Link className='button' href='/articles'>
              阅读文章 <Arrow />
            </Link>
            <Link className='text-link' href='/about'>
              更多关于我 <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className='hero-note'>
          <div className='note-top'>
            <span>FIELD NOTES</span>
            <span>↗</span>
          </div>
          <div className='orbital' aria-hidden='true'>
            <i />
            <i />
            <i />
            <span>e.</span>
            <b />
          </div>
          <div className='note-bottom'>
            <span>
              写代码。做东西。
              <br />
              留下一些思考。
            </span>
            <span className='note-no'>01—∞</span>
          </div>
        </div>
      </section>
      <div className='interest-strip'>
        <span className='eyebrow'>持续探索</span>
        {site.interests.map(x => (
          <span key={x}>{x}</span>
        ))}
        <span className='strip-star' aria-hidden='true'>
          ✳
        </span>
      </div>
      {featured.length > 0 && (
        <section className='section'>
          <div className='section-heading'>
            <div>
              <span className='eyebrow'>SELECTED WRITING</span>
              <h2>值得慢慢读</h2>
            </div>
            <Link href='/articles'>
              全部文章 <Arrow />
            </Link>
          </div>
          <PostList posts={featured} />
        </section>
      )}
      <section className='section'>
        <div className='section-heading'>
          <div>
            <span className='eyebrow'>SELECTED PROJECTS</span>
            <h2>把想法，做成东西。</h2>
          </div>
          <Link href='/projects'>
            所有项目 <Arrow />
          </Link>
        </div>
        <ProjectCards />
      </section>
      <section className='section latest-section'>
        <div className='section-heading'>
          <div>
            <span className='eyebrow'>LATEST NOTES</span>
            <h2>最近的记录</h2>
          </div>
          <Link href='/articles'>
            文章归档 <Arrow />
          </Link>
        </div>
        <PostList posts={posts.slice(0, 5)} unavailable={unavailable} compact />
      </section>
    </>
  )
}
export async function getStaticProps(context) {
  const { listingProps } = await import('../lib/notion')
  return listingProps(context)
}
