'use client';
import { useState } from 'react';
import { joinFlash } from '../../lib/api/client';
import { QueuePoller } from './QueuePoller';

export function FlashJoin({ campaignId }: { campaignId: string }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function onJoin() {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') || undefined : undefined;
    const res = await joinFlash(campaignId, 1, token);
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <button onClick={onJoin} disabled={loading} className="h-10 px-6 rounded bg-zinc-900 text-white text-sm hover:bg-black disabled:opacity-50">
        {loading ? 'Đang tham gia...' : 'Tham gia Flash Sale'}
      </button>
      {result && (
        <div className="rounded border border-zinc-200 bg-white p-4 space-y-2">
          <div className="text-sm"><span className="text-zinc-500">Trạng thái:</span> <span className="font-medium">{result.status}</span></div>
          {result.holdId && <div className="text-sm">Hold: <span className="font-mono text-zinc-700">{result.holdId}</span> <span className="text-zinc-500">(10 phút)</span></div>}
          {result.ticketId && <QueuePoller ticketId={result.ticketId} />}
        </div>
      )}
    </div>
  );
}
