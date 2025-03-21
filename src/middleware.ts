import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./lib/auth.config";

const { auth } = NextAuth(authConfig);

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/reset-password",
  "/forgot-password",
];

export default auth(async (request) => {
  const pathName = request.nextUrl.pathname;
  const sessionCookie = !!request.auth;
  const isAuthRoute = authRoutes.includes(pathName);

  if (!sessionCookie) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
