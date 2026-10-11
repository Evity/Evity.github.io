---
title: 用一个计数器理解 JavaScript 闭包
description: 从函数如何记住它创建时的环境开始。
slug: javascript-closures
pubDate: 2026-09-08
category: code
codeTopic: learning
tags: [JavaScript, 学习笔记]
draft: false
gallery: []
---

闭包常被解释为「函数和它能够访问的<span class="text-phrase">词法环境</span>」。下面用一个小例子记下这个说法。

```js
function createCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}

const next = createCounter();
next(); // 1
next(); // 2
```

返回函数仍然能访问 `count`，即使 `createCounter` 已经返回。变量不是被复制进函数；函数保留了对创建环境的引用。

## 两个计数器

每次调用 `createCounter` 都创建一份新的局部环境，因此两个计数器各自递增。
