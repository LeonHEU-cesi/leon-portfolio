"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 min

export type LoginState = { error?: string };

// Server Action de connexion. Message d'erreur générique (pas
// d'énumération d'utilisateurs). Les redirections (succès) sont relancées.
export async function authenticate(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");

  // Rate limit (5 / 15 min) par IP + email. Message générique (pas
  // d'énumération ni d'indication sur la cause exacte du refus).
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const email = String(formData.get("email") || "").toLowerCase();
  const rl = rateLimit(
    `login:${ip}:${email}`,
    LOGIN_LIMIT,
    LOGIN_WINDOW_MS,
  );
  if (!rl.allowed) {
    return { error: "Trop de tentatives. Réessayez plus tard." };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl.startsWith("/") ? callbackUrl : "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Identifiants invalides." };
    }
    // NEXT_REDIRECT (succès) et autres erreurs : relancer.
    throw error;
  }
}
