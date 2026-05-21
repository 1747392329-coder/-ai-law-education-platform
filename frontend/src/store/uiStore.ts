/**
 * UI 状态管理
 * 管理全局 UI 状态：侧边栏开关、主题等
 */
import { create } from "zustand"

interface UIState {
  /** 移动端侧边栏是否打开 */
  mobileMenuOpen: boolean
  /** 搜索关键词 */
  searchQuery: string

  /** 切换移动端菜单 */
  toggleMobileMenu: () => void
  /** 关闭移动端菜单 */
  closeMobileMenu: () => void
  /** 设置搜索关键词 */
  setSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  searchQuery: "",

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  closeMobileMenu: () =>
    set({ mobileMenuOpen: false }),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),
}))
