'use client';
import { useRef } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelectionChange: (sel: { text: string; range: { start: number; end: number } } | null) => void;
  offline: boolean;
};

export function Editor({ value, onChange, onSelectionChange, offline }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const handleSelect = () => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    if (s !== e) {
      const text = value.slice(s, e);
      if (text.trim().length > 1) { onSelectionChange({ text, range: { start: s, end: e } }); return; }
    }
    onSelectionChange(null);
  };
  return (
    <div className="border bg-white" style={{ borderColor: offline ? '#A34632' : 'var(--hairline)' }}>
      <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--hairline)' }}>
        <div className="font-mono text-xs text-zinc-500">Bạn có thể gõ ngay cả khi offline — sẽ tự flush khi có mạng</div>
        {offline && <div className="font-mono text-xs text-[#A34632]">Offline · viền #A34632</div>}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        onKeyUp={handleSelect}
        onMouseUp={handleSelect}
        placeholder="Bắt đầu gõ… CRDT RGA + Rope, nhiều người gõ cùng lúc không xung đột."
        className="w-full min-h-[62vh] bg-transparent p-6 font-mono text-sm leading-7 placeholder:text-zinc-400 focus:outline-none resize-none"
        spellCheck={false}
      />
      <div className="px-4 py-2 border-t flex gap-4 font-mono text-xs text-zinc-400" style={{ borderColor: 'var(--hairline)' }}>
        <span>{value.length} chars</span>
        <span>·</span>
        <span>Local undo/redo chỉ của bạn</span>
      </div>
    </div>
  );
}
