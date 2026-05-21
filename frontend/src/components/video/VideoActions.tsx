/**
 * 点赞 + 收藏按钮组件
 * 通过 Supabase session 获取 Token，确保与 useAuth 一致
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Bookmark } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { getSupabase } from "@/lib/supabase"
import { formatCount } from "@/lib/utils"

interface VideoActionsProps {
  videoId: string
  initialLikeCount: number
  initialLiked?: boolean
  initialFavorited?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function VideoActions({ videoId, initialLikeCount, initialLiked, initialFavorited }: VideoActionsProps) {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  const [liked, setLiked] = useState(initialLiked || false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [favorited, setFavorited] = useState(initialFavorited || false)
  const [loading, setLoading] = useState(false)

  // 保持与 useAuth 同步（页面刷新时 authStore 可能还没恢复）
  const [authReady, setAuthReady] = useState(false)
  useEffect(() => {
    const check = async () => {
      const supabase = getSupabase()
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        setAuthReady(!!session)
      } else {
        setAuthReady(false)
      }
    }
    check()
    // 延迟一下让 useAuth 先完成恢复
    const timer = setTimeout(check, 500)
    return () => clearTimeout(timer)
  }, [])

  // 合并 authStore 和自己的检测
  const actuallyLoggedIn = isLoggedIn || authReady

  const getToken = async (): Promise<string> => {
    const supabase = getSupabase()
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token || ""
    }
    return ""
  }

  const handleLike = async () => {
    if (!actuallyLoggedIn) { router.push("/login"); return }
    if (loading) return
    setLoading(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/likes/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ video_id: videoId }),
      })
      const result = await res.json()
      if (result.code === 200) {
        setLiked(result.data.liked)
        setLikeCount(result.data.like_count)
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const handleFavorite = async () => {
    if (!actuallyLoggedIn) { router.push("/login"); return }
    if (loading) return
    setLoading(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ video_id: videoId }),
      })
      const result = await res.json()
      if (result.code === 200) {
        setFavorited(result.data.favorited)
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
          ${liked
            ? "bg-red-50 text-red-500 border border-red-200"
            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
          }`}
      >
        <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
        {formatCount(likeCount)}
      </button>

      <button
        onClick={handleFavorite}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
          ${favorited
            ? "bg-blue-50 text-blue-500 border border-blue-200"
            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
          }`}
      >
        <Bookmark className={`w-4 h-4 ${favorited ? "fill-blue-500" : ""}`} />
        {favorited ? "已收藏" : "收藏"}
      </button>
    </div>
  )
}
