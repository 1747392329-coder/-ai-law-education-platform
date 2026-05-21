/**
 * 管理后台布局
 * 侧边栏 + 内容区
 */
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Upload, Video, ArrowLeft } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "数据概览", icon: LayoutDashboard },
  { href: "/admin/upload", label: "上传视频", icon: Upload },
  { href: "/admin/videos", label: "视频管理", icon: Video },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <aside className="w-60 bg-white border-r border-gray-100 flex-shrink-0 hidden md:block"
             style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">管理后台</span>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回前台
          </Link>
        </div>
      </aside>

      {/* 内容区 */}
      <div className="flex-1 min-w-0">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  )
}
