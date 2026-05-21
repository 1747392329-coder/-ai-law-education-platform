/**
 * 空状态组件
 * 列表无数据或搜索结果为空时显示
 */
import Link from "next/link"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string   // 操作按钮文字
  actionHref?: string    // 操作按钮链接
}

export default function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* 图标 */}
      {icon ? (
        <div className="mb-4 text-gray-300">{icon}</div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6M9 13h6M9 17h4" />
          </svg>
        </div>
      )}

      {/* 标题 */}
      <h3 className="text-base font-medium text-gray-600 mb-1">{title}</h3>

      {/* 描述 */}
      {description && (
        <p className="text-sm text-gray-400 mb-6 text-center max-w-sm">{description}</p>
      )}

      {/* 操作按钮 */}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
