'use client';

type Props = {
  title: string;
  onTitleChange: (v: string) => void;
  connection: 'loading' | 'connected' | 'offline';
  pending: number;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clientId: string;
};

export function TopBar({ title, onTitleChange, connection, pending, onUndo, onRedo, canUndo, canRedo, clientId }: Props) {
  const dot = connection === 'connected' ? 'bg-[#2F6E4F]' : connection === 'offline' ? 'bg-[#A34632]' : 'bg-zinc-400 animate-pulse';
  const label = connection === 'loading' ? 'Đang tải…' : connection === 'connected' ? 'Đã kết nối · RGA sync' : `Offline · ${pending} chờ gửi`;
  return (
    <div className="h-12 border-b flex items-center gap-3 px-6" style={{ borderColor: 'var(--hairline)', background: 'var(--paper)' }}>
      <input value={title} onChange={(e) => onTitleChange(e.target.value)} className="flex-1 min-w-0 max-w-[520px] bg-transparent font-mono text-sm tracking-tight placeholder:text-zinc-400 focus:outline-none px-2 py-1 border border-transparent focus:border-[var(--hairline)] focus:bg-white" placeholder="Untitled document" />
      <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className={connection === 'offline' ? 'text-[#A34632]' : 'text-zinc-600'}>{label}</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1 font-mono">
        <button onClick={onUndo} disabled={!canUndo} className="h-7 w-7 grid place-items-center border text-xs disabled:opacity-30 hover:bg-white" style={{ borderColor: 'var(--hairline)' }} title="Undo local">↶</button>
        <button onClick={onRedo} disabled={!canRedo} className="h-7 w-7 grid place-items-center border text-xs disabled:opacity-30 hover:bg-white" style={{ borderColor: 'var(--hairline)' }} title="Redo local">↷</button>
      </div>
      <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="h-7 px-3 border bg-white font-mono text-xs hover:bg-zinc-50" style={{ borderColor: 'var(--hairline)' }}>Share</button>
      <div className="h-7 w-7 rounded-full grid place-items-center text-xs font-mono text-white border-2 border-white" style={{ background: 'var(--ink)' }} title={clientId}>{clientId.slice(-2).toUpperCase()}</div>
    </div>
  );
}
