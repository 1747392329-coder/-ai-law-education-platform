/**
 * 登录页面
 */
import type { Metadata } from "next"
import LoginForm from "@/components/auth/LoginForm"
import Card from "@/components/ui/Card"

export const metadata: Metadata = {
  title: "登录",
  description: "登录法规AI课堂账号",
}

export default function LoginPage() {
  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">欢迎回来</h1>
        <p className="text-sm text-gray-500 mt-1">登录你的账号继续学习</p>
      </div>
      <LoginForm />
    </Card>
  )
}
