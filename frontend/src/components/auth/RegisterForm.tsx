/**
 * 注册表单组件
 * 调用后端 API 注册（后端用 service_role 跳过邮件确认）
 */
"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useAuthStore } from "@/store/authStore"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export default function RegisterForm() {
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    // 表单验证
    if (!email || !password || !confirmPassword) {
      setError("请填写所有必填项")
      return
    }
    if (password.length < 6) {
      setError("密码至少需要6位")
      return
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    setLoading(true)

    try {
      // 调用后端 API 注册（后端用 service_role，跳过邮件）
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname: nickname || undefined,
        }),
      })

      const result = await response.json()

      if (result.code === 200 && result.data) {
        // 注册成功，跳转登录页
        window.location.href = "/login?registered=true"
      } else {
        setError(result.detail || result.message || "注册失败")
      }
    } catch {
      setError("网络错误，请检查后端是否启动")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="昵称（选填）"
        type="text"
        placeholder="给自己起个名字"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        leftIcon={<User className="w-4 h-4" />}
      />

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
          placeholder="至少6位密码"
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

      <Input
        label="确认密码"
        type="password"
        placeholder="再次输入密码"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        leftIcon={<Lock className="w-4 h-4" />}
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        {loading ? "注册中..." : "创建账号"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        已有账号？
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
          立即登录
        </Link>
      </p>
    </form>
  )
}
