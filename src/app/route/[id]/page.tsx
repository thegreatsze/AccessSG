'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AccessibleRoute } from '@/lib/types';
import RouteCard from '@/components/RouteCard';
import AccessibilityBadge from '@/components/AccessibilityBadge';
import { ArrowLeft, AlertTriangle, Clock, Footprints, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Logo from '@/components/Logo';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

function buildRouteSummary(route: AccessibleRoute): string {
  const steps = route.legs.map((leg) => {
    switch (leg.mode) {
      case 'walk':   return `walk ${leg.distance}m to ${leg.to}`;
      case 'bus':    return `take Bus ${leg.serviceNo ?? ''} from ${leg.from} to ${leg.to}`;
      case 'mrt':    return `take MRT from ${leg.from} to ${leg.to}`;
      case 'lrt':    return `take LRT from ${leg.from} to ${leg.to}`;
      default:       return `${leg.mode} from ${leg.from} to ${leg.to}`;
    }
  });
  return `${route.legs.length} step${route.legs.length !== 1 ? 's' : ''}: ${steps.join('; ')}.`;
}

export default function RoutePage() {
  const searchParams = useSearchParams();
  const routeData = searchParams.get('data');
  const [guideOpen, setGuideOpen] = useState(false);

  const route: AccessibleRoute | null = useMemo(() => {
    if (!routeData) return null;
    try { return JSON.parse(decodeURIComponent(routeData)); }
    catch { return null; }
  }, [routeData]);

  if (!route) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No route data found.</p>
          <Link href="/plan" className="text-green-700 underline font-semibold">Plan a new trip</Link>
        </div>
      </main>
    );
  }

  const isVisual = route.profile.type === 'visual';
  const routeSummary = buildRouteSummary(route);

  const mapCenter: [number, number] = [route.origin.lat, route.origin.lng];
  const polylines = route.legs.map((leg) => ({
    positions: leg.polyline || [],
    color: '#FF2D78', // bright pink — distinct from every Singapore MRT line colour
  }));

  return (
    <main id="main-content" className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Logo variant="light" size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-200 truncate">
              {route.origin.name} → {route.destination.name}
            </p>
          </div>
          <AccessibilityBadge score={route.accessibilityScore} />
        </div>
      </header>

      {/* Visible route summary for visually impaired profile */}
      {isVisual && (
        <section
          aria-labelledby="text-summary-heading"
          className="bg-blue-50 border-l-4 border-blue-500 px-4 py-3 max-w-lg mx-auto w-full"
        >
          <h2 id="text-summary-heading" className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
            Route summary
          </h2>
          <p className="text-sm text-blue-900 leading-relaxed">{routeSummary}</p>
        </section>
      )}

      {/* Map — with sr-only text alternative for screen readers */}
      <div
        className="bg-gray-200 relative"
        style={{ height: 'clamp(220px, 45vw, 360px)' }}
        role="img"
        aria-label={`Route map. ${routeSummary}`}
      >
        <Map center={mapCenter} zoom={14} polylines={polylines} />
      </div>

      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span><strong>{route.totalDuration}</strong> min</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Footprints className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span><strong>{route.totalWalkDistance}</strong>m walking</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Score:</span>
            <span className={`font-bold ${route.accessibilityScore >= 80 ? 'text-green-700' : route.accessibilityScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {route.accessibilityScore}/100
            </span>
          </div>
        </div>

        {/* Warnings */}
        {route.warnings.length > 0 && (
          <section aria-labelledby="warnings-heading" className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h2 id="warnings-heading" className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Accessibility warnings
            </h2>
            <ul className="space-y-1" aria-live="polite">
              {route.warnings.map((w, i) => (
                <li key={i} className="text-sm text-amber-900">• {w}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Route legs */}
        <section aria-labelledby="legs-heading">
          <h2 id="legs-heading" className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Step-by-step directions</h2>
          <ol className="space-y-3">
            {route.legs.map((leg, i) => (
              <li key={i}>
                <RouteCard leg={leg} stepNumber={i + 1} profileType={route.profile.type} />
              </li>
            ))}
          </ol>
        </section>

        {/* Scoring guide */}
        <section aria-labelledby="guide-heading" className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            id="guide-heading"
            onClick={() => setGuideOpen((o) => !o)}
            aria-expanded={guideOpen}
            aria-controls="guide-body"
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-400" aria-hidden="true" />
              How are scores and labels calculated?
            </span>
            {guideOpen
              ? <ChevronUp className="w-4 h-4 text-gray-400" aria-hidden="true" />
              : <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />}
          </button>

          {guideOpen && (
            <div id="guide-body" className="px-4 pb-4 space-y-4 text-sm text-gray-700 border-t border-gray-100">

              <div className="pt-3 space-y-1">
                <p className="font-semibold">What does "Barrier-free" mean?</p>
                <p className="text-gray-600">A stop, station, or path is barrier-free when it has no physical obstacles — no steps, no narrow turnstiles — so a wheelchair, PMA, or mobility aid can pass through without assistance.</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold">What do the badge labels mean?</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">✓ Accessible</span>
                    <span className="text-gray-600">Score 80–100: ticks most accessibility criteria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">⚠ Partial</span>
                    <span className="text-gray-600">Score 50–79: some barriers present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">✗ Barriers</span>
                    <span className="text-gray-600">Score 0–49: significant accessibility barriers</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold">How is the score calculated?</p>
                <p className="text-gray-600">Each leg starts at 100 and loses points for accessibility gaps:</p>
                <ul className="mt-1 space-y-0.5 text-gray-600 pl-3">
                  <li><span className="font-medium text-gray-700">Walk leg:</span> &gt;500m walk −20 pts · &gt;800m −20 more pts · not sheltered −10 pts</li>
                  <li><span className="font-medium text-gray-700">Bus leg:</span> non-barrier-free stop −30 pts · no wheelchair bus (WAB) −20 pts</li>
                  <li><span className="font-medium text-gray-700">MRT/LRT leg:</span> no lift at station −40 pts · not barrier-free −30 pts</li>
                </ul>
                <p className="text-gray-500 mt-1">The overall route score is the average across all legs.</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold">Why is there a short walk at the end?</p>
                <p className="text-gray-600">Routing places your destination at its exact geocoded address pin. If that pin is a station entrance or building address, transit deposits you at the nearest platform exit — and the remaining few metres is a genuine walk to reach that exact point. This is normal and expected.</p>
              </div>

            </div>
          )}
        </section>

        <p className="text-xs text-gray-400 text-center pb-4">
          Accessibility data curated by AccessSG · Routing by OneMap (SLA)
        </p>
      </div>
    </main>
  );
}
