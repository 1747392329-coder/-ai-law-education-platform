/**
 * 管理后台 - 视频管理列表
 */
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import type { Video } from "@/types/video"
import { formatDuration } from "@/lib/utils"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Pagination from "@/components/common/Pagination"
import { Edit, Trash2, Plus } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchVideos = async (p: number) => {
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
      const res = await fetch(`${API_URL}/admin/videos?page=${p}&page_size=10`, {
        headers: { Authorization: `Bearer ${session?.access_token || ""}` },
      })
      const result = await res.json()
      if (result.code === 200) {
        setVideos(result.data)
        setTotalPages(result.total_pages)
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchVideos(page) }, [page])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确认删除「${title}」?`)) return
    const supabase = getSupabase()
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
    await fetch(`${API_URL}/admin/videos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.access_token || ""}` },
    })
    fetchVideos(page)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">视频管理</h1>
        <Link href="/admin/upload">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            上传视频
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">加载中...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10 text-gray-400">暂无视频</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"
             style={{ boxShadow: "var(--shadow-card)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">视频</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">分类</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">状态</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">播放</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{v.title}</p>
                    <p className="text-xs text-gray-400">{formatDuration(v.duration)}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {v.category ? (
                      <Badge variant="primary">{v.category.name}</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">未分类</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant={v.is_published ? "success" : "default"}>
                      {v.is_published ? "已发布" : "草稿"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{v.view_count}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/videos/${v.id}`}>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id, v.title)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
