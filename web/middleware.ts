import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

// Middleware Edge : utilise UNIQUEMENT authConfig (aucun Prisma/bcrypt).
// Le callback `authorized` bloque /admin/* sans session → Auth.js
// redirige vers `pages.signIn` (/login) avec callbackUrl automatique.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
