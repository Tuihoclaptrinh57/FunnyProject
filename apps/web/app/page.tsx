import Link from "next/link";

const posts = [
  {
    id: "p1",
    author: "Minh",
    role: "Seller" as const,
    avatar: "https://i.pravatar.cc/100?img=12",
    time: "2 phut truoc",
    badge: "De xuat cho ban",
    content: "Vua test xong Flash Sale Engine 10k RPS, deal nay gan voi Live luc 19:00 nhe.",
    product: { id: "flash-2", name: "Ao khoac gio SmartTobi", price: "199.000d", origPrice: "499.000d", stock: 42, countdown: "00:12:41", image: "https://picsum.photos/seed/p1/400/400" },
  },
  {
    id: "p2",
    author: "Linh",
    role: "Buyer" as const,
    avatar: "https://i.pravatar.cc/100?img=5",
    time: "8 phut truoc",
    badge: "Dang hot",
    content: "Deal nay minh san duoc hom qua, nhe 210g, di mua nhe ok. Ai chua co thi hong Live toi nay nhe!",
    product: { id: "flash-1", name: "Giay chay bo TobiRun", price: "399.000d", origPrice: "899.000d", stock: 8, countdown: "00:04:22", image: "https://picsum.photos/seed/p2/400/400" },
  },
];

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Header full-width, search 500-600px */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-zinc-100">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6 h-14 flex items-center gap-4">
          <div className="font-bold tracking-tight text-[15px] shrink-0">smart.tobi</div>
          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[600px]">
              <input placeholder="Tim san pham, deal, livestream..." className="w-full h-9 rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-300" />
              <span className="absolute left-3 top-2 text-zinc-400">⌕</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/seller/workspace" className="hidden sm:inline-flex h-8 items-center rounded-full border border-zinc-200 px-3 text-xs hover:bg-zinc-50">Seller</Link>
            <img src="https://i.pravatar.cc/100?img=8" alt="me" className="h-8 w-8 rounded-full object-cover" />
          </div>
        </div>
      </div>

      {/* 3 columns: left | feed | right */}
      <div className="mx-auto max-w-[1440px] px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-6 py-6">
        {/* Left sidebar - hidden <1024px */}
        <aside className="hidden lg:block">
          <div className="sticky top-[72px] space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="font-semibold text-sm">smart.tobi</div>
              <div className="text-xs text-zinc-500">SuperApp · Flash Live</div>
              <nav className="mt-4 space-y-1 text-sm">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900 text-white">Feed</div>
                <Link href="/live/flash-2" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"><span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" /> Live đang phát</Link>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">Đơn hàng của tôi</div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">Ví / Số dư</div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">Cài đặt</div>
              </nav>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=8" alt="Minh" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold">Minh · Seller</div>
                  <div className="text-xs text-zinc-500">minh@smart.tobi</div>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-zinc-50 border border-zinc-100 p-3">
                <div className="text-xs text-zinc-500">Số dư ví</div>
                <div className="text-sm font-bold">2.450.000đ</div>
                <div className="text-xs text-emerald-600">+ 120.000đ hôm nay</div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-500">© 2026 smart.tobi · Demo System Design</div>
          </div>
        </aside>

        {/* Center feed - 600-680px */}
        <div className="mx-auto w-full max-w-[680px] space-y-4">
          <div className="flex gap-2 overflow-auto">
            <span className="shrink-0 h-7 px-4 rounded-full bg-zinc-900 text-white text-xs grid place-items-center">For you</span>
            <span className="shrink-0 h-7 px-3 rounded-full border border-zinc-200 bg-white text-xs">Following</span>
            <span className="shrink-0 h-7 px-3 rounded-full border border-zinc-200 bg-white text-xs">Live</span>
          </div>

          {posts.map((p) => {
            const lowStock = p.product.stock < 10;
            const urgent = p.product.countdown < "00:05:00";
            return (
              <div key={p.id} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 transition-all">
                <div className="p-4 flex gap-3">
                  <img src={p.avatar} alt={p.author} className="h-10 w-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{p.author}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.role === "Seller" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>{p.role}</span>
                      <span className="text-xs text-zinc-400">· {p.time}</span>
                      <span className={`ml-auto inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${p.badge === "De xuat cho ban" ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"}`}>{p.badge}</span>
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-zinc-800">{p.content}</div>
                  </div>
                </div>

                {/* Product card: vertical on mobile, horizontal 160px on desktop */}
                <div className="mx-3 mb-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3 hover:bg-white hover:border-zinc-200 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative shrink-0 mx-auto lg:mx-0">
                      <img src={p.product.image} alt={p.product.name} className="h-28 w-28 lg:h-[160px] lg:w-[160px] rounded-xl object-cover bg-white border border-zinc-100" />
                      <span className={`absolute -top-2 -right-2 text-xs font-mono px-2 py-1 rounded-full text-white shadow ${urgent ? "bg-red-600 animate-pulse" : "bg-orange-500"}`}>{p.product.countdown}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="text-sm font-medium leading-tight line-clamp-2">{p.product.name}</div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-base font-bold text-red-600">{p.product.price}</span>
                        <span className="text-xs line-through text-zinc-400">{p.product.origPrice}</span>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
                          <div className={`h-full ${lowStock ? "bg-red-600" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (p.product.stock / 50) * 100)}%` }} />
                        </div>
                        <div className="mt-1 flex justify-between text-xs">
                          <span className={lowStock ? "text-red-600 font-medium" : "text-zinc-500"}>{lowStock ? `Con ${p.product.stock} suat - Sap het` : `Da ban ${50 - p.product.stock}/50`}</span>
                          <span className="text-zinc-400">{lowStock ? `${p.product.stock}/50` : `Con ${p.product.stock}`}</span>
                        </div>
                      </div>
                      <Link href={`/live/${p.product.id}`} className="mt-3 hidden lg:flex h-9 items-center justify-center gap-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        Xem Live
                      </Link>
                    </div>
                  </div>
                  <Link href={`/live/${p.product.id}`} className="mt-3 flex lg:hidden h-10 items-center justify-center gap-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    Xem Live
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right sidebar - hidden <1024px */}
        <aside className="hidden lg:block">
          <div className="sticky top-[72px] space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-4 text-white sticky top-[72px] shadow-sm">
              <div className="text-sm font-semibold">Flash Sale 19:00 · Ưu tiên</div>
              <div className="text-xs opacity-90">Giảm đến 60% · Chỉ 2 tiếng · Doanh thu</div>
              <div className="mt-3 h-8 rounded-full bg-white text-red-600 text-xs font-semibold grid place-items-center hover:bg-zinc-50 transition-colors">Xem ngay →</div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="text-sm font-semibold">Đang live ngay</div>
              <div className="mt-3 space-y-3">
                {[
                  { name: "Minh", img: "12", viewers: "12.4k" },
                  { name: "Linh", img: "5", viewers: "8.2k" },
                  { name: "Khoa", img: "15", viewers: "5.1k" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer">
                    <img src={`https://i.pravatar.cc/100?img=${s.img}`} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-none">{s.name}</div>
                      <div className="text-xs text-zinc-500">{s.viewers} đang xem</div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="text-sm font-semibold">Sản phẩm hot hôm nay</div>
              <div className="mt-3 space-y-3">
                {[
                  { name: "Áo thun Tobi", price: "149k", img: "10" },
                  { name: "Quần short gió", price: "199k", img: "11" },
                  { name: "Tất thể thao", price: "49k", img: "3" },
                ].map((p) => (
                  <div key={p.name} className="flex gap-3 p-2 -m-2 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer">
                    <img src={`https://picsum.photos/seed/${p.img}/100/100`} alt={p.name} className="h-12 w-12 rounded-lg object-cover border border-zinc-100" />
                    <div>
                      <div className="text-sm font-medium leading-tight">{p.name}</div>
                      <div className="text-xs font-bold text-red-600">{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
