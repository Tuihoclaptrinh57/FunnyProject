'use client';
import { useEffect, useState } from 'react';
import { getQueuePosition } from '../../lib/api/client';

export function QueuePoller({ ticketId }: { ticketId: string }) {
  const [pos, setPos] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function poll() {
      try {
        const data = await getQueuePosition(ticketId);
        setPos(data.position);
        setStatus(data.status);
        if (data.status === 'WAITING' && data.position > 0) {
          timer = setTimeout(poll, 2000); // poll 2s
        }
      } catch {}
    }
    poll();
    return () => clearTimeout(timer);
  }, [ticketId]);

  if (pos === null) return <div className="text-sm text-zinc-500">Đang tải vị trí hàng chờ...</div>;
  return <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm">Hàng chờ: vị trí <span className="font-medium">{pos}</span> - {status} {pos===0 && <span className="text-zinc-900">→ Sẵn sàng giữ hàng!</span>}</div>;
}
