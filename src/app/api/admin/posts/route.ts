import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
    };
    if (search) {
      where.title = { contains: search };
    }
    if (status && status !== "ALL") {
      where.status = status;
    }

    const posts = await prisma.post.findMany({
      where,
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json(
      { success: false, error: "获取文章列表失败" },
      { status: 500 }
    );
  }
}
