import { RouteLeg, AccessibilityProfile, AccessibleRoute } from './types';
import stationsData from '@/data/stations.json';

export function scoreRouteLeg(leg: RouteLeg): number {
  let score = 100;

  if (leg.mode === 'walk') {
    if (leg.distance > 500) score -= 20;
    if (leg.distance > 800) score -= 20;
    if (!leg.accessibility.sheltered) score -= 10;
  }

  if (leg.mode === 'bus') {
    if (!leg.accessibility.barrierFree) score -= 30;
    if (!leg.accessibility.wheelchairBus) score -= 20;
  }

  if (leg.mode === 'mrt' || leg.mode === 'lrt') {
    if (!leg.accessibility.liftAvailable) score -= 40;
    if (!leg.accessibility.barrierFree) score -= 30;
  }

  return Math.max(0, score);
}

export function scoreRoute(legs: RouteLeg[]): number {
  if (legs.length === 0) return 100;
  const scores = legs.map(scoreRouteLeg);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getScoreColor(score: number): 'green' | 'amber' | 'red' {
  if (score >= 80) return 'green';
  if (score >= 50) return 'amber';
  return 'red';
}

export function getRouteWarnings(legs: RouteLeg[], profile: AccessibilityProfile): string[] {
  const warnings: string[] = [];

  for (const leg of legs) {
    if (leg.mode === 'mrt' && !leg.accessibility.liftAvailable) {
      warnings.push(`No lift access at ${leg.from} or ${leg.to} — check alternative exits`);
    }
    if (leg.mode === 'walk' && leg.distance > 500 && profile.type === 'wheelchair') {
      warnings.push(`Long walk segment (${leg.distance}m) between ${leg.from} and ${leg.to}`);
    }
    if (leg.mode === 'bus' && !leg.accessibility.wheelchairBus) {
      warnings.push(`Bus ${leg.serviceNo} may not have wheelchair accessible buses — check live arrivals`);
    }
  }

  return warnings;
}

export function enrichLegWithAccessibility(leg: RouteLeg): RouteLeg {
  if (leg.mode === 'mrt' || leg.mode === 'lrt') {
    const station = (stationsData as any[]).find(
      (s) => s.name.toLowerCase().includes(leg.from.toLowerCase()) ||
             s.name.toLowerCase().includes(leg.to.toLowerCase())
    );
    if (station) {
      return {
        ...leg,
        accessibility: {
          ...leg.accessibility,
          liftAvailable: station.lifts && station.lifts.length > 0,
          barrierFree: station.barrierFreeExits && station.barrierFreeExits.length > 0,
        },
      };
    }
  }
  return leg;
}

export function parseOneMapRoute(rawRoute: any, profile: AccessibilityProfile): AccessibleRoute {
  const itinerary = rawRoute?.plan?.itineraries?.[0];
  if (!itinerary) throw new Error('No route found');

  const legs: RouteLeg[] = itinerary.legs.map((leg: any) => {
    const mode = leg.mode?.toLowerCase() as RouteLeg['mode'];
    const rawLeg: RouteLeg = {
      mode,
      from: leg.from?.name || 'Unknown',
      to: leg.to?.name || 'Unknown',
      duration: Math.round(leg.duration / 60),
      distance: Math.round(leg.distance),
      instructions: buildInstructions(leg),
      serviceNo: leg.routeShortName,
      polyline: decodePolyline(leg.legGeometry?.points || ''),
      accessibility: {
        barrierFree: true,
        liftAvailable: false,
        sheltered: false,
        wheelchairBus: false,
      },
    };
    return enrichLegWithAccessibility(rawLeg);
  });

  const totalWalkDistance = legs
    .filter((l) => l.mode === 'walk')
    .reduce((sum, l) => sum + l.distance, 0);

  return {
    id: Date.now().toString(),
    origin: { lat: itinerary.legs[0].from.lat, lng: itinerary.legs[0].from.lon, name: itinerary.legs[0].from.name },
    destination: {
      lat: itinerary.legs[itinerary.legs.length - 1].to.lat,
      lng: itinerary.legs[itinerary.legs.length - 1].to.lon,
      name: itinerary.legs[itinerary.legs.length - 1].to.name,
    },
    profile,
    legs,
    totalDuration: Math.round(itinerary.duration / 60),
    totalWalkDistance,
    accessibilityScore: scoreRoute(legs),
    warnings: getRouteWarnings(legs, profile),
  };
}

function buildInstructions(leg: any): string {
  const mode = leg.mode?.toLowerCase();
  if (mode === 'walk') return `Walk ${Math.round(leg.distance)}m to ${leg.to?.name}`;
  if (mode === 'bus') return `Take Bus ${leg.routeShortName} from ${leg.from?.name} to ${leg.to?.name}`;
  if (mode === 'subway' || mode === 'rail') return `Take MRT ${leg.routeShortName} from ${leg.from?.name} to ${leg.to?.name}`;
  return `${mode} from ${leg.from?.name} to ${leg.to?.name}`;
}

function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}
