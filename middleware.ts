import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PREFIXES = ["/home", "/create"]

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next()
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected) {
    const ok = await validateSessionViaMe(req, origin)
    if (!ok) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (pathname === "/login") {
    const ok = await validateSessionViaMe(req, origin)
    if (ok) {
      const url = req.nextUrl.clone()
      url.pathname = "/home"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

async function validateSessionViaMe(req: NextRequest, origin: string): Promise<boolean> {
  try {
    const res = await fetch(`${origin}/api/me`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        accept: "application/json",
      },
      cache: "no-store",
    })
    if (!res.ok) return false
    const data = await res.json()
    return Boolean(data?.success && data?.user?.id)
  } catch {
    return false
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
