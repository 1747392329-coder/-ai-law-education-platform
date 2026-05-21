/**
 * 模态框组件
 * 用于确认操作、表单弹窗等
 */
import { useEffect, useRef, type ReactNode } from "react"
import Button from "./Button"

interface ModalProps {
  open: boolean              // 是否打开
  onClose: () => void         // 关闭回调
  title?: string              // 标题
  children: ReactNode         // 内容
  footer?: ReactNode          // 底部操作区
  width?: string              // 宽度（默认 max-w-md）
}

export default function Modal({ open, onClose, title, children, footer, width = "max-w-md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // 按 ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className={`${width} w-full bg-white rounded-2xl shadow-xl animate-in`}>
        {/* 标题栏 */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* 内容 */}
        <div className="px-6 py-4">{children}</div>

        {/* 底部操作 */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
