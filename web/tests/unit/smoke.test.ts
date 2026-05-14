import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("jsdom environment is available", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  it("can do basic math (Vitest sanity)", () => {
    expect(1 + 1).toBe(2);
  });
});
