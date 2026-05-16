import { describe, expect, it } from "vitest";

import { buildVCard, vcardDataUri } from "@/lib/vcard";

const INPUT = {
  firstName: "Léon",
  lastName: "HEU",
  email: "leonheu97@gmail.com",
  site: "https://leonheu.fr",
  github: "https://github.com/LeonHEU-cesi",
};

describe("buildVCard", () => {
  it("produit une vCard 3.0 valide avec les champs clés", () => {
    const v = buildVCard(INPUT);
    expect(v.startsWith("BEGIN:VCARD\r\nVERSION:3.0")).toBe(true);
    expect(v).toContain("FN:Léon HEU");
    expect(v).toContain("N:HEU;Léon;;;");
    expect(v).toContain("EMAIL;TYPE=INTERNET:leonheu97@gmail.com");
    expect(v.trimEnd().endsWith("END:VCARD")).toBe(true);
  });
});

describe("vcardDataUri", () => {
  it("encode en data URI text/vcard", () => {
    const uri = vcardDataUri(buildVCard(INPUT));
    expect(uri.startsWith("data:text/vcard;charset=utf-8,")).toBe(true);
    expect(decodeURIComponent(uri)).toContain("BEGIN:VCARD");
  });
});
