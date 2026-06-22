import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, title: true, content: true, status: true, categoryId: true },
  });

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">编辑文章</h1>
      <ArticleEditor post={post} />
    </div>
  );
}
