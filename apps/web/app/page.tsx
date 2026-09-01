import Link from 'next/link';

export default function FeedPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="mx-auto max-w-[680px] px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm tracking-tight">smart.tobi — Feed</div>
          <div className="ml-auto font-mono text-xs px-2 py-1 border" style={{ borderColor: 'var(--hairline)' }}>Top-K heap · Vector 0.92</div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="border bg-white p-4" style={{ borderColor: 'var(--hairline)' }}>
            <div className="flex items-center gap-2 font-mono text-xs">
              <img src="https://i.pravatar.cc/100?img=12" alt="Minh" className="h-7 w-7 rounded-full" />
              <span className="font-medium">Minh · Seller</span>
              <span className="text-[var(--muted)]">· 2m</span>
              <span className="ml-auto text-xs px-2 py-0.5 border font-mono" style={{ borderColor: 'var(--hairline)', color: 'var(--trust)' }}>Đề xuất cho bạn</span>
            </div>
            <div className="mt-3 font-mono text-sm leading-relaxed">Vừa test xong Flash Sale Engine 10k RPS, Redis Lua + ZSet queue chạy mượt. Deal này gắn với Live lúc 19:00 nhé.</div>
            <div className="mt-4 border p-3 flex gap-3" style={{ borderColor: 'var(--hairline)', background: 'var(--paper)' }}>
              <img src="https://picsum.photos/seed/p1/200/200" alt="" className="h-20 w-20 object-cover border" style={{ borderColor: 'var(--hairline)' }} />
              <div className="flex-1">
                <div className="font-mono text-sm">Áo khoác gió SmartTobi</div>
                <div className="font-mono text-xs mt-1"><span style={{ color: 'var(--urgency)' }} className="font-bold">199k</span> <span className="line-through text-zinc-400 ml-2">499k</span></div>
                <div className="mt-2 h-1 bg-zinc-100"><div className="h-full" style={{ width: '84%', background: 'var(--urgency)' }} /></div>
                <Link href="/live/flash-2" className="mt-3 inline-flex h-7 px-3 bg-[var(--ink)] text-[var(--paper)] font-mono text-xs items-center">Xem Live →</Link>
              </div>
            </div>
          </div>

          <div className="border bg-white p-4" style={{ borderColor: 'var(--hairline)' }}>
            <div className="flex items-center gap-2 font-mono text-xs">
              <img src="https://i.pravatar.cc/100?img=5" alt="Linh" className="h-7 w-7 rounded-full" />
              <span className="font-medium">Linh · Buyer</span>
              <span className="text-[var(--muted)]">· 8m</span>
              <span className="ml-auto text-xs px-2 py-0.5 border font-mono" style={{ borderColor: 'var(--hairline)', color: 'var(--urgency)' }}>Đang hot</span>
            </div>
            <div className="mt-3 font-mono text-sm">Deal này mình săn được hôm qua, nhẹ 210g. Ai chưa có thì hóng Live tối nay!</div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 font-mono text-xs" style={{ borderColor: 'var(--hairline)', color: 'var(--muted)' }}>
          Queue position + stock + countdown cùng 1 hàng · có motion nhẹ khi số nhảy (signature)
        </div>
      </div>
    </div>
  );
}
