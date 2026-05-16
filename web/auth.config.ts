import type { NextAuthConfig } from "next-auth";

// Config Edge-safe (aucun import Prisma/bcrypt) : utilisable par le
// middleware (#4.4). Le provider Credentials est ajouté côté Node (auth.ts).
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    // Garde de routes : /admin/* exige une session.
    authorized({ auth, request: { nextUrl } }) {
      const isAdminArea = nextUrl.pathname.startsWith("/admin");
      if (!isAdminArea) return true;
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as string) ?? "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
