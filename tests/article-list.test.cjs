const test = require('node:test')
const assert = require('node:assert/strict')
const {
  createPostIndex,
  filterPosts,
  paginatePosts,
  articleListHref
} = require('../lib/article-list.cjs')
const posts = [
  { title: 'Go 并发', summary: '通道与协程', category: '技术', tags: ['Go'] },
  { title: '咖啡笔记', summary: '生活记录', category: '生活', tags: ['咖啡'] },
  { title: 'Go 工具', summary: '命令行实践', category: '技术', tags: ['工具'] }
]

test('search combines keyword, category and tag with Unicode and case normalization', () => {
  const index = createPostIndex(posts)
  assert.deepEqual(
    filterPosts(index, { query: ' ＧＯ ', category: '技术', tag: 'Go' }),
    [posts[0]]
  )
  assert.deepEqual(filterPosts(index, { query: '通道' }), [posts[0]])
  assert.deepEqual(filterPosts(index, { query: 'Go', category: '生活' }), [])
})

test('pagination accepts whole pages and clamps overflows without fractional or unsafe offsets', () => {
  const list = Array.from({ length: 23 }, (_, id) => ({ id }))
  for (const value of [
    '2.5',
    '-1',
    '0',
    'Infinity',
    'nope',
    ['2', '3'],
    '99999999999999999999'
  ]) {
    assert.equal(paginatePosts(list, value).page, 1)
  }
  assert.deepEqual(
    paginatePosts(list, '2').posts.map(p => p.id),
    Array.from({ length: 10 }, (_, i) => i + 10)
  )
  assert.equal(paginatePosts(list, '99').page, 3)
  assert.deepEqual(paginatePosts([], '99'), {
    page: 1,
    totalPages: 1,
    posts: []
  })
})

test('category, tag and pagination links preserve the current search instead of discarding it', () => {
  assert.deepEqual(
    articleListHref('/search', {
      query: ' Go ',
      category: '技术',
      tag: '工具',
      page: 2
    }),
    {
      pathname: '/search',
      query: { q: 'Go', category: '技术', tag: '工具', page: 2 }
    }
  )
  assert.deepEqual(articleListHref('/articles'), {
    pathname: '/articles',
    query: {}
  })
})
