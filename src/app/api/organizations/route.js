import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const per_page = searchParams.get('per_page') || 10;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  
  let url = `http://destbackdev.aggility.io/api/v1/organizations?page=${page}&per_page=${per_page}`;

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;



  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from upstream' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

