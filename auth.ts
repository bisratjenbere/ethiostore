import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getNormalizedName } from "./lib/utils";
import { updateUserNameInDb } from "./lib/actions/user.actions";

const config = {
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
    async jwt({ token, user, session, trigger }) {
      if (user) {
        if (user.role) token.role = user.role;
        const normalizedName = getNormalizedName(user);
        if (normalizedName) {
          if (user.name === "NO_NAME" && user.id) {
            try {
              await updateUserNameInDb(user.id, normalizedName);
            } catch (error) {
              throw error;
            }
          }
        }
      }

      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
