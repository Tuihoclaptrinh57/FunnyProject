'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LivePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('flash-2');
  const [viewers, setViewers] = useState(12482);
  const [chat, setChat] = useState([
    { user: 'Minh', text: 'Deal này còn bao nhiêu?' },
    { user: 'Linh', text: 'Stock còn 42 nhé!' },
  ]);

  useEffect(() => {
    params.then((p) => setId(p.id));
    const i = setInterval(() => setViewers((v) => v + Math.floor(Math.random() * 20 - 8)), 1200);
    return () => clearInterval(i);
  }, [params]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Player full-bleed */}
      <div className="flex-1 relative bg-zinc-900 flex flex-col">
        <div className="h-12 flex items-center gap-3 px-4 border-b border-white/10">
          <Link href="/" className="text-sm text-white/70 hover:text-white">← Feed</Link>
          <div className="text-sm font-medium">Live · SmartTobi</div>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="tabular-nums transition-all">{viewers.toLocaleString()} đang xem</span>
            <span className="hidden sm:inline text-white/50">· WebSocket fan-out</span>
          </div>
        </div>

        <div className="flex-1 relative bg-gradient-to-b from-zinc-800 to-zinc-900 grid place-items-center p-6">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/10 grid place-items-center text-2xl">▶</div>
            <div className="mt-4 text-sm text-white/80">Live player · HLS / WebRTC</div>
            <div className="text-xs text-white/50">Deal đang ghim bên dưới là floating card (không che player)</div>
          </div>

          {/* Floating deal card */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:w-80 rounded-xl border border-white/10 bg-white text-zinc-900 shadow-xl overflow-hidden">
            <div className="flex gap-3 p-3">
              <img src={`https://picsum.photos/seed/${id}/200/200`} alt="" className="h-16 w-16 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-tight">Áo khoác gió SmartTobi</div>
                <div className="text-sm font-bold text-red-600">199k <span className="text-xs line-through text-zinc-400">499k</span></div>
                <div className="text-xs text-zinc-500">Còn 42 · Lua stock TTL</div>
              </div>
            </div>
            <div className="px-3 pb-3">
              <Link href={`/queue/${id}`} className="block w-full h-10 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-bold grid place-items-center">Tham gia Flash Sale</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-950 flex flex-col h-[40vh] lg:h-auto">
        <div className="h-10 px-4 flex items-center text-sm font-medium border-b border-white/10">Chat · cuộn nhanh</div>
        <div className="flex-1 overflow-auto p-3 space-y-2 text-sm">
          {chat.map((c, i) => (
            <div key={i}><span className="font-medium text-white">{c.user}:</span> <span className="text-white/80">{c.text}</span></div>
          ))}
          <div className="text-xs text-white/40">WebSocket fan-out · tin nhắn hiện real-time</div>
        </div>
        <div className="p-3 border-t border-white/10 flex gap-2">
          <input
            placeholder="Nhắn..."
            className="flex-1 rounded bg-white/10 border border-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const v = (e.target as HTMLInputElement).value;
                if (v.trim()) { setChat((c) => [...c, { user: 'Bạn', text: v }]); (e.target as HTMLInputElement).value = ''; }
              }
            }}
          />
          <button className="px-3 rounded bg-white text-zinc-900 text-sm">Gửi</button>
        </div>
      </div>
    </div>
  );
}
