import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("token")?.value;

  let isAuthenticated = false;

  if (tokenCookie) {
    try {
      const decodedToken = jwtDecode<{ exp: number }>(tokenCookie);
      const currentTime = Date.now() / 1000; // saniye cinsinden
      isAuthenticated = decodedToken.exp > currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  if (!isAuthenticated && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/tours", request.url));
  }

  return NextResponse.next();
}

// API ve statik dosyalar hariç tüm sayfalarda çalıştır
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
