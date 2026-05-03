'use client';

import { Station } from '@/lib/types';
import { CheckCircle, XCircle, Elevator } from 'lucide-react';
import { useBusArrival } from '@/hooks/useBusArrival';

interface Props {
  station: Station;
}

export default function StationDetail({ station }: Props) {
  const operationalLifts = station.lifts.filter((l) => l.operational);
  const downLifts = station.lifts.filter((l) => !l.operational);

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-2 gap-3">
        <FeatureRow icon="🛗" label="Lifts" value={`${operationalLifts.length} operational`} ok={operationalLifts.length > 0} />
        <FeatureRow icon="♿" label="BF exits" value={station.barrierFreeExits.join(', ') || 'None'} ok={station.barrierFreeExits.length > 0} />
        <FeatureRow icon="🚻" label="Accessible toilet" value={station.accessibleToilet ? 'Available' : 'Not listed'} ok={station.accessibleToilet} />
        <FeatureRow icon="🦯" label="Tactile guides" value={station.tactileGuides ? 'Present' : 'Not listed'} ok={station.tactileGuides} />
        <FeatureRow icon="🔊" label="Hearing loop" value={station.hearingLoop ? 'Available' : 'Not listed'} ok={station.hearingLoop} />
      </div>

      {/* Lifts */}
      <section aria-labelledby="lifts-heading">
        <h2 id="lifts-heading" className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Lift locations</h2>
        <div className="space-y-2">
          {station.lifts.map((lift) => (
            <div key={lift.exitCode} className={`bg-white rounded-xl border p-3 flex gap-3 ${lift.operational ? 'border-green-200' : 'border-red-200 bg-red-50'}`}>
              <span className="text-xl" aria-hidden="true">🛗</span>
              <div>
                <p className="text-sm font-semibold">{lift.exitCode}</p>
                <p className="text-xs text-gray-600">{lift.description}</p>
                <p className={`text-xs font-medium mt-0.5 ${lift.operational ? 'text-green-700' : 'text-red-700'}`}>
                  {lift.operational ? '✓ Operational' : '✗ Out of service'}
                </p>
              </div>
            </div>
          ))}
          {station.lifts.length === 0 && (
            <p className="text-sm text-gray-500 italic">No lift data available for this station.</p>
          )}
        </div>
      </section>

      {downLifts.length > 0 && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
          ⚠️ {downLifts.length} lift(s) currently out of service at this station. Check alternative exits.
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">Data curated by AccessSG. Last survey: verify on-site.</p>
    </div>
  );
}

function FeatureRow({ icon, label, value, ok }: { icon: string; label: string; value: string; ok: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{icon} {label}</span>
      <span className={`text-sm font-medium ${ok ? 'text-gray-900' : 'text-gray-400'}`}>{value}</span>
    </div>
  );
}
