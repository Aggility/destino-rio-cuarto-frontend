import { NextResponse } from "next/server";
import { deduplicateEvents } from "@/utils/date";

const EVENTS_PER_PAGE = 12;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const perPage = parseInt(searchParams.get('per_page')) || EVENTS_PER_PAGE;
  const search = (searchParams.get('search') || '').toLowerCase().trim();
  const category = searchParams.get('category') || '';
  const date = searchParams.get('date') || '';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?per_page=12`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from upstream' }, { status: res.status });
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.data || []);

    const getStartTime = (e) => {
      const raw = e.calendars?.[0]?.start_date;
      if (!raw) return Infinity;
      const [y, m, d] = raw.split('T')[0].split('-').map(Number);
      return new Date(y, m - 1, d).getTime();
    };

    const activeFiltered = items.filter(e => e.status?.toLowerCase() !== 'inactive');
    const active = deduplicateEvents(activeFiltered).sort((a, b) => getStartTime(a) - getStartTime(b));

    // Categorías únicas del dataset completo (sin filtros) para el selector
    const categories = [...new Set(
      active.map(e => e.categories?.[0]?.name?.trim()).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, 'es'));

    let filtered = active;

    if (search) {
      filtered = filtered.filter(e =>
        e.title?.toLowerCase().includes(search) ||
        (e.description || '').replace(/<[^>]*>/g, '').toLowerCase().includes(search)
      );
    }

    if (category && category !== 'Todos') {
      filtered = filtered.filter(e =>
        e.categories?.[0]?.name?.trim().toLowerCase() === category.toLowerCase()
      );
    }

    if (date && date !== 'Todos') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(e => {
        const raw = e.calendars?.[0]?.start_date;
        if (!raw) return false;
        const [y, m, d] = raw.split('T')[0].split('-').map(Number);
        const evDate = new Date(y, m - 1, d);
        if (date === 'HOY') return evDate.getTime() === today.getTime();
        if (date === 'Esta semana') { const end = new Date(today); end.setDate(today.getDate() + 7); return evDate >= today && evDate <= end; }
        if (date === 'Este mes') return evDate.getMonth() === today.getMonth() && evDate.getFullYear() === today.getFullYear();
        return true;
      });
    }

    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);
    const hasMore = start + perPage < filtered.length;

    return NextResponse.json({ data: paginated, hasMore, categories });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
