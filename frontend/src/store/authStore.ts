/**
 * 认证状态管理
 * 使用 Zustand 管理全局认证状态
 */
import { create } from "zustand"
import type { UserProfile } from "@/types/user"

interface AuthState {
  /** 当前用户信息 */
  user: UserProfile | null
  /** 是否已登录 */
  isLoggedIn: boolean
  /** 是否正在加载认证状态 */
  isLoading: boolean

  /** 设置用户信息 */
  setUser: (user: UserProfile | null) => void
  /** 退出登录 */
  logout: () => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true, // 初始为加载中，等待 Supabase 恢复会话

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      isLoading: false,
    }),

  setLoading: (loading) =>
    set({ isLoading: loading }),
}))
