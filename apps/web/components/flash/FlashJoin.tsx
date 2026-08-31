'use client';
import { useState } from 'react';
import { joinFlash } from '@/lib/api/client';
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
      <button onClick={onJoin} disabled={loading} className="bg-red-600 text-white px-6 py-3 rounded">
        {loading ? 'Joining...' : 'Tham gia Flash Sale'}
      </button>
      {result && (
        <div className="p-4 border">
          <div>Status: {result.status}</div>
          {result.holdId && <div className="text-green-600">Hold: {result.holdId} (10 phút) - Countdown...</div>}
          {result.ticketId && <QueuePoller ticketId={result.ticketId} />}
        </div>
      )}
    </div>
  );
}
