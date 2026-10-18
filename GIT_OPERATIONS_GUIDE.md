# Git 分支合并操作指南

这份指南记录如何把远程 `main` 的更新合入功能分支，依据项目需求解决冲突，并在本地更新 `main`。示例中的 `feat/evity-personal-blog` 和提交号对应本仓库这次操作；其他项目请替换成自己的分支名。

## 合并前先看清状态

```sh
git status --short --branch
git fetch origin main
git log --oneline --graph --decorate --all -20
```

`fetch` 只更新本地的远程跟踪分支（例如 `origin/main`），不会改工作区。确认要合入的是哪一个远程提交，并先处理自己尚未提交的改动。

## 更新本地 main，再合入功能分支

```sh
git switch main
git merge --ff-only origin/main
git switch feat/evity-personal-blog
git merge --no-ff --no-commit origin/main
```

`--ff-only` 只允许本地 `main` 快进到远程提交；如果两边已经分叉，它会停止，避免悄悄创建另一个合并。`--no-ff --no-commit` 会把合并暂停在提交前，给你检查和解决冲突的机会。当前功能分支已经包含 `main` 的祖先关系，因此最后也能用快进更新本地 `main`。

## 逐个冲突，按需求决定结果

先查看冲突文件和 Git 的冲突类型：

```sh
git status
git diff --name-only --diff-filter=U
git diff --cc -- path/to/file
git ls-files -u -- path/to/file
```

合并时，`ours` 是当前功能分支，`theirs` 是正在合入的 `origin/main`。需要比较文件的三个版本时：

```sh
git show :1:path/to/file   # 合并基点；某些新增文件没有这个版本
git show :2:path/to/file   # 功能分支版本（ours）
git show :3:path/to/file   # main 版本（theirs）
git diff :2:path/to/file :3:path/to/file
```

修改/删除冲突中，被删除的一侧也可能没有对应阶段；这时 `git show` 该阶段会报不存在。用 `git ls-files -u` 查看当前可比较的阶段，不要把缺失的版本误当成文件读取故障。

按文件用途处理：保留满足博客需求的行为；上游的安全修复、配置或文档仍适用时，把它们合进最终文件；若文件属于已被替换的框架或主题，就确认没有被新应用引用后删除。选一侧只适合确认整份文件都应采用该侧的情况，不能把 `ours` 或 `theirs` 当作通用冲突策略。

手动编辑完成后用 `git add path/to/file` 标记为已解决。确定某个文件不再需要时用 `git rm path/to/file`。处理后的检查：

```sh
git status
git diff --cached
git diff --check
git diff --cached --check
git diff --name-only --diff-filter=U
```

最后一条命令应没有输出。再运行与项目相符的检查、构建或测试，确认功能和配置没有被冲突解决破坏。

当前 Astro 博客使用以下命令验证，依赖安装与 VMware 共享目录的处理见 [README](README.md)：

```sh
bun run check
bun run build
bun run preview
```

## 完成合并并更新本地 main

```sh
git commit -m "Merge origin/main into personal blog"
git show --no-patch --pretty=raw HEAD
git switch main
git merge --ff-only feat/evity-personal-blog
git status --short --branch
```

合并提交有两个父提交：功能分支原提交和被合入的 `main` 提交，因此两边的提交历史都保留。最后一步只移动本地 `main` 指针；它不会推送远程。需要发布时再检查远端目标和差异，并通过项目约定的 PR 或推送流程完成。

`git blame` 显示每一行最后一次修改的作者，不能用来判断分支是否已经合并。未修改的原有代码通常仍显示原作者；冲突解决或迁移时改写的行会显示新提交的作者。已删除文件的旧内容仍可用 `git log -- path/to/file` 和 `git show <commit>:path/to/file` 追溯。

确认当前分支已包含远程 `main` 的提交，可以执行：

```sh
git merge-base --is-ancestor origin/main HEAD
```

返回码为 `0` 表示已包含，`1` 表示尚未包含；其他返回码表示命令出错。以提交祖先关系核实合并结果，比查看 blame 更直接。

## 中止或撤销

合并尚未提交且想回到开始合并前，可以使用：

```sh
git merge --abort
```

如果合并提交已经共享给其他人，不要改写公共历史；应评估后用 `git revert -m 1 <merge-commit>` 新增一个反向提交。`-m 1` 表示以第一个父提交作为主线，执行前先确认它确实是希望保留的那一侧。

## 本仓库这次合并的取舍

本次先把本地 `main` 快进到远程 `origin/main` 的 `2a110322`，再把它合入 `feat/evity-personal-blog`。Git 报告 458 个冲突路径，其中 435 个是修改/删除冲突、14 个内容冲突、9 个文件位置冲突。

冲突主要来自两个不同目标：上游 `main` 继续维护 NotionNext 多主题应用，功能分支承载的是个人博客。依据个人博客需求，合并提交 `660ff8db` 保留了功能分支的应用树，没有把上游专属页面、主题和依赖重新加回博客；上游提交仍作为合并提交的第二父提交保留在历史里。随后本项目按 `~/Repos/blog` 的内容迁移为 Astro 静态博客。这样解决冲突是一次针对产品目标的选择，不代表遇到冲突都应优先选功能分支。

Astro 改造保存在 `1da13c24`（`Migrate personal blog to Astro`）。可用 `git show --stat 1da13c24` 查看这次迁移，用 `git show 660ff8db^2:path/to/file` 追溯合并前的上游文件。最初的合并操作只更新了本地分支；2026-10-18 的后续发布另行获得了推送授权。

## 推送并核对部署

本地检查、构建和浏览器验收通过后，核对远端目标与提交关系，再正常推送：

```sh
git remote -v
git fetch origin main
git log --oneline origin/main..main
git merge-base --is-ancestor origin/main main
git push origin main
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

最后两个命令的提交号应相同。若推送因远端有新提交而被拒绝，重新 fetch 并检查差异，按上文流程合并后再验证；不要强制覆盖远端。

推送到 Vercel 的生产分支后，在部署详情核对同一个完整提交号，等待 `Ready`，再通过真实生产域名检查页面、图片、深层链接和 404。本仓库的 Astro 构建设置由 `vercel.json` 管理，旧项目的 Next.js 预设由该文件覆盖；完整说明见 [部署方法论](docs/DEPLOYMENT.md#61-github-导入)。
