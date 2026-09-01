import Link from "next/link";

export default function FeedPage() {
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css" />
      <div className="feed-wrap">
        <nav className="feed-nav">
          <div className="feed-nav-item active"><i className="ti ti-home" aria-hidden="true"></i> Feed</div>
          <Link href="/live/flash-2" className="feed-nav-item"><i className="ti ti-device-tv" aria-hidden="true"></i> Live</Link>
          <div className="feed-nav-item"><i className="ti ti-bolt" aria-hidden="true"></i> Flash sale</div>
          <Link href="/seller/workspace" className="feed-nav-item"><i className="ti ti-wallet" aria-hidden="true"></i> Ví</Link>
          <Link href="/tracking/order-flash-2" className="feed-nav-item"><i className="ti ti-map-pin" aria-hidden="true"></i> Đơn hàng</Link>
        </nav>

        <div className="feed-grid">
          <div className="card">
            <div className="feed-card-media">
              <i className="ti ti-headphones" style={{ fontSize: "36px", color: "var(--color-text-muted)" }} aria-hidden="true"></i>
              <span className="badge badge-danger">-66% flash sale</span>
            </div>
            <div className="feed-card-body">
              <p>Đang livestream · gắn deal ProSound X2</p>
              <Link href="/live/flash-2" className="btn" style={{ width: "100%", height: "32px", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Xem live</Link>
            </div>
          </div>

          <div className="card">
            <div className="feed-card-media">
              <i className="ti ti-shoe" style={{ fontSize: "36px", color: "var(--color-text-muted)" }} aria-hidden="true"></i>
            </div>
            <div className="feed-card-body">
              <p>Gợi ý cho bạn · giày chạy bộ AirRun</p>
              <Link href="/live/flash-1" className="btn" style={{ width: "100%", height: "32px", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Xem sản phẩm</Link>
            </div>
          </div>

          <div className="card">
            <div className="feed-card-media">
              <i className="ti ti-watch" style={{ fontSize: "36px", color: "var(--color-text-muted)" }} aria-hidden="true"></i>
              <span className="badge badge-warning">Sắp mở bán</span>
            </div>
            <div className="feed-card-body">
              <p>Đồng hồ thông minh FitPro · 18:00</p>
              <button className="btn" style={{ width: "100%", height: "32px", fontSize: "13px" }}>Đặt nhắc</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .feed-wrap { max-width: 1200px; margin: 0 auto; padding: 24px 16px; display: grid; grid-template-columns: 1fr; gap: 16px; }
        .feed-nav { display: flex; overflow-x: auto; gap: 4px; padding-bottom: 8px; }
        .feed-nav-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--radius-sm); font-size: 14px; white-space: nowrap; color: var(--color-text-secondary); text-decoration: none; }
        .feed-nav-item.active { background: var(--color-surface-muted); color: var(--color-text); font-weight: 500; }
        .feed-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        .feed-card-media { position: relative; height: 140px; background: var(--color-surface-muted); display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md) var(--radius-md) 0 0; }
        .feed-card-media .badge { position: absolute; top: 8px; left: 8px; }
        .feed-card-body { padding: 10px 12px; }
        .feed-card-body p { font-size: 13px; margin: 0 0 8px; color: var(--color-text-secondary); }
        @media (min-width: 768px) {
          .feed-wrap { grid-template-columns: 220px minmax(0,1fr); }
          .feed-nav { flex-direction: column; overflow-x: visible; }
        }
      `}</style>
    </>
  );
}
