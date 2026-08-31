'use client';
import { useEffect, useState } from 'react';
import { getQueuePosition } from '@/lib/api/client';

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

  if (pos === null) return <div>Loading queue...</div>;
  return <div className="p-4 border">Queue: position {pos} - {status} {pos===0 && '-> Ready to hold!'}</div>;
}
