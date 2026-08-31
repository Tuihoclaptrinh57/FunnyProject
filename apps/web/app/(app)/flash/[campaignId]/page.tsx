// SmartTobi Flash Campaign - PPR + RSC streaming + Client Join
import { Suspense } from 'react';
import { FlashJoin } from '@/components/flash/FlashJoin';

export const revalidate = 5;

export default function FlashPage({ params }: { params: { campaignId: string } }) {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Flash Sale #{params.campaignId} - flash.smart.tobi</h1>
      <Suspense fallback={<div>Loading campaign...</div>}>
        <div className="p-4 border bg-yellow-50">Campaign info (ISR 5s) - stock via Redis Lua</div>
      </Suspense>
      <FlashJoin campaignId={params.campaignId} />
      <p className="text-sm text-gray-500">Flow: Join -> HOLD_CREATED (10m) or QUEUED (ZSet) -> checkout</p>
    </div>
  );
}
