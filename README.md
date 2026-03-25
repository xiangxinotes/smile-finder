# 😃 微笑捕手 ｜ Smile Finder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: HTML/CSS/JS](https://img.shields.io/badge/Language-HTML%2FCSS%2FJS-orange.svg)](#)

**微笑捕手**是一款基于 Web 的极简专注力训练游戏。通过在30秒内捕捉尽可能多的积极表情（笑脸），帮助用户训练“积极偏向（Positive Bias）”，提升专注力并改善情绪健康。

[🚀 立即开始游戏](https://xiangxinotes.github.io/smile-finder/?utm_source=github&utm_campaign=read_me)

--- 

## ✨ 核心功能

![OG Image](./assets/og-zh-hans.webp)

- **心理学原理**：基于积极心理学中的“积极偏向训练”，通过视觉搜寻笑脸来调节情绪。
- **动态难度**：随着得分提高，背景颜色、表情密度和干扰项会动态变化。
- **多语言支持**：原声支持**简体中文(zh-Hans)**、**繁体中文(zh-Hant)**和**英文(en)**。
- **响应式设计**：完美适配手机、平板及电脑屏幕。
- **智能记忆**：自动记忆用户的语言偏好及历史最高得分。
- **社交分享**：优化的 Open Graph 标签，分享到社交平台时拥有精美卡片。

---

## 🔧 技术栈

- **Vanilla JavaScript**: 原生 JS 驱动，无框架依赖，极致轻量。
- **CSS3**: 使用 Flexbox/Grid 布局，包括动态滤镜和过渡动画。
- **HTML5**: 语义化标签，深度 SEO 优化。
- **Github Pages**: 静态托管，自动化部署。

---

## 📁 项目结构

```text
.
├── index.html        # 英文版入口（根目录）
├── locales.json      # 多语言文案库
├── manifest.json     
├── js/
│   └── game.js       # 核心游戏逻辑   
├── assets/			  # OG 预览图
├── css/
│   └── styles.css    # 全局样式   
├── zh-hans/
│   └── index.html    # 简体中文版
└── zh-hant/
    └── index.html    # 繁体中文版
```

--- 

## 🚀 本地开发
1. **克隆仓库**
```bash
git clone https://github.com/xiangxinotes/smile-finder.git
```
2. **启动预览**
由于项目涉及 `fetch` 读取 `locales.json`，建议使用本地服务器打开(如 VS Code 的 Live Server 插件）。

--- 

## 许可证

本项目采用[MIT License](https://www.google.com/search?q=LICENSE)开源。

--- 
## 👋 联系作者
如果你喜欢这个项目，欢迎点个 **Star** ⭐️！

如果有任何改进建议，欢迎提交 **Issue** 或 **PR**。

