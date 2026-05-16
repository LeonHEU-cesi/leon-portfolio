import { describe, expect, it } from "vitest";

import { validateUpload } from "@/lib/upload";

describe("validateUpload", () => {
  it("accepte jpeg/png/webp sous la limite", () => {
    expect(validateUpload("image/jpeg", 1024)).toEqual({ ok: true });
    expect(validateUpload("image/png", 1024)).toEqual({ ok: true });
    expect(validateUpload("image/webp", 1024)).toEqual({ ok: true });
  });

  it("refuse un format non supporté", () => {
    expect(validateUpload("image/gif", 1024).ok).toBe(false);
    expect(validateUpload(undefined, 1024).ok).toBe(false);
  });

  it("refuse vide ou trop volumineux", () => {
    expect(validateUpload("image/png", 0).ok).toBe(false);
    expect(validateUpload("image/png", 6 * 1024 * 1024).ok).toBe(false);
  });
});
