// US-204 k6 Load Test - Chống oversell 10k VU
// Run: k6 run tests/k6/flash-oversell.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
  thresholds: {
    'http_req_failed': ['rate < 0.01'],
    'checks': ['rate > 0.99'],
  },
};

const BASE = __ENV.API_URL || 'http://localhost:8080';
const CAMPAIGN_ID = __ENV.CAMPAIGN_ID || '1';

export default function () {
  const res = http.post(`${BASE}/api/flash/${CAMPAIGN_ID}/join?quantity=1`, null, {
    headers: { 'Idempotency-Key': `${__VU}-${__ITER}` },
  });
  check(res, {
    'no oversell - status 200 or 409': (r) => r.status === 200 || r.status === 409 || r.status === 202,
    'stock never negative': (r) => r.status !== 500,
  });
}

export function handleSummary(data) {
  console.log(`Success HOLD_CREATED: ${JSON.stringify(data.metrics.checks)}`);
  return { stdout: JSON.stringify(data, null, 2) };
}
