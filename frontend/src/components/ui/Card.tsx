/**
 * 通用卡片组件
 * 提供统一的卡片容器，支持悬停效果
 */
import type { HTMLAttributes, ReactNode } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean   // 是否启用悬停效果
  padding?: boolean // 是否带内边距（默认 true）
}

export default function Card({
  children,
  hover = false,
  padding = true,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-100
        ${hover ? "video-card-hover cursor-pointer" : ""}
        ${padding ? "p-4" : ""}
        ${className ?? ""}
      `}
      style={{ boxShadow: "var(--shadow-card)" }}
      {...props}
    >
      {children}
    </div>
  )
}
