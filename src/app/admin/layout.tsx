"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Menu, LayoutDashboard, FileText, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { label: "仪表盘", href: "/admin", icon: LayoutDashboard },
  { label: "文章管理", href: "/admin/posts", icon: FileText },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) return <>{children}</>;

  const handleLogout = async () => {
    document.cookie = "admin-token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 桌面端侧边栏 */}
      <aside className="hidden md:flex w-56 flex-col bg-white border-r border-gray-200">
        <div className="h-14 flex items-center px-4 border-b border-gray-200">
          <Link href="/admin" className="text-lg font-bold text-gray-900">
            NewBlog 后台
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-200 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <Home className="w-4 h-4" />
            返回前台
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            {/* 移动端菜单 */}
            <Sheet open={open} onOpenChange={setOpen}>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <SheetContent side="left" className="w-56 p-0">
                <div className="h-14 flex items-center px-4 border-b border-gray-200">
                  <span className="text-lg font-bold text-gray-900">NewBlog 后台</span>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          active
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <hr className="my-2" />
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    <Home className="w-4 h-4" />
                    返回前台
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
            <span className="text-sm text-gray-500 hidden md:inline">欢迎回来</span>
          </div>
          <button
            onClick={handleLogout}
            className="hidden md:block text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            退出登录
          </button>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
