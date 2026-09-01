'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('order-flash-2');
  const [eta, setEta] = useState(12 * 60); // 12 phút
  const [progress, setProgress] = useState(0);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);
  useEffect(() => {
    const t = setInterval(() => {
      setEta((e) => Math.max(0, e - 1));
      setProgress((p) => Math.min(100, p + 0.3));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const mm = Math.floor(eta / 60);
  const ss = String(eta % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* ETA to */}
      <div className="bg-white border-b border-zinc-200 px-4 py-3">
        <div className="mx-auto max-w-[640px] flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500">ETA · GEO Search real-time</div>
            <div className="text-2xl font-bold tabular-nums">{mm}:{ss} <span className="text-sm font-normal text-zinc-500">phút</span></div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Shipper Minh · 3.2km</div>
            <div className="text-xs text-zinc-500">Đang giao · Cập nhật mỗi 3s qua WebSocket</div>
          </div>
        </div>
      </div>

      {/* Map full-screen */}
      <div className="flex-1 relative bg-zinc-100 overflow-hidden" style={{ minHeight: '50vh' }}>
        {/* grid map placeholder */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6 }} />
        {/* route line */}
        <svg className="absolute inset-0 w-full h-full">
          <path d="M 80 300 Q 200 200 320 240 T 520 180" stroke="#18181b" strokeWidth="3" fill="none" strokeDasharray="6 6" />
        </svg>
        {/* shipper marker moving */}
        <div className="absolute h-8 w-8 rounded-full bg-zinc-900 border-2 border-white shadow flex items-center justify-center text-white text-xs" style={{ left: `${20 + progress * 0.6}%`, top: `${45 - Math.sin(progress / 10) * 5}%`, transition: 'all 1s linear' }}>●</div>
        <div className="absolute left-4 bottom-4 rounded bg-white border border-zinc-200 px-3 py-1 text-xs">GEO Search · QuadTree</div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-t border-zinc-200 px-4 py-4">
        <div className="mx-auto max-w-[640px] flex items-center gap-2">
          {[
            { label: 'Đã lấy hàng', done: true },
            { label: 'Đang giao', done: progress > 30, active: true },
            { label: 'Đã giao', done: progress > 90 },
          ].map((s, i) => (
            <div key={s.label} className="flex-1 flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full grid place-items-center text-xs border ${s.done ? 'bg-zinc-900 text-white border-zinc-900' : s.active ? 'bg-white border-zinc-900 text-zinc-900' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>{s.done ? '✓' : i + 1}</div>
              <div className={`text-sm ${s.active ? 'font-medium' : 'text-zinc-500'}`}>{s.label}</div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${s.done ? 'bg-zinc-900' : 'bg-zinc-200'}`} />}
            </div>
          ))}
        </div>
        <Link href="/seller/workspace" className="mt-4 block w-full h-10 rounded border border-zinc-200 bg-white text-sm grid place-items-center hover:bg-zinc-50">Tiếp → Seller Workspace (desktop)</Link>
      </div>
    </div>
  );
}
