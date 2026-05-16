import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

// Middleware Edge : authConfig uniquement (aucun Prisma/bcrypt).
// Export par défaut direct (Next n'accepte pas un export déstructuré
// pour le middleware). Le callback `authorized` bloque /admin/* sans
// session → redirection /login + callbackUrl automatique.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
