import dynamic from 'next/dynamic'
import { NotionRenderer } from 'react-notion-x'
import { Code } from 'react-notion-x/build/third-party/code'
import { Equation } from 'react-notion-x/build/third-party/equation'
import { useRef } from 'react'
import CopyButton from './CopyButton'
import { useTheme } from './ThemeProvider'
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
  return (
    <div className='code-wrapper' ref={ref}>
      <CopyButton
        getText={() => ref.current?.querySelector('code')?.textContent || ''}
        className='copy-code'
        ariaLabel='复制代码'
      >
        复制
      </CopyButton>
      <Code {...props} />
    </div>
  )
}
const components = { Code: CodeBlock, Equation, Modal }
export default function ArticleBody({ recordMap, pageId, pageLinks }) {
  const { dark } = useTheme()
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
