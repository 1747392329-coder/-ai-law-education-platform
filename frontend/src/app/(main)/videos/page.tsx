/**
 * 全部视频页
 * 分页展示所有已发布视频
 */
import { Suspense } from "react"
import VideosContent from "./VideosContent"

export default function VideosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">全部视频</h1>
        <p className="text-sm text-gray-500 mt-1">浏览所有安全教育视频内容</p>
      </div>
      <Suspense fallback={<div className="text-center py-10 text-gray-400">加载中...</div>}>
        <VideosContent />
      </Suspense>
    </div>
  )
}
