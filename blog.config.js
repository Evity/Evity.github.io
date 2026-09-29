// Server-only Notion connection. Presentation lives in lib/site.js.
module.exports = {
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID || '304744654b4b81689035f470b349cbd7',
  NOTION_TOKEN_V2: process.env.NOTION_TOKEN_V2 || '',
  NOTION_ACTIVE_USER: process.env.NOTION_ACTIVE_USER || '',
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.notion.so/api/v3',
  POST_URL_PREFIX: process.env.NEXT_PUBLIC_POST_URL_PREFIX ?? 'article',
  REVALIDATE_SECONDS: 60
}
