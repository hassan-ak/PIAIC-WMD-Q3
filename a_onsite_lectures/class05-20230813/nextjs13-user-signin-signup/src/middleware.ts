import { verifyJWT } from "./lib/token";
import { getErrorResponse } from "./lib/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let token: string | undefined;
  
  if (request.cookies.has("token")) {
    token = request.cookies.get("token")?.value;
  } else if (request.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = request.headers.get("Authorization")?.substring(7);
  }

  if (
    !token &&
    (request.nextUrl.pathname.startsWith("/api/users") ||
      request.nextUrl.pathname.startsWith("/api/auth/logout"))
  ) {
    return getErrorResponse(
      401,
      "You are not logged in. Please provide a token to gain access."
    );
  }

  const response = NextResponse.next();
  try {
    if (token) {
      const { sub } = await verifyJWT<{ sub: string }>(token);
      response.headers.set("X-USER-ID", sub);
    }
  } catch (error) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return getErrorResponse(401, "Token is invalid or user doesn't exists");
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/users/:path*", "/api/auth/logout"],
};
