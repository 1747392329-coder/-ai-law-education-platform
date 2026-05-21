/**
 * 认证 Hook
 * 管理用户认证状态、登录、注册、登出
 */
"use client"

import { useEffect, useCallback } from "react"
import { useAuthStore } from "@/store/authStore"
import { getSupabase } from "@/lib/supabase"

export function useAuth() {
  const { user, isLoggedIn, isLoading, setUser, logout: storeLogout, setLoading } = useAuthStore()

  // 应用启动时，尝试恢复之前的登录会话
  useEffect(() => {
    const supabase = getSupabase()

    // Supabase 未配置时，设置未登录状态
    if (!supabase) {
      setUser(null)
      return
    }

    const restoreSession = async () => {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            nickname: session.user.user_metadata?.nickname ?? null,
            avatar_url: session.user.user_metadata?.avatar_url ?? null,
            role: session.user.user_metadata?.role ?? "user",
            phone: null,
            created_at: session.user.created_at,
          })
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }

    restoreSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser({
            id: session.user.id,
            nickname: session.user.user_metadata?.nickname ?? null,
            avatar_url: session.user.user_metadata?.avatar_url ?? null,
            role: session.user.user_metadata?.role ?? "user",
            phone: null,
            created_at: session.user.created_at,
          })
        } else if (event === "SIGNED_OUT") {
          storeLogout()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, storeLogout, setLoading])

  // 退出登录
  const logout = useCallback(async () => {
    const supabase = getSupabase()
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
      localStorage.removeItem("sb-token")
    } catch {
      // 忽略错误，继续清理本地状态
    }
    storeLogout()
    window.location.href = "/"
  }, [storeLogout])

  return {
    user,
    isLoggedIn,
    isLoading,
    logout,
  }
}
