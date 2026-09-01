import Link from 'next/link';

const posts = [
  {
    id: 'p1',
    author: 'Minh · Seller',
    time: '2m',
    label: 'Đề xuất cho bạn',
    labelType: 'vector' as const,
    content: 'Vừa test xong Flash Sale Engine 10k RPS, Redis Lua + ZSet queue chạy mượt. Deal này gắn với Live lúc 19:00 nhé.',
    product: { id: 'flash-2', name: 'Áo khoác gió SmartTobi · Chống mưa nhẹ', price: '199k', origPrice: '499k', stock: 42, image: 'https://picsum.photos/seed/p1/400/300', countdown: '00:12:41' },
  },
  {
    id: 'p2',
    author: 'Linh · Buyer',
    time: '8m',
    label: 'Đang hot',
    labelType: 'hot' as const,
    content: 'Deal này mình săn được hôm qua, chất vải ok phết. Ai chưa có thì hóng Live tối nay.',
    product: { id: 'flash-1', name: 'Giày chạy bộ TobiRun · Nhẹ 210g', price: '399k', origPrice: '899k', stock: 8, image: 'https://picsum.photos/seed/p2/400/300', countdown: '00:07:12' },
  },
];

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header mobile-first */}
      <div className="sticky top-0 z-20 bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-[640px] px-4 h-14 flex items-center gap-3">
          <div className="font-semibold tracking-tight">smart.tobi</div>
          <div className="flex-1" />
          <Link href="/seller/workspace" className="text-xs border border-zinc-200 rounded px-3 py-1.5 hover:bg-zinc-50">Seller Workspace</Link>
          <div className="h-7 w-7 rounded-full bg-zinc-900 text-white grid place-items-center text-xs">ME</div>
        </div>
        <div className="mx-auto max-w-[640px] px-4 pb-3">
          <div className="flex gap-2">
            <input placeholder="Tìm “áo khoác đi mưa nhẹ” (vector search)" className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white" />
            <button className="h-9 w-9 rounded-full bg-zinc-900 text-white grid place-items-center">⌕</button>
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-zinc-900 text-white">For you (ranked)</span>
            <span className="px-3 py-1 rounded-full border border-zinc-200 bg-white">Following</span>
            <span className="px-3 py-1 rounded-full border border-zinc-200 bg-white">Live</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[640px] px-4 py-4 space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">{p.author}</div>
                <div className="text-xs text-zinc-400">· {p.time}</div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${p.labelType === 'vector' ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{p.label}</span>
              </div>
              <div className="mt-2 text-sm leading-relaxed text-zinc-800">{p.content}</div>
            </div>

            {/* Deal card lồng - nối sang Live */}
            <div className="mx-4 mb-4 rounded-lg border border-zinc-200 overflow-hidden">
              <div className="flex gap-3 p-3">
                <img src={p.product.image} alt="" className="h-20 w-20 rounded object-cover bg-zinc-100" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-tight truncate">{p.product.name}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-red-600">{p.product.price}</span>
                    <span className="text-xs line-through text-zinc-400">{p.product.origPrice}</span>
                    <span className="ml-auto text-xs font-mono bg-zinc-900 text-white px-1.5 py-0.5 rounded">{p.product.countdown}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded bg-zinc-100 overflow-hidden">
                    <div className="h-full bg-zinc-900" style={{ width: `${(p.product.stock / 50) * 100}%` }} />
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">Còn {p.product.stock} · Top-K heap rank</div>
                </div>
              </div>
              <div className="px-3 pb-3">
                <Link href={`/live/${p.product.id}`} className="block w-full h-9 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium grid place-items-center">Xem Live →</Link>
              </div>
            </div>
          </div>
        ))}
        <div className="text-center text-xs text-zinc-400 py-4">Đã rank bằng Vector similarity + Top-K heap · Không phải chronological</div>
      </div>
    </div>
  );
}
