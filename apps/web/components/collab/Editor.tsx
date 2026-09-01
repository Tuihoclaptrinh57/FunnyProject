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
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start !== end) {
      const text = value.slice(start, end);
      if (text.trim().length > 1) {
        onSelectionChange({ text, range: { start, end } });
        return;
      }
    }
    onSelectionChange(null);
  };

  return (
    <div className={`rounded-lg border bg-white ${offline ? 'border-amber-300 ring-1 ring-amber-200' : 'border-zinc-200'} shadow-sm`}>
      <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
        <div className="text-xs text-zinc-500">Bạn có thể gõ ngay cả khi offline — thay đổi sẽ tự đồng bộ khi có mạng.</div>
        {offline && <div className="text-xs font-medium text-amber-700">Chế độ offline</div>}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        onKeyUp={handleSelect}
        onMouseUp={handleSelect}
        placeholder="Bắt đầu gõ… Hỗ trợ CRDT, nhiều người gõ cùng lúc không xung đột."
        className="w-full min-h-[62vh] bg-transparent p-6 font-mono text-[13.5px] leading-7 tracking-tight placeholder:text-zinc-400 focus:outline-none resize-none"
        spellCheck={false}
      />
      <div className="px-6 py-3 border-t border-zinc-100 text-xs text-zinc-400 flex gap-4">
        <span>{value.length} ký tự</span>
        <span>•</span>
        <span>Local undo/redo chỉ áp dụng cho bạn</span>
      </div>
    </div>
  );
}
