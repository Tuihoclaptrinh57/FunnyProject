// SmartTobi Flash Page - PPR + Streaming + Server Actions
// Domain: flash.smart.tobi
import { Suspense } from 'react';

export const revalidate = 5; // ISR 5s for campaign

async function FlashCampaign({ campaignId }: { campaignId: string }) {
  // fetch with Data Cache + tags - Next.js 4-tier cache
  const res = await fetch(`${process.env.API_URL}/api/flash/${campaignId}/stock`, {
    next: { tags: [`flash:${campaignId}`] }
  });
  // const stock = await res.json();
  return <div>Flash Campaign {campaignId} - Stock streaming...</div>;
}

export default function Page({ params }: { params: { campaignId: string } }) {
  return (
    <Suspense fallback={<div>Loading campaign...</div>}>
      <FlashCampaign campaignId={params.campaignId} />
    </Suspense>
  );
}
