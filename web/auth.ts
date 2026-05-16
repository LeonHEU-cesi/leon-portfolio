import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { parseCredentials } from "@/lib/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = parseCredentials(raw);
        if (!parsed) return null;

        try {
          // Import Prisma paresseux : pas de client construit au build
          // (build sans DATABASE_URL OK), uniquement à la tentative de login.
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({
            where: { email: parsed.email },
          });
          if (!user) return null;

          const valid = await bcrypt.compare(parsed.password, user.password);
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          // DB indisponible / erreur : réponse uniforme "invalide"
          // (jamais de 500 ni de fuite, anti-énumération).
          console.error("[auth] authorize a échoué:", error);
          return null;
        }
      },
    }),
  ],
});
