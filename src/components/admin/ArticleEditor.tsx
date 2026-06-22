"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Eye, Pen } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ArticleEditorProps {
  post?: {
    id: string;
    title: string;
    content: string;
    status: string;
    categoryId: string | null;
  };
}

export function ArticleEditor({ post }: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [status, setStatus] = useState(post?.status || "DRAFT");
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setCategories(j.data);
      });
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("标题和内容不能为空");
      return;
    }
    setSaving(true);
    try {
      const url = post ? `/api/posts/${post.id}` : "/api/posts";
      const method = post ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          status,
          categoryId: categoryId || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(post ? "保存成功" : "创建成功");
        router.push("/admin/posts");
      } else {
        toast.error(json.error || "保存失败");
      }
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <Pen className="w-4 h-4 mr-1" /> 编辑
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" /> 预览
              </>
            )}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : post ? "保存" : "发布/保存"}
          </Button>
        </div>
      </div>

      {/* 标题 */}
      <div>
        <Input
          className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
          placeholder="文章标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 元信息 */}
      <div className="flex gap-4">
        <div className="w-40">
          <Label className="text-xs text-gray-500">状态</Label>
          <Select value={status} onValueChange={(v) => setStatus(v || "DRAFT")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">草稿</SelectItem>
              <SelectItem value="PUBLISHED">发布</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-40">
          <Label className="text-xs text-gray-500">分类</Label>
          <Select value={categoryId} onValueChange={(v) => setCategoryId(v || "")}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">无分类</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 编辑器/预览区 */}
      {showPreview ? (
        <div className="border rounded-lg p-6 prose prose-gray max-w-none min-h-[400px]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          className="min-h-[500px] font-mono text-sm resize-none"
          placeholder="开始写 Markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}
    </div>
  );
}
