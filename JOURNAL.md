# Journal de bord — leon-portfolio

> Journal narratif du projet, organisé par Sprint puis par Issue.
> Format imposé : H2 Sprint, H3 Issue, séparateur `---` entre issues. Pas de date (l'historique git fait foi).

## Sprint 0 — Foundations

### Issue #5 — [0.5] Init Next.js 15 + TypeScript strict dans web/

Scaffold initial du projet Next.js dans `web/` via `create-next-app@latest`. La version installée est en réalité Next.js 16.2.6 (dernière stable disponible), supérieure à la cible plan_dev (Next.js 15.x). On conserve cette version 16 plus récente sans réécrire les docs : App Router stable + Tailwind v4 + ESLint 9 + TypeScript 5.x sont rétro-compatibles avec ce qui était prévu.

- Scaffold avec flags `--typescript --tailwind --eslint --app --import-alias "@/*" --use-npm --disable-git --no-agents-md` pour éviter le `AGENTS.md` que Next 16 génère par défaut
- React 19.2.4, Next.js 16.2.6, Tailwind CSS v4 (via `@tailwindcss/postcss`), ESLint 9 flat config
- `tsconfig.json` durci : `strict: true` (déjà fourni) + `noUncheckedIndexedAccess` + `noImplicitOverride` + `forceConsistentCasingInFileNames`, target `ES2022`
- Scripts ajoutés au `package.json` : `typecheck` (`tsc --noEmit`) et `lint:fix` (`eslint --fix`)
- Aucun fichier IA (`CLAUDE.md`, `AGENTS.md`, `.cursor*`) commité

Tests validés :
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur (même avec `noUncheckedIndexedAccess`)
- `npm run build` → succès, 2 routes statiques (`/`, `/_not-found`), compilation ~2s

---

### Issue #6 — [0.6] Init Prisma + schema + 1ère migration + seed

Installation Prisma + déclaration du schéma synchronisé avec `Docs/claude/leon-portfolio/mld.md`. Le scaffold initial a installé Prisma 7.8.0 qui introduit des breaking changes majeurs (URL dans `prisma.config.ts`, nouveau provider `prisma-client`, output customisé). On downgrade volontairement à **Prisma 6.19.3** pour rester sur l'API stable `import { PrismaClient } from "@prisma/client"` documentée dans le plan.

- `npm i -D prisma@^6 tsx` + `npm i @prisma/client@^6 bcryptjs` + types
- `web/prisma/schema.prisma` reflète exactement le MLD : User, Project, Article, Tag, ProjectTag, ArticleTag avec mappings `@map` snake_case côté DB, UUID en `@db.Uuid`, enums `ProjectStatus` et `ArticleStatus`
- `web/lib/prisma.ts` : singleton PrismaClient (évite multiple instances en dev hot reload)
- `web/prisma/seed.ts` : 1 admin bcrypt cost 12 (depuis `ADMIN_EMAIL` / `ADMIN_PASSWORD`), 8 tags (React, Next.js, TypeScript, Tailwind, Node.js, Postgres, Docker, Expo), 2 projets publiés (leon-portfolio + cesizen), 1 projet draft, 1 article draft. Utilise `upsert` pour idempotence.
- Scripts `package.json` : `db:generate`, `db:migrate`, `db:migrate:deploy`, `db:seed`, `db:reset`, `db:studio`
- `pkg.prisma.seed = "tsx prisma/seed.ts"` (Prisma 6 déprécie cette config en faveur de `prisma.config.ts` Prisma 7 — migration à prévoir V2)
- Migration `init` non générée à ce stade (Postgres pas requis en CI au Sprint 0). Première migration sera créée au Sprint 1 quand le user lancera `npx prisma migrate dev --name init` avec Docker dev up.

Tests validés :
- `npx prisma validate` → schema valide
- `npx prisma format` → ok
- `npx prisma generate` → client généré dans `node_modules/@prisma/client`
- `npm run typecheck` → 0 erreur (types Prisma reconnus)
- `npm run build` → succès

---
