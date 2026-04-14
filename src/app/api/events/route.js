import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const baseUrl = 'http://destbackdev.aggility.io/api/v1/events';

  try {
    const res = await fetch(`${baseUrl}?page=${page}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from upstream' }, { status: res.status }, { statusText: res.statusText });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
