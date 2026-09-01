// SmartTobi Flash Campaign - PPR + RSC streaming + Client Join
import { Suspense } from 'react';
import { FlashJoin } from '../../../../components/flash/FlashJoin';

export const revalidate = 5;

export default async function FlashPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Flash Sale #{campaignId} <span className="text-zinc-400 font-normal">· flash.smart.tobi</span></h1>
      <Suspense fallback={<div className="text-sm text-zinc-500">Đang tải campaign...</div>}>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">Campaign info · ISR 5s · Stock Redis Lua + DB optimistic lock</div>
      </Suspense>
      <FlashJoin campaignId={campaignId} />
      <p className="text-xs text-zinc-400">Flow: Join → HOLD_CREATED (10m TTL) hoặc QUEUED (ZSet FIFO) → checkout</p>
    </div>
  );
}
