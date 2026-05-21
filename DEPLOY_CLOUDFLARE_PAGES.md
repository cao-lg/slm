# Cloudflare Pages 部署指南

## 🚀 快速部署

### 方法1：使用 Git 自动部署（推荐）

1. 将代码推送到 GitHub/GitLab 仓库
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com)
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择您的仓库
6. 配置如下：

```
项目名称: erp-system
构建命令: npm run build
输出目录: dist
Node.js 版本: 20
```

7. 点击 "Save and Deploy"

---

### 方法2：使用 Wrangler CLI

#### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

#### 3. 先构建项目

```bash
cd erp-frontend
npm install
npm run build
```

#### 4. 部署到 Cloudflare Pages

```bash
wrangler pages project create erp-system --production-branch=main
wrangler pages deploy ./dist --project-name=erp-system
```

---

## 📝 部署前配置

### 1. 环境变量（可选）

如果需要配置 API 地址等环境变量，可以在 Cloudflare Pages 控制台添加：

```
VITE_API_BASE_URL=https://your-api.example.com
```

### 2. 修改 Vite 配置（可选）

如果需要使用不同的 API 地址，可以修改 `vite.config.ts`：

```typescript
export default defineConfig({
  // ...其他配置
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || '/api'
    )
  }
})
```

---

## 🎯 技术优势

### Cloudflare Pages 的优势

- ✅ **免费**: 免费套餐完全够用
- ✅ **全球 CDN**: 全球加速，加载快
- ✅ **自动 HTTPS**: 免费 SSL 证书
- ✅ **自动部署**: Git 提交自动部署
- ✅ **边缘函数**: 支持 Cloudflare Workers
- ✅ **团队协作**: 多人协作开发
- ✅ **预览部署**: 每个 PR 自动预览
- ✅ **自定义域名**: 支持绑定您的域名

### 本项目特别适合

- 因为我们现在主要使用 Mock 数据
- 可以完全独立运行，无需后端（暂时）
- 纯静态文件部署，性能极佳
- 页面加载速度超快！

---

## 🔧 注意事项

### 1. 路由模式

当前使用 `createWebHistory()`，这需要在服务器端配置 SPA 路由重定向（已配置 `_redirects` 文件）。

### 2. API 后端

如果需要部署后端，可以考虑：
- **Cloudflare Workers**: 使用 Worker + Durable Objects
- **Railway/Render/Vercel**: 部署 Spring Boot 后端
- **Supabase/PocketBase**: 使用 BaaS 服务代替后端

### 3. Mock 数据

当前项目使用前端 Mock 数据，可以直接运行。如果需要真实后端，需要另行部署。

---

## 📊 完整部署方案建议

### 方案1：完全静态（当前状态）

- ✅ 前端部署到 Cloudflare Pages
- ✅ 使用 Mock 数据
- ✅ 零后端依赖
- ✅ 100% 免费

### 方案2：前后端分离

- **前端**: Cloudflare Pages
- **后端**: Cloudflare Workers 或其他云服务
- **数据库**: Cloudflare D1 或其他

### 方案3：云原生完整方案

- **前端**: Cloudflare Pages
- **后端**: Cloudflare Workers + Durable Objects
- **数据库**: Cloudflare D1
- **存储**: Cloudflare R2
- **100% Cloudflare 生态**

---

## 🌐 部署后的访问地址

部署后，您将获得类似这样的地址：

```
https://erp-system.pages.dev
```

或者绑定您的自定义域名：

```
https://erp.your-domain.com
```

---

## 🎉 总结

**可以部署到 Cloudflare Pages！**

这是一个完美的组合：
- 🟢 Vue 3 + Vite = 极速构建和加载
- 🟢 Cloudflare Pages = 免费+全球CDN+自动部署
- 🟢 无需后端 = 可以直接使用 Mock 数据

立即开始部署吧！🚀
