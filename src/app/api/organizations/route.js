import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const per_page = searchParams.get('per_page') || 10;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  
  // Modificamos para traer todos (2000), ordenar descendente y luego paginar localmente
  let url = `https://destbackdev.aggility.io/api/v1/organizations?per_page=2000`;

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from upstream' }, { status: res.status });
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.data || []);
    
    // Sort descending by created_at
    const sorted = [...items].sort((a, b) =>
      new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );

    const start = (page - 1) * per_page;
    const end = start + per_page;
    const paginated = sorted.slice(start, end);

    return NextResponse.json({ data: paginated, total: sorted.length, page, per_page });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

