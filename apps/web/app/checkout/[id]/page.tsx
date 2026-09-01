'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('flash-2');
  const [secs, setSecs] = useState(600); // 10 phút
  const [step, setStep] = useState<0 | 1 | 2>(0);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (secs < 480 && step === 0) setStep(1);
    if (secs < 300 && step === 1) setStep(2);
  }, [secs, step]);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const warn = secs < 120;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[480px] px-4 py-6">
        {/* Countdown XUYÊN SUỐT - to, cảnh báo */}
        <div className={`rounded-xl border p-4 text-center ${warn ? 'border-red-200 bg-red-50' : 'border-zinc-200 bg-white'}`}>
          <div className="text-xs tracking-widest text-zinc-500">GIỮ CHỖ CÒN LẠI</div>
          <div className={`mt-1 text-4xl font-bold tabular-nums tracking-tight transition-colors ${warn ? 'text-red-600 animate-pulse' : 'text-zinc-900'}`}>{mm}:{ss}</div>
          <div className="text-xs text-zinc-500">Lua script giữ stock có TTL 10 phút · đỏ khi &lt; 2 phút</div>
        </div>

        {/* 3 bước */}
        <div className="mt-4 flex items-center gap-2 text-xs">
          {['Đang giữ chỗ', 'Đang trừ tiền', 'Đã xác nhận'].map((label, i) => (
            <div key={label} className="flex-1 flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full grid place-items-center border text-xs ${i === step ? 'bg-zinc-900 text-white border-zinc-900' : i < step ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-zinc-200 text-zinc-400'}`}>{i < step ? '✓' : i + 1}</div>
              <div className={`hidden sm:block ${i === step ? 'text-zinc-900 font-medium' : 'text-zinc-500'}`}>{label}</div>
              {i < 2 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-zinc-200'}`} />}
            </div>
          ))}
        </div>

        {/* 3 số dư rõ ràng */}
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-zinc-500">Số dư hiện tại</span><span className="font-medium">2.450.000đ</span></div>
          <div className="flex justify-between text-sm"><span className="text-zinc-500">Số tiền trừ</span><span className="font-bold text-red-600">-199.000đ</span></div>
          <div className="h-px bg-zinc-100" />
          <div className="flex justify-between text-sm"><span className="font-medium">Số dư sau giao dịch</span><span className="font-bold">2.251.000đ</span></div>
          <div className="text-xs text-zinc-400">Không gộp chung 1 dòng · CÓ THỂ THẤT BẠI giữa chừng nếu hết hold time</div>
        </div>

        <div className="mt-4 rounded border border-zinc-200 bg-white p-4 flex gap-3">
          <img src={`https://picsum.photos/seed/${id}/200/200`} alt="" className="h-16 w-16 rounded object-cover" />
          <div className="flex-1">
            <div className="text-sm font-medium">Áo khoác gió SmartTobi</div>
            <div className="text-xs text-zinc-500">Flash Sale · Còn 8 · Stock progress real-time</div>
            <div className="mt-1 h-1.5 rounded bg-zinc-100 overflow-hidden"><div className="h-full bg-red-600 w-16 transition-all" /></div>
          </div>
        </div>

        <Link href={`/tracking/order-${id}`} className="mt-6 w-full h-11 rounded bg-zinc-900 text-white font-medium grid place-items-center hover:bg-black">Xác nhận thanh toán →</Link>
        <div className="mt-2 text-center text-xs text-zinc-400">Sau khi xác nhận tự động chuyển sang Shipper Tracking</div>
      </div>
    </div>
  );
}
