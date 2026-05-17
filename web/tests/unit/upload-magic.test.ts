import { describe, expect, it } from "vitest";

import { sniffImageType, verifyMagicBytes } from "@/lib/upload";

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const WEBP = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
]);

describe("sniffImageType", () => {
  it("reconnaît jpeg/png/webp", () => {
    expect(sniffImageType(JPEG)).toBe("image/jpeg");
    expect(sniffImageType(PNG)).toBe("image/png");
    expect(sniffImageType(WEBP)).toBe("image/webp");
  });

  it("null si signature inconnue", () => {
    expect(sniffImageType(new Uint8Array([1, 2, 3, 4]))).toBeNull();
  });
});

describe("verifyMagicBytes", () => {
  it("ok si signature == type déclaré", () => {
    expect(verifyMagicBytes("image/png", PNG)).toEqual({ ok: true });
  });

  it("rejette si le contenu ne correspond pas au type déclaré", () => {
    const r = verifyMagicBytes("image/png", JPEG);
    expect(r.ok).toBe(false);
  });

  it("rejette une signature non reconnue", () => {
    const r = verifyMagicBytes("image/png", new Uint8Array([0, 1, 2, 3]));
    expect(r.ok).toBe(false);
  });
});
