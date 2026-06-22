import { ArticleTable } from "@/components/admin/ArticleTable";

export default function AdminPostsPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6">文章管理</h1>
      <ArticleTable />
    </div>
  );
}
