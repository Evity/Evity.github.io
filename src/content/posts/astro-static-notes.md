---
title: 为什么先把博客做成静态站点
description: 个人文章在构建时生成页面，托管只需提供静态文件。
slug: astro-static-notes
pubDate: 2026-09-05
category: code
codeTopic: learning
tags: [Astro, 部署]
draft: false
gallery: []
---

博客以文章阅读为主，没有登录、实时消息或每个读者不同的数据。把 Markdown 在构建时变成 HTML，访问时就不需要先启动应用再查询数据库。

静态站点也能放到 Workers 或 Vercel。文章和页面 URL 保持稳定，图片经过构建优化后按尺寸输出。

## 什么时候再加服务器逻辑

需要登录、动态编辑或请求时个性化内容时，再评估运行时服务。先让写作、阅读和图片加载路径保持简单。
