import { AccessibilityProfile, RouteLeg } from '@/lib/types';
import AccessibilityBadge from './AccessibilityBadge';
import { MapPin, Bus, Train, PersonStanding, Clock, ArrowRight } from 'lucide-react';
import { scoreRouteLeg } from '@/lib/accessibility';

interface Props {
  leg: RouteLeg;
  stepNumber: number;
  profileType?: AccessibilityProfile['type'];
}

const WHEEL_PROFILES = new Set<AccessibilityProfile['type']>(['wheelchair', 'pma']);

const modeIcons: Record<RouteLeg['mode'], React.ReactNode> = {
  walk: <PersonStanding className="w-4 h-4" aria-hidden="true" />,
  bus: <Bus className="w-4 h-4" aria-hidden="true" />,
  mrt: <Train className="w-4 h-4" aria-hidden="true" />,
  lrt: <Train className="w-4 h-4" aria-hidden="true" />,
  taxi: <MapPin className="w-4 h-4" aria-hidden="true" />,
};

const modeColors: Record<RouteLeg['mode'], string> = {
  walk: 'bg-blue-100 text-blue-800',
  bus: 'bg-orange-100 text-orange-800',
  mrt: 'bg-purple-100 text-purple-800',
  lrt: 'bg-indigo-100 text-indigo-800',
  taxi: 'bg-yellow-100 text-yellow-800',
};

export default function RouteCard({ leg, stepNumber, profileType }: Props) {
  const score = scoreRouteLeg(leg);
  const isWheelchair = profileType ? WHEEL_PROFILES.has(profileType) : false;
  const walkLabel = isWheelchair ? 'TRAVEL' : 'WALK';
  const walkVerb  = isWheelchair ? 'Travel' : 'Walk';

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-4" aria-label={`Step ${stepNumber}: ${leg.instructions}`}>
      <div className="flex items-start gap-3">
        {/* Step number */}
        <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" aria-hidden="true">
          {stepNumber}
        </div>

        <div className="flex-1 min-w-0">
          {/* Mode + service */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${modeColors[leg.mode]}`}>
              {modeIcons[leg.mode]}
              {leg.mode === 'walk' ? walkLabel : leg.mode.toUpperCase()}
              {leg.serviceNo ? ` ${leg.serviceNo}` : ''}
            </span>
            <AccessibilityBadge score={score} size="sm" showLabel />
          </div>

          {/* Instruction */}
          <p className="text-sm font-medium text-gray-900">{leg.instructions}</p>

          {/* From → To */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3" aria-hidden="true" />
            <span className="truncate">{leg.from}</span>
            <ArrowRight className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{leg.to}</span>
          </div>

          {/* Duration + distance */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {leg.duration} min
            </span>
            {leg.distance > 0 && <span>{leg.distance}m</span>}
          </div>

          {/* Accessibility details */}
          <div className="flex gap-3 mt-2 flex-wrap">
            {leg.accessibility.barrierFree && (
              <span className="text-xs text-green-700 font-medium" title="No steps or narrow turnstiles — wheelchair and mobility aid accessible">♿ Barrier-free</span>
            )}
            {leg.accessibility.liftAvailable && (
              <span className="text-xs text-green-700 font-medium">🛗 Lift available</span>
            )}
            {leg.accessibility.wheelchairBus && (
              <span className="text-xs text-green-700 font-medium">🚌 WAB</span>
            )}
            {leg.accessibility.sheltered && (
              <span className="text-xs text-blue-700 font-medium">☂ Sheltered</span>
            )}
          </div>

          {/* Walk-to-destination note */}
          {leg.mode === 'walk' && leg.distance > 0 && (
            <p className="text-xs text-gray-400 mt-2 leading-snug">
              {walkVerb} distance is measured to the exact geocoded point of the destination. If your destination is a transit stop, this covers the gap between the platform exit and the entrance/address pin.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
