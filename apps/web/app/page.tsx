'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const create = () => {
    const id = Math.random().toString(36).slice(2, 8);
    const title = name.trim() || 'Untitled document';
    // pass title via query + localStorage for demo (no real backend)
    localStorage.setItem(`doc-title-${id}`, title);
    router.push(`/docs/${id}`);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center px-6 py-16">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500">SMART.TOBI · COLLAB</div>
          <h1 className="text-3xl font-semibold tracking-tight">Tạo document mới</h1>
          <p className="text-sm text-zinc-500">Tối giản, nhanh, cho developer/technical writer. Không màu mè.</p>
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-zinc-700">Tên document</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
            placeholder="Ví dụ: Spec - Flash Sale Engine"
            className="mt-2 w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={create} className="h-9 px-4 rounded bg-zinc-900 text-white text-sm hover:bg-black">
              Tạo document mới
            </button>
          </div>
          <div className="mt-3 text-xs text-zinc-500">Mỗi client có clientId ngẫu nhiên làm tác giả tạm thời. Chưa cần đăng nhập.</div>
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6 text-xs text-zinc-400">
          Gợi ý: Mở 2 tab cùng document để test CRDT gõ cùng lúc. Thử ngắt mạng để thấy chế độ offline.
        </div>
      </div>

      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">Linear/Notion/Height - inspired · 1 accent (zinc-900) · neutral only</div>
    </div>
  );
}
