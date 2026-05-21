/**
 * 搜索栏组件
 * 用于首页和搜索页的搜索入口
 */
"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface SearchBarProps {
  placeholder?: string
  className?: string          // 外层容器样式
  size?: "md" | "lg"          // 尺寸
}

export default function SearchBar({ placeholder = "搜索法律法规、安全知识...", className, size = "md" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const sizeStyles = {
    md: "h-11 text-sm",
    lg: "h-14 text-base",
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full rounded-2xl border border-gray-200 bg-white
            pl-11 pr-4 ${sizeStyles[size]} text-gray-900
            placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            shadow-sm
          `}
        />
      </div>
    </form>
  )
}
