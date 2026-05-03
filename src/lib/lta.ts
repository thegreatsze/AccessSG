const LTA_BASE = 'https://datamall2.mytransport.sg/ltaodataservice';

function getHeaders() {
  const key = process.env.LTA_ACCOUNT_KEY;
  if (!key) throw new Error('LTA_ACCOUNT_KEY not configured');
  return { AccountKey: key, Accept: 'application/json' };
}

export async function getBusArrivals(busStopCode: string) {
  const res = await fetch(`${LTA_BASE}/v3/BusArrival?BusStopCode=${busStopCode}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`LTA bus arrival failed: ${res.status}`);
  return res.json();
}

export async function getTaxiStands() {
  const res = await fetch(`${LTA_BASE}/TaxiStands`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`LTA taxi stands failed: ${res.status}`);
  return res.json();
}

export async function getTrainAlerts() {
  const res = await fetch(`${LTA_BASE}/TrainServiceAlerts`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`LTA train alerts failed: ${res.status}`);
  return res.json();
}

export async function getBusStops(skip: number = 0) {
  const res = await fetch(`${LTA_BASE}/BusStops?$skip=${skip}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`LTA bus stops failed: ${res.status}`);
  return res.json();
}
