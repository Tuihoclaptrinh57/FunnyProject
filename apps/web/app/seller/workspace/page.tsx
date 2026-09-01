'use client';
import { useEffect, useState } from 'react';

const suggestions = [
  { id: 's1', name: 'Áo thun Tobi Cotton · 149k', reason: 'Vector 0.92 · Bán chạy cùng nhóm' },
  { id: 's2', name: 'Quần short gió · 199k', reason: 'Vector 0.88 · Từng gắn với flash-2' },
  { id: 's3', name: 'Tất thể thao · 49k', reason: 'Vector 0.81 · Thường mua kèm' },
];

export default function SellerWorkspace() {
  const [title, setTitle] = useState('Áo khoác gió SmartTobi · Flash Sale 19:00');
  const [price, setPrice] = useState('199000');
  const [desc, setDesc] = useState('Mô tả deal: Chống mưa nhẹ, nhẹ 280g, 3 màu. Soạn cùng lúc với team qua CRDT.');
  const [savedAt, setSavedAt] = useState('Vừa lưu');
  const [added, setAdded] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setSavedAt(`Đã lưu lúc ${new Date().toLocaleTimeString('vi-VN')}`), 800);
    return () => clearTimeout(t);
  }, [title, price, desc]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Top bar desktop - neutral professional */}
      <div className="h-14 border-b border-zinc-200 bg-white flex items-center px-6 gap-4">
        <div className="font-semibold tracking-tight">Seller Workspace · CRDT</div>
        <div className="text-xs text-zinc-500">Desktop-first · 2 cột</div>
        <div className="flex-1" />
        <div className="text-xs text-zinc-500">{savedAt} · Tự động lưu, không nút Save</div>
        <div className="flex -space-x-2">
          <div className="h-7 w-7 rounded-full bg-zinc-900 text-white grid place-items-center text-xs border-2 border-white">A</div>
          <div className="h-7 w-7 rounded-full bg-violet-600 text-white grid place-items-center text-xs border-2 border-white">B</div>
          <div className="h-7 w-7 rounded-full bg-emerald-600 text-white grid place-items-center text-xs border-2 border-white">C</div>
        </div>
        <div className="text-xs text-zinc-500">3 seller đang cùng sửa</div>
      </div>

      <div className="flex min-h-0">
        {/* Left editor */}
        <div className="flex-1 p-8 max-w-3xl">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium text-zinc-700">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-700">Giá flash</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700">Ảnh</label>
                <div className="mt-1 h-10 rounded border border-dashed border-zinc-300 grid place-items-center text-xs text-zinc-500">Kéo thả ảnh</div>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700">Mô tả</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={6} className="mt-1 w-full rounded border border-zinc-200 p-3 text-sm focus:outline-none focus:border-zinc-900" />
            </div>
            <div className="text-xs text-zinc-400">CRDT: nhiều người gõ cùng lúc không xung đột · Avatar góc phải đủ, không cần con trỏ màu</div>
          </div>
        </div>

        {/* Right AI suggestions */}
        <div className="w-[380px] border-l border-zinc-200 bg-zinc-50 p-6">
          <div className="text-sm font-medium">AI gợi ý deal tiếp theo</div>
          <div className="text-xs text-zinc-500">Vector search từ M3 · nên đẩy flash sale</div>
          <div className="mt-4 space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="rounded border border-zinc-200 bg-white p-3">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-zinc-500">{s.reason}</div>
                <button
                  onClick={() => setAdded((a) => [...a, s.id])}
                  disabled={added.includes(s.id)}
                  className="mt-2 h-7 px-3 rounded bg-zinc-900 text-white text-xs hover:bg-black disabled:opacity-40"
                >
                  {added.includes(s.id) ? 'Đã thêm' : 'Thêm vào deal'}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded border border-zinc-200 bg-white p-3 text-xs text-zinc-600">
            <div className="font-medium text-zinc-900">Đã lưu lúc {new Date().toLocaleTimeString('vi-VN')}</div>
            <div>Tự động lưu mỗi thay đổi, không dùng nút Save.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
