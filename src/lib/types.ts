export interface AccessibilityProfile {
  type: 'wheelchair' | 'visual' | 'elderly' | 'pma' | 'custom';
  maxWalkDistance: number;
  avoidStairs: boolean;
  preferSheltered: boolean;
  requireLift: boolean;
}

export interface LiftLocation {
  exitCode: string;
  lat: number;
  lng: number;
  description: string;
  operational: boolean;
}

export interface Station {
  id: string;
  name: string;
  codes: string[];
  line: string[];
  lat: number;
  lng: number;
  lifts: LiftLocation[];
  barrierFreeExits: string[];
  accessibleToilet: boolean;
  tactileGuides: boolean;
  hearingLoop: boolean;
}

export interface BusStop {
  code: string;
  description: string;
  roadName: string;
  lat: number;
  lng: number;
  barrierFree: boolean;
}

export interface TaxiStand {
  id: string;
  lat: number;
  lng: number;
  barrierFree: boolean;
  owner: string;
}

export interface RouteLeg {
  mode: 'walk' | 'bus' | 'mrt' | 'lrt' | 'taxi';
  from: string;
  to: string;
  duration: number;
  distance: number;
  instructions: string;
  line?: string;
  serviceNo?: string;
  stopCode?: string;
  polyline?: [number, number][];
  accessibility: {
    barrierFree: boolean;
    liftAvailable: boolean;
    sheltered: boolean;
    wheelchairBus: boolean;
  };
}

export interface AccessibleRoute {
  id: string;
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  profile: AccessibilityProfile;
  legs: RouteLeg[];
  totalDuration: number;
  totalWalkDistance: number;
  accessibilityScore: number;
  warnings: string[];
}

export interface BusArrival {
  serviceNo: string;
  operator: string;
  nextBus: BusArrivalTiming;
  nextBus2: BusArrivalTiming;
  nextBus3: BusArrivalTiming;
}

export interface BusArrivalTiming {
  estimatedArrival: string;
  load: 'SEA' | 'SDA' | 'LSD' | '';
  feature: string;
  type: string;
}

export interface SearchResult {
  searchVal: string;
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: SearchResultItem[];
}

export interface SearchResultItem {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}
