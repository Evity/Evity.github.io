# 日常之间

个人博客原型：吃的记录、音乐、咖啡、旅行和日常生活；代码仅作为导航中的独立小栏目。工作名可替换。

基于 Astro 7 的可运行静态博客原型。文章采用 Markdown，生活图片经构建时转换为 AVIF/WebP 和响应式尺寸。

- [桌面首页原型 PNG](docs/design/home-desktop.png) / [可编辑 SVG](docs/design/home-desktop.svg)
- [手机首页原型 PNG](docs/design/home-mobile.png) / [可编辑 SVG](docs/design/home-mobile.svg)
- [设计规范](DESIGN.md)：色彩、字体、布局、组件、交互、移动端与验收标准。
- [页面与交互原型](docs/design/prototype.md)：首页、栏目、文章、关于、归档及内容字段。
- [部署方法论](docs/DEPLOYMENT.md)：GitHub → Cloudflare Workers / Vercel、图片存储、域名、预览与回滚。
- [图片来源](docs/design/assets/SOURCES.md)：本地演示素材与用途。
- [视觉生成提示词](docs/design/image-prompts.md)：视觉稿来源与复现说明。

本地运行需要 Node.js 22.12.0 或更高的受支持偶数版本，以及 Bun 1.3.14：执行 `bun install`、`bun run dev`。发布前执行 `bun run check` 和 `bun run build`；检查构建结果用 `bun run preview`。

所有示例文章、日期、听歌近况和演示照片都用于原型展示，不代表作者真实经历。正式发布前需替换为自己的内容和有权使用的素材。公开域名确定后再启用 canonical 与 RSS。

## VMware / Linux 共享目录

本地项目仍以 `bun.lock` 和 Bun 1.3.14 锁定依赖。若在不支持符号链接的 VMware 共享目录中 `bun install` 返回 `ENOTSUP`，可用 npm 安装不保存锁文件的本地副本：

```sh
npm install --no-save --no-package-lock --no-bin-links
bun run check
bun run build
```

脚本直接调用 Astro CLI，不依赖 `node_modules/.bin` 链接。提交时保留 `bun.lock`；不要提交 npm 临时锁文件。
