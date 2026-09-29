import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang='zh-CN'>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=localStorage.getItem('evity-theme');if(v==='dark'||(!v&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
