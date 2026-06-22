import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      select: { id: true, nickname: true, avatar: true, bio: true, socialLinks: true },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "未找到博主信息" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: {
        ...user,
        socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "获取博主信息失败" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    const { nickname, avatar, bio, socialLinks } = await request.json();
    const data: Record<string, unknown> = {};
    if (nickname !== undefined) data.nickname = nickname;
    if (avatar !== undefined) data.avatar = avatar;
    if (bio !== undefined) data.bio = bio;
    if (socialLinks !== undefined) data.socialLinks = JSON.stringify(socialLinks);

    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "未找到博主信息" },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, nickname: true, avatar: true, bio: true, socialLinks: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        socialLinks: updated.socialLinks ? JSON.parse(updated.socialLinks) : null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "更新博主信息失败" },
      { status: 500 }
    );
  }
}
