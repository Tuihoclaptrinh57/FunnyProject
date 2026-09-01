'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('flash-2');
  const [secs, setSecs] = useState(600);
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
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css" />
      <div className="ck-wrap">
        <div className="card ck-card">
          <p style={{ fontSize: "15px", fontWeight: 500, margin: "0 0 12px" }}>Xác nhận đơn hàng</p>
          <div className={`rounded border p-3 text-center mb-3 ${warn ? 'border-red-200 bg-red-50' : 'border-zinc-200 bg-white'}`}>
            <div className="text-xs tracking-widest text-zinc-500">GIỮ CHỖ CÒN LẠI</div>
            <div className={`mt-1 text-2xl font-bold tabular-nums ${warn ? 'text-red-600 animate-pulse' : 'text-zinc-900'}`}>{mm}:{ss}</div>
          </div>
          <div className="flex items-center gap-2 text-xs mb-3">
            {['Đang giữ chỗ', 'Đang trừ tiền', 'Đã xác nhận'].map((label, i) => (
              <div key={label} className="flex-1 flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full grid place-items-center border text-xs ${i === step ? 'bg-zinc-900 text-white border-zinc-900' : i < step ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-zinc-200 text-zinc-400'}`}>{i < step ? '✓' : i + 1}</div>
                <div className={`hidden sm:block text-xs ${i === step ? 'text-zinc-900 font-medium' : 'text-zinc-500'}`}>{label}</div>
                {i < 2 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-zinc-200'}`} />}
              </div>
            ))}
          </div>
          <div className="ck-item">
            <div className="ck-item-thumb"><i className="ti ti-headphones" style={{ fontSize: "22px", color: "var(--color-text-muted)" }} aria-hidden="true"></i></div>
            <div className="ck-item-info">
              <p style={{ fontSize: "14px" }}>Tai nghe không dây ProSound X2 · #{id}</p>
              <p style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>Số lượng: 1</p>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 500 }}>299.000đ</p>
          </div>
          <table className="ck-table">
            <tbody>
              <tr><td style={{ color: "var(--color-text-secondary)" }}>Tạm tính</td><td style={{ textAlign: "right" }}>299.000đ</td></tr>
              <tr><td style={{ color: "var(--color-text-secondary)" }}>Phí vận chuyển</td><td style={{ textAlign: "right" }}>0đ</td></tr>
              <tr className="total"><td>Tổng cộng</td><td style={{ textAlign: "right" }}>299.000đ</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card ck-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>Thanh toán</p>
          <div className="ck-pay-row">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="ti ti-wallet" style={{ fontSize: "18px", color: "var(--color-accent)" }} aria-hidden="true"></i>
              <span style={{ fontSize: "13px" }}>Ví của bạn</span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>1.250.000đ</span>
          </div>
          <div className="rounded border bg-white p-3 space-y-1 text-sm" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between"><span className="text-zinc-500">Số dư hiện tại</span><span>2.450.000đ</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Trừ</span><span className="text-red-600">-299.000đ</span></div>
            <div className="flex justify-between font-medium border-t pt-1" style={{ borderColor: 'var(--color-border)' }}><span>Số dư sau</span><span>2.151.000đ</span></div>
          </div>
          <div className="ck-pay-btn-wrap">
            <Link href={`/tracking/order-${id}`} className="btn btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Thanh toán 299.000đ</Link>
            <p style={{ fontSize: "11px", color: "var(--color-text-muted)", margin: "8px 0 0", textAlign: "center" }}>Giữ chỗ hết hạn sau {mm}:{ss}</p>
          </div>
        </div>
      </div>

      <style>{`
        .ck-wrap { max-width: 1000px; margin: 0 auto; padding: 24px 16px; display: grid; grid-template-columns: 1fr; gap: 16px; }
        .ck-card { padding: 16px; }
        .ck-item { display: flex; gap: 12px; align-items: center; padding-bottom: 12px; border-bottom: 0.5px solid var(--color-border); margin-bottom: 12px; }
        .ck-item-thumb { width: 48px; height: 48px; background: var(--color-surface-muted); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ck-item-info { flex: 1; }
        .ck-item-info p { margin: 0; }
        .ck-table { width: 100%; font-size: 13px; }
        .ck-table td { padding: 4px 0; }
        .ck-table .total td { font-weight: 500; padding-top: 8px; border-top: 0.5px solid var(--color-border); }
        .ck-pay-row { display: flex; align-items: center; justify-content: space-between; background: var(--color-surface-muted); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 12px; }
        .ck-pay-btn-wrap { position: sticky; bottom: 0; background: var(--color-bg); padding-top: 8px; }
        @media (min-width: 1024px) {
          .ck-wrap { grid-template-columns: minmax(0,1fr) 300px; }
          .ck-pay-btn-wrap { position: static; }
        }
      `}</style>
    </>
  );
}
