# 视觉稿生成记录（历史）

以下为 v0.1 的失败生成记录，不是当前设计指令。v0.3 已加入本地摄影图文预览；v0.2 已按用户要求改为生活优先：食物、音乐、咖啡；代码只出现在首页导航。当前交付以更新后的 SVG、PNG 和 DESIGN.md 为准。

工具：内置 imagegen。类型：ui-mockup。用途：温暖杂志风博客首页设计参考，非浏览器截图。

结果：首次生成与简化提示词重试均返回 timeout，没有可保存的生成文件。最终交付为人工定义的 SVG 布局原型及 rsvg-convert 导出的 PNG；SVG 中封面是示意插画，不是生成照片。

## 重试提示词

```text
Generate one high fidelity UI mockup of a Chinese personal blog homepage named 日常之间, warm editorial magazine style. Portrait 1024x1536. Cream #F5F4ED background, charcoal Chinese serif titles, moss green #465C43 links. Header 日常之间 and 首页 生活 代码 关于. Headline 认真生活，慢慢记录。 Large warm photograph of coffee breakfast and open book on wooden table. Feature title 把周末，留给一顿早餐. Below, clean latest article list 最新记录 with 终于弄懂了 JavaScript 闭包, 沿着街道，走一个没有计划的下午, 把书桌搬到窗边以后. Small side section 最近在学 TypeScript. Generous whitespace, thin dividers, elegant typography, no heavy card boxes, no gradients, straight-on website screenshot without browser chrome. Footer 好好生活，保持好奇。
```

精确文案、布局尺寸和交互以根目录 DESIGN.md 为准。生成图中的字体、文字和细节可能存在偏差，不作为真实功能验证。

## 首页完整提示词

```text
Use case: ui-mockup. Create a high fidelity Chinese personal blog website design prototype, a beautifully composed desktop homepage screenshot, front-on no perspective no device chrome, 1440px wide with full long page. Editorial warm magazine style. Brand name 日常之间 (temporary design name), tiny English subtitle LIFE & CODE. Off-white parchment #F5F4ED, warm ink #242720, muted gray #62645B, moss green #465C43 for links, borders #DCDDD2. Chinese Songti/Noto Serif SC headings, Chinese sans body, monospaced small issue/date labels. Wide margins, 1120px content width. Crisp hairline dividers, almost square photo corners, no shadows, no gradients, no pills everywhere. Top masthead brand left and navigation 首页 生活 代码 关于 right. Intro headline 认真生活，慢慢记录。 under it short text 关于衣食住行，也关于代码与好奇心。 Hero is editorial feature spread: large warm natural film-like photograph of sunlit breakfast toast coffee and open book on wooden table taking left 65%, right 35% label 生活 · 食, title 把周末，留给一顿早餐, short Chinese excerpt, date 2026.09.20 and text link 阅读这篇 →. Below thin rule, main section 最新记录 with left 70% three editorial list rows mixing small thumbnails (quiet green street, cozy room) and text-only technical article: 代码 · 学习 / 终于弄懂了 JavaScript 闭包; 生活 · 行 / 沿着街道，走一个没有计划的下午; 生活 · 住 / 把书桌搬到窗边以后. Right rail small pale sage panel 最近在学 with TypeScript / 从类型收窄开始 and lower small paragraph 关于这里. Bottom footer 日常之间 / 好好生活，保持好奇。 and 归档 RSS GitHub text links. All content is demonstration, do not invent followers or metrics. Elegant, readable, substantial realistic Chinese typesetting, photographic focal point, quiet sophisticated literary magazine. This is ONE full homepage design reference with coherent page structure.
```
