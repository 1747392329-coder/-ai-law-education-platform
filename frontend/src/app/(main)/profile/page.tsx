/**
 * 个人中心页面
 * 信息 / 积分 / 收藏
 */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getSupabase } from "@/lib/supabase"
import type { Video } from "@/types/video"
import type { PointRecord } from "@/types/user"
import VideoGrid from "@/components/video/VideoGrid"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import { User, Coins, Bookmark, LogOut, TrendingUp } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function ProfilePage() {
  const { isLoggedIn, isLoading, user, logout } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Video[]>([])
  const [balance, setBalance] = useState({ balance: 0, total_earned: 0 })
  const [records, setRecords] = useState<PointRecord[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [tab, setTab] = useState<"info" | "points" | "favorites">("info")

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push("/login")
  }, [isLoggedIn, isLoading, isLoggedIn, router])

  useEffect(() => {
    if (!isLoggedIn) return
    const load = async () => {
      const supabase = getSupabase()
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
      const headers = { Authorization: `Bearer ${session?.access_token || ""}` }

      const [favRes, balRes, recRes] = await Promise.all([
        fetch(`${API_URL}/favorites?page=1&page_size=20`, { headers }),
        fetch(`${API_URL}/points/balance`, { headers }),
        fetch(`${API_URL}/points/records?page=1&page_size=20`, { headers }),
      ])

      const fav = await favRes.json()
      const bal = await balRes.json()
      const rec = await recRes.json()

      if (fav.code === 200) setFavorites(fav.data)
      if (bal.code === 200) setBalance(bal.data)
      if (rec.code === 200) setRecords(rec.data)
      setLoadingData(false)
    }
    load()
  }, [isLoggedIn])

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">加载中...</div>
  if (!isLoggedIn || !user) return null

  const tabs = [
    { key: "info" as const, label: "基本信息", icon: User },
    { key: "points" as const, label: "我的积分", icon: Coins },
    { key: "favorites" as const, label: "我的收藏", icon: Bookmark },
  ]

  const pointReasons: Record<string, string> = {
    watch_video: "观看视频", like_video: "点赞视频",
    daily_login: "每日登录", favorite: "收藏视频",
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 用户卡片 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8"
           style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-ai flex items-center justify-center text-white text-2xl font-bold">
            {user.nickname?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.nickname || "用户"}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500">{user.role === "admin" ? "管理员" : "普通用户"}</p>
              <span className="flex items-center gap-1 text-sm text-amber-600 font-medium">
                <Coins className="w-4 h-4" /> {balance.balance}
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" /> 退出
            </Button>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-4 mb-8 border-b border-gray-100 pb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${tab === t.key ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      {tab === "info" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4"
             style={{ boxShadow: "var(--shadow-card)" }}>
          {[
            { label: "用户ID", value: user.id?.slice(0, 16) + "..." },
            { label: "昵称", value: user.nickname || "-" },
            { label: "角色", value: user.role === "admin" ? "管理员" : "普通用户" },
            { label: "注册时间", value: user.created_at ? new Date(user.created_at).toLocaleDateString("zh-CN") : "-" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "points" && (
        <div>
          {/* 积分概览 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center"
                 style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="text-sm text-gray-500 mb-1">当前积分</p>
              <p className="text-3xl font-bold text-amber-600">{balance.balance}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center"
                 style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="text-sm text-gray-500 mb-1">累计获取</p>
              <p className="text-3xl font-bold text-green-600">{balance.total_earned}</p>
            </div>
          </div>

          {/* 积分记录 */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"
               style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">积分记录</h3>
            </div>
            {records.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm">暂无积分记录</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {records.map((r) => (
                  <li key={r.id} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-700">{pointReasons[r.reason] || r.reason}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(r.created_at).toLocaleString("zh-CN")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">+{r.points}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "favorites" && (
        <VideoGrid videos={favorites} loading={loadingData} />
      )}
    </div>
  )
}
