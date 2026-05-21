/**
 * 管理后台 - 数据概览
 */
"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { BarChart3, Video, Users, Eye } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function DashboardPage() {
  const [stats, setStats] = useState({ total_videos: 0, total_users: 0, total_views: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = getSupabase()
        const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${session?.access_token || ""}` },
        })
        const result = await res.json()
        if (result.code === 200) setStats(result.data)
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: "已发布视频", value: stats.total_videos, icon: Video, color: "text-blue-600 bg-blue-50" },
    { label: "注册用户", value: stats.total_users, icon: Users, color: "text-green-600 bg-green-50" },
    { label: "总播放量", value: stats.total_views, icon: Eye, color: "text-purple-600 bg-purple-50" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">数据概览</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-6"
               style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
