'use client';
import { useEffect, useState } from 'react';

// Demo: 2 cursors typing interleaved, converge to one sentence. Runs once on load.
const finalText = 'Gõ cùng lúc. Không xung đột.';

export function CollabHero() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const partA = 'Gõ cùng lúc. ';
    const partB = 'Không xung đột.';
    let i = 0;
    let j = 0;
    let raf: number;

    const tick = () => {
      // interleave: A types 1, B types 1
      if (i < partA.length) {
        setA(partA.slice(0, i + 1));
        i++;
        setTimeout(tick, 90);
      } else if (j < partB.length) {
        setB(partB.slice(0, j + 1));
        j++;
        setTimeout(tick, 90);
      } else {
        setDone(true);
      }
    };
    const t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="font-mono text-[28px] sm:text-[36px] leading-tight tracking-tight">
      <span className="text-[11px] tracking-widest text-zinc-500 block mb-3">CRDT · RGA · Live demo</span>
      <div className="flex flex-wrap gap-1">
        <span>
          {a}
          {!done && a.length < 'Gõ cùng lúc. '.length && <span className="inline-block w-[2px] h-[1em] bg-[#2F6E4F] translate-y-1 animate-pulse ml-0.5" />}
        </span>
        <span className="text-[#A34632]">
          {b}
          {!done && b.length > 0 && b.length < 'Không xung đột.'.length && <span className="inline-block w-[2px] h-[1em] bg-[#A34632] translate-y-1 animate-pulse ml-0.5" />}
        </span>
      </div>
      {done && <div className="mt-3 text-sm font-sans text-zinc-600">2 con trỏ · 1 câu · hội tụ — đúng như engine đang làm</div>}
    </div>
  );
}
