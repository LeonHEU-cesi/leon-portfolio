import type { DefaultSession } from "next-auth";

// Augmente la session/JWT avec id + role (renseignés par les callbacks).
declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
