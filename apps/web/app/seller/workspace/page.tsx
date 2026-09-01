'use client';
import { useEffect, useState } from 'react';

const suggestions = [
  { id: 's1', name: 'Áo thun Tobi Cotton · 149k', reason: 'Vector 0.92 · Bán chạy cùng nhóm' },
  { id: 's2', name: 'Quần short gió · 199k', reason: 'Vector 0.88 · Từng gắn với flash-2' },
  { id: 's3', name: 'Tất thể thao · 49k', reason: 'Vector 0.81 · Thường mua kèm' },
];

export default function SellerWorkspace() {
  const [title, setTitle] = useState('Bàn phím cơ RGB Nova');
  const [price, setPrice] = useState('399.000đ');
  const [qty, setQty] = useState('500');
  const [desc, setDesc] = useState('');
  const [savedAt, setSavedAt] = useState('Đã đồng bộ');

  useEffect(() => {
    const t = setTimeout(() => setSavedAt(`Đã lưu lúc ${new Date().toLocaleTimeString('vi-VN')}`), 600);
    return () => clearTimeout(t);
  }, [title, price, qty]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css" />
      <div className="ws-wrap">
        <div className="ws-presence">
          <div className="ws-avatars">
            <div className="avatar">M</div>
            <div className="avatar">T</div>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginLeft: "8px" }}>2 người đang sửa</span>
          </div>
          <span className="ws-synced"><i className="ti ti-cloud-check" style={{ fontSize: "14px", marginRight: "4px" }} aria-hidden="true"></i>{savedAt}</span>
        </div>

        <div className="card" style={{ padding: "16px" }}>
          <p className="ws-field-label">Tên deal tiếp theo</p>
          <div className="flex items-center gap-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 bg-transparent border-0 p-0 text-[15px] focus:outline-none" style={{ margin: "0 0 4px" }} />
            <span className="ws-caret" style={{ background: "var(--color-accent)" }}></span>
          </div>
          <div className="ws-typing a">M đang gõ...</div>

          <p className="ws-field-label">Giá flash sale</p>
          <div className="flex items-center gap-2">
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="flex-1 bg-transparent border-0 p-0 text-[15px] focus:outline-none" style={{ margin: "0 0 4px" }} />
            <span className="ws-caret" style={{ background: "var(--color-success)" }}></span>
          </div>
          <div className="ws-typing b">T đang gõ...</div>

          <p className="ws-field-label">Số lượng</p>
          <input value={qty} onChange={(e) => setQty(e.target.value)} className="w-full bg-transparent border-0 p-0 text-[15px] focus:outline-none" style={{ marginBottom: 0 }} />

          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="text-sm font-medium">AI gợi ý</div>
            <div className="mt-2 space-y-2">
              {suggestions.slice(0, 2).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: "var(--color-border)" }}>
                  <div><div className="text-sm">{s.name}</div><div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{s.reason}</div></div>
                  <button className="btn" style={{ height: "28px", fontSize: "12px", padding: "0 10px" }}>Thêm</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ws-wrap { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
        .ws-presence { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; position: sticky; top: 0; background: var(--color-bg); padding: 8px 0; z-index: 10; }
        .ws-avatars { display: flex; align-items: center; }
        .ws-avatars .avatar { width: 22px; height: 22px; font-size: 11px; }
        .ws-avatars .avatar:nth-child(2) { margin-left: -8px; background: var(--color-success-bg); color: var(--color-success); }
        .ws-synced { font-size: 12px; color: var(--color-text-muted); }
        .ws-field-label { font-size: 13px; color: var(--color-text-secondary); margin: 0 0 4px; }
        .ws-typing { font-size: 10px; margin-bottom: 14px; }
        .ws-typing.a { color: var(--color-accent); }
        .ws-typing.b { color: var(--color-success); }
        .ws-caret { display: inline-block; width: 2px; height: 16px; vertical-align: -3px; margin-left: 2px; }
      `}</style>
    </>
  );
}
