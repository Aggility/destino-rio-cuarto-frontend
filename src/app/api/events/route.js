import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const perPage = parseInt(searchParams.get('per_page')) || 10;
  const baseUrl = 'http://destbackdev.aggility.io/api/v1/events';

  try {
    const res = await fetch(`${baseUrl}?per_page=500`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from upstream' }, { status: res.status });
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.data || []);

    // Ordenar más reciente primero (created_at desc)
    const sorted = [...items].sort((a, b) =>
      new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = sorted.slice(start, end);

    return NextResponse.json({ ...data, data: paginated });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
