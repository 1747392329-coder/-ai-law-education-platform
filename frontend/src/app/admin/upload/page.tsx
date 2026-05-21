/**
 * 管理后台 - 上传视频
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import type { Category } from "@/types/video"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

export default function UploadPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [duration, setDuration] = useState("0")
  const [published, setPublished] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(r => r.json())
      .then(d => { if (d.code === 200) setCategories(d.data) })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!title || !videoUrl) {
      setError("标题和视频地址为必填项")
      return
    }

    const supabase = getSupabase()
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          title,
          description: description || null,
          category_id: categoryId ? Number(categoryId) : null,
          tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
          video_url: videoUrl,
          duration: Number(duration) || 0,
          is_published: published,
        }),
      })

      const result = await res.json()
      if (result.code === 200) {
        setSuccess(true)
        setTitle(""); setDescription(""); setTags(""); setVideoUrl(""); setDuration("0")
      } else {
        setError(result.detail || result.message || "上传失败")
      }
    } catch {
      setError("网络错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">上传视频</h1>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          视频上传成功！
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl border border-gray-100"
            style={{ boxShadow: "var(--shadow-card)" }}>
        <Input label="视频标题 *" value={title} onChange={e => setTitle(e.target.value)}
               placeholder="输入视频标题" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">视频简介</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="输入视频简介"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">分类</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">选择分类</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="时长（秒）" type="number" value={duration}
                 onChange={e => setDuration(e.target.value)} />
        </div>

        <Input label="视频地址 *" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
               placeholder="https://example.com/video.mp4" />

        <Input label="标签（逗号分隔）" value={tags} onChange={e => setTags(e.target.value)}
               placeholder="如: 法律, 安全, 教育" />

        {/* 发布开关 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)}
                 className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm text-gray-700">立即发布</span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>上传视频</Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/videos")}>
            查看列表
          </Button>
        </div>
      </form>
    </div>
  )
}
