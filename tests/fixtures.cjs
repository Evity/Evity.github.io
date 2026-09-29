const id = '11111111-1111-4111-8111-111111111111'
const headings = [
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333'
]
const textId = '44444444-4444-4444-8444-444444444444'
const codeId = '55555555-5555-4555-8555-555555555555'
const block = (id, type, properties = {}, content = []) => ({
  value: {
    id,
    type,
    properties,
    content,
    alive: true,
    parent_id: '11111111-1111-4111-8111-111111111111',
    parent_table: 'block',
    format: {}
  }
})
const row = {
  id,
  title: '本地验证：Go 并发与阅读体验',
  type: 'Post',
  status: 'Published',
  password: '',
  date: { start_date: '2026-01-01' },
  slug: 'article/local-reading-check',
  summary:
    '用于验证代码高亮、目录、长文排版和公开内容过滤。此内容只存在于本地测试夹具。',
  category: '技术分享',
  tags: ['Go', '并发'],
  publishedAt: '2026-01-01',
  updatedAt: '2026-01-01T00:00:00Z',
  featured: true,
  order: 1
}
const fixtureRows = [
  row,
  {
    ...row,
    id: '66666666-6666-4666-8666-666666666666',
    title: 'PRIVATE DRAFT SENTINEL',
    slug: 'article/private-draft',
    status: 'Draft'
  },
  {
    ...row,
    id: '77777777-7777-4777-8777-777777777777',
    slug: 'article/invisible',
    status: 'Invisible'
  },
  {
    ...row,
    id: '88888888-8888-4888-8888-888888888888',
    slug: 'article/locked',
    password: 'secret'
  }
]
const fixtureMap = {
  block: {
    [id]: block(id, 'page', { title: [[row.title]] }, [
      headings[0],
      textId,
      codeId,
      headings[1]
    ]),
    [headings[0]]: block(headings[0], 'header', {
      title: [['先看问题，再写代码']]
    }),
    [textId]: block(textId, 'text', {
      title: [
        [
          '这是一段用于验证中文阅读体验的文本。先确认问题的边界，再决定并发模型。页面需要在桌面和手机上保持清晰，目录与代码复制都应能正常使用。'
        ]
      ]
    }),
    [codeId]: block(codeId, 'code', {
      title: [
        [
          'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Evity")\n}'
        ]
      ],
      language: [['Go']]
    }),
    [headings[1]]: block(headings[1], 'sub_header', {
      title: [['把结论留给下一次实践']]
    })
  },
  collection: {},
  collection_view: {},
  collection_query: {},
  notion_user: {},
  signed_urls: {}
}
module.exports = { fixtureRows, fixtureMap }
