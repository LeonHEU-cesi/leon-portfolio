// UI de référence API (Scalar) servie en HTML statique. Scalar est chargé
// depuis le CDN jsDelivr (CSP assouplie pour cette seule route, cf.
// `lib/security-headers.ts` + `next.config.ts`). noindex : doc, pas du SEO.
// Aucune route admin/auth n'est décrite (cf. `lib/openapi.ts`).
export const dynamic = "force-static";

const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>API leon-portfolio — Référence</title>
  </head>
  <body>
    <script id="api-reference" data-url="/api/openapi"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

export function GET() {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
