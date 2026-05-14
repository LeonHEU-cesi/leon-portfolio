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

### Issue #9 — [0.9] Storybook + 2 stories démo

Init Storybook via `npx storybook@latest init`. La version installée est **Storybook 10.4.0** (au-delà des 8.x prévues — version stable la plus récente). Le scaffold installe également Vitest 4 et Playwright pour les tests visuels via `@storybook/addon-vitest`, ce qui anticipe le setup tests TU prévu au Sprint 1.

- Storybook 10.4 + framework `@storybook/nextjs-vite` (compatible Next.js 16)
- Addons : `@chromatic-com/storybook`, `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-docs`
- Addon `@storybook/addon-mcp` retiré (placeholder AI non nécessaire V1)
- Stories démo : `Button` + `Header` + `Page` + `Configure.mdx` (4 stories au lieu des 2 minimales demandées)
- `.storybook/main.ts` : staticDirs corrigé `..\\public` → `../public` (cross-platform Linux CI)
- `.storybook/preview.tsx` : import `app/globals.css` (Tailwind appliqué), backgrounds light + dark
- Fix lint dans `stories/Page.tsx` : guillemets HTML échappés `&quot;`
- Scripts ajoutés : `storybook`, `build-storybook`, `test`, `test:run`, `test:coverage`
- Vitest 4 + Playwright installés en bonus (sera utilisé Sprint 1 pour les TU)

Tests validés :
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur
- `npm run build` → succès
- `npm run build-storybook` → succès, output dans `storybook-static/` (gitignored)

---

### Issue #10 — [0.10] Direction visuelle : Hybride A+C retenue

Trois directions visuelles proposées dans `Docs/claude/leon-portfolio/design/direction-visuelle.md` (Sobre éditorial, Brutaliste moderne, Tech minimaliste sombre), avec palettes light + dark, typographies, animations caractéristiques, références à mood-boarder, et un tableau de décision croisée.

Léon a tranché pour l'**hybride A+C** : mode `editorial` (Fraunces + crème + brun) sur `/`, `/cv`, `/about`, `/contact`, `/mentions-legales` et mode `tech` (Geist + dark + cyan/violet) sur `/projets`, `/projets/[slug]`, `/admin/*`, `/blog/*`. La dichotomie sert elle-même de démo de compétence : maîtrise design + theming dynamique selon route.

- Document mis à jour : direction retenue détaillée + alternatives évaluées en annexe
- Snippets Tailwind v4 `@theme` documentés avec OKLCH (light + dark pour chaque mode)
- Plan d'implémentation Issue #11 (tokens) et Issue #12 (`<ModeProvider>` détection automatique selon `usePathname()`)
- Transition inter-modes documentée : ~400ms dissolution

Tests validés :
- Décision validée par Léon le 2026-05-14
- Direction cohérente avec les exigences WCAG AA (contrastes calculables, OKLCH facilite l'audit)
- Direction cohérente avec les démos de compétence souhaitées (signal CV "design + tech")

---

### Issue #11 — [0.11] Tokens design Tailwind v4 (palette, typo, espacement)

Implémentation des tokens design dans `web/app/globals.css` selon la direction hybride A+C validée à l'issue #10. Quatre jeux de tokens (`editorial-light` par défaut, `editorial-dark`, `tech-dark` par défaut sur ces routes, `tech-light` option) avec couleurs en OKLCH, polices via `next/font/google`, custom variants Tailwind v4 (`dark`, `editorial`, `tech`).

- `globals.css` : `@theme` partagé (radius, shadows, fonts variables CSS) + 4 variants `[data-mode]+[data-theme]` avec palettes OKLCH complètes
- Custom variants Tailwind v4 : `dark` (data-theme=dark), `editorial` (data-mode=editorial), `tech` (data-mode=tech). Permet usages comme `dark:bg-foreground` ou `tech:font-mono`
- `layout.tsx` :
  - Chargement Fraunces (axes SOFT, WONK, opsz), Inter, Geist, Geist Mono via `next/font/google`
  - Variables CSS exposées sur `<html>` : `--font-fraunces`, `--font-inter`, `--font-geist-sans`, `--font-geist-mono`
  - `lang="fr"`, `data-mode="editorial"` et `data-theme="light"` par défaut (le `<ModeProvider>` de l'issue #12 ajustera dynamiquement)
  - Metadata App Router : title template, description FR, authors, metadataBase via env `NEXT_PUBLIC_SITE_URL`
- `prefers-reduced-motion: reduce` : toutes les transitions et animations désactivées (couvre US-VI-06)
- `stories/Tokens.stories.tsx` : story Design System / Tokens avec 4 variants (Editorial Light / Editorial Dark / Tech Dark / Tech Light) — visualise palette, typo, radius
- `eslint.config.mjs` : ajout des ignores `storybook-static/**`, `coverage/**`, `playwright-report/**`, `test-results/**`, `node_modules/.prisma/**` pour éviter le lint des fichiers générés

Tests validés :
- `npm run lint` → 0 warning (ignores OK)
- `npm run typecheck` → 0 erreur
- `npm run build` → succès (fonts téléchargées par next/font)
- `npm run build-storybook` → succès (5 stories : Button, Header, Page, Configure, Tokens)

---
