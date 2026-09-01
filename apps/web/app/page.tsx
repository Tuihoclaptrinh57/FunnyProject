import Link from 'next/link';
import { CollabHero } from '../components/landing/CollabHero';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header - left aligned, hairline */}
      <div className="mx-auto max-w-[1080px] px-6 h-14 flex items-center gap-6">
        <div className="font-mono text-sm tracking-tight">smart.tobi — CRDT editor</div>
        <div className="text-xs text-zinc-500 font-mono">RGA · Rope · WebSocket</div>
        <div className="flex-1" />
        <Link href="/docs/demo" className="text-xs font-mono border border-[var(--hairline)] px-3 py-1.5 hover:bg-white">Mở editor →</Link>
      </div>
      <hr className="hr" />

      {/* Hero - left aligned, 2 cursors typing */}
      <div className="mx-auto max-w-[1080px] px-6 py-16 sm:py-20">
        <CollabHero />
        <div className="mt-6 max-w-[560px] text-sm leading-relaxed text-zinc-600">
          Tự viết từ đầu cho dân kỹ thuật xem. Không SaaS chung chung, không số to + label nhỏ. Mọi màu đều lấy từ domain: INSERT và DELETE.
        </div>
        <div className="mt-8 flex gap-3">
          <Link href="/docs/demo" className="h-9 px-4 inline-flex items-center bg-[var(--ink)] text-[var(--paper)] text-sm font-mono hover:opacity-90">Mở editor</Link>
          <Link href="#engine" className="h-9 px-4 inline-flex items-center border border-[var(--hairline)] bg-white text-sm font-mono hover:bg-zinc-50">Xem engine</Link>
        </div>
      </div>

      <hr className="hr" />

      {/* Engine - as log/diff, not card */}
      <div id="engine" className="mx-auto max-w-[1080px] px-6 py-10">
        <div className="text-xs font-mono tracking-widest text-zinc-500">ENGINE — 2 OPERATIONS ONLY</div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="font-mono text-sm leading-6">
            <div className="text-zinc-500">{'// log — insert path'}</div>
            <div><span className="text-[#2F6E4F]">+ INSERT</span> <span className="text-zinc-400">RGA</span> id: 3a7f · left: 2c · right: 8e</div>
            <div><span className="text-[#2F6E4F]">+ INSERT</span> <span className="text-zinc-400">Rope</span> offset: 12 · len: 5 · &quot;không&quot;</div>
            <div><span className="text-[#A34632]">- DELETE</span> <span className="text-zinc-400">RGA</span> id: 4b1 · tombstone: true</div>
            <div className="mt-3 text-xs text-zinc-500">Màu INSERT #2F6E4F / DELETE #A34632 dùng luôn làm ngôn ngữ hệ thống.</div>
          </div>
          <div className="font-mono text-sm leading-6 border-l border-[var(--hairline)] pl-6">
            <div className="text-zinc-500">{'// diff — CRDT state'}</div>
            <div className="text-zinc-700">@@ doc: 1  ·  peers: 2  ·  pending: 0</div>
            <div className="text-[#2F6E4F]">{'+ Rope {"chunks": 3, "len": 128}'}</div>
            <div className="text-[#2F6E4F]">{'+ RGA  {"nodes":  48, "tombstones": 2}'}</div>
            <div className="text-zinc-500">-- no shadow, no card, left-aligned, hairline only</div>
          </div>
        </div>
      </div>

      <hr className="hr" />

      {/* How it works - left aligned, hairline */}
      <div className="mx-auto max-w-[1080px] px-6 py-10 grid sm:grid-cols-3 gap-8 font-mono text-sm">
        <div>
          <div className="text-xs tracking-widest text-zinc-500">01 — OFFLINE FIRST</div>
          <div className="mt-2 text-zinc-800">Vẫn gõ được khi mất mạng. Số thay đổi chờ gửi hiện ở top bar, tự flush khi có mạng.</div>
        </div>
        <div>
          <div className="text-xs tracking-widest text-zinc-500">02 — LOCAL UNDO</div>
          <div className="mt-2 text-zinc-800">Undo chỉ hoàn tác hành động của bạn, không undo global.</div>
        </div>
        <div>
          <div className="text-xs tracking-widest text-zinc-500">03 — ANNOTATION</div>
          <div className="mt-2 text-zinc-800">Bôi đen text → comment gắn vào range, sidebar phải hiện trích đoạn.</div>
        </div>
      </div>

      <hr className="hr" />

      <div className="mx-auto max-w-[1080px] px-6 py-10 flex items-center justify-between">
        <div className="font-mono text-xs text-zinc-500">Nền giấy #F6F5F1 · Mực #1C1B18 · IBM Plex Mono + Sans</div>
        <Link href="/docs/demo" className="text-sm font-mono underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">Vào editor</Link>
      </div>
    </div>
  );
}
