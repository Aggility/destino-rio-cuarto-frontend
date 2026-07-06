import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // URLs v1 de eventos: /evento/:id/:slug → /eventos (slug no compatible con v2)
  if (/^\/evento\/\d+\/.+$/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/eventos';
    return NextResponse.redirect(url, { status: 301 });
  }

  // URLs v1 de servicios: /servicio/:id/:slug → /servicio/:slug (slug idéntico en v2)
  const servicioMatch = pathname.match(/^\/servicio\/\d+\/(.+)$/);
  if (servicioMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/servicio/${servicioMatch[1]}`;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/evento/:path*', '/servicio/:path*'],
};
