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
      <div className="w-12 border-l bg-white flex flex-col items-center py-4 gap-3" style={{ borderColor: 'var(--hairline)', background: 'var(--paper)' }}>
        <button onClick={onToggleCollapsed} className="h-7 w-7 grid place-items-center border bg-white font-mono text-xs" style={{ borderColor: 'var(--hairline)' }}>‹</button>
        <div className="font-mono text-xs text-zinc-500 -rotate-90 whitespace-nowrap mt-6">Comments · {comments.length}</div>
      </div>
    );
  }
  return (
    <div className="w-[340px] shrink-0 border-l flex flex-col" style={{ borderColor: 'var(--hairline)', background: '#F6F5F1' }}>
      <div className="h-12 px-4 flex items-center justify-between border-b bg-white" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-xs tracking-widest">COMMENTS</div>
        <button onClick={onToggleCollapsed} className="h-6 px-2 border bg-white font-mono text-xs" style={{ borderColor: 'var(--hairline)' }}>Thu gọn ›</button>
      </div>
      {selection ? (
        <div className="m-3 p-3 border bg-white" style={{ borderColor: 'var(--ink)' }}>
          <div className="font-mono text-xs">Thêm comment cho đoạn đã chọn</div>
          <div className="mt-2 font-mono text-xs border-l-2 pl-2 py-1 bg-zinc-50" style={{ borderColor: 'var(--ink)' }}>“{selection.text.slice(0, 120)}”</div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Nhận xét…" className="mt-3 w-full border p-2 font-mono text-sm focus:outline-none" style={{ borderColor: 'var(--hairline)' }} rows={3} />
          <div className="mt-2 flex gap-2 justify-end">
            <button onClick={() => setDraft('')} className="h-7 px-3 border bg-white font-mono text-xs" style={{ borderColor: 'var(--hairline)' }}>Huỷ</button>
            <button onClick={() => { onAdd(draft, selection.text, selection.range); setDraft(''); }} disabled={!draft.trim()} className="h-7 px-3 bg-[var(--ink)] text-white font-mono text-xs disabled:opacity-40">Thêm</button>
          </div>
        </div>
      ) : (
        <div className="m-3 p-3 border border-dashed bg-white font-mono text-xs text-zinc-500" style={{ borderColor: 'var(--hairline)' }}>Bôi đen 1 đoạn text để thêm comment.</div>
      )}
      <div className="flex-1 overflow-auto px-3 pb-4 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className={`border bg-white p-3 ${c.resolved ? 'opacity-60' : ''}`} style={{ borderColor: 'var(--hairline)' }}>
            <div className="flex items-center justify-between font-mono text-xs"><span className="text-zinc-500">{c.author}</span><span className="text-zinc-400">{c.createdAt}</span></div>
            <div className="mt-1 text-sm leading-relaxed">{c.content}</div>
            <div className="mt-2 font-mono text-xs border-l-2 pl-2 py-1 bg-zinc-50" style={{ borderColor: c.resolved ? '#2F6E4F' : 'var(--hairline)' }}>“{c.quote}”</div>
            <div className="mt-3 flex gap-2 font-mono text-xs">
              <button onClick={() => onToggleResolve(c.id)} className={`h-6 px-2 border ${c.resolved ? 'bg-[#2F6E4F] text-white border-[#2F6E4F]' : 'bg-white border-[var(--hairline)]'}`}>{c.resolved ? 'Resolved' : 'Resolve'}</button>
              <button onClick={() => onDelete(c.id)} className="h-6 px-2 border bg-white" style={{ borderColor: 'var(--hairline)' }}>Xoá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
