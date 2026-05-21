"""
种子数据脚本
导入初始分类和示例视频数据
"""
from app.core.supabase import supabase_admin

if supabase_admin is None:
    print("Supabase 未配置，无法导入数据")
    exit(1)

# ========== 1. 插入分类 ==========
categories = [
    {"name": "法律法规", "slug": "laws", "icon": "⚖️", "description": "宪法、刑法、民法典等", "sort_order": 1},
    {"name": "应急安全", "slug": "emergency", "icon": "🚨", "description": "地震、火灾、急救知识", "sort_order": 2},
    {"name": "校园安全", "slug": "campus", "icon": "🏫", "description": "防欺凌、交通安全、网络安全", "sort_order": 3},
    {"name": "交通安全", "slug": "traffic", "icon": "🚗", "description": "交通法规、安全出行", "sort_order": 4},
    {"name": "食品安全", "slug": "food-safety", "icon": "🍽️", "description": "食品卫生、营养健康", "sort_order": 5},
    {"name": "网络安全", "slug": "cyber", "icon": "🔒", "description": "防诈骗、网络素养", "sort_order": 6},
]

for cat in categories:
    # 先检查是否已存在
    existing = supabase_admin.table("categories").select("id").eq("slug", cat["slug"]).execute()
    if existing.data:
        print(f"  跳过已存在: {cat['name']}")
    else:
        supabase_admin.table("categories").insert(cat).execute()
        print(f"  插入分类: {cat['name']}")

print("分类数据导入完成!")

# ========== 2. 获取分类 ID 用于视频 ==========
cat_result = supabase_admin.table("categories").select("id,slug").execute()
cat_map = {c["slug"]: c["id"] for c in (cat_result.data or [])}

# ========== 3. 插入示例视频 ==========
videos = [
    {
        "title": "《民法典》之未成年人权益保护",
        "description": "了解民法典中关于未成年人权益保护的重要条款，学会用法律保护自己。",
        "category_id": cat_map.get("laws"),
        "tags": ["民法典", "未成年人", "权益保护"],
        "video_url": "https://example.com/videos/sample1.mp4",
        "thumbnail_url": None,
        "duration": 245,
        "is_published": True,
        "view_count": 1520,
        "like_count": 86,
    },
    {
        "title": "宪法与我们：公民的基本权利",
        "description": "宪法规定的公民基本权利，每个人都应该了解的法制基础。",
        "category_id": cat_map.get("laws"),
        "tags": ["宪法", "公民权利", "法制"],
        "video_url": "https://example.com/videos/sample2.mp4",
        "thumbnail_url": None,
        "duration": 312,
        "is_published": True,
        "view_count": 980,
        "like_count": 52,
    },
    {
        "title": "地震逃生自救指南",
        "description": "地震发生时如何快速判断、正确躲避、安全撤离，掌握这些技能能救命。",
        "category_id": cat_map.get("emergency"),
        "tags": ["地震", "逃生", "自救"],
        "video_url": "https://example.com/videos/sample3.mp4",
        "thumbnail_url": None,
        "duration": 198,
        "is_published": True,
        "view_count": 3200,
        "like_count": 215,
    },
    {
        "title": "火灾逃生：黄金60秒",
        "description": "火灾发生后60秒内是最佳逃生时间，正确的逃生方法至关重要。",
        "category_id": cat_map.get("emergency"),
        "tags": ["火灾", "逃生", "消防"],
        "video_url": "https://example.com/videos/sample4.mp4",
        "thumbnail_url": None,
        "duration": 178,
        "is_published": True,
        "view_count": 2100,
        "like_count": 134,
    },
    {
        "title": "拒绝校园欺凌：勇敢说不",
        "description": "校园欺凌的识别、应对和预防，每个学生都应该了解的安全知识。",
        "category_id": cat_map.get("campus"),
        "tags": ["校园欺凌", "心理健康", "安全"],
        "video_url": "https://example.com/videos/sample5.mp4",
        "thumbnail_url": None,
        "duration": 265,
        "is_published": True,
        "view_count": 4500,
        "like_count": 328,
    },
    {
        "title": "未成年人网络安全防护",
        "description": "如何识别网络诈骗、保护个人信息，安全地使用互联网和社交媒体。",
        "category_id": cat_map.get("campus"),
        "tags": ["网络安全", "防诈骗", "未成年人"],
        "video_url": "https://example.com/videos/sample6.mp4",
        "thumbnail_url": None,
        "duration": 220,
        "is_published": True,
        "view_count": 1800,
        "like_count": 97,
    },
    {
        "title": "道路安全：行人守则",
        "description": "过马路、骑自行车、乘坐公共交通时的安全注意事项。",
        "category_id": cat_map.get("traffic"),
        "tags": ["交通安全", "行人", "规则"],
        "video_url": "https://example.com/videos/sample7.mp4",
        "thumbnail_url": None,
        "duration": 156,
        "is_published": True,
        "view_count": 890,
        "like_count": 45,
    },
    {
        "title": "食品安全五大要点",
        "description": "世卫组织推荐的食品安全五大要点，保障饮食健康。",
        "category_id": cat_map.get("food-safety"),
        "tags": ["食品安全", "健康", "卫生"],
        "video_url": "https://example.com/videos/sample8.mp4",
        "thumbnail_url": None,
        "duration": 190,
        "is_published": True,
        "view_count": 670,
        "like_count": 38,
    },
    {
        "title": "电信诈骗识别指南",
        "description": "常见的电信诈骗手法分析，教你如何识别骗局保护财产安全。",
        "category_id": cat_map.get("cyber"),
        "tags": ["电信诈骗", "防骗", "网络安全"],
        "video_url": "https://example.com/videos/sample9.mp4",
        "thumbnail_url": None,
        "duration": 280,
        "is_published": True,
        "view_count": 5600,
        "like_count": 412,
    },
    {
        "title": "《未成年人保护法》全面解读",
        "description": "新修订的未成年人保护法有哪些重要变化？对青少年有什么影响？",
        "category_id": cat_map.get("laws"),
        "tags": ["未成年人保护法", "法律", "修订"],
        "video_url": "https://example.com/videos/sample10.mp4",
        "thumbnail_url": None,
        "duration": 335,
        "is_published": True,
        "view_count": 1200,
        "like_count": 73,
    },
    {
        "title": "夏季防溺水安全指南",
        "description": "游泳安全常识、溺水自救与互救方法，夏季必学的安全知识。",
        "category_id": cat_map.get("emergency"),
        "tags": ["防溺水", "夏季安全", "游泳"],
        "video_url": "https://example.com/videos/sample11.mp4",
        "thumbnail_url": None,
        "duration": 205,
        "is_published": True,
        "view_count": 3800,
        "like_count": 256,
    },
    {
        "title": "个人信息保护法知多少",
        "description": "你的个人信息受法律保护，了解个人信息保护法的核心内容。",
        "category_id": cat_map.get("cyber"),
        "tags": ["个人信息", "隐私", "法律"],
        "video_url": "https://example.com/videos/sample12.mp4",
        "thumbnail_url": None,
        "duration": 260,
        "is_published": True,
        "view_count": 1400,
        "like_count": 88,
    },
]

for v in videos:
    supabase_admin.table("videos").insert(v).execute()
    print(f"  插入视频: {v['title'][:30]}...")

print(f"\n全部完成！共导入 {len(categories)} 个分类, {len(videos)} 条视频")
