import Link from "next/link";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  category?: { name: string } | null;
  publishedAt: string | null;
}

export function ArticleCard({ title, slug, excerpt, category, publishedAt }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        {category && (
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{category.name}</span>
        )}
        <time>{publishedAt ? new Date(publishedAt).toLocaleDateString("zh-CN") : "未发布"}</time>
      </div>
      <Link href={`/posts/${slug}`}>
        <h2 className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors mb-2">
          {title}
        </h2>
      </Link>
      {excerpt && <p className="text-sm text-gray-500 line-clamp-2">{excerpt}</p>}
    </article>
  );
}
