/**
 * 通用输入框组件
 * 支持图标前缀、错误提示、密码可见切换
 */
import { type InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string          // 标签文字
  error?: string          // 错误提示
  leftIcon?: React.ReactNode  // 左侧图标
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* 标签 */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {/* 左侧图标 */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            className={`
              w-full rounded-xl border bg-white px-4 py-2.5 text-sm
              text-gray-900 placeholder:text-gray-400
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              ${leftIcon ? "pl-10" : ""}
              ${error ? "border-red-400 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300"}
              ${className ?? ""}
            `}
            {...props}
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export default Input
