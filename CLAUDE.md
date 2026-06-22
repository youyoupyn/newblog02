# CLAUDE.md — NewBlog 个人博客系统

## 项目概述

NewBlog 是一个极简个人博客系统，分两个端：用户端（浏览文章、关于我）和管理后台（登录、仪表盘、文章 CRUD）。详细需求见 `doc/PRD.md`，技术方案见 `doc/plan.md`。

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 样式 | Tailwind CSS |
| 组件库 | shadcn/ui |
| 数据库 | SQLite（本地开发） / PostgreSQL（线上） |
| ORM | Prisma |
| 认证 | JWT + bcrypt |
| Markdown | react-markdown + remark |
| 部署 | Vercel |

## 架构规则

1. **Server Components 优先** — 只有需要交互（表单、事件、状态）的组件才加 `'use client'`，其余一律写成 Server Component
2. **API Routes 做后端** — `src/app/api/` 下直接查数据库，不单独搭后端服务
3. **Middleware 做权限守卫** — 所有 `/admin/*` 路由（除 `/admin/login` 外）由 `middleware.ts` 拦截，无 Token 重定向登录页
4. **软删除** — 文章删除只设 `deletedAt`，不真删数据。所有查询文章的地方必须加 `where: { deletedAt: null }`
5. **草稿隔离** — 用户端只查 `status: PUBLISHED` 的文章，管理后台可以看到所有状态
6. **slug 做 URL 标识** — 文章通过 `slug` 字段定位（如 `/posts/hello-world`），不用数字 ID 做公开 URL

## 目录结构

```
src/
├── app/
│   ├── (public)/            # 用户端路由组
│   │   ├── layout.tsx       # 用户端布局（Navbar + Footer）
│   │   ├── page.tsx         # / 首页（已发布文章列表 + 分页）
│   │   ├── posts/[slug]/    # /posts/[slug] 文章详情
│   │   └── about/           # /about 关于我
│   ├── admin/
│   │   ├── layout.tsx       # 后台布局（Sidebar + TopBar）
│   │   ├── login/           # /admin/login 登录页
│   │   ├── page.tsx         # /admin 仪表盘
│   │   └── posts/           # /admin/posts 文章管理
│   │       ├── page.tsx     # 文章列表
│   │       ├── new/         # 新建文章
│   │       └── [id]/edit/   # 编辑文章
│   └── api/
│       ├── auth/login/      # POST 登录
│       ├── posts/           # GET 列表 / POST 创建
│       ├── posts/[id]/      # GET/PUT/DELETE 单篇
│       ├── categories/      # GET 列表 / POST 新增
│       ├── stats/           # GET 统计数据
│       └── profile/         # GET/PUT 博主信息
├── components/
│   ├── ui/                  # shadcn 基础组件（Button, Input, Table, Dialog...）
│   ├── public/              # 用户端业务组件
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ArticleCard.tsx
│   │   └── Pagination.tsx
│   └── admin/               # 后台业务组件
│       ├── Sidebar.tsx
│       ├── StatsCards.tsx
│       ├── ArticleTable.tsx
│       └── ArticleEditor.tsx
├── lib/
│   ├── auth.ts              # JWT 签发/验证 + 密码哈希
│   ├── db.ts                # Prisma 客户端单例
│   └── utils.ts             # 生成 slug 等工具函数
└── middleware.ts            # /admin/* 登录校验
```

## 数据库表（3张）

- **User** — 管理员用户（username, passwordHash, nickname, avatar, bio, socialLinks）
- **Post** — 文章（title, slug, content, excerpt, status, categoryId, publishedAt, deletedAt）
- **Category** — 分类（name, slug）

## 编码规范

- 所有文案和注释使用中文
- API 返回 `{ success: boolean, data?: T, error?: string }` 统一格式
- 后台 API 统一先调用 `lib/auth.ts` 中的 `getSession()` 校验身份，未登录返回 401
- 用户端 page.tsx 写 Server Component，通过 `prisma.post.findMany()` 直接查库
- slug 由标题自动生成：去掉特殊字符、空格替换为 `-`、全部小写、末尾加随机 6 位（防冲突）
- shadcn 组件按需手动添加（`npx shadcn add button`），不一次装完

## 常用命令

```bash
# 本地开发
npm run dev

# 数据库
npx prisma db push          # Schema 同步到本地 SQLite
npx prisma db seed          # 写入种子数据
npx prisma studio           # 浏览器打开数据库管理面板
npx prisma generate         # 重新生成 Prisma 客户端类型

# 构建部署
npm run build               # 生产构建
vercel                      # 部署到 Vercel
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | 数据库连接串（本地: `file:./dev.db`，线上: PostgreSQL） |
| `JWT_SECRET` | JWT 签名密钥（生产环境用随机长字符串） |

## 暂不实现

- 博客标签（Tag）功能 — 规划中但本轮不实现

---

*关联文档：`doc/PRD.md` | `doc/plan.md`*
