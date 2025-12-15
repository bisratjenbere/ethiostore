import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "admin" | "user";
  }
  interface Session {
    user: {
      role?: "user" | "admin";
    } & DefaultSession["user"];
  }
  interface JWT {
    role?: "user" | "admin";
  }
}
