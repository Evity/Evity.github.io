const normalizeKeyword = value =>
  String(value || '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()

function createPostIndex(posts) {
  return posts.map(post => ({
    post,
    text: normalizeKeyword(
      [post.title, post.summary, post.category, ...(post.tags || [])].join(' ')
    )
  }))
}

function filterPosts(index, { query = '', category = '', tag = '' } = {}) {
  const keyword = normalizeKeyword(query)
  return index
    .filter(
      ({ post, text }) =>
        (!category || post.category === category) &&
        (!tag || post.tags?.includes(tag)) &&
        (!keyword || text.includes(keyword))
    )
    .map(({ post }) => post)
}

function paginatePosts(posts, requestedPage, pageSize = 10) {
  const raw = String(requestedPage || '')
  const parsed = /^[1-9]\d*$/.test(raw) ? Number(raw) : 1
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))
  const page = Math.min(totalPages, Number.isSafeInteger(parsed) ? parsed : 1)
  return {
    page,
    totalPages,
    posts: posts.slice((page - 1) * pageSize, page * pageSize)
  }
}

function articleListHref(
  pathname,
  { query = '', category = '', tag = '', page = 1 } = {}
) {
  return {
    pathname,
    query: {
      ...(query.trim() ? { q: query.trim() } : {}),
      ...(category ? { category } : {}),
      ...(tag ? { tag } : {}),
      ...(page > 1 ? { page } : {})
    }
  }
}

module.exports = {
  createPostIndex,
  filterPosts,
  paginatePosts,
  articleListHref
}
