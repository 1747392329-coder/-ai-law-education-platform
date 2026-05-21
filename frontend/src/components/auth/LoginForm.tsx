/**
 * 登录表单组件
 * 通过 Supabase Auth 登录，session 由 Supabase 自动管理
 */
"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { getSupabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("请填写邮箱和密码")
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setError("服务未配置，请联系管理员")
      return
    }

    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message?.includes("Invalid login credentials")) {
          setError("邮箱或密码错误")
        } else {
          setError(signInError.message || "登录失败")
        }
        return
      }

      if (data.user) {
        // Supabase 自动保存 session 到 localStorage（key: sb-token）
        // 只需更新全局状态，不要手动覆盖 Supabase 的 session
        setUser({
          id: data.user.id,
          nickname: data.user.user_metadata?.nickname ?? email.split("@")[0],
          avatar_url: null,
          role: "user",
          phone: null,
          created_at: data.user.created_at,
        })

        window.location.href = "/"
      }
    } catch {
      setError("网络错误，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="邮箱"
        type="email"
        placeholder="请输入邮箱地址"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
      />

      <div className="relative">
        <Input
          label="密码"
          type={showPassword ? "text" : "password"}
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        {loading ? "登录中..." : "登录"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        还没有账号？
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
          立即注册
        </Link>
      </p>
    </form>
  )
}
