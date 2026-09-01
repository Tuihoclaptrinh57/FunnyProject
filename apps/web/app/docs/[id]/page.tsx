'use client';
import { use, useState } from 'react';
import { TopBar } from '../../../components/collab/TopBar';
import { Editor } from '../../../components/collab/Editor';
import { Sidebar } from '../../../components/collab/Sidebar';
import { useCollab } from '../../../lib/collab/useCollab';

export default function DocsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [collapsed, setCollapsed] = useState(false);
  const initialTitle = typeof window !== 'undefined' ? localStorage.getItem(`doc-title-${id}`) || `Document ${id}` : `Document ${id}`;
  const collab = useCollab(initialTitle, `SmartTobi Spec — Flash Sale Engine (CRDT demo)\n\nMục tiêu: 10k RPS, 0 oversell.\n- Stock: Redis Lua + DB optimistic lock\n- Queue: Redis SortedSet FIFO\n- Hold: TTL 600s\n\nBạn có thể:\n- Bôi đen 1 đoạn → Sidebar hiện ô comment\n- Undo/Redo chỉ của bạn\n- Toggle offline ở TopBar dot\n`);
  const toggleConnection = () => collab.connection === 'connected' ? collab.setOffline() : collab.setConnected();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      <div onClick={toggleConnection} className="cursor-pointer"><TopBar title={collab.title} onTitleChange={collab.setTitle} connection={collab.connection} pending={collab.pending} onUndo={collab.undo} onRedo={collab.redo} canUndo={collab.canUndo} canRedo={collab.canRedo} clientId={collab.clientId} /></div>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 flex justify-center p-6 lg:p-8 overflow-auto">
          <div className="w-full max-w-[720px]">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs"><span className="text-zinc-500">doc:</span><span>{id}</span><span className="text-zinc-300">·</span><button onClick={toggleConnection} className="underline decoration-dotted">Toggle offline/connected</button></div>
            <Editor value={collab.content} onChange={collab.handleContentChange} onSelectionChange={collab.setSelection} offline={collab.connection === 'offline'} />
          </div>
        </div>
        <Sidebar comments={collab.comments} selection={collab.selection} onAdd={collab.addComment} onToggleResolve={collab.toggleResolve} onDelete={collab.deleteComment} collapsed={collapsed} onToggleCollapsed={() => setCollapsed(v => !v)} />
      </div>
    </div>
  );
}
