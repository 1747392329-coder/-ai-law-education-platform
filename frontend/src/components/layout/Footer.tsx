/**
 * 页脚组件
 * 包含版权信息、链接列表
 */
import Link from "next/link"

const footerLinks = [
  {
    title: "平台导航",
    links: [
      { label: "首页", href: "/" },
      { label: "全部视频", href: "/videos" },
      { label: "搜索", href: "/search" },
    ],
  },
  {
    title: "安全知识",
    links: [
      { label: "法律法规", href: "/categories/laws" },
      { label: "应急安全", href: "/categories/emergency" },
      { label: "校园安全", href: "/categories/campus" },
    ],
  },
  {
    title: "关于我们",
    links: [
      { label: "平台介绍", href: "/about" },
      { label: "联系方式", href: "/contact" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* 品牌 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">法规AI课堂</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI驱动的法律法规与安全教育视频平台，让安全知识学习更生动有趣。
            </p>
          </div>

          {/* 链接分组 */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 版权 */}
        <div className="border-t border-gray-100 mt-8 pt-8">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} 法规AI课堂 - AI法规安全教育视频平台
          </p>
        </div>
      </div>
    </footer>
  )
}
