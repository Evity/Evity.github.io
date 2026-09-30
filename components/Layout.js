import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from './ThemeProvider'
import { site } from '../lib/site'
import { SearchIcon, Arrow } from './Icons'
export default function Layout({ children, article = false }) {
  const router = useRouter()
  const { dark, toggleTheme } = useTheme()
  return (
    <>
      <a className='skip-link' href='#main'>
        跳至正文
      </a>
      <header className='site-header'>
        <div className='shell header-inner'>
          <Link href='/' className='brand' aria-label='Evity 首页'>
            <span className='brand-mark'>e.</span>
            <span>
              Evity<span className='brand-dot'> / </span>
            </span>
          </Link>
          <nav aria-label='主导航'>
            {[
              ['/articles', '文章'],
              ['/projects', '项目'],
              ['/about', '关于']
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  router.pathname === href
                    ? 'page'
                    : href === '/articles' &&
                        (article ||
                          ['/archive', '/search'].includes(router.pathname))
                      ? 'true'
                      : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className='header-actions'>
            <Link className='icon-button' href='/search' aria-label='搜索文章'>
              <SearchIcon />
            </Link>
            <button
              className='icon-button theme-toggle'
              onClick={toggleTheme}
              aria-label={dark ? '切换浅色模式' : '切换深色模式'}
              aria-pressed={dark}
            >
              <svg
                viewBox='0 0 24 24'
                width='19'
                height='19'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                aria-hidden='true'
              >
                <circle cx='12' cy='12' r='4' />
                <path d='M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2' />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main id='main' className='shell' tabIndex={-1}>
        {children}
      </main>
      <footer className='shell site-footer'>
        <div>
          <Link href='/' className='footer-name'>
            Evity.
          </Link>
          <p>记录，构建，保持好奇。</p>
        </div>
        <div className='footer-links'>
          <a href={site.github} target='_blank' rel='noreferrer'>
            GitHub <Arrow diagonal />
          </a>
          {/* RSS is XML, so use a full document navigation rather than the Next router. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href='/feed.xml'>
            RSS <Arrow diagonal />
          </a>
          <span>© {new Date().getFullYear()} Evity</span>
        </div>
      </footer>
    </>
  )
}
