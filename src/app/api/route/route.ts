import { NextRequest, NextResponse } from 'next/server';
import { getRoute } from '@/lib/onemap';
import { parseOneMapRoute } from '@/lib/accessibility';
import { AccessibilityProfile } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startLat = parseFloat(searchParams.get('startLat') || '');
  const startLng = parseFloat(searchParams.get('startLng') || '');
  const endLat = parseFloat(searchParams.get('endLat') || '');
  const endLng = parseFloat(searchParams.get('endLng') || '');
  const profileType = (searchParams.get('profileType') || 'general') as AccessibilityProfile['type'];
  const maxWalk = parseInt(searchParams.get('maxWalk') || '500');

  if ([startLat, startLng, endLat, endLng].some(isNaN)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  try {
    const rawRoute = await getRoute(startLat, startLng, endLat, endLng, maxWalk);
    const profile: AccessibilityProfile = {
      type: profileType,
      maxWalkDistance: maxWalk,
      avoidStairs: profileType === 'wheelchair' || profileType === 'pma' || profileType === 'elderly',
      preferSheltered: profileType === 'wheelchair' || profileType === 'pma',
      requireLift: profileType === 'wheelchair' || profileType === 'pma',
    };
    const route = parseOneMapRoute(rawRoute, profile);
    return NextResponse.json(route);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
