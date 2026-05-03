import { NextRequest, NextResponse } from 'next/server';
import { searchOneMap } from '@/lib/onemap';

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get('q');
  if (!query) return NextResponse.json({ results: [] });

  try {
    const results = await searchOneMap(query);
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
