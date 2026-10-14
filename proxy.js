import { NextResponse } from "next/server";

// O'zbekcha sahifalar manzilda til qo'shimchasisiz ochiladi (/chorsu/turk-tili),
// ichkarida esa /uz/... sahifasi ko'rsatiladi. /ru/... va /en/... o'z holicha qoladi.
const prefixed = ["ru", "en"];
const defaultLocale = "uz";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (prefixed.includes(first)) return NextResponse.next();

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // API, Next.js ichki fayllari va kengaytmali fayllar (rasm, ikonka, sitemap.xml...) o'tkazib yuboriladi.
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
