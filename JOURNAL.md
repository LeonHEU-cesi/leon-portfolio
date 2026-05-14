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

### Issue #12 — [0.12] Layout root + composants Header / Footer minimaux

Pose des composants de layout fondamentaux. Le hero animé GSAP arrive au Sprint 1 (issue 1.4) ; ici on installe la coquille.

- **`<ThemeProvider>`** (`components/providers/`) : wrapper `next-themes` avec `attribute="data-theme"`, defaultTheme `system`, enableSystem. Permet le toggle light/dark/system persistant via cookie.
- **`<ModeProvider>`** (`components/providers/`) : composant client lisant `usePathname()` et settant `data-mode="editorial"` ou `data-mode="tech"` sur `<html>` selon route. Prefixes tech : `/projets`, `/admin`, `/blog`.
- **`<Header>`** (`components/layout/`) : sticky top, blur backdrop, nav avec 5 items (Accueil / Projets / CV / À propos / Contact), indicateur de page active (underline cyan/brun selon mode), `aria-current="page"`, ThemeToggle.
- **`<Footer>`** (`components/layout/`) : copyright dynamique (année), lien mentions légales, 3 liens sociaux (GitHub LeonHEU-cesi, LinkedIn placeholder, mailto).
- **`<ThemeToggle>`** : bouton SVG avec icône soleil/lune selon `resolvedTheme`, hydratation safe via `mounted` state (avec `eslint-disable` motivé en commentaire pour la règle `react-hooks/set-state-in-effect` de React 19).
- **`app/layout.tsx`** : intégration `<ThemeProvider><ModeProvider><Header /><main><Footer /></>` avec `suppressHydrationWarning` sur `<html>` (`next-themes` ajoute `data-theme` côté client après hydratation).
- **`app/page.tsx`** : page accueil minimaliste pour vérifier le rendu — sera remplacée par le hero animé au Sprint 1.
- next-themes ajouté en dépendance runtime.

Tests validés :
- `npm run lint` → 0 warning (eslint-disable ciblé sur `setMounted(true)` avec justification commentée)
- `npm run typecheck` → 0 erreur
- `npm run build` → succès, 2 routes statiques prérenderées
- `npm run build-storybook` → succès
- Tests TU Header + Footer prévus mais reportés au Sprint 1 (Vitest browser config existante ne couvre que Storybook test, ajout d'un project unit-jsdom hors scope Sprint 0)

---

## Sprint 1 — Vitrine Hero

### Issue #21 — [1.1] Setup Vitest jsdom + Testing Library

Mise en place de la fondation tests TU avec Vitest 4 multi-projects + @testing-library/react + jsdom + @vitejs/plugin-react. Désormais `npm run test:run` lance les tests unitaires en jsdom, `npm run test:storybook` lance les stories en browser Playwright.

- Installation : `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@vitejs/plugin-react`
- `vitest.config.ts` : 2 projects parallèles
  - `unit` (jsdom, globals, setupFiles, include `tests/unit/**`, alias `@/` → racine web/)
  - `storybook` (browser Playwright, existant Sprint 0)
- `vitest.setup.ts` : import `@testing-library/jest-dom/vitest` + cleanup automatique après chaque test
- `tests/unit/smoke.test.ts` : 2 tests de fumée valident jsdom + Vitest
- Scripts package.json :
  - `test` → watch tous projects
  - `test:run` → run project `unit` (CI default)
  - `test:run:all` → run les 2
  - `test:storybook` → run project `storybook`
  - `test:coverage` → run unit avec coverage v8
- CI workflow `ci.yml` durci : retrait des `|| echo`, `--if-present` et `continue-on-error` sur lint/typecheck/build/Vitest. Les jobs failent désormais si lint/typecheck/tests échouent.

Tests validés :
- `npm run test:run` → 2 tests passants (smoke)
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur

---

### Issue #22 — [1.2] Tests TU Header / Footer / ThemeToggle

Tests TU des composants posés au Sprint 0 (issue #12), reportés faute de setup Vitest jsdom. Couvre la dette technique listée dans `sprint0-foundations.md § 4`.

- `tests/unit/Header.test.tsx` (5 tests) : rendu 5 items de nav, `aria-current="page"` sur item actif (3 cas : `/`, `/projets/leon-portfolio`, `/about`), logo cliquable vers `/`
- `tests/unit/Footer.test.tsx` (4 tests) : copyright année dynamique, lien mentions légales, 3 liens sociaux présents, `rel="noopener noreferrer"` sur liens externes
- `tests/unit/ThemeToggle.test.tsx` (4 tests) : icône lune/soleil + aria-label selon `resolvedTheme`, click toggle light↔dark
- Mocks : `next/navigation.usePathname` (fonction modulable via `vi.fn`), `next-themes.useTheme`

Tests validés :
- `npm run test:run` → **15 tests passants** (smoke + 5 Header + 4 Footer + 4 ThemeToggle)
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur

---

### Issue #23 — [1.3] Hook usePrefersReducedMotion + TU

Hook React qui lit la préférence OS `(prefers-reduced-motion: reduce)` et retourne un booléen réactif. SSR-safe (retourne `false` côté serveur). Sera utilisé par les composants `<HeroAnimated>` (#1.5) et `<MobileMenu>` (#1.4) pour désactiver les animations complexes.

- `lib/hooks/usePrefersReducedMotion.ts` : hook avec `useEffect` + `matchMedia.addEventListener('change', ...)`, cleanup au démontage
- `tests/unit/usePrefersReducedMotion.test.ts` (4 tests) :
  - retourne `false` par défaut
  - retourne `true` si `matches: true` initial
  - met à jour en runtime si la préférence change (test `act()` + dispatch listener)
  - cleanup correct via `removeEventListener` au démontage
- Mock matchMedia custom : `createMatchMediaMock` qui simule la registry des listeners pour pouvoir trigger `change` à la volée

Couvre :
- US-VI-06 (Animations respectant prefers-reduced-motion)
- TU-VI-02 du Cahier_de_tests.md

Tests validés :
- `npm run test:run` → **19 tests passants** (15 précédents + 4 nouveaux)
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur

---
