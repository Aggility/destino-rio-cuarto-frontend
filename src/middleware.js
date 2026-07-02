import { NextResponse } from 'next/server';

// Redirige URLs indexadas del sistema v1 que tenían formato /evento/:id/:slug
// donde el slug tenía un número generado al final (ej: dale-q-va-en-el-coloso-20253184739).
// Elimina ese sufijo numérico para obtener el slug limpio del sistema v2.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  const match = pathname.match(/^\/evento\/\d+\/(.+)$/);
  if (match) {
    const newSlug = match[1].replace(/-\d+$/, '');
    const url = request.nextUrl.clone();
    url.pathname = `/eventos/${newSlug}`;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/evento/:path*',
};
