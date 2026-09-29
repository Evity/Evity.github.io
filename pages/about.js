import Link from 'next/link'
import Meta from '../components/Meta'
import { site } from '../lib/site'
import { Arrow } from '../components/Icons'
export default function About() {
  return (
    <>
      <Meta title='关于' />
      <header className='page-heading'>
        <span className='eyebrow'>A LITTLE ABOUT ME</span>
        <h1>
          你好，我是 Evity<span className='accent'>.</span>
        </h1>
        <p>Go 工程师。喜欢把问题想清楚，也喜欢亲手做点东西。</p>
      </header>
      <div className='about-grid'>
        <div className='about-copy'>
          <h2>用代码探索，也用文字记录。</h2>
          <p>
            这里是我的个人空间，记录
            Go、后端技术和开发工具相关的学习与实践，也收藏代码之外的观察。
          </p>
          <p>
            我关注 AI
            如何改变开发方式，喜欢折腾交互工具与三维小场景。工作之外，咖啡、单机游戏和力量训练也是我持续投入的兴趣。
          </p>
          <p>
            这个博客会慢慢生长。希望留下的内容，既能帮助以后的自己，也能给路过的人一点启发。
          </p>
          <Link className='text-link' href='/projects'>
            看看我做的东西 <Arrow />
          </Link>
        </div>
        <aside className='about-aside'>
          <span className='eyebrow'>ON MY RADAR</span>
          <ul>
            {site.interests.map(x => (
              <li key={x}>
                {x}
                <Arrow diagonal />
              </li>
            ))}
          </ul>
          <a
            href={site.github}
            target='_blank'
            rel='noreferrer'
            className='button'
          >
            在 GitHub 找到我 <Arrow diagonal />
          </a>
        </aside>
      </div>
    </>
  )
}
