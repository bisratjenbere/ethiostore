import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { protectedPaths } from "./lib/constants";

export async function proxy(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  
  const isProtectedPath = protectedPaths.some((path) => path.test(pathname));
  
  if (isProtectedPath) {

    if (!session?.user) {
      const redirectTo = new URL("/sign-in", req.url);
      redirectTo.searchParams.set(
        "callbackUrl",
        pathname + req.nextUrl.search
      );
      return NextResponse.redirect(redirectTo);
    }
    

    if (pathname.startsWith("/admin")) {
      if (session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  // Handle session cart ID
  const hasCartId = req.cookies.has("sessionCartId");
  if (!hasCartId) {
    const sessionCartId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set("sessionCartId", sessionCartId, {
      path: "/",
      httpOnly: true,
    });

    return response;
  }

  return NextResponse.next();
}
