/**
 * 搜索内容（客户端组件）
 */
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Video } from "@/types/video"
import SearchBar from "@/components/common/SearchBar"
import VideoGrid from "@/components/video/VideoGrid"
import EmptyState from "@/components/common/EmptyState"
import { Search } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setVideos([])
      setSearched(false)
      return
    }

    const searchVideos = async () => {
      setLoading(true)
      setSearched(true)
      try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}&page_size=24`)
        const result = await res.json()
        if (result.code === 200) {
          setVideos(result.data as Video[])
        }
      } catch (err) {
        console.error("搜索失败:", err)
      } finally {
        setLoading(false)
      }
    }

    searchVideos()
  }, [query])

  return (
    <div>
      {/* 搜索栏 */}
      <SearchBar placeholder="搜索法律法规、应急安全、校园安全知识..." size="lg" className="mb-8" />

      {/* 搜索结果 */}
      {!query.trim() ? (
        <EmptyState
          icon={<Search className="w-10 h-10" />}
          title="搜索你感兴趣的安全知识"
          description="输入关键词搜索相关视频，如: 民法典, 消防安全等"
        />
      ) : searched ? (
        <div>
          <p className="text-sm text-gray-500 mb-6">
            搜索 &ldquo;{query}&rdquo; 找到 {videos.length} 个结果
          </p>
          <VideoGrid videos={videos} loading={loading} />
        </div>
      ) : null}
    </div>
  )
}
