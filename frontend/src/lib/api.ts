/**
 * API 请求封装
 * 统一管理所有后端请求，自动处理 Token 和错误
 */
import type { ApiResponse } from "@/types/api"

// 后端 API 基地址
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

/**
 * 创建带认证的请求头
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // 从 localStorage 获取 Supabase Session Token
  if (typeof window !== "undefined") {
    const supabaseAuth = localStorage.getItem("sb-token")
    if (supabaseAuth) {
      try {
        const parsed = JSON.parse(supabaseAuth)
        if (parsed.access_token) {
          headers["Authorization"] = `Bearer ${parsed.access_token}`
        }
      } catch {
        // Token 解析失败，忽略
      }
    }
  }

  return headers
}

/**
 * 通用 GET 请求
 */
export async function get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 通用 POST 请求
 */
export async function post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 通用 DELETE 请求
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.statusText}`)
  }

  return response.json()
}
