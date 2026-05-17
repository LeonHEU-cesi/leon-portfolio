import { describe, expect, it } from "vitest";

import { openApiDocument, OPENAPI_VERSION, API_VERSION } from "@/lib/openapi";
import { buildCsp, buildScalarCsp } from "@/lib/security-headers";

describe("openApiDocument", () => {
  it("déclare OpenAPI 3.1 et la version d'API V1", () => {
    expect(openApiDocument.openapi).toBe(OPENAPI_VERSION);
    expect(OPENAPI_VERSION).toBe("3.1.0");
    expect(openApiDocument.info.version).toBe(API_VERSION);
    expect(API_VERSION).toBe("1.0.0");
  });

  it("documente exactement les deux endpoints publics", () => {
    expect(Object.keys(openApiDocument.paths).sort()).toEqual([
      "/api/projects",
      "/api/projects/{slug}",
    ]);
  });

  it("n'expose aucune route admin ou auth", () => {
    const paths = Object.keys(openApiDocument.paths).join(" ");
    expect(paths).not.toMatch(/admin|auth|upload/);
  });

  it("liste des projets : 200 avec un tableau ProjectCard", () => {
    const list = openApiDocument.paths["/api/projects"].get;
    expect(list.operationId).toBe("listProjects");
    const schema = list.responses["200"].content["application/json"].schema;
    expect(schema.properties.projects.type).toBe("array");
    expect(schema.properties.projects.items.required).toContain("slug");
  });

  it("détail projet : 200 et 404 documentés", () => {
    const detail = openApiDocument.paths["/api/projects/{slug}"].get;
    expect(detail.responses["200"]).toBeDefined();
    expect(detail.responses["404"]).toBeDefined();
    expect(detail.parameters[0]).toMatchObject({ name: "slug", in: "path", required: true });
  });

  it("expose les schémas réutilisables", () => {
    expect(Object.keys(openApiDocument.components.schemas).sort()).toEqual([
      "Error",
      "ProjectCard",
      "ProjectDetail",
    ]);
  });
});

describe("buildScalarCsp", () => {
  it("autorise le CDN Scalar pour script/style/font sans toucher la CSP globale", () => {
    const scalar = buildScalarCsp();
    expect(scalar).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net");
    expect(scalar).toContain("https://cdn.jsdelivr.net");
    // La CSP de base reste stricte (pas de jsdelivr, pas de unsafe-eval).
    expect(buildCsp()).not.toContain("cdn.jsdelivr.net");
    expect(buildCsp()).not.toContain("unsafe-eval");
  });

  it("conserve les directives de durcissement", () => {
    const scalar = buildScalarCsp();
    expect(scalar).toContain("frame-ancestors 'none'");
    expect(scalar).toContain("object-src 'none'");
    expect(scalar).toContain("base-uri 'self'");
  });
});
