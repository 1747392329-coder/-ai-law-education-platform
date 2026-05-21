/**
 * Supabase 客户端初始化
 * 懒加载模式：只在浏览器端和首次使用时创建实例
 * 避免 SSR 阶段因未配置环境变量而报错
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

/**
 * 获取 Supabase 客户端单例
 * 在 Supabase 未配置时返回 null，方便前端开发调试
 */
export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
      console.warn("Supabase 配置缺失，认证功能不可用。请检查 .env.local")
    }
    return null
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "sb-token",
    },
  })

  return supabaseInstance
}

/**
 * 兼容旧导入方式的导出
 * 推荐使用 getSupabase() 函数
 */
export const supabase = typeof window !== "undefined" ? getSupabase() : null
