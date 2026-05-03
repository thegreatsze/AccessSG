import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const headers: Record<string, string> = {};
  let totalSize = 0;
  req.headers.forEach((value, key) => {
    headers[key] = value;
    totalSize += key.length + value.length + 4;
  });
  console.log('[HEADERS]', JSON.stringify({ url: req.url, totalBytes: totalSize, headers }, null, 2));
  return NextResponse.next();
}

export const config = { matcher: '/' };
