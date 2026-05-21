/**
 * API 响应类型定义
 */

/** 通用 API 响应 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  code: number
  message: string
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

/** 分页请求参数 */
export interface PaginationParams {
  page?: number
  page_size?: number
}
