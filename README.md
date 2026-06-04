# rikka's Blog

一个基于 Jekyll 的 GitHub Pages 个人博客。

当前版本是独立的笔记索引风格：纯文本导航、卡片索引、表格式文章归档，不复刻参考站的图标导航或时间线布局。

## 目录

- `index.html`: 首页
- `posts/index.html`: 文章归档
- `showcase/index.html`: 作品页
- `about/index.html`: 关于页
- `_posts/`: Markdown 文章目录
- `_layouts/`: Jekyll 页面布局
- `_includes/`: 公共页头、页脚和主题脚本
- `assets/styles.css`: 全站样式
- `assets/main.js`: 深浅主题切换
- `feed.xml`: 订阅源文件
- `404.html`: GitHub Pages 404 页面
- `Gemfile`: GitHub Pages / Jekyll 依赖

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库，例如 `yourname.github.io` 或普通项目仓库。
2. 把本目录中的文件提交并推送到仓库。
3. 进入仓库 `Settings` -> `Pages`。
4. Source 选择 `Deploy from a branch`，Branch 选择 `main`，Folder 选择 `/root`。
5. 保存后等待 GitHub Pages 构建完成。

如果使用普通项目仓库，站点地址通常是：

```text
https://你的用户名.github.io/仓库名/
```

如果仓库名是 `你的用户名.github.io`，站点地址通常是：

```text
https://你的用户名.github.io/
```

## 添加文章

在 `_posts/` 目录新建 Markdown 文件，文件名格式为：

```text
YYYY-MM-DD-slug.md
```

例如：

```text
_posts/2026-06-04-rag.md
```

文件开头写 front matter：

```yaml
---
title: "文章标题"
description: "文章摘要"
date: 2026-06-04 00:00:00 +0800
slug: example
tags:
  - 标签
---
```

GitHub Pages 会自动把 Markdown 构建成文章页面，并自动更新文章归档和订阅源。

## 本地预览

需要先安装 Ruby，然后运行：

```bash
bundle install
bundle exec jekyll serve
```

本地地址通常是：

```text
http://127.0.0.1:4000/blog/
```
