'use client';

import { AccessibilityProfile } from '@/lib/types';
import { useProfileStore } from '@/store/profile';

interface Props {
  selected: AccessibilityProfile['type'];
  onChange: (type: AccessibilityProfile['type']) => void;
}

const profiles: { type: AccessibilityProfile['type']; label: string; icon: string; description: string }[] = [
  { type: 'wheelchair', label: 'Wheelchair / PMA', icon: '♿', description: 'Requires lifts, barrier-free paths, wheelchair buses' },
  { type: 'elderly',   label: 'Elderly',           icon: '🧑‍🦳', description: 'Prefers lifts, shorter walks, sheltered paths' },
  { type: 'visual',    label: 'Visual Impairment', icon: '👁️', description: 'Tactile guides, audio announcements' },
  { type: 'custom',    label: 'Custom',            icon: '⚙️', description: 'Set your own accessibility preferences' },
];

const TOGGLE_OPTIONS = [
  { key: 'avoidStairs'      as const, label: 'Avoid stairs',           description: 'Prefer lifts and ramps over stairs' },
  { key: 'preferSheltered'  as const, label: 'Prefer sheltered paths',  description: 'Avoid open-air walkways where possible' },
  { key: 'requireLift'      as const, label: 'Require lift access',     description: 'Only routes with lifts at every station' },
];

export default function ProfileSelector({ selected, onChange }: Props) {
  const { profile, setProfile } = useProfileStore();

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Select accessibility profile">
      <div className="grid grid-cols-2 gap-2">
        {profiles.map((p) => (
          <button
            key={p.type}
            role="radio"
            aria-checked={selected === p.type}
            onClick={() => onChange(p.type)}
            className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left ${
              selected === p.type
                ? 'border-green-700 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-2xl mb-1" aria-hidden="true">{p.icon}</span>
            <span className={`text-sm font-semibold ${selected === p.type ? 'text-green-800' : 'text-gray-800'}`}>
              {p.label}
            </span>
            <span className="text-xs text-gray-500 mt-0.5 leading-snug">{p.description}</span>
          </button>
        ))}
      </div>

      {/* Custom profile controls */}
      {selected === 'custom' && (
        <div className="bg-white border-2 border-green-200 rounded-xl p-4 space-y-4" aria-label="Custom profile settings">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customise your preferences</p>

          {/* Max walk distance slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="max-walk-slider" className="text-sm font-medium text-gray-700">
                Max walking distance
              </label>
              <span className="text-sm font-bold text-green-700">{profile.maxWalkDistance}m</span>
            </div>
            <input
              id="max-walk-slider"
              type="range"
              min={100}
              max={1000}
              step={50}
              value={profile.maxWalkDistance}
              onChange={(e) => setProfile({ maxWalkDistance: Number(e.target.value) })}
              className="w-full accent-green-700 h-2 rounded-lg cursor-pointer"
              aria-label={`Maximum walking distance: ${profile.maxWalkDistance} metres`}
              aria-valuemin={100}
              aria-valuemax={1000}
              aria-valuenow={profile.maxWalkDistance}
              aria-valuetext={`${profile.maxWalkDistance} metres`}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>100m</span><span>500m</span><span>1000m</span>
            </div>
          </div>

          {/* Toggle switches */}
          <div className="space-y-3">
            {TOGGLE_OPTIONS.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={profile[key]}
                  onClick={() => setProfile({ [key]: !profile[key] })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ${
                    profile[key] ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                  aria-label={`${label}: ${profile[key] ? 'on' : 'off'}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profile[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
