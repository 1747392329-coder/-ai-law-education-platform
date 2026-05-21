/**
 * 首页视频推荐区域
 * 从后端 API 获取视频列表并展示
 */
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Video } from "@/types/video"
import VideoGrid from "./VideoGrid"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_URL}/videos?page=1&page_size=8`)
        const result = await res.json()
        if (result.code === 200 && result.data) {
          setVideos(result.data as Video[])
        }
      } catch (err) {
        console.error("获取视频列表失败:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">推荐视频</h2>
          <p className="text-sm text-gray-500 mt-1">精选优质安全教育视频内容</p>
        </div>
        <Link
          href="/videos"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          更多视频 →
        </Link>
      </div>

      <VideoGrid videos={videos} loading={loading} />
    </section>
  )
}
