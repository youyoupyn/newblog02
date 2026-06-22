"use client";

import { useCallback, useEffect, useState } from "react";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Pagination } from "@/components/public/Pagination";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category?: { name: string } | null;
  publishedAt: string | null;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${page}`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.posts);
        setTotalPages(json.data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">最新文章</h1>

      {loading ? (
        <div className="text-center text-gray-500 py-16">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p className="text-lg mb-2">暂无文章</p>
          <p className="text-sm">博主正在努力创作中...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <ArticleCard key={post.id} {...post} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
