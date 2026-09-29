import Link from 'next/link'
import Meta from '../components/Meta'
export default function ErrorPage() {
  return (
    <div className='error-page'>
      <Meta title='暂时无法加载' noindex />
      <span className='eyebrow'>PLEASE TRY AGAIN</span>
      <h1>稍等，正在找回这些记录。</h1>
      <p>内容暂时无法加载，请稍后刷新。</p>
      <Link className='button' href='/projects'>
        先看看项目 ↗
      </Link>
    </div>
  )
}
