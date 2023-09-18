// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // get the URL from request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const prevUrl = request.cookies.get("currentUrl")?.value;

  if (prevUrl) {
    response.cookies.set("prevUrl", prevUrl);
  }

  response.cookies.set("currentUrl", request.url);

  return response;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
