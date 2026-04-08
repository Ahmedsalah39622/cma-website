import NextAuth from "next-auth";

import authConfig from "@/auth.config";

export const { auth: middleware } = NextAuth({
  ...authConfig,
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (!isAdminRoute) {
        return true;
      }

      return isLoggedIn;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};