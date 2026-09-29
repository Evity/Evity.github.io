# Evity · 代码与生活

个人主页、文章博客与作品集。Notion 负责写作，GitHub 管理代码，Vercel 托管。

## 本地开发

Node.js 20 或更新版本：

```sh
npm ci
cp .env.example .env.local
npm run dev
```

## 内容发布

继续使用现有 **Notion 博客**数据库。公开文章必须同时满足：`type=Post`、`status=Published`、标题非空、`password` 为空，且处于 `date` 指定的发布范围内。`Page` 使用相同规则。草稿、Invisible、加锁文章、菜单和配置记录均不进入公开目录、详情、搜索、RSS、站点地图。

- `slug` 保持原有文章路径，默认前缀为 `article`，可通过 `NEXT_PUBLIC_POST_URL_PREFIX` 设置。
- 可选字段 `精选`（checkbox）与 `排序`（number）控制首页精选区。未设置精选时不展示精选区。
- 首页、项目与关于内容在 `lib/site.js` 和对应页面维护。旧 Notion Config、Menu 不再改变导航、品牌或样式。
- 正文继续使用 notion-client 与 react-notion-x。沿用现有 Notion 内部 API 兼容适配；并未迁移到官方 Notion API。
- 详情仅允许当前博客数据库中的公开记录；不再支持任意 Notion ID 读取。子页面、嵌入数据库、跨页同步引用不展开，避免间接输出其他页面。
- `password` 文章首版完全不公开；不再采用前端密码框隐藏已经下载的正文。
- 内容页每 60 秒进入 ISR 重验证窗口；上游读取失败时详情重验证抛错，保留已有静态页。列表初次获取失败会显示“暂时无法加载”，不注入示例文章。
- 撤回文章后存在缓存窗口；如需立即下线，请清理 Vercel 缓存或重新部署。

## Vercel

沿用现有项目及 GitHub 仓库，Framework Preset 选择 Next.js，安装命令 `npm ci`，构建命令 `npm run build`。删除旧项目里手动指定的 yarn/export 命令覆盖（如果有）。

必需配置：

| 变量                                     | 用途                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `NOTION_PAGE_ID`                         | 默认已指向现有博客库 `304744654b4b81689035f470b349cbd7`               |
| `NEXT_PUBLIC_SITE_URL`                   | 正式访问地址，用于 canonical、RSS、sitemap；兼容旧 `NEXT_PUBLIC_LINK` |
| `NOTION_TOKEN_V2` / `NOTION_ACTIVE_USER` | 仅当 Notion 数据访问需要时设置；不能加 NEXT_PUBLIC 前缀               |

不要把旧主题参数、广告、Clerk 或评论服务配置迁移到新界面。Preview 部署的 robots.txt 禁止索引。没有站点 URL 时 RSS/sitemap 返回 503，避免生成指向错误域名的链接。

## 验证与回退

```sh
npm run lint
npm test
npm run build
```

离线内容夹具仅供本地验证：`BLOG_TEST_FIXTURE=true NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build`。Vercel 环境中该开关无效，永不把夹具发布到线上。

验收首页空状态、项目外链、手机布局、深色模式、文章目录、代码复制、搜索、草稿和 ID 路由 404、RSS 与站点地图。合并前查看 Vercel Preview；生产回退使用 Vercel 的上一成功部署，代码通过 revert 恢复。

## 来源

基于 NotionNext / Nobelium 重构，保留 MIT LICENSE。移除多主题和推广插件，保留 Notion 数据格式兼容思路及 react-notion-x 正文渲染。
