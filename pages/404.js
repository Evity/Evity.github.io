import Link from 'next/link'
import Meta from '../components/Meta'
export default function NotFound() {
  return (
    <div className='error-page'>
      <Meta title='页面不存在' noindex />
      <span className='eyebrow'>404 / A SMALL DETOUR</span>
      <h1>这里暂时没有记录。</h1>
      <p>页面可能已移动，或尚未公开。</p>
      <Link className='button' href='/'>
        回到首页 ↗
      </Link>
    </div>
  )
}
