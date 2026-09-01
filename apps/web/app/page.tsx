import Link from 'next/link';

const posts = [
  {
    id: 'p1',
    author: 'Minh · Seller',
    time: '2m',
    label: 'Đề xuất cho bạn',
    labelType: 'vector' as const,
    content: 'Vừa test xong Flash Sale Engine 10k RPS, Redis Lua + ZSet queue chạy mượt. Deal này gắn với Live lúc 19:00 nhé.',
    product: { id: 'flash-2', name: 'Áo khoác gió SmartTobi · Chống mưa nhẹ', price: '199k', origPrice: '499k', stock: 42, countdown: '00:12:41' },
  },
  {
    id: 'p2',
    author: 'Linh · Buyer',
    time: '8m',
    label: 'Đang hot',
    labelType: 'hot' as const,
    content: 'Deal này mình săn được hôm qua, chất vải ok. Ai chưa có thì hóng Live tối nay.',
    product: { id: 'flash-1', name: 'Giày chạy bộ TobiRun · Nhẹ 210g', price: '399k', origPrice: '899k', stock: 8, countdown: '00:07:12' },
  },
];

export default function FeedPage() {
  return (
    <div className="min-h-screen">
      {/* Header - full bleed, hairline */}
      <div className="border-b" style={{ borderColor: 'var(--hairline)', background: 'var(--paper)' }}>
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 h-12 flex items-center gap-4">
          <div className="font-mono text-sm tracking-tight">smart.tobi — Feed</div>
          <div className="hidden sm:block font-mono text-xs text-zinc-500">Top-K heap · Vector 0.92 · RGA</div>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-[#2F6E4F] animate-pulse" />
            <span className="text-zinc-600">Live · 12.4k</span>
          </div>
          <Link href="/seller/workspace" className="font-mono text-xs border px-3 py-1.5 hover:bg-white hidden sm:block" style={{ borderColor: 'var(--hairline)' }}>Seller Workspace</Link>
          <Link href="/docs/demo" className="font-mono text-xs border px-3 py-1.5 bg-[var(--ink)] text-[var(--paper)] hover:opacity-90" style={{ borderColor: 'var(--ink)' }}>CRDT Editor</Link>
          <div className="h-7 w-7 rounded-full grid place-items-center text-xs font-mono text-white" style={{ background: 'var(--ink)' }}>ME</div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 grid lg:grid-cols-[1fr_340px] gap-8 py-6">
        {/* Main feed - left */}
        <div>
          <div className="flex gap-2">
            <input placeholder="Tìm “áo khoác đi mưa nhẹ” — vector search" className="flex-1 border bg-white px-3 py-2 font-mono text-sm focus:outline-none" style={{ borderColor: 'var(--hairline)' }} />
            <button className="h-9 px-4 bg-[var(--ink)] text-[var(--paper)] font-mono text-xs">Tìm</button>
          </div>
          <div className="mt-3 flex gap-2 font-mono text-xs">
            <span className="px-3 py-1 bg-[var(--ink)] text-[var(--paper)]">For you (ranked)</span>
            <span className="px-3 py-1 border bg-white" style={{ borderColor: 'var(--hairline)' }}>Following</span>
            <span className="px-3 py-1 border bg-white" style={{ borderColor: 'var(--hairline)' }}>Live</span>
            <span className="ml-auto hidden sm:block text-xs text-zinc-500 self-center">Đã rank · không phải chronological</span>
          </div>

          <div className="mt-6">
            <div className="font-mono text-xs tracking-widest text-zinc-500 border-b pb-2" style={{ borderColor: 'var(--hairline)' }}>FEED — RANKED</div>
            <div className="divide-y" style={{ borderColor: 'var(--hairline)' }}>
              {posts.map((p) => (
                <div key={p.id} className="py-6 grid sm:grid-cols-[1fr_280px] gap-6">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-medium">{p.author}</span>
                      <span className="text-zinc-400">· {p.time}</span>
                      <span className={`ml-auto px-2 py-0.5 border text-xs ${p.labelType === 'vector' ? 'bg-white border-[var(--hairline)] text-[#2F6E4F]' : 'bg-white border-[var(--hairline)] text-[#A34632]'}`}>{p.label}</span>
                    </div>
                    <div className="mt-2 text-sm leading-relaxed">{p.content}</div>
                    <div className="mt-3 font-mono text-xs text-zinc-500">Top-K heap · {p.labelType === 'vector' ? 'Vector similarity 0.92' : 'Engagement 1.2k'}</div>
                  </div>
                  <div className="border bg-white p-3 h-fit" style={{ borderColor: 'var(--hairline)' }}>
                    <div className="flex gap-3">
                      <img src={`https://picsum.photos/seed/${p.id}/200/200`} alt="" className="h-16 w-16 object-cover border" style={{ borderColor: 'var(--hairline)' }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm leading-tight">{p.product.name}</div>
                        <div className="mt-1 flex items-baseline gap-2 font-mono text-xs">
                          <span className="font-bold" style={{ color: '#A34632' }}>{p.product.price}</span>
                          <span className="line-through text-zinc-400">{p.product.origPrice}</span>
                          <span className="ml-auto bg-[var(--ink)] text-[var(--paper)] px-1.5 py-0.5">{p.product.countdown}</span>
                        </div>
                        <div className="mt-2 h-1 bg-zinc-100">
                          <div className="h-full" style={{ width: `${(p.product.stock / 50) * 100}%`, background: p.product.stock < 10 ? '#A34632' : '#2F6E4F' }} />
                        </div>
                        <div className="mt-1 font-mono text-xs text-zinc-500">Còn {p.product.stock} · STOCK</div>
                      </div>
                    </div>
                    <Link href={`/live/${p.product.id}`} className="mt-3 block w-full h-8 grid place-items-center bg-[var(--ink)] text-[var(--paper)] font-mono text-xs hover:opacity-90">Xem Live →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right rail - evenly distributed, not just centered */}
        <div className="space-y-4">
          <div className="border bg-white p-4" style={{ borderColor: 'var(--hairline)' }}>
            <div className="font-mono text-xs tracking-widest text-zinc-500">LIVE NOW · Fan-out</div>
            <div className="mt-3 space-y-3">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded bg-zinc-900 grid place-items-center text-white text-xs">▶</div>
                <div>
                  <div className="text-sm font-medium">Live 19:00 · Flash Sale</div>
                  <div className="font-mono text-xs text-zinc-500">12.4k đang xem · WebSocket</div>
                </div>
              </div>
              <Link href="/live/flash-2" className="block w-full h-8 grid place-items-center border font-mono text-xs hover:bg-zinc-50" style={{ borderColor: 'var(--hairline)' }}>Vào Live</Link>
            </div>
          </div>

          <div className="border bg-white p-4" style={{ borderColor: 'var(--hairline)' }}>
            <div className="font-mono text-xs tracking-widest text-zinc-500">ENGINE — 2 OPS</div>
            <div className="mt-3 font-mono text-xs leading-6">
              <div><span style={{ color: '#2F6E4F' }}>+ INSERT</span> <span className="text-zinc-400">RGA</span> 3a7f</div>
              <div><span style={{ color: '#A34632' }}>- DELETE</span> <span className="text-zinc-400">RGA</span> 4b1</div>
              <div className="mt-2 text-zinc-500">#F6F5F1 · #1C1B18 · IBM Plex</div>
            </div>
          </div>

          <div className="border bg-white p-4" style={{ borderColor: 'var(--hairline)' }}>
            <div className="font-mono text-xs tracking-widest">QUEUE PREVIEW</div>
            <div className="mt-2 font-mono text-xs text-zinc-500">Heap · Lua TTL 10m</div>
            <Link href="/queue/flash-2" className="mt-3 block text-xs underline">Xem queue →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
