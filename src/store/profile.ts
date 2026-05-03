import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccessibilityProfile } from '@/lib/types';

interface ProfileStore {
  profile: AccessibilityProfile;
  setProfile: (profile: Partial<AccessibilityProfile>) => void;
}

const defaults: Record<AccessibilityProfile['type'], Partial<AccessibilityProfile>> = {
  wheelchair: { maxWalkDistance: 300, avoidStairs: true, preferSheltered: true, requireLift: true },
  pma:        { maxWalkDistance: 300, avoidStairs: true, preferSheltered: true, requireLift: true },
  elderly:    { maxWalkDistance: 500, avoidStairs: true, preferSheltered: true, requireLift: false },
  visual:     { maxWalkDistance: 600, avoidStairs: false, preferSheltered: false, requireLift: false },
  custom:     { maxWalkDistance: 500, avoidStairs: false, preferSheltered: false, requireLift: false },
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: {
        type: 'custom',
        maxWalkDistance: 500,
        avoidStairs: false,
        preferSheltered: false,
        requireLift: false,
      },
      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
    }),
    { name: 'accesssg-profile' }
  )
);

export function applyProfileDefaults(type: AccessibilityProfile['type']): AccessibilityProfile {
  return { type, maxWalkDistance: 500, avoidStairs: false, preferSheltered: false, requireLift: false, ...defaults[type] };
}

export const PROFILE_LABELS: Record<AccessibilityProfile['type'], string> = {
  wheelchair: 'Wheelchair / PMA',
  pma:        'PMA',
  elderly:    'Elderly',
  visual:     'Visual Impairment',
  custom:     'Custom',
};
