'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import stationsData from '@/data/stations.json';
import { Station } from '@/lib/types';
import StationDetail from '@/components/StationDetail';
import Logo from '@/components/Logo';

export default function StationPage() {
  const { code } = useParams<{ code: string }>();
  const station = (stationsData as Station[]).find(
    (s) => s.codes.some((c) => c.toLowerCase() === code.toLowerCase()) || s.id.toLowerCase() === code.toLowerCase()
  );

  if (!station) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Station not found.</p>
          <Link href="/" className="text-green-700 underline font-semibold">Go home</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Logo variant="light" size="sm" />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight">{station.name} MRT</h1>
            <p className="text-green-200 text-xs">{station.codes.join(' / ')} · {station.line.join(', ')}</p>
          </div>
        </div>
      </header>
      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        <StationDetail station={station} />
      </div>
    </main>
  );
}
