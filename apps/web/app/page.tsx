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
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-zinc-100">
        <div className="mx-auto max-w-[680px] px-4 h-14 flex items-center gap-3">
          <div className="font-bold tracking-tight text-[15px]">smart.tobi</div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/seller/workspace" className="hidden sm:inline-flex h-8 items-center rounded-full border border-zinc-200 px-3 text-xs hover:bg-zinc-50">Seller</Link>
            <img src="https://i.pravatar.cc/100?img=8" alt="me" className="h-8 w-8 rounded-full object-cover" />
          </div>
        </div>
        <div className="mx-auto max-w-[680px] px-4 pb-3">
          <div className="relative">
            <input placeholder="Tim san pham, deal, livestream..." className="w-full h-10 rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-300" />
            <span className="absolute left-3 top-2.5 text-zinc-400">⌕</span>
          </div>
          <div className="mt-3 flex gap-2 overflow-auto">
            <span className="shrink-0 h-7 px-4 rounded-full bg-zinc-900 text-white text-xs grid place-items-center">For you</span>
            <span className="shrink-0 h-7 px-3 rounded-full border border-zinc-200 bg-white text-xs">Following</span>
            <span className="shrink-0 h-7 px-3 rounded-full border border-zinc-200 bg-white text-xs">Live</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[680px] px-4 py-4 space-y-4">
        {posts.map((p) => {
          const lowStock = p.product.stock < 10;
          const urgent = p.product.countdown < "00:05:00";
          return (
            <div key={p.id} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
              <div className="p-4 flex gap-3">
                <img src={p.avatar} alt={p.author} className="h-9 w-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{p.author}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.role === "Seller" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>{p.role}</span>
                    <span className="text-xs text-zinc-400">· {p.time}</span>
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-zinc-800">{p.content}</div>
                </div>
              </div>
              <div className="mx-3 mb-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <img src={p.product.image} alt={p.product.name} className="h-24 w-24 rounded-xl object-cover bg-white border border-zinc-100" />
                    <span className={`absolute -top-2 -right-2 text-xs font-mono px-2 py-1 rounded-full text-white shadow ${urgent ? "bg-red-600 animate-pulse" : "bg-orange-500"}`}>{p.product.countdown}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight line-clamp-2">{p.product.name}</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-base font-bold text-red-600">{p.product.price}</span>
                      <span className="text-xs line-through text-zinc-400">{p.product.origPrice}</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
                        <div className="h-full bg-red-600" style={{ width: `${Math.min(100, (p.product.stock / 50) * 100)}%` }} />
                      </div>
                      <div className="mt-1 flex justify-between text-xs">
                        <span className={lowStock ? "text-red-600 font-medium" : "text-zinc-500"}>{lowStock ? "Sap het" : `Con ${p.product.stock} san pham`}</span>
                        <span className="text-zinc-400">{p.product.stock}/50</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={`/live/${p.product.id}`} className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  Xem Live
                </Link>
              </div>
              <div className="px-4 pb-3">
                <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${p.badge === "De xuat cho ban" ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"}`}>{p.badge}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
