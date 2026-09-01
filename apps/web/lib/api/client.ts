// SmartTobi API Client - typed fetch with Next.js cache tags
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8080';

export type Campaign = {
  id: number; productId: number; stockTotal: number; stockRemaining: number;
  startAt: string; endAt: string; maxPerUser: number; status: string;
};

export type QueueTicket = { ticketId: string; position: number; status: string };
export type JoinResult = { status: 'HOLD_CREATED'|'QUEUED'|'SOLD_OUT'|'LIMIT_EXCEEDED'; holdId?: string; ticketId?: string; position?: number };

export async function fetchCampaign(id: string): Promise<Campaign> {
  const res = await fetch(`${API_URL}/api/flash/campaigns/${id}`, { next: { tags: [`flash:${id}`] } });
  if (!res.ok) throw new Error('Campaign not found');
  return res.json();
}

export async function joinFlash(campaignId: string, quantity: number, token?: string): Promise<JoinResult> {
  const res = await fetch(`${API_URL}/api/flash/${campaignId}/join?quantity=${quantity}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return res.json();
}

export async function getQueuePosition(ticketId: string): Promise<QueueTicket> {
  const res = await fetch(`${API_URL}/api/flash/queue/${ticketId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Ticket not found');
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error('Login failed');
  return res.json() as Promise<{ accessToken: string; refreshToken: string; userId: number }>;
}

export async function register(email: string, password: string, displayName: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, displayName }) });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}
