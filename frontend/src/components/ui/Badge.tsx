/**
 * 标签/徽章组件
 * 用于显示分类标签、状态标识等
 */
import type { ReactNode } from "react"

type BadgeVariant = "default" | "primary" | "success" | "warning" | "ai"

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  ai: "bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700",
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className ?? ""}
      `}
    >
      {variant === "ai" && (
        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )}
      {children}
    </span>
  )
}
