import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileCheck, FileEdit, FolderOpen } from "lucide-react";

interface StatsData {
  total: number;
  published: number;
  draft: number;
  categories: number;
}

export function StatsCards({ stats }: { stats: StatsData }) {
  const items = [
    { label: "文章总数", value: stats.total, icon: FileText, color: "text-blue-600" },
    { label: "已发布", value: stats.published, icon: FileCheck, color: "text-green-600" },
    { label: "草稿", value: stats.draft, icon: FileEdit, color: "text-orange-500" },
    { label: "分类数", value: stats.categories, icon: FolderOpen, color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{item.label}</CardTitle>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
