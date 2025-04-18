import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware runs on all routes
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get the path from the request
  const path = req.nextUrl.pathname;

  // Define protected routes (routes that require authentication)
  const protectedRoutes = [
    "/profile",
    "/results",
    "/settings",
    // Add other protected routes here
  ];

  // Define authentication routes (where logged-in users should not go)
  const authRoutes = ["/login"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => path === route);

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the route is an auth route and the user is authenticated, redirect to home
  if (isAuthRoute && session) {
    const redirectUrl = new URL("/", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configure which routes this middleware will run on
export const config = {
  matcher: [
    "/",
    "/profile",
    "/results",
    "/settings",
    "/leaderboard",
    "/login",
    // Add other routes you want to run the middleware on
  ],
};
