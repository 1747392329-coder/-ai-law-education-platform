/**
 * 注册页面
 */
import type { Metadata } from "next"
import RegisterForm from "@/components/auth/RegisterForm"
import Card from "@/components/ui/Card"

export const metadata: Metadata = {
  title: "注册",
  description: "注册法规AI课堂账号",
}

export default function RegisterPage() {
  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">创建账号</h1>
        <p className="text-sm text-gray-500 mt-1">免费注册，开始学习安全知识</p>
      </div>
      <RegisterForm />
    </Card>
  )
}
