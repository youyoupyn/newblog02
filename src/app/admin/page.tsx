"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/admin/StatsCards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StatsData {
  total: number;
  published: number;
  draft: number;
  categories: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setStats(j.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">仪表盘</h1>
        <Button onClick={() => router.push("/admin/posts/new")}>
          <Plus className="w-4 h-4 mr-1" />
          新建文章
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-16">加载中...</div>
      ) : stats ? (
        <StatsCards stats={stats} />
      ) : (
        <div className="text-center text-gray-500 py-16">加载失败</div>
      )}
    </div>
  );
}
