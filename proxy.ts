import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { protectedPaths } from "./lib/constants";

export async function proxy(req: NextRequest) {
  const session = await auth();
  if (
    !session?.user &&
    protectedPaths.some((path) => path.test(req.nextUrl.pathname))
  ) {
    const redirectTo = new URL("sign-in", req.url);
    redirectTo.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );

    return NextResponse.redirect(redirectTo);
  }

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
