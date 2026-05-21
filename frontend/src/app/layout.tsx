/**
 * 应用根布局
 * 所有页面共享的 HTML 结构，包含 Header 和 Footer
 */
import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: {
    default: "法规AI课堂 - AI驱动的安全教育视频平台",
    template: "%s | 法规AI课堂",
  },
  description: "AI驱动的法律法规与安全教育视频平台，涵盖法律法规、应急安全、校园安全教育内容",
  keywords: ["法制教育", "安全教育", "AI视频", "应急安全", "校园安全", "法律科普"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
