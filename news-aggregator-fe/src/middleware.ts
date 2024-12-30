import { NextResponse, NextRequest } from "next/server"
import { cookieKey } from './constants'

export async function middleware (request: NextRequest) {
  const accessToken = request.cookies.get(cookieKey.authToken)?.value
  const url = request.nextUrl.clone()
  const pathName = url.pathname
  if (accessToken) {
    if (pathName === "/auth/login" || pathName === "/auth/signup") {
      // User is authenticated but trying to access auth pages, redirect to app
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  } else {
    if (pathName === "/preferences") {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  // No redirect needed, continue with the request
  return NextResponse.next() // Explicitly signal no redirect
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/preferences",
  ],
}
