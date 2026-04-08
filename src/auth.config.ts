import type { NextAuthConfig } from "next-auth";

const authConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
} satisfies NextAuthConfig;

export default authConfig;