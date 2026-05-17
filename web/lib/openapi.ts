// Document OpenAPI 3.1 de l'API publique en lecture (consommée par l'app
// mobile Expo et exposée via Scalar sur /api/docs, #7.4).
//
// Pur et testable : aucune dépendance runtime, le contrat reflète
// exactement les réponses de `app/api/projects` et `app/api/projects/[slug]`.
// L'admin (`/api/admin/*`, `/api/auth/*`) est volontairement absent.

export const OPENAPI_VERSION = "3.1.0";
export const API_VERSION = "1.0.0";

const projectCardSchema = {
  type: "object",
  required: ["slug", "title", "summary", "tags", "imageGradient"],
  properties: {
    slug: { type: "string", example: "leon-portfolio" },
    title: { type: "string", example: "Portfolio Léon HEU" },
    summary: { type: "string" },
    tags: { type: "array", items: { type: "string" }, example: ["Next.js", "Prisma"] },
    repoUrl: { type: "string", format: "uri", nullable: true },
    demoUrl: { type: "string", format: "uri", nullable: true },
    imageGradient: {
      type: "string",
      description: "Dégradé CSS déterministe dérivé du slug.",
    },
  },
} as const;

const projectDetailSchema = {
  type: "object",
  required: ["slug", "title", "summary", "tags", "imageGradient"],
  properties: {
    ...projectCardSchema.properties,
    content: {
      type: "string",
      nullable: true,
      description: "Contenu long du projet (texte échappé).",
    },
  },
} as const;

const errorSchema = {
  type: "object",
  required: ["error"],
  properties: { error: { type: "string", example: "Projet introuvable." } },
} as const;

export const openApiDocument = {
  openapi: OPENAPI_VERSION,
  info: {
    title: "API publique — leon-portfolio",
    version: API_VERSION,
    description:
      "API REST en lecture seule exposant les projets publiés. " +
      "Consommée par l'application mobile Expo. CORS ouvert (GET, OPTIONS).",
    contact: { name: "Léon HEU", url: "https://leonheu.fr" },
    license: { name: "Propriétaire" },
  },
  servers: [
    { url: "https://leonheu.fr", description: "Production" },
    { url: "http://localhost:3000", description: "Développement local" },
  ],
  tags: [{ name: "Projets", description: "Projets publiés du portfolio." }],
  paths: {
    "/api/projects": {
      get: {
        tags: ["Projets"],
        summary: "Liste des projets publiés",
        description:
          "Retourne les projets au statut PUBLISHED. Filtrage optionnel " +
          "par tags (slugs séparés par des virgules).",
        operationId: "listProjects",
        parameters: [
          {
            name: "tags",
            in: "query",
            required: false,
            description: "Slugs de tags séparés par des virgules (filtre OR).",
            schema: { type: "string", example: "nextjs,prisma" },
          },
        ],
        responses: {
          "200": {
            description: "Liste des projets.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["projects"],
                  properties: {
                    projects: { type: "array", items: projectCardSchema },
                  },
                },
              },
            },
          },
        },
      },
      options: {
        tags: ["Projets"],
        summary: "Pré-vol CORS",
        operationId: "optionsProjects",
        responses: { "204": { description: "Pas de contenu (CORS)." } },
      },
    },
    "/api/projects/{slug}": {
      get: {
        tags: ["Projets"],
        summary: "Détail d'un projet publié",
        operationId: "getProjectBySlug",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Projet trouvé.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["project"],
                  properties: { project: projectDetailSchema },
                },
              },
            },
          },
          "404": {
            description: "Projet inexistant ou non publié.",
            content: { "application/json": { schema: errorSchema } },
          },
        },
      },
      options: {
        tags: ["Projets"],
        summary: "Pré-vol CORS",
        operationId: "optionsProjectBySlug",
        responses: { "204": { description: "Pas de contenu (CORS)." } },
      },
    },
  },
  components: {
    schemas: {
      ProjectCard: projectCardSchema,
      ProjectDetail: projectDetailSchema,
      Error: errorSchema,
    },
  },
} as const;

export type OpenApiDocument = typeof openApiDocument;
