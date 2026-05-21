/**
 * 搜索页
 */
import { Suspense } from "react"
import SearchContent from "./SearchContent"

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">搜索视频</h1>
      <Suspense fallback={<div className="text-center py-10 text-gray-400">加载中...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  )
}
