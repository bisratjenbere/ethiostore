import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts";

const config = {
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
        console.log("AUTHORIZE CALLED", credentials);
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
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
