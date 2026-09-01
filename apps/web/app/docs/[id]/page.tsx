'use client';
import { use, useEffect, useState } from 'react';
import { TopBar } from '../../../components/collab/TopBar';
import { Editor } from '../../../components/collab/Editor';
import { Sidebar } from '../../../components/collab/Sidebar';
import { useCollab } from '../../../lib/collab/useCollab';

export default function DocsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [collapsed, setCollapsed] = useState(false);
  const [showOfflineToggle, setShowOfflineToggle] = useState(false);

  // initial title from localStorage (home) or fallback
  const initialTitle = typeof window !== 'undefined' ? localStorage.getItem(`doc-title-${id}`) || `Document ${id}` : `Document ${id}`;
  const collab = useCollab(initialTitle, `SmartTobi Spec — Flash Sale Engine (CRDT demo)

Mục tiêu: chịu tải 10k RPS, 0 oversell.
- Stock: Redis Lua atomic decr + DB optimistic lock (version)
- Queue: Redis SortedSet (score = timestamp) FIFO
- Hold: TTL 600s + scheduler release

Bạn có thể:
- Bôi đen 1 đoạn text → Sidebar sẽ hiện ô thêm comment
- Thử Undo/Redo (chỉ undo của bạn)
- Bấm dot trạng thái để giả lập offline/connected
`);

  // For demo: allow clicking dot to toggle offline
  const toggleConnection = () => {
    if (collab.connection === 'connected') collab.setOffline();
    else collab.setConnected();
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div onClick={toggleConnection} className="cursor-pointer">
        <TopBar
          title={collab.title}
          onTitleChange={collab.setTitle}
          connection={collab.connection}
          pending={collab.pending}
          onUndo={collab.undo}
          onRedo={collab.redo}
          canUndo={collab.canUndo}
          canRedo={collab.canRedo}
          clientId={collab.clientId}
        />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Editor centered */}
        <div className="flex-1 min-w-0 flex justify-center p-6 lg:p-8 overflow-auto">
          <div className="w-full max-w-[720px]">
            <div className="mb-4 flex items-center gap-2 text-xs">
              <span className="text-zinc-500">doc:</span>
              <span className="font-mono text-zinc-700">{id}</span>
              <span className="text-zinc-300">·</span>
              <button onClick={toggleConnection} className="text-zinc-600 hover:text-zinc-900 underline decoration-dotted">Toggle offline/connected (demo)</button>
            </div>
            <Editor value={collab.content} onChange={collab.handleContentChange} onSelectionChange={collab.setSelection} offline={collab.connection === 'offline'} />
            <div className="mt-4 text-xs text-zinc-400">
              Tip: Mở 2 tab <span className="font-mono">/docs/{id}</span> để test gõ cùng lúc. Offline vẫn gõ được, viền vàng sẽ hiện.
            </div>
          </div>
        </div>

        <Sidebar
          comments={collab.comments}
          selection={collab.selection}
          onAdd={collab.addComment}
          onToggleResolve={collab.toggleResolve}
          onDelete={collab.deleteComment}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
      </div>
    </div>
  );
}
