import { describe, expect, it } from "vitest";

import { authConfig } from "@/auth.config";

const cb = authConfig.callbacks!;

type AuthorizedArg = Parameters<NonNullable<typeof cb.authorized>>[0];
type JwtArg = Parameters<NonNullable<typeof cb.jwt>>[0];
type SessionArg = Parameters<NonNullable<typeof cb.session>>[0];

function authorizedArg(pathname: string, auth: unknown): AuthorizedArg {
  return {
    auth,
    request: { nextUrl: { pathname } },
  } as unknown as AuthorizedArg;
}

describe("authConfig.callbacks.authorized", () => {
  it("laisse passer les routes publiques", () => {
    expect(cb.authorized!(authorizedArg("/projets", null))).toBe(true);
  });

  it("bloque /admin sans session, autorise avec session", () => {
    expect(cb.authorized!(authorizedArg("/admin", null))).toBe(false);
    expect(
      cb.authorized!(authorizedArg("/admin/projects", { user: { id: "1" } })),
    ).toBe(true);
  });
});

describe("authConfig.callbacks jwt/session", () => {
  it("jwt injecte id + role depuis user", () => {
    const token = cb.jwt!({
      token: {},
      user: { id: "u1", role: "admin" },
    } as unknown as JwtArg);
    expect(token).toMatchObject({ id: "u1", role: "admin" });
  });

  it("session expose id + role depuis le token", () => {
    const session = cb.session!({
      session: { user: { email: "a@b.fr" } },
      token: { id: "u1", role: "admin" },
    } as unknown as SessionArg);
    expect(session).toMatchObject({ user: { id: "u1", role: "admin" } });
  });
});
