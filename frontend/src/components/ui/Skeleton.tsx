/**
 * 骨架屏组件
 * 数据加载时的占位动画
 */
interface SkeletonProps {
  className?: string
}

/** 通用骨架块 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`skeleton-shimmer rounded-xl ${className ?? ""}`} />
  )
}

/** 视频卡片骨架屏 */
export function VideoCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* 缩略图占位 */}
      <Skeleton className="w-full aspect-video rounded-none" />
      {/* 内容占位 */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/** 列表骨架屏（用于整页加载） */
export function VideoListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}
