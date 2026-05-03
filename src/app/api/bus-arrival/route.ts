import { NextRequest, NextResponse } from 'next/server';
import { getBusArrivals } from '@/lib/lta';

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing bus stop code' }, { status: 400 });

  try {
    const data = await getBusArrivals(code);
    return NextResponse.json({ services: data.Services || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
