/**
 * 用户相关类型定义
 */

/** 用户角色 */
export type UserRole = "user" | "admin"

/** 用户信息（扩展 Supabase Auth 用户） */
export interface UserProfile {
  id: string
  nickname: string | null
  avatar_url: string | null
  role: UserRole
  phone: string | null
  created_at: string
}

/** 积分记录 */
export interface PointRecord {
  id: number
  user_id: string
  points: number // 正数=获得，负数=消费
  reason: string
  description: string | null
  created_at: string
}
