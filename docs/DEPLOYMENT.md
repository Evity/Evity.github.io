# 日常之间 · 部署方法论

文档版本：0.4。Vercel 迁移配置核验日期：2026-10-18；其他平台资料沿用 2026-09-29 的核验记录。

**当前状态：沿用当前仓库的 Git 历史和已连接的 Vercel 项目 `evity-github-io`，Astro 静态博客已通过本地构建与浏览器预览。** 生产入口为 [evity-github-io.vercel.app](https://evity-github-io.vercel.app/)，通过推送 `main` 触发发布；构建配置已纳入仓库。部署前应复核目标提交与平台当时的控制台选项。

## 1. 交付方式与边界

当前原型采用 **Astro 静态输出 + Markdown 内容集合 + 构建时图片处理**：首页以美食、咖啡、音乐、旅行为主，代码只保留导航入口。Astro 锁定为 7.3.5，Bun 锁定为 1.3.14。

部署产物统一为 `dist/`，选以下一条路线作为生产入口：

| 路线 | 内容更新过程 | 平台设置重点 |
| --- | --- | --- |
| GitHub → Cloudflare Workers Static Assets | 分支预览 → 合并 `main` → Workers Builds 构建发布 | Wrangler 指向 `dist/`，配置真实 404 |
| GitHub → Vercel | 分支 Preview → 合并 `main` → Production | Astro 预设，构建 `bun run build`，输出 `dist` |

选择方法：已有 Cloudflare 域名管理、未来计划用 R2 管照片时，可优先 Workers，把站点与资源管理放在同一平台；更希望直接导入仓库并使用框架预设时，可优先 Vercel。两个方案都以静态产物为基础，先选一个生产平台，再保留另一条作为迁移路径。最终选择还需用目标读者的网络环境实测访问体验，并核对账号当时的用量限制；不预先承诺速度或零费用。

静态 Astro 可直接发布至两平台；只有以后引入按请求执行的服务端功能时，才重新评估对应 adapter。纯静态 Workers 无需 `main` 入口或 Worker 脚本。官方依据：[Cloudflare Astro 的静态站点配置](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#if-you-have-a-static-site)、[Astro 部署到 Vercel](https://docs.astro.build/en/guides/deploy/vercel/)。

本指南使用 **Workers Static Assets**。Cloudflare 控制台虽名为「Workers & Pages」，这里创建的是 Worker；不使用 Pages 项目、`wrangler pages deploy` 或旧 Workers Sites/KV 教程。Workers 能直接上传并托管 HTML、CSS 和图片等静态文件，参见 [Static Assets](https://developers.cloudflare.com/workers/static-assets/)。

## 2. 首次部署前，开发阶段必须补齐的契约

以下列出当前文件及部署阶段才需要补充的 Cloudflare 配置：

```text
package.json             # 开发、构建、预览命令
.bun-version              # 本地与构建平台的 Bun 版本
bun.lock                  # 确定依赖版本
.gitignore
astro.config.mjs         # 静态输出、站点正式 URL
src/content.config.ts    # 内容集合与 frontmatter 校验
src/pages/               # 首页、生活、代码、关于与文章页
src/pages/404.astro      # 构建为 dist/404.html
src/content/posts/       # 作者维护的 Markdown 文章
src/assets/              # 需要构建时优化的生活照片
public/                  # 原样复制的 favicon 等文件
wrangler.jsonc           # 仅 Cloudflare 路线需要，当前待补充
dist/                    # 构建产物，不提交 Git
```

当前 `package.json` 提供以下脚本：

```json
{
  "scripts": {
    "dev": "node node_modules/astro/bin/astro.mjs dev --host 127.0.0.1",
    "build": "node node_modules/astro/bin/astro.mjs build",
    "preview": "node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1",
    "check": "node node_modules/astro/bin/astro.mjs check"
  }
}
```

脚本直接通过 Node.js 调用 Astro CLI，以兼容不能创建 `node_modules/.bin` 符号链接的 VMware 共享目录。构建输出至 `dist/`；预览命令用于检查已构建站点，不作为生产服务器。依据：[Astro CLI](https://docs.astro.build/en/reference/cli-reference/)。

自定义错误页由 `src/pages/404.astro` 生成 `404.html`，交由平台在不存在的路由上提供。[Astro 自定义 404](https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page)

开发完成后的本地检查命令：

```sh
bun install --frozen-lockfile
bun run check
bun run build
bun run preview
```

前置条件：

1. 已实现文章路由、分类、响应式图片与 404；运行 `bun run build` 生成 `dist/` 后再用 `bun run preview` 检查。
2. 本地安装 Node.js 22.12.0 或更高的受支持偶数版本，以及 Bun 1.3.14。Astro CLI 通过 Node.js shebang 运行，Bun 默认尊重该 shebang；不要仅凭已安装 Bun 推断 Node.js 可省略。`.bun-version`、`package.json` 的 `packageManager` 和平台构建设置需与 Bun 版本保持一致。Astro 官方支持 Bun，但也提示个别集成可能存在兼容细节，出现问题时先查看 Astro 与 Bun 的更新说明。[Astro + Bun](https://docs.astro.build/en/recipes/bun/)、[Astro 安装要求](https://docs.astro.build/en/install-and-setup/#prerequisites)、[Bun 的 `--bun` 行为](https://bun.com/docs/runtime#--bun)
3. Astro 与依赖版本已锁定并记录在 `package.json`、`bun.lock`；新增依赖后重新提交更新的锁文件。
4. 已有 GitHub 和目标平台账号，并能授予目标仓库访问权限。
5. 自定义域名可在首发成功后添加；第一轮使用平台提供的地址。

## 3. 图片如何从原型进入网站

### 3.1 少量图片随内容入 Git

建议先将可公开的美食、咖啡、旅行照片放入 `src/assets/`，交由 Astro 图片组件生成适合手机与桌面的尺寸。`public/` 图片会原样复制，不会自动压缩；已有多尺寸导出文件时才适合放在这里。依据：[Astro 图片处理](https://docs.astro.build/en/guides/images/)。

建议的内容生产约定：

- 原始相机文件另行备份；进入网站的是经过导出的网络版本。
- 列表封面输出 480 / 800px，文章大图输出 1200 / 1600px，作为初始目标并按实际视觉验收调整。
- 优先 WebP / AVIF，必要时提供 JPEG；保留宽高、替代文本、图注与裁剪焦点。
- 美食与旅行封面采用横图；音乐可用方形专辑图或自摄唱片照片，保持主题与标题一致。
- 首屏主图优先加载，正文后续图片懒加载；用响应式图片避免手机获取全部大图。
- 图片文件名用稳定英文 slug 与版本标记，例如 `kyoto-morning-202609-v1.webp`；修改内容时生成新地址，旧文和回滚版本仍可引用旧文件。
- 原型演示图不能直接当作作者真实经历发布；上线前替换为可使用的实际素材并记录来源。

### 3.2 图片增长后再启用 R2

当图片使克隆、构建或历史管理明显变慢时，可将网络版本迁至独立 R2 图片桶，文章继续保存在 GitHub。生产图片使用持久域名，例如 `images.example.com/travel/kyoto-v1.webp`；禁止将临时签名链接或会失效的分享页作为文章图片地址。

R2 启用步骤：创建专门存放公开图片的桶 → 上传网络版本 → 在桶 Settings / Custom Domains 连接图片域名 → 确认对象 HTTPS 地址可访问 → 替换文章引用。`r2.dev` 是受限流的开发地址，生产应使用自定义域名；域名需属于同账号中的 Cloudflare zone。[R2 Public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/)

R2 负责存储；本方案仍在本地或构建阶段生成合适尺寸，不假设开启 R2 就会自动优化照片。静态页面直接引用公开图片 URL 时，不需要给博客 Worker 加 R2 binding。保留独立图片备份和旧文件，站点回滚不会自动恢复桶里被覆盖或删除的对象。

### 3.3 图片缓存与发布顺序

首版先采用平台默认缓存行为，并通过真实响应头检查。若以后配置长缓存，只用于带内容哈希或不可变版本号的图片；同名地址覆盖图片会使部分读者持续看到旧图。HTML、RSS 和 sitemap 不套用图片的长期 immutable 缓存规则。

独立图片桶的发布顺序固定为：上传新版本图片 → 检查公开 URL → 发布引用新地址的文章 → 验收。不要先发布文章再补图片。旧图片至少保留到相关站点版本退出回滚窗口；需要清缓存时只处理受影响资源，避免全站刷新代替正确版本管理。

## 4. 将代码放到 GitHub

当前项目已有 Git 仓库与 `origin`，沿用现有远程。先用 `git remote -v` 核对目标，再按项目约定通过 PR 或推送发布。

以下初始化命令仅适用于另建的全新项目，不要在当前项目重复添加 `origin`：

`.gitignore` 已忽略 `node_modules/`、`dist/`、`.astro/`、`.wrangler/`、`.vercel/` 和 `.env*`；需要提交变量说明时单独放行 `.env.example`。平台凭据不进入仓库，构建产物也不提交。

1. 在 GitHub 创建空仓库，例如 `daily-between`；已有本地文件时，不同时生成 README、license 或 `.gitignore`，避免首次同步冲突。
2. 在项目根目录运行以下命令；只在确认为尚未初始化 Git 时执行 `git init`。仓库地址须替换为自己的地址。

```sh
git init -b main
git add .
git diff --cached --stat
git diff --cached
git commit -m "Initialize daily life blog"
git remote add origin https://github.com/YOUR_ACCOUNT/daily-between.git
git push -u origin main
```

提交前人工检查暂存内容；上述命令是未来操作说明，本轮未执行。GitHub 官方流程见 [添加本地代码到 GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)。

## 5. 路线 A：Cloudflare Workers Static Assets

### 5.1 本地配置

在后续开发阶段安装并锁定 Wrangler 为开发依赖：

```sh
bun add -d wrangler
```

根目录 `wrangler.jsonc` 示例：

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "daily-between",
  "compatibility_date": "2026-09-29",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  }
}
```

`name` 与控制台 Worker 名保持一致。`compatibility_date` 在初次实施时设为当日，再有计划地更新。`auto-trailing-slash` 能按生成文件结构处理文章路径；找不到的路径返回最近的 `404.html` 与 HTTP 404。需要开发 `src/pages/404.astro`，不可用 SPA 的首页回退掩盖文章不存在。配置依据：[静态生成与自定义 404](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)。

首次本地模拟：

```sh
bun install --frozen-lockfile
bun run build
bunx wrangler dev
```

访问终端给出的本地地址，检查首页、文章深层链接、图片，以及不存在路径。`wrangler dev` 是本地运行命令；真实发布才使用 `wrangler deploy`。[Static Assets 入门](https://developers.cloudflare.com/workers/static-assets/get-started/)

### 5.2 通过 GitHub 自动构建发布

1. Cloudflare 控制台进入 Workers & Pages，新建 Worker，选择连接 Git 仓库流程。
2. 授权 GitHub，选择刚创建的仓库；只授予所需仓库访问权。
3. 设置 Worker 名为 `daily-between`，生产分支为 `main`，根目录为项目根目录。
4. 设置以下构建字段；在开始部署前确认提交了 `bun.lock`，并将 `BUN_VERSION` 构建变量设为 `1.3.14`。

| 配置 | 值 |
| --- | --- |
| Build command | `bun run build` |
| Deploy command | `bunx wrangler deploy` |
| Preview command | `bunx wrangler preview` |
| Root directory | 仓库根目录 |

Workers Builds 按构建、部署两步运行；预览分支会用 Preview command 代替 Deploy command。Wrangler 版本读取项目依赖；构建变量在 Build 设置中维护。依据：[Builds 配置](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)、[Git 集成](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)。

5. 启动首次构建，记录 commit SHA、部署版本和平台提供的 `workers.dev` 地址。
6. Settings / Build / Branch control 中启用 Preview Builds，推送一个内容分支，检查生成的预览链接。

**版本注意：** 2026-09-22 更新的官方文档规定，新 Worker 的预览使用 `bunx wrangler preview`。旧 Worker 可能仍采用旧预览模型；不要直接把旧教程中的 `versions upload` 当作新项目默认配置。实施时确认锁定的 Wrangler 支持该命令，并按控制台实际模型配置。[Build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)

### 5.3 CLI 手动发布备用流程

只在未启用自动发布，或明确进行人工恢复时使用；这是一次真实上传与发布：

```sh
bunx wrangler login
bun install --frozen-lockfile
bun run build
bunx wrangler deploy
```

命令和纯静态配置依据：[Cloudflare Astro 指南](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)、[Wrangler 登录](https://developers.cloudflare.com/workers/wrangler/commands/general/#login)。平时以 Git 集成为发布入口，避免本机未提交内容覆盖线上版本。

### 5.4 自定义域名

确保域名已成为同账号下有效的 Cloudflare zone。在 Worker 的 Settings / Domains & Routes / Add / Custom Domain 输入域名；Cloudflare 配置 DNS 和证书。已有同名 CNAME 时先核对其用途，不能直接覆盖其他站点。[Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

若后续用 Wrangler 管理域名，可在配置中加入以下片段，替换为自己的真实域名，并避免控制台和文件互相覆盖配置：

```jsonc
"routes": [
  { "pattern": "blog.example.com", "custom_domain": true }
]
```

## 6. 路线 B：Vercel

### 6.1 GitHub 导入

1. Vercel 控制台 Add New / Project，连接 GitHub 并 Import 博客仓库。
2. Framework Preset 选择或确认自动识别为 Astro；从 Next.js 项目迁移时，旧项目不会因此自动更新已保存的预设。
3. Root Directory 选择应用所在根目录。仓库的 `vercel.json` 已固定 Framework 为 `astro`、Install Command 为 `bunx bun@1.3.14 install --frozen-lockfile`、Build Command 为 `bunx bun@1.3.14 run build`、Output Directory 为 `dist`；这些字段覆盖控制台对应设置。
4. `bun.lock` 让 Vercel 自动识别 Bun，但不会固定到 1.3.14；上述命令负责固定版本。核对 Production Branch 为 `main`。
5. Deploy 后记录 commit SHA、Deployment URL 和生产域名；逐项执行第 8 节检查。

Astro 官方支持直接导入 Git 仓库，静态站不需 adapter；分支推送生成 Preview，生产分支更新生成 Production。[Astro 的 Vercel 部署指南](https://docs.astro.build/en/guides/deploy/vercel/)

当前沿用旧 NotionNext 的 Vercel 项目，因此将构建契约提交为 `vercel.json`，避免已保存的 Next.js 预设影响本次 Astro 发布。`trailingSlash: true` 与 Astro 的目录式静态输出一致。不要增加将全部路径改写为首页的 SPA rewrite，否则不存在的文章也会返回成功页面。配置覆盖关系见 [Vercel 项目配置](https://vercel.com/docs/project-configuration/vercel-json)。

### 6.1.1 部署成功但页面异常时

先打开部署详情，比较 **Source Commit** 与 `git rev-parse HEAD`，再检查 Framework、输出目录及浏览器实际页面。`git commit` 和本地合并不会触发远程构建，必须推送到生产分支。

2026-10-18 排查发现，`evity-github-io` 生产环境仍在运行 `2a110322` 的 Next.js/NotionNext，而本地已迁移为 Astro。旧页面 HTTP 200，但浏览器显示 “Something went wrong”；页面数据还含有 Notion 获取失败的兜底文章。上游演示站正常，并不能证明本项目的 Notion 页面可访问或部署配置相同。当前博客直接从仓库 Markdown 和图片生成静态页面，已不依赖旧 Notion 数据源。

旧版 NotionNext 在拉取失败后仍返回 `EmptyData` 占位数据，首页继续返回 `props`，所以构建可以成功。占位文章只能证明数据读取失败，不能单凭它断定是页面 ID、权限还是网络问题；也不能据此确定浏览器错误边界的具体触发点。依据：[该版本的数据读取与兜底逻辑](https://github.com/notionnext-org/NotionNext/blob/2a11032252faa3cb3cd62438e821afd245810164/lib/db/SiteDataApi.js#L51-L85)、[占位文章](https://github.com/notionnext-org/NotionNext/blob/2a11032252faa3cb3cd62438e821afd245810164/lib/db/SiteDataApi.js#L319-L340)。

发布后应核对新部署的提交号与推送结果一致，并实际打开首页、分类、文章和不存在的路径；绿色 `Ready` 只代表部署完成，不代表内容和显示已通过验收。

### 6.2 CLI 备用流程

需要 CLI 时再安装并锁定 `vercel` 工具。项目根目录运行下列命令，首次交互时选择正确账号与已有项目；不要重复创建项目。

```sh
bunx vercel
```

已有首次部署的项目默认生成预览部署；新项目的第一次部署即使没有 `--prod` 也会发布到 Production，因此不要把裸命令当成无风险试运行。明确发布生产时运行：

```sh
bunx vercel --prod
```

CLI 会上传项目并按设置构建，不等同于仅把已有 `dist` 上传；没有配置 Build Output API 时，不使用 `--prebuilt`。依据：[Vercel deploy CLI](https://vercel.com/docs/cli/deploy)。

### 6.3 自定义域名

项目 Settings / Domains 添加域名，按 Vercel 当前界面给出的 DNS 记录在域名服务商侧配置，等待域名验证与 TLS 生效。不要照抄历史教程中的固定 IP；根域、子域及不同项目可能有不同记录要求。[添加 Vercel 域名](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

将最终站点地址写入 Astro 的 `site` 配置，并在构建时用于 canonical、RSS 与 sitemap（这些功能需要在开发时实现）。生产主域只指向所选平台，另一平台仅用于迁移演练或预览。

## 7. 日常发布与 CI

固定流程：编辑文章和图片 → 本地构建预览 → 内容分支 push → 检查平台 Preview → 合并 `main` → 核对 Production。

- 平台 Git 集成负责发布。GitHub Actions 如后续引入，只运行安装、构建及项目已有检查，避免同一提交同时由 Actions 和平台部署两次。
- 如以后改用 Actions 发布，先关闭同一生产目标的自动 Git 发布；使用平台范围内的凭据，并将其放入 Actions Secrets。
- Preview 使用演示或待审内容，避免把草稿当作私密存储。预览站的访问控制与禁止搜索索引需要单独配置和验证，不能假定“不是主域就不会被发现”。
- 构建变量与生产变量按环境设置；会写入静态 HTML/JS 的值均视为公开内容。R2 写入密钥只用于上传工具，不能写进浏览器代码。
- 每次生产发布记录日期、commit SHA、平台部署 ID、检查结果、上一个正常部署 ID。

## 8. 首发与更新检查清单

发布成功以真实地址验收为准；控制台显示绿色只说明构建/部署阶段结束。

- [ ] 首页包含美食、咖啡、音乐、旅行图片预览；代码仅在导航中出现。
- [ ] 375px 手机与桌面分别检查封面裁剪、文字换行与图片清晰度。
- [ ] 首页、生活分类、文章详情、代码页和关于页能打开，深层 URL 刷新正常。
- [ ] 图片与字体没有 404；音乐链接正确，不自动播放；真实内容已替换演示文案。
- [ ] 不存在 URL 返回 HTTP 404，并显示可返回首页的错误页。
- [ ] 首屏图片及时显示；手机加载缩略尺寸，正文图片有宽高与替代文本。
- [ ] HTTPS、主域与备用域跳转正常；canonical 指向正式域名。
- [ ] sitemap/RSS（若实现）只含已发布内容；代码文章不进入生活首页或生活 RSS。
- [ ] 至少保留一个经过检查的部署，记录其 SHA 和平台 ID 供回滚。

示例检查命令，域名和文章路径需替换：

```sh
curl -I https://blog.example.com/
curl -I https://blog.example.com/posts/first-post/
curl -I https://blog.example.com/this-page-does-not-exist/
```

分别预期首页/文章可正常访问，不存在页面最终状态为 404；若出现重定向，使用 `curl -IL` 检查最终响应。还需在真实浏览器打开图片、点击导航和验证手机布局，HTTP 检查不能替代视觉检查。

## 9. 故障排查与回滚

| 现象 | 排查顺序 |
| --- | --- |
| `bun install --frozen-lockfile` 失败 | 检查锁文件是否提交、Bun 版本是否与 `.bun-version` 和 `BUN_VERSION` 一致；修复后重新生成并提交 `bun.lock` |
| 构建完成但首页 404 | 确认根目录、输出目录及 `dist/index.html`；Workers 的 assets 必须指向实际产物 |
| 文章内页 404 | 检查是否生成该文章、slug 大小写、尾斜杠策略、草稿过滤 |
| 404 页面却返回 200 | 检查是否误用 SPA 回退或 catch-all rewrite |
| 图片缺失 | 检查文件是否入 Git、大小写、是否误写 `/public/` 前缀、远程地址是否可公开访问 |
| 图片很大或首屏慢 | 检查是否直接引用原图、是否选中正确 `srcset`、是否误把首图懒加载 |
| 预览正确、生产不正确 | 对比部署 SHA、生产分支、环境变量、域名实际指向 |
| 域名 TLS 未生效 | 检查平台域名验证状态、DNS 冲突及证书签发状态 |
| 回滚后再次被坏版本覆盖 | 暂停错误发布源；恢复代码后再启用正常发布流程 |

### Cloudflare 回滚

打开 Worker / Deployments，找到上一个已验收的版本，选择 Rollback；或在正确项目目录使用 CLI：

```sh
bunx wrangler rollback <VERSION_ID>
```

将 `<VERSION_ID>` 替换为发布记录中已验收的正常版本 ID，并确认目标 Worker。指定 ID 可避免不同 Wrangler 入口对省略 ID 的默认行为不一致。回滚会形成新的活动部署；Cloudflare 当前支持回滚至最近 100 个发布版本，关联存储资源不会随代码回滚。依据：[Workers 回滚](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)、[Wrangler 命令](https://developers.cloudflare.com/workers/wrangler/commands/workers/#rollback)。

### Vercel 回滚

项目 Production Deployment / Instant Rollback，选择允许的历史生产部署并核对域名。当前 Hobby 可回滚至紧邻的上一生产部署，其他计划按其可用历史版本处理。**回滚后自动分配生产域名会关闭**；修复版本预览通过后，用 Undo Rollback 选择正确部署，或使用 `vercel promote` 恢复正常发布。依据：[Vercel Instant Rollback](https://vercel.com/docs/instant-rollback)。

### 两平台共同收尾

回滚后立即重做首页、文章、图片、404 检查；记录恢复的部署 ID。在 Git 中修复或 revert 错误提交，经预览后合并，不使用强制推送抹去历史。平台回滚只恢复平台部署，外部图片、域名和第三方内容需要独立恢复。

## 10. 版本与验证记录

- 已完成：核对官方在线文档中的静态托管配置、构建命令、Git 接入、预览、域名、图片管理和回滚方式；示例以 2026-09-29 的文档为准。
- 已完成：框架安装与版本锁定、本地构建与预览检查；21 个页面已在手机、平板与桌面视口下打开检查，无横向溢出或图片加载失败；验收记录见 [本地检查记录](design/REVIEW.md)。
- 本轮未执行：新建远程仓库、平台账号配置、线上发布及线上验收。当前项目沿用已有 Git 远程。Cloudflare 部署前应通过 `bun add -d wrangler` 将 Wrangler 加入并锁定为开发依赖。
- 当前官方资料为滚动更新页面，不能将示例解释成已锁定具体 Wrangler / Vercel CLI 版本；首次发布前再次核对平台 UI、工具命令与套餐限制。
- 如使用本文之外的 SSR 教程，需要重新核对 adapter 与输出结构；本文只覆盖所有页面在构建时生成的静态博客。

相关设计：[设计规范](../DESIGN.md) · [页面原型说明](design/prototype.md)。
