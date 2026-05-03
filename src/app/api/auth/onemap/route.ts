import { NextResponse } from 'next/server';
import { getOneMapToken } from '@/lib/onemap';

export async function GET() {
  try {
    const token = await getOneMapToken();
    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
