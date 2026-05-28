/**
 * 视频播放详情页
 */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import type { Video } from "@/types/video"
import { formatDuration, formatCount } from "@/lib/utils"
import VideoActions from "@/components/video/VideoActions"
import { Play, Eye, Calendar, Tag, ArrowLeft } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    const fetchVideo = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/videos/${id}`)
        const result = await res.json()
        if (result.code === 200 && result.data) {
          setVideo(result.data as Video)
        } else {
          setError(result.detail || "视频不存在")
        }
      } catch {
        setError("网络错误")
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="aspect-video bg-gray-200 rounded-xl animate-pulse mb-6" />
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">{error || "视频不存在"}</p>
        <Link href="/videos" className="text-blue-600 hover:underline">
          返回视频列表
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 返回按钮 */}
      <Link
        href="/videos"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      {/* 视频播放器 */}
      <div className="relative rounded-xl overflow-hidden bg-black mb-6">
        <video
          controls
          poster={video.thumbnail_url || undefined}
          className="w-full aspect-video"
          src={video.video_url}
        >
          你的浏览器不支持视频播放
        </video>
      </div>

      {/* 视频信息 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* 元数据行 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {formatCount(video.view_count)} 次播放
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {video.created_at ? new Date(video.created_at).toLocaleDateString("zh-CN") : "-"}
          </span>
          {video.duration > 0 && (
            <span className="flex items-center gap-1.5">
              时长 {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* 分类 + 标签 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {video.category && (
            <Link
              href={`/categories/${video.category.slug}`}
              className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {video.category.name}
            </Link>
          )}
          {video.tags?.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* 点赞收藏 */}
        <div className="mb-4">
          <VideoActions
            videoId={video.id}
            initialLikeCount={video.like_count}
            initialLiked={video.is_liked}
            initialFavorited={video.is_favorited}
          />
        </div>

        {/* 描述 */}
        <p className="text-gray-600 leading-relaxed">{video.description || "暂无描述"}</p>
      </div>
    </div>
  )
}
