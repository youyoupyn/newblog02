import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateSlug, extractExcerpt } from "@/lib/utils";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = 10;
    const category = searchParams.get("category") || undefined;

    const where: Prisma.PostWhereInput = {
      status: "PUBLISHED",
      deletedAt: null,
    };
    if (category) {
      where.category = { slug: category };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "获取文章列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    const { title, content, status, categoryId } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "标题和内容不能为空" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const excerpt = extractExcerpt(content);
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        status: status || "DRAFT",
        categoryId: categoryId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json(
      { success: false, error: "创建文章失败" },
      { status: 500 }
    );
  }
}
