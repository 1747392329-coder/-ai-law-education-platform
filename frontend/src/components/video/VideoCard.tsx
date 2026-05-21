/**
 * 视频卡片组件
 * 用于视频列表和首页推荐展示
 */
"use client"

import Link from "next/link"
import type { Video } from "@/types/video"
import { formatDuration, formatCount } from "@/lib/utils"
import { Play, Eye } from "lucide-react"

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.id}`} className="group block">
      <div className="video-card-hover bg-white rounded-xl border border-gray-100 overflow-hidden"
           style={{ boxShadow: "var(--shadow-card)" }}>
        {/* 缩略图区域 */}
        <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {/* 占位渐变 + 播放按钮 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center
                          group-hover:bg-white/30 group-hover:scale-110 transition-all duration-200">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>

          {/* 时长标签 */}
          {video.duration > 0 && (
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-xs font-medium">
              {formatDuration(video.duration)}
            </span>
          )}

          {/* 播放量 */}
          <span className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 text-white text-xs">
            <Eye className="w-3 h-3" />
            {formatCount(video.view_count)}
          </span>
        </div>

        {/* 信息区域 */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5
                       group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>

          {/* 分类 + 标签 */}
          <div className="flex items-center gap-2 flex-wrap">
            {video.category && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                {video.category.name}
              </span>
            )}
            {video.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
