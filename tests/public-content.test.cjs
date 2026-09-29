const test = require('node:test')
const assert = require('node:assert/strict')
const {
  isPublic,
  findPublicPage,
  publicSummary,
  cleanSlug,
  escapeXml
} = require('../lib/public-content.cjs')
const row = {
  id: '11111111-1111-4111-8111-111111111111',
  type: 'Post',
  status: 'Published',
  title: 'Hello',
  slug: 'article/hello',
  date: { start_date: '2026-01-01' },
  password: ''
}
test('only published public articles and pages pass the shared boundary', () => {
  assert.equal(isPublic(row), true)
  for (const patch of [
    { status: 'Draft' },
    { status: 'Invisible' },
    { type: 'Config' },
    { type: 'Menu' },
    { password: 'secret' },
    { title: '  ' },
    { date: { start_date: '2099-01-01' } },
    { date: { end_date: '2020-01-01' } },
    { slug: 'https://external.invalid/x' }
  ])
    assert.equal(isPublic({ ...row, ...patch }), false)
})
test('dates use Hong Kong midnight, not UTC midnight', () => {
  assert.equal(
    isPublic(
      { ...row, date: { start_date: '2026-09-29' } },
      Date.parse('2026-09-28T16:01:00Z')
    ),
    true
  )
  assert.equal(
    isPublic(
      { ...row, date: { start_date: '2026-09-29' } },
      Date.parse('2026-09-28T15:59:00Z')
    ),
    false
  )
})
test('detail lookup does not fall back to arbitrary ids or partial slug matches', () => {
  assert.equal(findPublicPage([row], 'hello'), null)
  assert.equal(findPublicPage([row], 'random/article/hello'), null)
  assert.equal(findPublicPage([row], '11111111111141118111111111111111'), row)
  assert.equal(findPublicPage([{ ...row, status: 'Draft' }], row.id), null)
  assert.equal(findPublicPage([row], '99999999999949998999999999999999'), null)
})
test('browser metadata uses an allowlist, excluding credentials and unexpected properties', () => {
  const summary = publicSummary({
    ...row,
    password: 'secret',
    NOTION_TOKEN_V2: 'TOKEN',
    internalNotes: 'PRIVATE'
  })
  assert.equal('password' in summary, false)
  assert.equal('NOTION_TOKEN_V2' in summary, false)
  assert.equal('internalNotes' in summary, false)
})
test('invalid routes are rejected and XML is escaped', () => {
  for (const slug of ['https://a.com', '../draft', 'article//x', 'a?b', 'a#b'])
    assert.equal(cleanSlug(slug), null)
  assert.equal(escapeXml('a&<b>'), 'a&amp;&lt;b&gt;')
})

test('body output excludes unrelated, nested private pages and their signed attachments', () => {
  const { pruneRecordMap } = require('../lib/public-content.cjs')
  const raw = {
    block: {
      root: {
        value: {
          id: 'root',
          type: 'page',
          content: ['public', 'private', 'db', 'sync'],
          permissions: ['PRIVATE']
        }
      },
      public: {
        value: {
          id: 'public',
          type: 'text',
          properties: { title: [['visible']] }
        }
      },
      private: {
        value: {
          id: 'private',
          type: 'page',
          properties: { title: [['SECRET']] }
        }
      },
      db: { value: { id: 'db', type: 'collection_view' } },
      sync: { value: { id: 'sync', type: 'transclusion_reference' } },
      unrelated: { value: { id: 'unrelated', type: 'text' } }
    },
    signed_urls: { public: 'public-url', private: 'secret-url' },
    notion_user: { someone: 'private' },
    collection: { secret: 'data' }
  }
  const out = pruneRecordMap(raw, 'root')
  assert.deepEqual(Object.keys(out.block), ['root', 'public'])
  assert.deepEqual(out.block.root.value.content, ['public'])
  assert.equal(JSON.stringify(out).includes('SECRET'), false)
  assert.equal(JSON.stringify(out).includes('secret-url'), false)
  assert.deepEqual(out.notion_user, {})
})
