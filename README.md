# 笔记本

一个适合 GitHub Pages 的纯静态个人博客模板。页面内容目前保持占位状态，方便后续填写个人信息、文章和作品。

当前版本是独立的笔记索引风格：纯文本导航、卡片索引、表格式文章归档，不复刻参考站的图标导航或时间线布局。

## 目录

- `index.html`: 首页
- `posts/index.html`: 文章归档
- `showcase/index.html`: 作品页
- `about/index.html`: 关于页
- `templates/post.html`: 文章页面模板
- `assets/styles.css`: 全站样式
- `assets/main.js`: 深浅主题切换
- `rss.xml`: RSS 占位文件
- `404.html`: GitHub Pages 404 页面

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

复制 `templates/post.html` 到一个新目录，例如：

```text
posts/my-first-post/index.html
```

然后修改标题、摘要、日期、标签和正文，并在 `posts/index.html` 与首页里添加对应链接。
