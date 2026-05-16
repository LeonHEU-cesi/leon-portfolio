import { describe, expect, it } from "vitest";

import { parseCredentials } from "@/lib/credentials";

describe("parseCredentials", () => {
  it("rejette null / non-objet / champs manquants", () => {
    expect(parseCredentials(null)).toBeNull();
    expect(parseCredentials("x")).toBeNull();
    expect(parseCredentials({})).toBeNull();
    expect(parseCredentials({ email: "a@b.fr" })).toBeNull();
    expect(parseCredentials({ password: "x" })).toBeNull();
  });

  it("rejette un email invalide", () => {
    expect(parseCredentials({ email: "pasunemail", password: "x" })).toBeNull();
  });

  it("normalise email (trim + lowercase) et conserve le mot de passe", () => {
    expect(parseCredentials({ email: "  Leon@Leonheu.FR ", password: " pw " })).toEqual({
      email: "leon@leonheu.fr",
      password: " pw ",
    });
  });
});
