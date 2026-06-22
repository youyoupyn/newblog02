import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 将标题转换为 URL 友好的 slug，末尾追加 6 位随机字符防冲突 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, "-") // 非单词/中文 → 连字符
    .replace(/^-+|-+$/g, "") // 去除首尾连字符
    .slice(0, 60); // 限制长度
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

/** 从 Markdown 正文提取前 200 字作为摘要 */
export function extractExcerpt(content: string, maxLength = 200): string {
  const text = content
    .replace(/^#{1,6}\s.*$/gm, "") // 去掉标题行
    .replace(/!\[.*?\]\(.*?\)/g, "") // 去掉图片
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1") // 链接保留文字
    .replace(/[`*_~>#\[\]|-]/g, "") // 去掉 Markdown 标记符号
    .replace(/\n+/g, " ") // 换行变空格
    .trim();
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
