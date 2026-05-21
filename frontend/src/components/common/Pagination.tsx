/**
 * 分页组件
 * 用于视频列表等分页场景
 */
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number   // 当前页码
  totalPages: number    // 总页数
  onPageChange: (page: number) => void   // 页码变化回调
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // 生成页码数组，支持省略号
  const pages: (number | "ellipsis")[] = []
  const delta = 1 // 当前页前后各显示多少页

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis")
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="上一页"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* 页码 */}
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors
              ${page === currentPage
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="下一页"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  )
}
