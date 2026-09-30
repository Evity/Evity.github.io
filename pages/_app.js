import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import '../styles/site.css'
import Layout from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Layout article={pageProps.post?.type === 'Post'}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
