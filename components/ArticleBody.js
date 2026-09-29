import dynamic from 'next/dynamic'
import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { Equation } from 'react-notion-x/build/third-party/equation'
import { useEffect, useRef, useState } from 'react'
import 'prismjs'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-yaml'
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)
function CodeBlock(props) {
  const ref = useRef(null)
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        ref.current.querySelector('code')?.textContent || ''
      )
      setCopied(true)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch (_) {
      setCopied(false)
    }
  }
  return (
    <div className='code-wrapper' ref={ref}>
      <button onClick={copy} className='copy-code' aria-label='复制代码'>
        {copied ? '已复制' : '复制'}
      </button>
      <Code {...props} />
    </div>
  )
}
const components = { Code: CodeBlock, Equation, Modal }
export default function ArticleBody({ recordMap, pageId, pageLinks }) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const update = () =>
      setDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    return () => observer.disconnect()
  }, [])
  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      fullPage={false}
      darkMode={dark}
      disableHeader
      components={components}
      mapPageUrl={id => pageLinks[id.replace(/-/g, '')] || '/404'}
    />
  )
}
