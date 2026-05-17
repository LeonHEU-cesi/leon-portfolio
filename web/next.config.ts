import type { NextConfig } from "next";

import { securityHeaders, scalarSecurityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  // Sortie standalone pour l'image Docker staging/prod (#6.11).
  output: "standalone",
  async headers() {
    return [
      // CSP élargie au CDN Scalar pour la seule UI de doc (#7.4).
      {
        source: "/api/docs",
        headers: scalarSecurityHeaders,
      },
      // CSP stricte partout ailleurs (exclut /api/docs traité ci-dessus).
      {
        source: "/((?!api/docs).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
