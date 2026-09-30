const { isPublic, publicSummary } = require('./public-content.cjs')

function createListingProps(
  loadCatalog,
  { revalidate = 60, development = false } = {}
) {
  return async function listingProps({ revalidateReason = 'build' } = {}) {
    try {
      const rows = await loadCatalog()
      return {
        props: {
          posts: rows
            .filter(row => row.type === 'Post' && isPublic(row))
            .map(publicSummary),
          unavailable: false
        },
        revalidate
      }
    } catch (error) {
      // A failed refresh must leave Next.js's last successful page in place.
      if (revalidateReason !== 'build' && !development) throw error
      return { props: { posts: [], unavailable: true }, revalidate: 15 }
    }
  }
}

module.exports = { createListingProps }
