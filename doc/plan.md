# NewBlog 技术方案

---

## 1. 技术选型

| 层级 | 选型 | 理由 |
|------|------|------|
| **框架** | Next.js 14+ (App Router) | 一个框架同时搞定前端和后端，Server Components + API Routes 无缝衔接；File-based Routing 让目录即路由，直觉清晰；SSR 对 SEO 友好 |
| **样式** | Tailwind CSS | 原子化样式，不用起类名，直接在元素上堆样式；响应式一行搞定（如 `md:flex`），大幅提升开发速度 |
| **组件库** | shadcn/ui | 不是传统的 npm 包，而是把源码复制到项目里，想改就改，没有黑盒依赖 |
| **数据库** | SQLite（本地开发）+ PostgreSQL（线上） | 本地开发用 SQLite 零配置；上线后切到 Vercel Marketplace 的 PostgreSQL |
| **ORM** | Prisma | 定义好 Schema 自动生成类型安全的客户端，增删改查完全类型提示 |
| **认证** | JWT + bcrypt | 只有一个管理员用户，不需要 OAuth 那套重的，自己写 bcrypt 加密密码 + JWT Token 验证足够 |
| **Markdown 渲染** | react-markdown + remark 插件 | 文章存 Markdown 格式，前端渲染成 HTML，支持代码高亮、GFM 语法 |
| **部署** | Vercel | 一键部署，自动 CI/CD，Push 代码即上线 |

---

## 2. 架构规范

核心思路：**Next.js App Router 一套代码搞定全栈**。

- **Server Components 优先**：能放服务端的组件不写客户端代码，减小 JS 体积，首屏更快
- **Client Components 按需**：只有需要交互（表单、状态、事件）的组件才加 `'use client'`
- **API Routes 充当后端**：`src/app/api/` 下的文件就是后端接口，直接从 Server 端查数据库
- **Middleware 做权限守卫**：`/admin/*` 路径全部拦截，没 Token 就重定向到登录页
- **前后端共享类型**：Prisma Schema 生成的 TypeScript 类型，前后端直接用同一套，不用手写

---

## 3. 项目目录结构

```
newblog02/
├── doc/
│   ├── PRD.md                    # 产品需求文档
│   └── plan.md                   # 技术方案（本文件）
├── prisma/
│   ├── schema.prisma             # 数据库表结构定义
│   └── seed.ts                   # 种子数据（管理员账号 + 示例文章）
├── public/
│   └── uploads/                  # 上传的图片等静态资源
├── src/
│   ├── app/
│   │   ├── (public)/             # 用户端（路由组，括号不影响 URL）
│   │   │   ├── layout.tsx        # 用户端公共布局（导航栏 + 页脚）
│   │   │   ├── page.tsx          # 首页 → /
│   │   │   ├── posts/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # 文章详情 → /posts/hello-world
│   │   │   └── about/
│   │   │       └── page.tsx      # 关于我 → /about
│   │   ├── admin/                # 管理后台
│   │   │   ├── layout.tsx        # 后台公共布局（侧边栏 + 顶栏）
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # 登录页 → /admin/login
│   │   │   ├── page.tsx          # 仪表盘 → /admin
│   │   │   └── posts/
│   │   │       ├── page.tsx      # 文章列表 → /admin/posts
│   │   │       ├── new/
│   │   │       │   └── page.tsx  # 新建文章 → /admin/posts/new
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx # 编辑文章 → /admin/posts/3/edit
│   │   ├── api/                  # 后端 API 接口
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   │       └── route.ts  # POST /api/auth/login
│   │   │   ├── posts/
│   │   │   │   ├── route.ts      # GET（列表）/ POST（创建）
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET/PUT/DELETE 单篇
│   │   │   ├── categories/
│   │   │   │   └── route.ts      # GET（分类列表）/ POST（新增分类）
│   │   │   ├── stats/
│   │   │   │   └── route.ts      # GET 统计数据
│   │   │   └── profile/
│   │   │       └── route.ts      # GET/PUT 博主信息
│   │   └── layout.tsx            # 根布局
│   ├── components/
│   │   ├── ui/                   # shadcn 基础组件（Button、Input、Table、Dialog 等）
│   │   ├── public/               # 用户端业务组件
│   │   │   ├── Navbar.tsx        # 导航栏
│   │   │   ├── Footer.tsx        # 页脚
│   │   │   ├── ArticleCard.tsx   # 文章卡片
│   │   │   └── Pagination.tsx    # 分页器
│   │   └── admin/                # 后台业务组件
│   │       ├── Sidebar.tsx       # 侧边栏
│   │       ├── StatsCards.tsx    # 统计卡片
│   │       ├── ArticleTable.tsx  # 文章列表表格
│   │       └── ArticleEditor.tsx # Markdown 编辑器（输入 + 实时预览）
│   ├── lib/
│   │   ├── auth.ts               # JWT Token 签发和验证
│   │   ├── db.ts                 # Prisma 客户端单例（全局复用）
│   │   └── utils.ts              # 通用工具函数（生成 slug 等）
│   └── middleware.ts             # 中间件：拦截 /admin/* 做登录校验
├── .env                          # 环境变量（数据库连接串、JWT 密钥）
├── .env.example                  # 环境变量示例（不含敏感值，可提交到 Git）
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 4. 路由设计

### 4.1 页面路由

**用户端：**
| URL | 页面 | 说明 |
|-----|------|------|
| `/` | 首页 | 已发布文章列表 + 分页 |
| `/posts/[slug]` | 文章详情 | Markdown 渲染全文 |
| `/about` | 关于我 | 博主个人信息展示 |

**管理后台：**
| URL | 页面 | 说明 |
|-----|------|------|
| `/admin/login` | 登录页 | 账号密码登录表单 |
| `/admin` | 仪表盘 | 统计数据概览 |
| `/admin/posts` | 文章列表 | 表格浏览 + 搜索 + 状态筛选 |
| `/admin/posts/new` | 新建文章 | Markdown 编辑器 |
| `/admin/posts/[id]/edit` | 编辑文章 | Markdown 编辑器（回填已有内容） |

### 4.2 API 路由

| 方法 | 接口 | 认证 | 说明 |
|------|------|------|------|
| `POST` | `/api/auth/login` | 否 | 登录，返回 JWT Token |
| `GET` | `/api/posts?page=1&category=xxx` | 否 | 获取已发布文章列表（分页+筛选） |
| `GET` | `/api/posts/[id]` | 否 | 获取单篇文章详情 |
| `POST` | `/api/posts` | 是 | 新建文章 |
| `PUT` | `/api/posts/[id]` | 是 | 更新文章 |
| `DELETE` | `/api/posts/[id]` | 是 | 软删除文章 |
| `GET` | `/api/categories` | 否 | 获取所有分类 |
| `POST` | `/api/categories` | 是 | 新增分类 |
| `GET` | `/api/stats` | 是 | 获取统计数据 |
| `GET` | `/api/profile` | 否 | 获取博主信息 |
| `PUT` | `/api/profile` | 是 | 更新博主信息 |

---

## 5. 数据库 Schema

共 3 张表：用户、文章、分类。

```prisma
// ── 管理员用户 ──
model User {
  id           String   @id @default(uuid())
  username     String   @unique          // 登录账号
  passwordHash String                     // bcrypt 加密后的密码
  nickname     String                     // 显示昵称
  avatar       String?                    // 头像 URL
  bio          String?                    // 个人介绍（Markdown）
  socialLinks  Json?                     // {"github":"...", "email":"..."}
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ── 文章 ──
model Post {
  id          String     @id @default(uuid())
  title       String                     // 标题
  slug        String     @unique         // URL 友好标识，由标题自动生成
  content     String                     // Markdown 正文
  excerpt     String?                    // 摘要，自动从正文截取前 200 字
  status      PostStatus @default(DRAFT) // DRAFT 草稿 | PUBLISHED 已发布
  categoryId  String?                    // 可选分类
  category    Category?  @relation(fields: [categoryId], references: [id])
  publishedAt DateTime?                  // 发布时间
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?                  // 软删除标记，不为 null 即已删除
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

// ── 分类 ──
model Category {
  id    String @id @default(uuid())
  name  String @unique
  slug  String @unique
  posts Post[]
}
```

**设计要点：**
- 文章用 `slug` 做 URL 标识，比数字 ID 更 SEO 友好（如 `/posts/hello-world`）
- 状态用枚举 `DRAFT / PUBLISHED`，草稿只有博主在后台能看到
- `deletedAt` 做软删除，删文章只是打标记，数据不丢
- 一篇文章归属一个分类，分类可选

---

## 6. 实现步骤

### 第 1 步：项目初始化
- `npx create-next-app` 创建项目
- 安装 Tailwind CSS + shadcn/ui
- 搭建上方的目录骨架

### 第 2 步：数据库
- 编写 Prisma Schema（上方的 3 张表）
- 本地用 SQLite 执行 `prisma db push`
- 写 Seed 脚本：插入默认管理员账号 + 两篇示例文章 + 一个示例分类

### 第 3 步：认证系统
- 实现 `/api/auth/login`（验密 → 签发 JWT）
- 编写 `middleware.ts`：拦截 `/admin/*`，无 Token 重定向登录页
- 开发登录页面 `/admin/login`

### 第 4 步：用户端页面
- 首页：从数据库查询已发布文章，服务端渲染，分页展示
- 文章详情：按 `slug` 查单篇，react-markdown 渲染
- 关于我：读取 User 表展示博主信息

### 第 5 步：管理后台页面
- 仪表盘：聚合查询统计（文章总数、已发布数、草稿数、分类数）
- 文章列表：表格展示 + 按标题搜索 + 按状态筛选
- 文章编辑器：Markdown 输入 + 实时预览 + 分类选择 + 保存/发布

### 第 6 步：响应式打磨
- 按 PRD 定义的三个断点（768px / 1024px）调整布局
- 移动端导航栏改为汉堡菜单
- 后台表格在小屏切换为卡片布局

### 第 7 步：部署上线
- 代码推送到 GitHub
- Vercel 关联仓库，自动识别 Next.js 项目
- 通过 Vercel Marketplace 创建 PostgreSQL 数据库
- 设置环境变量（`DATABASE_URL`、`JWT_SECRET`）
- 每次 `git push` 自动部署，`main` 分支合并自动发布生产

---

## 7. 部署方案

部署到 Vercel，流程极简：

1. 把代码推到 GitHub 仓库
2. 在 Vercel 中 import 该仓库，自动识别为 Next.js 项目
3. 设置环境变量：
   - `DATABASE_URL`：PostgreSQL 连接串（通过 Vercel Marketplace 创建）
   - `JWT_SECRET`：随机生成一串字符作为 JWT 签名密钥
4. 配置 Vercel 部署钩子：每次部署时自动执行 `prisma db push`，保持线上数据库与 Schema 同步
5. 每次 `git push` 自动触发预览部署；`main` 分支合并自动发布生产
6. 可选：绑定自定义域名 + 自动 HTTPS

---

*文档版本：v1.0 | 最后更新：2026-06-22*
