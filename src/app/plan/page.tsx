'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore, PROFILE_LABELS } from '@/store/profile';
import SearchInput from '@/components/SearchInput';
import Logo from '@/components/Logo';
import { SearchResultItem } from '@/lib/types';
import { Navigation, Loader2 } from 'lucide-react';

export default function PlanPage() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [origin, setOrigin] = useState<SearchResultItem | null>(null);
  const [destination, setDestination] = useState<SearchResultItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlan = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        startLat: origin.LATITUDE,
        startLng: origin.LONGITUDE,
        endLat: destination.LATITUDE,
        endLng: destination.LONGITUDE,
        profileType: profile.type,
        maxWalk: String(profile.maxWalkDistance),
        avoidStairs: String(profile.avoidStairs),
        preferSheltered: String(profile.preferSheltered),
        requireLift: String(profile.requireLift),
      });

      const res = await fetch(`/api/route?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to plan route');
      }
      const route = await res.json();
      router.push(`/route/${route.id}?data=${encodeURIComponent(JSON.stringify(route))}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <span className="text-green-200 text-xs">
            Profile: {PROFILE_LABELS[profile.type]}
          </span>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Plan a Trip</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-semibold text-gray-700 mb-1">
              From (origin)
            </label>
            <SearchInput
              id="origin"
              placeholder="Enter address, postal code, or landmark…"
              onSelect={setOrigin}
              aria-label="Enter your starting location"
            />
            {origin && (
              <p className="text-xs text-green-700 mt-1 truncate" aria-live="polite">
                Selected: {origin.ADDRESS}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-1">
              To (destination)
            </label>
            <SearchInput
              id="destination"
              placeholder="Enter address, postal code, or landmark…"
              onSelect={setDestination}
              aria-label="Enter your destination"
            />
            {destination && (
              <p className="text-xs text-green-700 mt-1 truncate" aria-live="polite">
                Selected: {destination.ADDRESS}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handlePlan}
          disabled={!origin || !destination || loading}
          className="flex items-center justify-center gap-3 w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-4 text-lg transition-colors"
          aria-label="Find accessible route"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Finding route…</>
          ) : (
            <><Navigation className="w-5 h-5" aria-hidden="true" /> Find Accessible Route</>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Routes powered by OneMap (SLA) · Accessibility data curated by AccessSG
        </p>
      </div>
    </main>
  );
}
