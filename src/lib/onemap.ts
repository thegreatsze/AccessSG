import { SearchResultItem } from './types';

const ONEMAP_BASE = 'https://www.onemap.gov.sg';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getOneMapToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  // If a pre-obtained token is set in env, use it directly
  const envToken = process.env.ONEMAP_TOKEN;
  if (envToken) {
    // Parse the JWT expiry from the payload
    try {
      const payload = JSON.parse(Buffer.from(envToken.split('.')[1], 'base64').toString());
      cachedToken = envToken;
      tokenExpiry = payload.exp * 1000 - 3600000; // 1 hour before expiry
      return cachedToken;
    } catch {
      // Fall through to password auth if JWT is malformed
    }
  }

  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD;

  if (!email || !password) {
    throw new Error('OneMap credentials not configured — set ONEMAP_TOKEN or ONEMAP_EMAIL+ONEMAP_PASSWORD');
  }

  const res = await fetch(`${ONEMAP_BASE}/api/auth/post/getToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(`OneMap auth failed: ${res.status}`);

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expiry_timestamp * 1000) - 3600000;

  return cachedToken!;
}

export async function searchOneMap(query: string): Promise<SearchResultItem[]> {
  const url = `${ONEMAP_BASE}/api/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OneMap search failed: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function getRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  maxWalkDistance: number = 500
) {
  const token = await getOneMapToken();
  const url = `${ONEMAP_BASE}/api/public/routingsvc/route?` +
    `start=${startLat},${startLng}&end=${endLat},${endLng}` +
    `&routeType=pt&mode=TRANSIT&maxWalkDistance=${maxWalkDistance}` +
    `&date=${getTodayDate()}&time=${getCurrentTime()}&numItineraries=3`;

  const res = await fetch(url, {
    headers: { Authorization: token },
  });

  if (!res.ok) throw new Error(`OneMap routing failed: ${res.status}`);
  return res.json();
}

function getTodayDate(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
}

function getCurrentTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
}
