import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 开始写入种子数据...");

  // ── 创建管理员 ──
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      nickname: "博主",
      bio: "欢迎来到我的博客！\n\n这里记录了我的技术笔记和生活感悟。",
      socialLinks: JSON.stringify({
        github: "https://github.com",
        email: "admin@example.com",
      }),
    },
  });
  console.log(`  ✓ 管理员: ${admin.username}`);

  // ── 创建分类 ──
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "tech" },
      update: {},
      create: { name: "技术", slug: "tech" },
    }),
    prisma.category.upsert({
      where: { slug: "life" },
      update: {},
      create: { name: "生活", slug: "life" },
    }),
  ]);
  console.log(`  ✓ 分类: ${categories.map((c) => c.name).join(", ")}`);

  // ── 创建示例文章 ──
  const posts = [
    {
      title: "Hello World — 我的第一篇博客",
      slug: "hello-world",
      content: `## 欢迎来到我的博客！\n\n这是我的第一篇文章。经过一段时间的准备，个人博客终于上线了。\n\n### 为什么要写博客？\n\n- **记录成长**：把学到的知识整理成文字，加深理解\n- **分享知识**：帮助遇到同样问题的人\n- **建立个人品牌**：展示自己的技术能力和思考方式\n\n### 后续计划\n\n我会持续分享前端开发、后端技术和个人项目方面的内容，敬请期待！`,
      excerpt: "这是我的第一篇文章。经过一段时间的准备，个人博客终于上线了。",
      status: "PUBLISHED",
      categoryId: categories[0].id,
      publishedAt: new Date(),
    },
    {
      title: "Next.js 14 App Router 入门指南",
      slug: "nextjs-app-router-guide",
      content: `## Next.js 14 App Router 入门\n\nNext.js 14 带来了全新的 App Router，让 React 开发体验又上了一个台阶。\n\n### Server Components\n\n默认情况下，App Router 中的所有组件都是 Server Component。它们在服务端渲染，不会发送到客户端。\n\n### 路由约定\n\n- \`page.tsx\` — 页面组件\n- \`layout.tsx\` — 布局组件\n- \`loading.tsx\` — 加载状态\n- \`error.tsx\` — 错误处理\n- \`route.ts\` — API 路由\n\n### 总结\n\nApp Router 是 Next.js 的未来方向，值得每个 React 开发者学习。`,
      excerpt: "Next.js 14 带来了全新的 App Router，让 React 开发体验又上了一个台阶。",
      status: "PUBLISHED",
      categoryId: categories[0].id,
      publishedAt: new Date(Date.now() - 86400000),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log(`  ✓ 文章: ${post.title}`);
  }

  console.log("🎉 种子数据写入完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
