/**
 * 首页
 * 包含：英雄区、搜索栏、视频分类快捷入口、推荐视频列表
 */
import Link from "next/link"
import SearchBar from "@/components/common/SearchBar"
import VideoSection from "@/components/video/VideoSection"

// 预定义的视频分类（后续从 API 获取）
const categories = [
  { name: "法律法规", slug: "laws", icon: "⚖️", description: "宪法、刑法、民法典等" },
  { name: "应急安全", slug: "emergency", icon: "🚨", description: "地震、火灾、急救知识" },
  { name: "校园安全", slug: "campus", icon: "🏫", description: "防欺凌、交通安全、网络安全" },
  { name: "交通安全", slug: "traffic", icon: "🚗", description: "交通法规、安全出行" },
  { name: "食品安全", slug: "food-safety", icon: "🍽️", description: "食品卫生、营养健康" },
  { name: "网络安全", slug: "cyber", icon: "🔒", description: "防诈骗、网络素养" },
]

export default function Home() {
  return (
    <div>
      {/* ========== 英雄区域 ========== */}
      <section className="relative overflow-hidden">
        {/* 背景渐变 */}
        <div className="absolute inset-0 gradient-ai opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* AI 标签 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-purple-600 text-xs font-medium mb-6">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              AI 技术驱动 · 智能教育平台
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              让安全知识学习
              <br />
              <span className="gradient-ai bg-clip-text text-transparent">
                更生动、更有趣
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              基于AI技术，将枯燥的法律法规和应急安全知识，
              转化为生动有趣的动画视频，让安全教育入脑入心。
            </p>

            {/* 搜索栏 */}
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBar size="lg" placeholder="搜索法律法规、应急安全、校园安全知识..." />
            </div>

            {/* 热门搜索词 */}
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">热门搜索：</span>
              {["民法典", "交通安全", "防溺水", "未成年人保护法", "消防安全"].map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 分类区域 ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">学习分类</h2>
            <p className="text-sm text-gray-500 mt-1">选择你感兴趣的安全教育主题</p>
          </div>
          <Link
            href="/videos"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group p-5 rounded-2xl bg-white border border-gray-100 text-center
                         hover:border-blue-200 hover:shadow-md transition-all duration-200"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 推荐视频 - 从后端 API 获取真实数据 */}
      <VideoSection />

      {/* ========== 平台特色 ========== */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI 智能化",
                description: "AI自动生成剧情化视频内容，告别枯燥的法律条文讲解",
                icon: "🤖",
              },
              {
                title: "场景化教学",
                description: "真实场景再现，让安全知识学习更有代入感",
                icon: "🎬",
              },
              {
                title: "碎片化学习",
                description: "3-5分钟短视频，利用碎片时间轻松学习",
                icon: "⏱️",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
