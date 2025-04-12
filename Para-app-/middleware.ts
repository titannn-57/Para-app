import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup" || path === "/" || path.startsWith("/_next")

  // Get the token from the cookies
  const userId = request.cookies.get("userId")?.value

  // Redirect logic
  if (!isPublicPath && !userId) {
    // Redirect to login if trying to access a protected route without being logged in
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

