import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col justify-center px-6 py-16">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500">SMART.TOBI · FLASH LIVE</div>
          <h1 className="text-3xl font-semibold tracking-tight">SmartTobi SuperApp</h1>
          <p className="text-sm text-zinc-500">Flash Sale + Live Commerce · Hexagonal · Next.js 15 PPR · Spring Boot 3.4.5</p>
        </div>

        <div className="mt-8 grid gap-3">
          <Link href="/login" className="flex items-center justify-between rounded border border-zinc-200 bg-white p-4 hover:bg-zinc-50">
            <div><div className="text-sm font-medium">Đăng nhập</div><div className="text-xs text-zinc-500">/login · JWT + Refresh</div></div>
            <span className="text-zinc-400">→</span>
          </Link>
          <Link href="/register" className="flex items-center justify-between rounded border border-zinc-200 bg-white p-4 hover:bg-zinc-50">
            <div><div className="text-sm font-medium">Đăng ký</div><div className="text-xs text-zinc-500">/register · smart.tobi.user</div></div>
            <span className="text-zinc-400">→</span>
          </Link>
          <Link href="/flash/2" className="flex items-center justify-between rounded border border-zinc-900 bg-zinc-900 p-4 text-white hover:bg-black">
            <div><div className="text-sm font-medium">Flash Sale #2</div><div className="text-xs text-zinc-400">flash.smart.tobi · Redis Lua + ZSet queue</div></div>
            <span>→</span>
          </Link>
        </div>

        <div className="mt-8 rounded border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-600">
          <div className="font-medium text-zinc-900">Test flow Sprint 1</div>
          Register → Login (lưu accessToken) → Join Flash Sale → HOLD_CREATED (10m TTL) hoặc QUEUED (poll /api/flash/queue/&#123;ticketId&#125;) → Hold expire
        </div>
      </div>
      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">Minimal · Neutral (white/zinc/black) · 1 accent (zinc-900) · Linear/Notion inspired</div>
    </div>
  );
}
