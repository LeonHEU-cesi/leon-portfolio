import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactQrCode } from "@/components/sections/ContactQrCode";

describe("<ContactQrCode />", () => {
  it("rend un QR (SVG, role img) + lien de téléchargement vCard", async () => {
    render(await ContactQrCode());
    const qr = screen.getByRole("img", { name: /qr code vcard/i });
    expect(qr.querySelector("svg")).not.toBeNull();
    const dl = screen.getByRole("link", { name: /télécharger la vcard/i });
    expect(dl).toHaveAttribute("download", "leon-heu.vcf");
    expect(dl.getAttribute("href")).toMatch(/^data:text\/vcard/);
  });
});
