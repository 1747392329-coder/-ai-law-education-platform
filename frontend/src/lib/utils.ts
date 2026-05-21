/**
 * 通用工具函数
 */

/**
 * 格式化视频时长
 * 将秒数转换为 "MM:SS" 格式
 * @param seconds 秒数
 * @returns 格式化后的时间字符串，如 "03:25"
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

/**
 * 格式化数字显示
 * 大于1000时显示为 "1.2k" 格式
 * @param num 原始数字
 * @returns 格式化后的字符串
 */
export function formatCount(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * 生成随机占位背景色（用于视频卡片占位图）
 */
export function getPlaceholderColor(): string {
  const colors = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
