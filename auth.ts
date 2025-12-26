import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getNormalizedName } from "./lib/utils";
import { updateUserNameInDb } from "./lib/actions/user.actions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { protectedPaths } from "./lib/constants";

export const runtime = "nodejs";

const config = {
  pages: {
    signIn: "/sign-in",
    error: "/app/not-found",
  },

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "jenberehenok@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },

      authorize: async (credentials) => {
        if (credentials === null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token, trigger }) {
      session.user.id = token.sub || "";
      session.user.name = token.name as string | undefined;
      session.user.role =
        (token.role as "user" | "admin" | undefined) ?? "user";
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async authorized({ request, auth }) {
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();

        const newRequestHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
    async signIn({ user }) {
      if (user && user.name === "NO_NAME" && user.id) {
        const normalizedName = getNormalizedName(user);
        if (normalizedName) {
          await updateUserNameInDb(user.id, normalizedName);
        }
      }
      return true;
    },
    async jwt({ token, user, session, trigger }) {
      if (user) {
        if (user.role) token.role = user.role;
      }

      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name;
      }

      if (trigger === "signIn" || trigger === "signUp") {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get("sessionCartId")?.value;
        if (sessionCartId) {
          const cart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });
          console.log(cart, cart?.userId);
          if (cart && !cart.userId) {
            await prisma.cart.update({
              where: { id: cart.id },
              data: { userId: user.id },
            });
          }
        }
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
