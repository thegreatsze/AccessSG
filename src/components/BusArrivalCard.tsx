'use client';

import { useBusArrival } from '@/hooks/useBusArrival';
import { BusArrival } from '@/lib/types';
import { Loader2, RefreshCw } from 'lucide-react';

interface Props {
  busStopCode: string;
  stopName?: string;
}

const loadLabels: Record<string, string> = {
  SEA: 'Seats available',
  SDA: 'Standing available',
  LSD: 'Limited standing',
  '': 'Unknown load',
};

function timeDiff(isoTime: string): string {
  if (!isoTime) return '—';
  const diff = Math.round((new Date(isoTime).getTime() - Date.now()) / 60000);
  if (diff <= 0) return 'Arr';
  return `${diff} min`;
}

function ArrivalChip({ timing, isFirst }: { timing: BusArrival['nextBus']; isFirst?: boolean }) {
  if (!timing?.estimatedArrival) return null;
  const isWAB = timing.feature === 'WAB';
  const time = timeDiff(timing.estimatedArrival);
  return (
    <div className={`flex flex-col items-center px-2 py-1 rounded-lg ${isFirst ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
      <span className={`text-xs font-bold ${isFirst ? 'text-green-700' : 'text-gray-600'}`}>{time}</span>
      {isWAB && <span className="text-xs text-green-700 font-semibold" aria-label="Wheelchair accessible bus">♿WAB</span>}
      <span className="text-xs text-gray-400">{loadLabels[timing.load]?.split(' ')[0]}</span>
    </div>
  );
}

export default function BusArrivalCard({ busStopCode, stopName }: Props) {
  const { arrivals, isLoading, error } = useBusArrival(busStopCode);

  return (
    <section aria-labelledby={`arrivals-${busStopCode}`} className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 id={`arrivals-${busStopCode}`} className="text-sm font-semibold">
          {stopName || `Stop ${busStopCode}`}
        </h3>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" aria-label="Loading bus arrivals" />}
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <RefreshCw className="w-3 h-3" aria-hidden="true" /> 30s
        </span>
      </div>

      {error && <p className="text-xs text-red-600">{error.message}</p>}

      {arrivals.length === 0 && !isLoading && (
        <p className="text-sm text-gray-500 italic">No arrivals data.</p>
      )}

      <ul className="space-y-2" aria-live="polite" aria-label="Bus arrivals">
        {arrivals.slice(0, 5).map((arrival) => (
          <li key={arrival.serviceNo} className="flex items-center gap-3">
            <span className="w-12 text-sm font-bold text-gray-900">{arrival.serviceNo}</span>
            <div className="flex gap-1.5">
              <ArrivalChip timing={arrival.nextBus} isFirst />
              <ArrivalChip timing={arrival.nextBus2} />
              <ArrivalChip timing={arrival.nextBus3} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
