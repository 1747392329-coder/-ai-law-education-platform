/**
 * 全部视频内容（带搜索参数和分页）
 */
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Video } from "@/types/video"
import VideoGrid from "@/components/video/VideoGrid"
import Pagination from "@/components/common/Pagination"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function VideosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = Number(searchParams.get("page")) || 1
  const [videos, setVideos] = useState<Video[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/videos?page=${currentPage}&page_size=12`)
        const result = await res.json()
        if (result.code === 200) {
          setVideos(result.data as Video[])
          setTotalPages(result.total_pages || 1)
        }
      } catch (err) {
        console.error("获取视频列表失败:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    router.push(`/videos?page=${page}`)
  }

  return (
    <>
      <VideoGrid videos={videos} loading={loading} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}
