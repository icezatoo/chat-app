import { NextRequest, NextResponse } from "next/server"

const locales = ["th", "en"] as const
const defaultLocale = "th"

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie

  const al = req.headers.get("accept-language") ?? ""
  const preferred = al.split(",")[0]?.split("-")[0]?.toLowerCase() ?? ""
  if ((locales as readonly string[]).includes(preferred)) return preferred
  return defaultLocale
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const matchedLocale = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )

  if (!matchedLocale) {
    const locale = detectLocale(req)
    const url = req.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  // Forward locale as request header so the root layout can set html[lang]
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-locale", matchedLocale)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)",
  ],
}
