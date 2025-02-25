import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "./auth";

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/reset-password",
  "/forgot-password",
];

export default auth(async (request) => {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const session = !request.auth;

  const isParent = request.auth?.user.role === UserRole.parent;
  const isChild = request.auth?.user.role === UserRole.child;

  if (session) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isParent && pathName === "/") {
    return NextResponse.redirect(new URL("/parent", request.url));
  }

  if (isChild && pathName === "/") {
    return NextResponse.redirect(new URL("/child", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
