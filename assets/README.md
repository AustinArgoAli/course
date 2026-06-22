# 素材替换说明

把你的图片素材放进这个 assets 目录，然后按下面对应关系替换即可。

## 1. 首页主背景（SpaceX 大图）

- 推荐命名：`hero.jpg`
- 替换位置：`index.html` 中搜索 `hero-bg` 下的 `<img src="...">`
- 改成：`<img src="assets/hero.jpg" alt="..." />`

## 2. 登录页右侧配图

- 推荐命名：`login-side.jpg`
- 替换位置：`login.html` 中搜索 `auth-visual` 下的 `<img src="...">`
- 改成：`<img src="assets/login-side.jpg" alt="" />`

## 3. 视频封面图

- 推荐命名：`video-1.jpg`、`video-2.jpg` ...
- 替换位置：`js/videos-data.js` 中每个视频的 `cover` 字段
- 改成：`cover: 'assets/video-1.jpg'`

## 4. 站点图标 favicon

- 已提供 `assets/favicon.svg`，如需替换换成你自己的图标即可。

---
当前未替换的图片用的是 Unsplash 网络占位图，换成本地素材后无需联网即可显示。
