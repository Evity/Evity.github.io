const test = require('node:test')
const assert = require('node:assert/strict')
const { createListingProps } = require('../lib/listing-props.cjs')
const { fixtureRows } = require('./fixtures.cjs')

test('a catalog failure during build keeps the personal site deployable', async () => {
  const load = createListingProps(async () => {
    throw new Error('Notion unavailable')
  })
  assert.deepEqual(await load({ revalidateReason: 'build' }), {
    props: { posts: [], unavailable: true },
    revalidate: 15
  })
})

test('a failed refresh is propagated so ISR can retain its last successful article list', async () => {
  let available = true
  const load = createListingProps(async () => {
    if (!available) throw new Error('upstream outage')
    return fixtureRows
  })
  const initial = await load({ revalidateReason: 'build' })
  assert.equal(initial.props.posts.length, 1)
  assert.equal(initial.props.unavailable, false)
  available = false
  for (const revalidateReason of ['stale', 'on-demand']) {
    await assert.rejects(load({ revalidateReason }), /upstream outage/)
  }
  available = true
  assert.deepEqual(await load({ revalidateReason: 'stale' }), initial)
})

test('a legitimate empty database refreshes successfully rather than retaining withdrawn posts', async () => {
  const load = createListingProps(async () => [])
  const result = await load({ revalidateReason: 'stale' })
  assert.equal(result.props.unavailable, false)
  assert.deepEqual(result.props.posts, [])
})

test('local development can show an unavailable state without requiring production Notion access', async () => {
  const load = createListingProps(
    async () => {
      throw new Error('offline')
    },
    { development: true }
  )
  assert.equal(
    (await load({ revalidateReason: 'stale' })).props.unavailable,
    true
  )
})
