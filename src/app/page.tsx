'use client';

import { useProfileStore, applyProfileDefaults } from '@/store/profile';
import ProfileSelector from '@/components/ProfileSelector';
import Logo from '@/components/Logo';
import { AccessibilityProfile } from '@/lib/types';
import { Navigation, Info } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { profile, setProfile } = useProfileStore();

  const handleProfileChange = (type: AccessibilityProfile['type']) => {
    const defaults = applyProfileDefaults(type);
    setProfile(defaults);
  };

  return (
    <main id="main-content" className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white px-4 py-4 safe-top">
        <div className="max-w-lg mx-auto">
          <Logo variant="light" size="md" />
          <p className="text-green-200 text-sm mt-1 ml-1">Trip planner for accessible journeys</p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Profile selection */}
        <section aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="text-lg font-semibold mb-3">Please select your accessibility profile</h2>
          <ProfileSelector selected={profile.type} onChange={handleProfileChange} />
        </section>

        {/* Preferences summary */}
        <section aria-labelledby="prefs-heading" className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <h2 id="prefs-heading" className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active preferences</h2>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <span>Max walk distance</span>
              <span className="font-medium">{profile.maxWalkDistance}m</span>
            </li>
            <li className="flex justify-between">
              <span>Avoid stairs</span>
              <span className={`font-medium ${profile.avoidStairs ? 'text-green-700' : 'text-gray-500'}`}>{profile.avoidStairs ? 'Yes' : 'No'}</span>
            </li>
            <li className="flex justify-between">
              <span>Prefer sheltered paths</span>
              <span className={`font-medium ${profile.preferSheltered ? 'text-green-700' : 'text-gray-500'}`}>{profile.preferSheltered ? 'Yes' : 'No'}</span>
            </li>
            <li className="flex justify-between">
              <span>Require lift access</span>
              <span className={`font-medium ${profile.requireLift ? 'text-green-700' : 'text-gray-500'}`}>{profile.requireLift ? 'Yes' : 'No'}</span>
            </li>
          </ul>
        </section>

        {/* Plan a trip CTA */}
        <Link
          href="/plan"
          className="flex items-center justify-center gap-3 w-full bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl px-6 py-4 text-lg transition-colors focus-visible:ring-4 focus-visible:ring-green-300"
          aria-label="Plan an accessible trip"
        >
          <Navigation className="w-5 h-5" aria-hidden="true" />
          Plan a Trip
        </Link>

        {/* Quick info */}
        <section className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-green-900">
            <p className="font-semibold">About AccessSG</p>
            <p className="mt-1">Routes are checked against our curated database of MRT lift locations, wheelchair-accessible buses, and barrier-free bus stops across Singapore.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
