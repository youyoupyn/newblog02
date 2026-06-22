import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: { category: true },
  });

  if (!post) notFound();

  // 上一篇和下一篇
  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lt: post.publishedAt! },
      },
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true },
    }),
    prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { gt: post.publishedAt! },
      },
      orderBy: { publishedAt: "asc" },
      select: { title: true, slug: true },
    }),
  ]);

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* 头部 */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          {post.category && (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {post.category.name}
            </span>
          )}
          <time>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </time>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
      </header>

      {/* 正文 */}
      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {/* 底部导航 */}
      <nav className="mt-12 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.slug}`}
            className="flex items-start gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <span className="block text-xs text-gray-400">上一篇</span>
              {prevPost.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextPost && (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="flex items-start justify-end gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors text-right"
          >
            <div>
              <span className="block text-xs text-gray-400">下一篇</span>
              {nextPost.title}
            </div>
            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
          </Link>
        )}
      </nav>
    </article>
  );
}
