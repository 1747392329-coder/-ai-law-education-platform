/**
 * 视频相关类型定义
 */

/** 视频分类 */
export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  description: string | null
  sort_order: number
}

/** 视频对象 */
export interface Video {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  video_url: string
  duration: number // 秒
  category_id: number | null
  tags: string[]
  view_count: number
  like_count: number
  is_published: boolean
  uploaded_by: string
  created_at: string
  updated_at: string
  // 扩展字段（从关联查询获得）
  category?: Category | null
  is_liked?: boolean // 当前用户是否已点赞
  is_favorited?: boolean // 当前用户是否已收藏
}
