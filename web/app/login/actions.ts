"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export type LoginState = { error?: string };

// Server Action de connexion. Message d'erreur générique (pas
// d'énumération d'utilisateurs). Les redirections (succès) sont relancées.
export async function authenticate(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");
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
