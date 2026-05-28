/**
 * 管理后台 - 上传视频
 * 选择文件 → 上传到 Supabase Storage → 创建视频记录
 */
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import { getSupabase } from "@/lib/supabase"
import { Upload, Film, Image, X } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

const categories = [
  { id: null, name: "未分类" },
  { id: 1, name: "法律法规" },
  { id: 2, name: "应急安全" },
  { id: 3, name: "校园安全" },
  { id: 4, name: "交通安全" },
  { id: 5, name: "食品安全" },
  { id: 6, name: "网络安全" },
]

export default function UploadPage() {
  const router = useRouter()
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [tags, setTags] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [error, setError] = useState("")

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbFile(file)
      setThumbPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) { setError("请输入视频标题"); return }
    if (!videoFile) { setError("请选择视频文件"); return }

    setUploading(true)
    setError("")

    try {
      const supabase = getSupabase()
      if (!supabase) { setError("服务未配置"); return }

      // 1. 上传视频到 Supabase Storage
      setUploadProgress("正在上传视频...")
      const videoPath = `${Date.now()}_${videoFile.name}`
      const { error: videoErr } = await supabase.storage
        .from("videos")
        .upload(videoPath, videoFile, { upsert: false, contentType: videoFile.type })

      if (videoErr) {
        setError(`视频上传失败: ${videoErr.message}`)
        return
      }

      const { data: videoUrlData } = supabase.storage.from("videos").getPublicUrl(videoPath)
      const videoUrl = videoUrlData?.publicUrl || ""

      // 2. 上传缩略图（如果有）
      let thumbnailUrl = ""
      if (thumbFile) {
        setUploadProgress("正在上传封面...")
        const thumbPath = `thumbnails/${Date.now()}_${thumbFile.name}`
        const { error: thumbErr } = await supabase.storage
          .from("videos")
          .upload(thumbPath, thumbFile, { upsert: false, contentType: thumbFile.type })

        if (!thumbErr) {
          const { data: thumbUrlData } = supabase.storage.from("videos").getPublicUrl(thumbPath)
          thumbnailUrl = thumbUrlData?.publicUrl || ""
        }
      }

      // 3. 创建视频记录
      setUploadProgress("创建视频记录...")
      const { data: { session } } = await supabase.auth.getSession()

      const tagList = tags.split(/[,，]/).map(t => t.trim()).filter(Boolean)

      const res = await fetch(`${API_URL}/admin/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category_id: categoryId,
          tags: tagList,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || null,
          is_published: true,
        }),
      })

      const result = await res.json()
      if (result.code === 200) {
        router.push("/admin/videos")
      } else {
        setError(result.detail || "创建失败")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "上传失败")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">上传视频</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6"
           style={{ boxShadow: "var(--shadow-card)" }}>

        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">视频标题 *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="输入视频标题"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400" />
        </div>

        {/* 简介 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">视频简介</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="简要描述视频内容" rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 resize-none" />
        </div>

        {/* 分类 + 标签 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">分类</label>
            <select value={categoryId ?? ""} onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white">
              {categories.map(c => (
                <option key={c.id ?? 0} value={c.id ?? ""}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">标签（逗号分隔）</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="如: 法律,安全,教育"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400" />
          </div>
        </div>

        {/* 视频文件选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">视频文件 *</label>
          <input ref={videoInputRef} type="file" accept="video/*" className="hidden"
            onChange={e => setVideoFile(e.target.files?.[0] || null)} />
          <div onClick={() => videoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
              ${videoFile ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"}`}>
            {videoFile ? (
              <div className="flex items-center justify-center gap-2 text-green-700">
                <Film className="w-5 h-5" />
                <span className="text-sm font-medium">{videoFile.name}</span>
                <button onClick={e => { e.stopPropagation(); setVideoFile(null) }}
                  className="ml-2 p-1 rounded-lg hover:bg-green-200"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="text-gray-400">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">点击选择视频文件</p>
                <p className="text-xs mt-1">支持 MP4、WebM、AVI 格式</p>
              </div>
            )}
          </div>
        </div>

        {/* 缩略图选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">封面图（可选）</label>
          <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbChange} />
          <div onClick={() => thumbInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${thumbFile ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"}`}>
            {thumbPreview ? (
              <div className="flex items-center justify-center gap-3">
                <img src={thumbPreview} alt="" className="w-16 h-10 object-cover rounded" />
                <span className="text-sm text-green-700">{thumbFile?.name}</span>
              </div>
            ) : (
              <div className="text-gray-400">
                <Image className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs">点击上传封面图</p>
              </div>
            )}
          </div>
        </div>

        {/* 错误 / 进度 */}
        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200"><p className="text-sm text-red-600">{error}</p></div>}
        {uploadProgress && <div className="p-3 rounded-xl bg-blue-50 border border-blue-200"><p className="text-sm text-blue-600">{uploadProgress}</p></div>}

        {/* 提交 */}
        <Button onClick={handleSubmit} loading={uploading} className="w-full" size="lg">
          {uploading ? "上传中..." : "上传视频"}
        </Button>
      </div>
    </div>
  )
}
