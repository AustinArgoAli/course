# AI for Everyone · 让所有人都用上 AI

一个纯静态的私域视频教程网站。无需任何构建工具，**直接用浏览器打开 `index.html` 即可运行**。

## 文件结构

```
.
├── index.html          首页（理念介绍 + SpaceX 背景）
├── login.html          注册 / 登录页
├── videos.html         视频教程页（需登录）
├── css/
│   └── styles.css       全部样式（改配色在文件顶部的变量区）
├── js/
│   ├── auth.js          登录逻辑（本地模拟，预留真实接口替换点）
│   ├── main.js          导航栏与滚动效果
│   └── videos-data.js   视频列表数据与渲染
└── assets/
    ├── favicon.svg
    └── README.md        图片素材替换说明
```

## 本地预览

任选一种：

1. 直接双击 `index.html` 用浏览器打开。
2. 起一个本地静态服务（推荐，跳转更稳）：
   ```bash
   # 任选其一
   python3 -m http.server 8080
   npx serve .
   ```
   然后访问 http://localhost:8080

## 替换素材

见 `assets/README.md`，把图片放进 `assets/` 后改对应的 `src` / `cover` 即可。

## 后期上线（连云数据库 + 服务器）

当前注册登录是**本地模拟**（账号存浏览器）。上线时只需两步，页面 UI 完全不用动：

1. **部署静态文件**：把整个目录上传到云服务器（Nginx / 任意静态托管 / 对象存储）即可对外访问。
2. **接真实后端**：
   - 登录注册：改写 `js/auth.js` 里标注【后期替换】的 `signUp` / `signIn`，改成 `fetch` 调用你的接口。
   - 视频列表：改写 `js/videos-data.js` 里的 `VIDEOS`，改成从你的数据库接口获取；视频/封面换成对象存储 + CDN 链接。

整个网站是纯前端静态页面，和后端解耦，后期接什么后端都行。
