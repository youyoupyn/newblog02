import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">新建文章</h1>
      <ArticleEditor />
    </div>
  );
}
