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
  const dot = connection === 'connected' ? 'bg-emerald-500' : connection === 'offline' ? 'bg-amber-500' : 'bg-zinc-400 animate-pulse';
  const label =
    connection === 'loading' ? 'Đang tải…' : connection === 'connected' ? 'Đã kết nối' : `Offline · ${pending} thay đổi đang chờ`;

  return (
    <div className="h-14 border-b border-zinc-200 bg-white flex items-center gap-3 px-4">
      {/* Title editable */}
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="min-w-0 flex-1 max-w-[520px] bg-transparent text-[15px] font-medium tracking-tight placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 rounded px-2 py-1 border border-transparent focus:border-zinc-200"
        placeholder="Untitled document"
      />

      {/* Connection */}
      <div className="hidden sm:flex items-center gap-2 text-xs">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className={connection === 'offline' ? 'text-amber-700' : 'text-zinc-600'}>{label}</span>
      </div>

      <div className="flex-1" />

      {/* Undo / Redo local */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8 grid place-items-center rounded border border-zinc-200 bg-white text-zinc-700 disabled:opacity-40 hover:bg-zinc-50"
          title="Undo (chỉ của bạn)"
        >
          ↶
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8 grid place-items-center rounded border border-zinc-200 bg-white text-zinc-700 disabled:opacity-40 hover:bg-zinc-50"
          title="Redo"
        >
          ↷
        </button>
      </div>

      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
        }}
        className="h-8 px-3 rounded bg-zinc-900 text-white text-sm hover:bg-black"
      >
        Share
      </button>

      {/* Avatar small - presence minimal */}
      <div className="h-7 w-7 rounded-full bg-zinc-900 text-white grid place-items-center text-[10px] font-medium" title={clientId}>
        {clientId.slice(-2).toUpperCase()}
      </div>
    </div>
  );
}
