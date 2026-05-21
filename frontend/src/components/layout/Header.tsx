/**
 * 顶部导航栏组件
 * 包含 Logo、导航菜单、搜索入口、用户操作（含下拉菜单）
 */
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Search, User, LogOut } from "lucide-react"

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* 左侧：Logo + 导航 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              法规AI课堂
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              首页
            </Link>
            <Link href="/videos" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              全部视频
            </Link>
          </nav>
        </div>

        {/* 右侧：搜索 + 用户 */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>搜索视频...</span>
          </Link>

          {isLoggedIn ? (
            /* 已登录：头像 + 下拉菜单 */
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-ai flex items-center justify-center text-white text-sm font-medium">
                  {user?.nickname?.charAt(0) || "U"}
                </div>
              </button>

              {/* 下拉菜单 */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-1 animate-in">
                  {/* 用户信息 */}
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.nickname || "用户"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.role === "admin" ? "管理员" : "普通用户"}
                    </p>
                  </div>

                  {/* 菜单项 */}
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    个人中心
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      logout()
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                登录
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
