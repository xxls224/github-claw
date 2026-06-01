# 思维与英语教育 · 单页网站

基于 React 18 + Vite + Tailwind CSS v3 构建的移动端优先个人家教单页网站，默认配置 GitHub Pages 部署与 Formspree 表单。

## GitHub Actions 简报自动化

仓库新增 `daily-ai-brief` 定时 Issue 发布流程，说明见 `DAILY_BRIEF_GUIDE.md`，当前在北京时间 08:00 和 14:00 触发，并默认从多个官方来源自动生成正文。

## 开发与构建

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run format
npm run build
```

## 关键配置说明

### 1) 替换微信跳转链接

编辑 `src/App.jsx` 中的常量：

```js
const WECHAT_LINK = 'https://weixin.qq.com/r/your-wechat-link'
```

### 2) 替换微信二维码图片

将真实二维码替换为同名文件：

```
public/wechat-qr-placeholder.svg
```

如需自定义文件名，请同步修改 `src/App.jsx` 中的图片路径。

### 3) 配置 Formspree 表单

编辑 `src/App.jsx` 中的常量：

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/yourFormId'
```

### 4) 修改网站内容

- `src/App.jsx`：导航、Hero、课程、价格、流程、预约等主要内容
- `src/sections/FaqSection.jsx`：常见问题
- `src/sections/TestimonialsSection.jsx`：匿名家长评价

## GitHub Pages 部署

已配置 `.github/workflows/deploy.yml` 自动部署到 GitHub Pages。默认 `base` 路径为仓库名：

```
/vite.config.js -> base: '/github-claw/'
```

如果仓库名改变，请同步更新 `vite.config.js` 中的 `base` 字段。

## GitHub Codespaces

已补充 `.devcontainer/` 配置，Codespace 启动后会自动安装前端依赖、Python 依赖并安装 FFmpeg，随后尝试启动前端开发服务器与可用的 Python 服务入口。

- 前端默认转发：`5173`
- Python 服务默认转发：`8000`
- 服务日志默认写入 `$HOME/.cache/codespaces-services/`
- 可通过 `tail -f ~/.cache/codespaces-services/*.log` 查看启动日志
- 日志不会自动轮转，Codespace 很长时间未清理时可手动删除该目录下旧日志
