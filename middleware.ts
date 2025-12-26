import { auth } from "@/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";
export const runtime = "nodejs";

export const middleware = auth((req) => {
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
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
