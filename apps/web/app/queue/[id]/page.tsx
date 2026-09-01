'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function QueuePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('flash-2');
  const [pos, setPos] = useState(47);
  const [stock, setStock] = useState(42);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  useEffect(() => {
    const t = setInterval(() => {
      setPos((p) => (p > 0 ? p - Math.floor(Math.random() * 2 + 1) : 0));
      setStock((s) => Math.max(0, s - (Math.random() > 0.7 ? 1 : 0)));
    }, 1300);
    return () => clearInterval(t);
  }, []);

  const pct = Math.max(0, 100 - (pos / 47) * 100);
  const stockPct = (stock / 50) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="mx-auto w-full max-w-[480px] flex-1 flex flex-col px-4 py-6">
        <Link href={`/live/${id}`} className="text-sm text-zinc-500 hover:text-zinc-900">← Quay lại Live</Link>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Xếp hàng Flash Sale</h1>
        <p className="text-sm text-zinc-500">Heap priority-queue · vị trí giảm dần real-time</p>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <div className="text-xs tracking-widest text-zinc-500">VỊ TRÍ CỦA BẠN</div>
          <div className="mt-2 text-5xl font-bold tracking-tight tabular-nums transition-all duration-500">{pos}</div>
          <div className="mt-1 text-sm text-zinc-500">người trước bạn</div>

          <div className="mt-6 h-2 rounded-full bg-zinc-100 overflow-hidden">
            <div className="h-full bg-zinc-900 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 text-xs text-zinc-500">Ước tính chờ ~ {Math.max(0, Math.ceil(pos * 0.4))} giây · progress bar XUYÊN SUỐT</div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Stock còn lại</span>
            <span className="tabular-nums font-mono text-zinc-700">{stock} / 50</span>
          </div>
          <div className="mt-2 h-2 rounded bg-zinc-100 overflow-hidden">
            <div className={`h-full transition-all duration-700 ${stock < 10 ? 'bg-red-600' : 'bg-emerald-600'}`} style={{ width: `${stockPct}%` }} />
          </div>
          <div className="mt-1 text-xs text-zinc-500">Thanh giảm dần real-time (Lua stock), đỏ khi sắp hết tạo urgency</div>
        </div>

        {pos <= 0 ? (
          <Link href={`/checkout/${id}`} className="mt-6 w-full h-11 rounded bg-zinc-900 text-white font-medium grid place-items-center hover:bg-black">Tới lượt bạn → Checkout</Link>
        ) : (
          <div className="mt-6 text-center text-sm text-zinc-400">Tự động chuyển sang Checkout khi tới lượt (không cần bấm)</div>
        )}

        <div className="mt-auto pt-6 text-xs text-center text-zinc-400">Đếm ngược giữ chỗ và stock sẽ XUYÊN SUỐT sang màn Checkout</div>
      </div>
    </div>
  );
}
