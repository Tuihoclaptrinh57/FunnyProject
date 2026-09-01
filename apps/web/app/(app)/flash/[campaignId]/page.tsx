import { Suspense } from 'react';
import { FlashJoin } from '../../../../components/flash/FlashJoin';

export const revalidate = 5;

export default async function FlashPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css" />
      <div className="fs-wrap">
        <div className="card fs-card">
          <div className="fs-live-media">
            <i className="ti ti-device-tv" style={{ fontSize: "40px", color: "var(--color-text-muted)" }} aria-hidden="true"></i>
            <span className="badge badge-danger fs-live-badge"><span className="dot"></span> Live</span>
            <span className="fs-viewers">2 341 đang xem</span>
          </div>
          <div className="fs-body">
            <p className="fs-title">Tai nghe không dây ProSound X2 · #{campaignId}</p>
            <div className="fs-price-row">
              <span className="fs-price">299.000đ</span>
              <span className="fs-price-old">890.000đ</span>
              <span className="badge badge-danger">-66%</span>
            </div>
            <div className="fs-progress-card">
              <div className="fs-progress-meta">
                <span>Đã bán 847 / 1000</span>
                <span>Kết thúc sau 04:12</span>
              </div>
              <div className="fs-progress-track"><div className="fs-progress-fill"></div></div>
            </div>
            <div className="fs-queue">
              <i className="ti ti-clock" style={{ fontSize: "18px", color: "var(--color-warning)" }} aria-hidden="true"></i>
              <div>
                <strong>Vị trí hàng đợi: #58</strong>
                <span>Giữ chỗ 10:00 phút sau khi đến lượt</span>
              </div>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <FlashJoin campaignId={campaignId} />
            </Suspense>
          </div>
        </div>
      </div>

      <style>{`
        .fs-wrap { max-width: 420px; margin: 0 auto; padding: 24px 12px; }
        .fs-live-media { position: relative; height: 200px; background: var(--color-surface-muted); display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; }
        .fs-live-badge { position: absolute; top: 10px; left: 10px; }
        .fs-live-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; }
        .fs-viewers { position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.55); color: #fff; font-size: 12px; padding: 3px 8px; border-radius: var(--radius-sm); }
        .fs-body { padding: 16px; }
        .fs-title { font-size: 18px; font-weight: 500; margin: 0 0 4px; }
        .fs-price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px; }
        .fs-price { font-size: 24px; font-weight: 500; color: var(--color-danger); }
        .fs-price-old { font-size: 13px; color: var(--color-text-muted); text-decoration: line-through; }
        .fs-progress-card { background: var(--color-surface-muted); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 14px; }
        .fs-progress-meta { display: flex; justify-content: space-between; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 6px; }
        .fs-progress-track { height: 6px; background: var(--color-border); border-radius: 4px; overflow: hidden; }
        .fs-progress-fill { width: 84.7%; height: 100%; background: var(--color-danger); }
        .fs-queue { display: flex; align-items: center; gap: 10px; background: var(--color-warning-bg); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 16px; }
        .fs-queue strong { display: block; font-size: 13px; color: var(--color-warning); }
        .fs-queue span { font-size: 12px; color: var(--color-text-secondary); }
        @media (min-width: 768px) {
          .fs-wrap { max-width: 900px; }
          .fs-card { display: grid; grid-template-columns: 1.2fr 1fr; }
          .fs-live-media { height: 100%; border-radius: var(--radius-md) 0 0 var(--radius-md); }
          .fs-body { display: flex; flex-direction: column; justify-content: center; }
        }
      `}</style>
    </>
  );
}
