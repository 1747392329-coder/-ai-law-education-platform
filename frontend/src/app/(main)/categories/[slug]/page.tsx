/**
 * 分类视频页
 * 按分类筛选展示视频
 */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Video, Category } from "@/types/video"
import VideoGrid from "@/components/video/VideoGrid"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [videos, setVideos] = useState<Video[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // 并行获取分类信息和视频列表
        const [catRes, videoRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/videos?category=${slug}&page_size=20`),
        ])

        const catData = await catRes.json()
        const videoData = await videoRes.json()

        if (catData.code === 200 && catData.data) {
          const found = (catData.data as Category[]).find((c) => c.slug === slug)
          setCategory(found || null)
        }

        if (videoData.code === 200) {
          setVideos(videoData.data as Video[])
        }
      } catch (err) {
        console.error("获取分类数据失败:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {category ? category.name : "加载中..."}
        </h1>
        {category?.description && (
          <p className="text-sm text-gray-500 mt-1">{category.description}</p>
        )}
      </div>

      <VideoGrid videos={videos} loading={loading} />
    </div>
  )
}
