'use client';
import { useState } from 'react';
import type { Comment } from '../../lib/collab/useCollab';

type Props = {
  comments: Comment[];
  selection: { text: string; range: { start: number; end: number } } | null;
  onAdd: (text: string, quote: string, range?: { start: number; end: number }) => void;
  onToggleResolve: (id: string) => void;
  onDelete: (id: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function Sidebar({ comments, selection, onAdd, onToggleResolve, onDelete, collapsed, onToggleCollapsed }: Props) {
  const [draft, setDraft] = useState('');

  if (collapsed) {
    return (
      <div className="w-12 border-l border-zinc-200 bg-zinc-50 flex flex-col items-center py-4 gap-3">
        <button onClick={onToggleCollapsed} className="h-8 w-8 rounded border border-zinc-200 bg-white text-sm">‹</button>
        <div className="text-xs text-zinc-500 -rotate-90 whitespace-nowrap mt-6">Comments · {comments.length}</div>
      </div>
    );
  }

  return (
    <div className="w-[340px] shrink-0 border-l border-zinc-200 bg-zinc-50 flex flex-col">
      <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-200 bg-white">
        <div className="text-sm font-medium">Comments</div>
        <button onClick={onToggleCollapsed} className="h-7 px-2 rounded border border-zinc-200 bg-white text-xs hover:bg-zinc-50">Thu gọn ›</button>
      </div>

      {/* New comment when selection */}
      {selection ? (
        <div className="m-3 p-3 rounded border border-zinc-900 bg-white shadow-sm">
          <div className="text-xs font-medium text-zinc-900">Thêm comment cho đoạn đã chọn</div>
          <div className="mt-2 text-xs border-l-2 border-zinc-900 pl-2 py-1 bg-zinc-50 text-zinc-700">“{selection.text.slice(0, 120)}”</div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Nhận xét …"
            className="mt-3 w-full rounded border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-900"
            rows={3}
          />
          <div className="mt-2 flex gap-2 justify-end">
            <button onClick={() => setDraft('')} className="h-7 px-3 rounded border border-zinc-200 bg-white text-xs">Huỷ</button>
            <button
              onClick={() => { onAdd(draft, selection.text, selection.range); setDraft(''); }}
              className="h-7 px-3 rounded bg-zinc-900 text-white text-xs hover:bg-black disabled:opacity-40"
              disabled={!draft.trim()}
            >
              Thêm
            </button>
          </div>
        </div>
      ) : (
        <div className="m-3 p-3 rounded border border-dashed border-zinc-300 bg-white text-xs text-zinc-500">
          Bôi đen 1 đoạn text trong editor để thêm comment. Hoặc xem “comment tại vị trí con trỏ” khi bạn đặt caret.
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-auto px-3 pb-4 space-y-3">
        {comments.length === 0 && <div className="text-sm text-zinc-500 text-center py-8">Chưa có comment</div>}
        {comments.map((c) => (
          <div key={c.id} className={`rounded border bg-white p-3 ${c.resolved ? 'opacity-60' : ''} border-zinc-200`}>
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-zinc-500">{c.author}</div>
              <div className="text-xs text-zinc-400">{c.createdAt}</div>
            </div>
            <div className="mt-1 text-sm text-zinc-900 leading-relaxed">{c.content}</div>
            <div className="mt-2 text-xs border-l-2 border-zinc-300 pl-2 py-1 bg-zinc-50 text-zinc-600">“{c.quote}”</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onToggleResolve(c.id)} className={`h-7 px-2 rounded text-xs border ${c.resolved ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}>{c.resolved ? 'Đã resolve' : 'Resolve'}</button>
              <button onClick={() => onDelete(c.id)} className="h-7 px-2 rounded text-xs border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600">Xoá</button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-200 bg-white text-xs text-zinc-500">Tip: Undo/redo chỉ ảnh hưởng thao tác của bạn.</div>
    </div>
  );
}
