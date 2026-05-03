import useSWR from 'swr';
import { BusArrival } from '@/lib/types';

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch bus arrivals');
  return res.json();
}

export function useBusArrival(busStopCode: string | null) {
  const { data, error, isLoading } = useSWR<{ services: BusArrival[] }>(
    busStopCode ? `/api/bus-arrival?code=${busStopCode}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  return { arrivals: data?.services || [], error, isLoading };
}
