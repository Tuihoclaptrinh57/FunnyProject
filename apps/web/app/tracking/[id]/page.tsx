'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('order-flash-2');
  const [eta, setEta] = useState(12 * 60);
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
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css" />
      <div className="trk-wrap">
        <div className="trk-map">
          <div className="pin pin-user"></div>
          <div className="pin pin-dest"></div>
          <div className="pin pin-dest-label">Bạn</div>
          <div className="pin pin-shipper" style={{ left: `${100 + progress * 0.8}px` }}><i className="ti ti-motorbike" style={{ fontSize: "12px", color: "var(--color-accent)" }} aria-hidden="true"></i></div>
        </div>

        <div className="trk-panel">
          <div className="trk-stat"><p className="label">Trạng thái</p><p className="value">Shipper đang đến {mm}:{ss}</p></div>
          <div className="trk-stat"><p className="label">Dự kiến</p><p className="value">{mm} phút {ss} giây nữa</p></div>
          <div className="trk-shipper">
            <div className="avatar">NV</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}>Nguyễn Văn A</p>
              <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: 0 }}>Xe máy · 4.9 ★</p>
            </div>
          </div>
          <button className="btn" style={{ width: "100%" }}><i className="ti ti-phone" style={{ fontSize: "14px", marginRight: "6px" }} aria-hidden="true"></i>Gọi shipper</button>
          <Link href="/seller/workspace" className="btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Tiếp → Seller Workspace</Link>
        </div>
      </div>

      <style>{`
        .trk-wrap { max-width: 1100px; margin: 0 auto; padding: 24px 16px; display: grid; grid-template-columns: 1fr; gap: 16px; }
        .trk-map { position: relative; height: 260px; background:
          linear-gradient(var(--color-border) 0.5px, transparent 0.5px) 0 0 / 32px 32px,
          linear-gradient(90deg, var(--color-border) 0.5px, transparent 0.5px) 0 0 / 32px 32px,
          var(--color-surface-muted); border-radius: var(--radius-md); overflow: hidden; }
        .pin { position: absolute; }
        .pin-user { width: 14px; height: 14px; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 0 6px var(--color-accent-muted); top: 150px; left: 100px; }
        .pin-dest { width: 12px; height: 12px; border-radius: 3px; background: var(--color-success); top: 190px; left: 260px; }
        .pin-dest-label { top: 155px; left: 220px; background: var(--color-surface); border: 0.5px solid var(--color-border); border-radius: var(--radius-sm); padding: 4px 8px; font-size: 12px; }
        .pin-shipper { width: 22px; height: 22px; border-radius: 50%; background: var(--color-surface); border: 1.5px solid var(--color-accent); display: flex; align-items: center; justify-content: center; top: 110px; transition: left 1s linear; }
        .trk-panel { display: flex; flex-direction: column; gap: 10px; }
        .trk-stat { background: var(--color-surface-muted); border-radius: var(--radius-sm); padding: 10px 12px; }
        .trk-stat p { margin: 0; }
        .trk-stat .label { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px; }
        .trk-stat .value { font-size: 14px; font-weight: 500; }
        .trk-shipper { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 0.5px solid var(--color-border); }
        @media (min-width: 1024px) {
          .trk-wrap { grid-template-columns: minmax(0,1fr) 300px; }
          .trk-map { height: 420px; }
        }
      `}</style>
    </>
  );
}
