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

### Issue #24 — [1.4] Menu burger mobile animé

Menu burger visible `< md` (768px) avec drawer slide-in depuis la droite via Framer Motion. Accessible : `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal="true"`, focus management auto, Esc ferme, backdrop click ferme, scroll lock body, honor `usePrefersReducedMotion` (fade simple si reduce demandé).

- `components/layout/MobileMenu.tsx` :
  - Bouton burger (hamburger SVG → croix SVG selon `isOpen`)
  - `<AnimatePresence>` Framer Motion : backdrop (fade) + drawer (slide-in OU fade selon reduced motion)
  - `useEffect` : keydown Esc, body scroll lock, focus management (first link à l'ouverture, retour au trigger à la fermeture), auto-close sur pathname change (avec eslint-disable motivé sur le setState in effect)
  - `usePrefersReducedMotion` consommé : durations à 0 et drawer en fade au lieu de slide
- Header.tsx : import + rendu `<MobileMenu />` à côté de `<ThemeToggle />` (visible md:hidden auto via la classe interne du composant)
- `tests/unit/MobileMenu.test.tsx` (5 tests) :
  - rendu fermé par défaut (`aria-expanded="false"`)
  - ouverture au clic (dialog avec aria-modal)
  - 5 items de navigation visibles
  - Escape ferme le drawer
  - body overflow `hidden` pendant ouverture
- Mocks : `usePathname` ("/"), `usePrefersReducedMotion` (false)

Tests validés :
- `npm run test:run` → **24 tests passants** (19 précédents + 5 nouveaux)
- `npm run lint` → 0 warning (eslint-disable ciblé motivé)
- `npm run typecheck` → 0 erreur
- `npm run build` → succès

---

### Issue #25 — [1.5] Hero animé GSAP + ScrollTrigger

Implémentation du hero animé scroll-driven sur la page d'accueil. Timeline GSAP avec entrée échelonnée (kicker → titre par lignes/mots stagger → sous-titre → CTAs → hint scroll), parallax léger via ScrollTrigger, fallback statique si `prefers-reduced-motion: reduce`.

- `npm i gsap @gsap/react` (GSAP 3.15 + hook officiel React 2.1)
- `components/sections/HeroAnimated.tsx` (client) :
  - `useGSAP` hook officiel (auto cleanup, scope sur le ref container)
  - Timeline GSAP `power3.out` avec 5 étapes (kicker, mots du titre stagger 80ms, sous-titre, CTAs, scroll hint)
  - ScrollTrigger : parallax `yPercent: -10` sur le title-wrapper en scrub
  - `usePrefersReducedMotion()` → `gsap.set` static (opacity 1, y 0) sans timeline
- `app/page.tsx` remplacé : import `<HeroAnimated />` uniquement (la section "Projets phares" arrive issue #26)
- `tests/unit/HeroAnimated.test.tsx` (2 tests) : rendu des contenus (kicker, titre 3 lignes, sous-titre, 2 CTAs), accessibilité (`<h1>` avec id + aria-labelledby) — GSAP entièrement mocké
- Fix collatéral : mock `usePrefersReducedMotion = true` dans `MobileMenu.test.tsx` (durations 0 = exit instantané = test Esc synchrone fiable)

Couvre :
- US-VI-01 (Hero animé scroll-driven)
- US-VI-06 (prefers-reduced-motion)

Tests validés :
- `npm run test:run` → **26 tests passants** (24 précédents + 2 nouveaux Hero, MobileMenu fix)
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur
- `npm run build` → succès

---

### Issue #26 — [1.6] Section "Projets phares" sur l'accueil

Section "Projets phares" affichée sous le Hero. 3 cartes projet avec données mock pour la V1 (la query Prisma viendra Sprint 2 quand Postgres sera up en local). Animation hover Framer Motion subtile (lift + scale 1.01).

- `lib/data/featured-projects.ts` : type `FeaturedProject` + 3 projets en dur (leon-portfolio, CESIZen, Tasknest concept)
- `components/sections/FeaturedProjects.tsx` (server) : titre de section + grid responsive (1/2/3 cols) + CTA "Voir tous les projets" → /projets
- `components/sections/FeaturedProjectCard.tsx` (client) : carte avec image gradient OKLCH, titre serif, summary, tags chips, liens Code/Démo. Framer Motion `whileHover={{ y: -4, scale: 1.01 }}` désactivé si `usePrefersReducedMotion`
- `app/page.tsx` : ajout de `<FeaturedProjects />` sous `<HeroAnimated />`
- `tests/unit/FeaturedProjects.test.tsx` (3 tests) : titre + CTA, 3 articles, contenu d'un projet (tags + liens)

Note Sprint 2 : remplacer le mock par `prisma.project.findMany({ where: { isFeatured: true, status: 'PUBLISHED' }, take: 3, orderBy: { createdAt: 'desc' } })` côté Server Component, avec try/catch + fallback mock.

Couvre :
- US-VI-02 (Section "Projets phares" sur l'accueil)

Tests validés :
- `npm run test:run` → **29 tests passants** (26 précédents + 3 nouveaux)
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur
- `npm run build` → succès

---

### Issue #27 — [1.7] Page /about avec bio narrative

Page `/about` en mode `editorial` (Fraunces + crème + brun). Bio narrative 4 paragraphes, section "Valeurs & approche" en 3 cartes (Qualité du code / Pédagogie / Curiosité), photo placeholder en gradient OKLCH, CTA vers CV et Contact.

- `app/about/page.tsx` créée
  - Metadata App Router : title "À propos · Léon HEU", description spécifique
  - Layout 2 colonnes desktop (bio + aside photo), 1 colonne mobile
  - Aside photo placeholder en gradient OKLCH (vrai portrait à venir Sprint 7)
  - Section "Valeurs & approche" 3 cartes responsive
  - Footer CTA "Voir mon CV" et "Me contacter"
- `tests/unit/AboutPage.test.tsx` (4 tests) : H1, ≥ 3 paragraphes bio, 3 H3 valeurs (sélecteur strict pour éviter le mot "pédagogie" dans la bio), 2 CTA href

Mode `editorial` activé automatiquement via `<ModeProvider>` (route `/about` n'a pas de préfixe tech).

Couvre :
- US-VI-05 (Page About avec bio narrative)

Tests validés :
- `npm run test:run` → **33 tests passants** (29 précédents + 4 nouveaux)
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur
- `npm run build` → succès, 3 routes statiques (`/`, `/_not-found`, `/about`)

---

## Sprint 2 — Projets

### Issue #38 — [2.0] Fix CI : le workflow ne compile pas (erreur YAML)

Régression latente depuis le bootstrap : 100 % des runs GitHub Actions étaient des `startup_failure` (0 job, 0 s). Le lint/typecheck/tests ne passaient qu'en local — la CI n'avait en réalité jamais tourné. Prérequis bloquant du Sprint 2 (les PR ne peuvent être validées sans CI verte).

- Cause racine `ci.yml` L119 : `run: npm ci || echo "Sprint 0: mobile/ pas encore initialisé"`. Le `run:` est un scalaire YAML *plain* (les `"` ne quotent que pour le shell, pas pour YAML) ; le `0: ` (deux-points + espace) est lu comme un indicateur de mapping → `mapping values are not allowed here` → fichier entier invalide → GitHub ne crée aucun job.
- Correctif L119 : message reformulé sans `: ` ni accent (`mobile non initialise (arrive au Sprint 5)`), scalaire YAML sûr.
- Défaut secondaire `mobile-checks` : `actions/setup-node@v4` avec `cache: npm` + `cache-dependency-path: mobile/package-lock.json` alors que `mobile/` ne contient qu'un `.gitkeep` jusqu'au Sprint 5. Le step `setup-node` (non `continue-on-error`) aurait fait échouer le job même après le fix YAML. Cache npm retiré du job mobile (commentaire explicatif ajouté).
- Jobs `web-*` inchangés : `web/package-lock.json` présent, 33 TU verts en local, pages `/` et `/about` statiques (build sans DB).

Tests validés :
- `yaml.safe_load(ci.yml)` → fichier valide (avant : `ScannerError` L119), `name` + `on` + 3 jobs parsés
- Run CI sur la PR : jobs effectivement créés (plus de `startup_failure`, `jobs` non vide)
- `web-tests`, `mobile-checks`, `web-e2e-lighthouse` au vert

---

### Issue #40 — [2.0bis] Bump actions checkout/setup-node v4 → v5

Le premier run CI réellement exécuté (PR #39) a remonté une dépréciation datée : `actions/checkout@v4` et `actions/setup-node@v4` tournent sur Node 20, bascule forcée Node 24 le 2026-06-02 puis retrait du runner le 2026-09-16. Échéance en plein Sprint 2 → correctif préventif pour éviter une nouvelle régression CI.

- `actions/checkout@v4` → `@v5` (3 occurrences)
- `actions/setup-node@v4` → `@v5` (3 occurrences)
- Aucun autre changement (pas de modif des steps, du cache web ni du job mobile)

Tests validés :
- Run CI sur la PR vert (3 jobs)
- Plus d'annotation de dépréciation Node 20 dans le run

---

### Issue #42 — [2.1] Baseline migration Prisma init committée

Le schéma `Project` / `Tag` / `ProjectTag` (+ `User` / `Article`) existait depuis le Sprint 0 (#6) mais aucune migration n'était versionnée — `prisma migrate deploy` (CI/prod) et les tests TF API (#2.9) étaient bloqués. Création d'une **baseline** sans toucher à la DB de dev.

- `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` → `web/prisma/migrations/20260516000000_init/migration.sql` (6 tables, 2 enums `ProjectStatus`/`ArticleStatus`, index `slug`/`status`/`is_featured`/`created_at`, FK `project_tags`/`article_tags` ON DELETE CASCADE)
- `web/prisma/migrations/migration_lock.toml` (`provider = "postgresql"`)
- `.gitignore` : suppression de `web/prisma/migrations/dev/` (pattern erroné) — les migrations sont versionnées par convention Prisma
- DB de dev déjà créée côté Léon : à marquer appliquée sans rejouer via `npx prisma migrate resolve --applied 20260516000000_init` (documenté en note PR)

Tests validés :
- SQL généré par Prisma lui-même depuis `schema.prisma` (méthode canonique d'init), cohérent avec le MLD
- `npx prisma validate` → schéma valide
- CI `web-tests` verte (lint + typecheck + prisma generate + 33 TU)

---

### Issue #43 — [2.2] Seed enrichi : 5 projets publiés + tags

Le seed avait 3 projets (2 publiés, 1 draft). Planning_Scrum §5 demande 5 projets pour alimenter `/projets` et la section "Projets phares" de la home. Enrichissement à 5 projets publiés + 1 draft, 3 `isFeatured`.

- `web/prisma/seed.ts` : ajout de `tasknest` (publié, featured), `devbox-cli` (publié), `homelab-iac` (publié). Conservation de `leon-portfolio`, `cesizen` (publiés, featured) et `demo-project` (draft)
- Données réalistes : `summary`, `content` Markdown structuré, `repoUrl`, `tagSlugs` mappés sur les 8 tags existants (aucun tag orphelin, pas de nouveau tag)
- Idempotence conservée : `upsert` par slug, `projectTag.deleteMany` + recréation des liaisons
- Récap console enrichi : compte publiés / draft / featured

Tests validés :
- `npx tsc --noEmit` → 0 erreur (seed.ts couvert par le tsconfig `**/*.ts`)
- `npx eslint prisma/seed.ts` → 0 warning
- CI `web-tests` verte
- 5 projets PUBLISHED + 1 DRAFT, 3 featured (≥3 requis pour la home)

---

### Issue #44 — [2.3] Page /projets + prisma.project.findMany (+ swap mock home)

Catalogue `/projets` (mode `tech`) alimenté par Prisma, et bascule de la section "Projets phares" de la home du mock vers la base — clôture la dette du Sprint 1 (#26).

- `lib/projects.ts` : `getPublishedProjects()` / `getFeaturedProjects(take)` (`findMany` PUBLISHED [+ `isFeatured`], `include` tags, `orderBy createdAt desc`). `mapProjectToCard` aplatit les tags et dérive un gradient déterministe du slug (visuel sans upload). Fallback `FEATURED_PROJECTS` (mock) si la DB échoue ou liste vide.
- **Import Prisma paresseux** (`await import("@/lib/prisma")` dans le try) : `next build` sans `DATABASE_URL` ne plante plus à l'import — la construction du client est dans le try/catch.
- Split présentationnel : `FeaturedProjectsView` / `ProjectsListView` (purs, testables sync) + `FeaturedProjects` / `app/projets/page.tsx` (Server Components async).
- `app/projets/page.tsx` : `metadata`, `dynamic = "force-dynamic"` (pas de pré-rendu DB au build), h1 + intro mode tech, grille responsive 1/2/3, état vide accessible (`role="status"`).
- `app/page.tsx` : `revalidate = 300` (ISR — featured rafraîchi en prod, build retombe sur le mock).

Couvre US-PJ-01 ; clôt la note Sprint 2 de #26.

Tests validés :
- `npm run test:run` → **40 tests passants** (33 + Data 5 + ProjectsListView 2, FeaturedProjects → FeaturedProjectsView)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès : `/` statique (revalidate 5m, fallback mock sans DB), `/projets` dynamique (`ƒ`), aucune route ne casse sans base

---

### Issue #45 — [2.4] Filtres tags (chips) avec synchronisation URL

Filtrage par tags sur `/projets`, état porté par l'URL (`?tags=docker,nextjs`), rendu **100 % côté serveur** (liens, pas de JS client) : partageable, rechargeable, accessible nativement.

- `lib/tag-filter.ts` (pur) : `parseSelectedTags` (split/trim/lowercase/dédoublonne, supporte la clé répétée) + `toggleTagHref` (bascule un tag, tri canonique, retour `/projets` si vide)
- `lib/projects.ts` : `getPublishedProjects(tagSlugs)` ajoute `where.tags.some.tag.slug.in` (OR — au moins un tag) ; `getAllTags()` (`tag.findMany` trié, fallback tags dérivés du mock)
- `components/sections/TagFilter.tsx` : `<nav aria-label>` + chip "Tous" (reset) + un `<Link>` par tag ; tag actif = `aria-current="true"` + `aria-label` "Retirer le filtre X", focus visible
- `app/projets/page.tsx` : `searchParams` (Promise Next 16) → `parseSelectedTags`, `Promise.all` projets filtrés + tags, compteur `aria-live`, état vide réutilisé

Couvre US-PJ-05.

Tests validés :
- `npm run test:run` → **51 tests passants** (40 + tag-filter 6 + TagFilter 3 + getAllTags/filtre 2)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès (`/projets` `ƒ` dynamique)

---

### Issue #46 — [2.5] Page /projets/[slug] : détail + 404 propre

Page détail projet (mode `tech`) avec 404 Next propre si le slug est inconnu ou le projet en DRAFT, et métadonnées dynamiques.

- `lib/projects.ts` : `getProjectBySlug(slug)` → `findUnique` + garde `status === PUBLISHED` (sinon `null` → 404). `ProjectDetail` (avec `content`), `mapProjectToDetail`. Fallback mock (slug connu) si DB KO, `null` sinon
- `components/sections/ProjectDetailView.tsx` (pur) : retour catalogue, bannière gradient, h1, résumé, chips tags, liens repo/démo (`rel="noopener noreferrer"`), corps `whitespace-pre-line` (MDX riche → V2), fallback résumé si pas de contenu
- `app/projets/[slug]/page.tsx` : `dynamic = "force-dynamic"`, `generateMetadata` (title + description + OpenGraph), `notFound()` si `null`

Couvre US-PJ-02.

Tests validés :
- `npm run test:run` → **57 tests passants** (51 + ProjectDetailView 2 + getProjectBySlug 4)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/projets/[slug]` rendu `ƒ` (dynamique, pas de DB au build)

---

### Issue #47 — [2.6] GitHubService + cache ISR 24h

Service isolé d'accès aux repos publics GitHub de `LeonHEU-cesi`, caché 24h, qui ne casse jamais la page (dégradation propre).

- `lib/services/github.ts` : `fetchPublicRepos(fetchImpl = fetch)` — `fetch` injectable pour les tests ; `Authorization: Bearer` si `GITHUB_TOKEN` présent, `Accept` + `User-Agent` ; exclut forks/archivés, tri par stars desc ; **renvoie `[]`** sur erreur réseau / quota / 4xx-5xx / token absent (jamais d'exception)
- `getCachedPublicRepos` = `unstable_cache(..., { revalidate: 86400, tags: ["github-repos"] })` → 1 appel réseau / jour max
- Type `GitHubRepo` exporté (consommé par #2.7)

Couvre US-PJ-04 (partie service).

Tests validés :
- `npm run test:run` → **61 tests passants** (57 + github-service 4 : mapping/tri/exclusion forks, en-tête token, non-OK→[], exception→[])
- `npm run lint` / `npm run typecheck` → 0
- Build vérifié en CI (module non encore monté sur une route)

---

### Issue #48 — [2.7] Section "Mes repos publics" sur /projets

Affichage des repos publics GitHub sous le catalogue, alimenté par le cache 24h de #2.6.

- `components/sections/GitHubRepos.tsx` : `GitHubReposView` (pur) — masquée totalement si liste vide (aucun message d'erreur visible) ; `GitHubRepos` (server async) lit `getCachedPublicRepos()` et limite à 9
- Cartes compactes : nom (lien externe `rel="noopener noreferrer" target="_blank"`), description, langage, ★ stars (`aria-label`)
- Montée dans `app/projets/page.tsx` sous la grille (page déjà `force-dynamic` → pas d'appel réseau au build)

Couvre US-PJ-04 (UI).

Tests validés :
- `npm run test:run` → **63 tests passants** (61 + GitHubRepos 2 : rendu + dégradation silencieuse)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/projets` reste `ƒ` (cache GitHub non exécuté au build)

---

### Issue #49 — [2.8] Animations cards hover (Framer Motion) — raffinement

Harmonisation et polissage des animations hover des cartes, transform/opacity uniquement (zéro layout shift), respect strict de `prefers-reduced-motion`.

- `FeaturedProjectCard` : hover affiné (`y:-6`, `scale:1.015`, ressort ajusté), highlight de bordure + ombre en `transition-[box-shadow,border-color]`, léger zoom du visuel (`group-hover:scale-105`, parent `overflow-hidden` → pas de débordement). `whileHover` toujours neutralisé si `usePrefersReducedMotion`
- `GitHubRepos` : lift cohérent sur les cartes repo (`hover:-translate-y-1` + highlight bordure) en CSS pur — neutralisé par la règle globale `prefers-reduced-motion` (#11)
- Cohérence catalogue / featured / repos

Couvre US-PJ-01 (animations).

Tests validés :
- `npm run test:run` → **65 tests passants** (63 + FeaturedProjectCard 2 : rendu + chemin reduced-motion)
- `npm run lint` / `npm run typecheck` → 0
- Build vérifié en CI (changement purement CSS/anim, aucune route modifiée)

---

### Issue #50 — [2.9] Tests TF API /api/projects + mock GitHub

Tests fonctionnels de la couche données projets sur une **vraie base Postgres** (pas de mock Prisma), exécutés en CI sur le service `postgres` après `prisma migrate deploy` (rendu possible par la baseline #2.1).

- `vitest.config.ts` : 3e projet `tf` (environment `node`, `tests/tf/**/*.tf.test.ts`)
- `package.json` : script `test:tf` (`vitest run --project tf`)
- `tests/tf/projects.tf.test.ts` : `describe.skip` si pas de `DATABASE_URL` (local propre), sinon seed isolé (préfixe `tf-`, cleanup avant/après) + assertions sur `getPublishedProjects` (exclut DRAFT), filtre tag, `getProjectBySlug` (publié / DRAFT→null / inconnu→null), `getAllTags`, et `fetchPublicRepos` (fetch stubbé) — TF-PJ-01 à 04
- `ci.yml` (`web-tests`) : ajout `prisma migrate deploy` (DB de service) + step `npm run test:tf`

Couvre Cahier de tests TF-PJ-01 à TF-PJ-04.

Tests validés :
- Local : `test:run` 65 verts, `test:tf` 6 *skipped* proprement (pas de DB)
- `npm run lint` / `npm run typecheck` → 0
- **CI `web-tests`** : `migrate deploy` OK + 6 TF verts sur la DB de service (preuve empirique sur la PR)

---

### Issue #51 — [2.10] Tests E2E Playwright : parcours catalogue → détail

Première vraie suite Playwright (vide depuis le Sprint 0), rendue **bloquante** en CI.

- `@playwright/test@^1.60` ajouté (devDep ; `playwright` 1.60 déjà présent), script `test:e2e`
- `playwright.config.ts` : `testDir tests/e2e`, projet chromium, `webServer: npm run start` (sert le build du step CI), `reuseExistingServer: !CI`, retries CI
- `FeaturedProjectCard` : titre désormais lien interne vers `/projets/[slug]` (lien manquant — requis pour le parcours catalogue → détail, bénéficie aussi à la home)
- `tests/e2e/projets.e2e.spec.ts` : TE-01 (catalogue affiché) + TE-03 (filtre tag → URL `?tags=`, carte → détail, retour). Déterministe sans DB grâce au fallback mock (#2.3)
- `ci.yml` (`web-e2e-lighthouse`) : step Playwright **bloquant** (retrait de `--if-present` + `continue-on-error`)

Couvre Cahier de tests TE-01, TE-03.

Tests validés :
- Local : `lint` / `typecheck` 0, `test:run` **65 verts** (lien carte intégré sans régression)
- **CI `web-e2e-lighthouse`** : `Playwright E2E` vert et bloquant (preuve empirique sur la PR)

---

### Issue #52 — [2.11] Sprint 2 review + release v0.3.0

Clôture du Sprint 2 : revue, release develop→main, tag `v0.3.0`.

- `Docs/claude/Sprint docs/sprint2-projets.md` : issues + PRs, stack/versions, décisions (CI réparée, baseline Prisma, résilience build, tests 3 niveaux), dette, métriques (65 TU / 6 TF / 2 E2E), DoD §5 cochée, préparation Sprint 3
- PR `release: Sprint 2 - Projets` develop→main (merge commit, historique préservé)
- Tag `v0.3.0` + `gh release` ; milestone `M2 - Projets` fermée
- Mémoire projet mise à jour (correction : la CI n'avait jamais compilé avant le Sprint 2)

Tests validés :
- Récap conforme au format Sprint 1, versions cohérentes
- Toutes les issues Sprint 2 closed sur le Board, M2 fermée
- CI verte sur `develop` (3 jobs) avant release

---

## Sprint 3 — CV / Contact / Recherche

### Issue #65 — [3.1] Page /cv : timeline expériences animée au scroll

Page `/cv` en mode `editorial` avec timeline verticale antéchronologique, entrées révélées au scroll (Framer `whileInView`), rendu statique immédiat si `prefers-reduced-motion`.

- `lib/data/cv.ts` : type `CvEntry` + `CV_EXPERIENCES` (formation CESI CDA + projets leon-portfolio / CESIZen — données factuelles, pas d'employeur fictif), `start` pour le tri
- `components/sections/CvTimeline.tsx` : `CvTimelineView` (client) — `<ol>` bordée, puce, période/kind, rôle, org, points ; `motion.li` `whileInView` (once) gated `usePrefersReducedMotion`
- `app/cv/page.tsx` : metadata, mode editorial (route sans préfixe tech), h1 + intro + section timeline
- Tri antéchronologique (`start` desc) dans la vue

Couvre US-CV-01 (expériences).

Tests validés :
- `npm run test:run` → **67 tests passants** (65 + CvTimeline 2 : rendu entrées + ordre antéchronologique)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/cv` rendu statique (`○`)

---

### Issue #66 — [3.2] Sections Compétences + Formations + Langues + Loisirs

Complète `/cv` avec 4 sections sémantiques sous la timeline.

- `lib/data/cv.ts` : `CV_SKILLS` (4 groupes), `CV_FORMATIONS` (CESI CDA RNCP 6), `CV_LANGUES` (FR natif / EN B2), `CV_LOISIRS` — données factuelles
- `components/sections/CvSections.tsx` : `CvSectionsView` (pur) — `<section aria-labelledby>` + h2/h3, compétences en chips groupées, listes formations/langues/loisirs, responsive
- `app/cv/page.tsx` : rendu de `CvSectionsView` après la timeline

Couvre US-CV-01 (sections).

Tests validés :
- `npm run test:run` → **68 tests passants** (67 + CvSections 1 : 4 sections + contenu)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/cv` statique

---

### Issue #67 — [3.3] CSS @media print + bouton "Télécharger le PDF"

`/cv` imprimable proprement + export PDF via le navigateur, sans dépendance externe.

- `app/globals.css` : bloc `@media print` (masque `header`/`footer`/`.no-print`, fond blanc, liens noirs sans soulignement) + utilitaire `.print-only` (caché écran, visible print) — dans `@layer base`
- `components/ui/PrintButton.tsx` (client) : `window.print()`, `aria-label` explicite, classe `no-print` (s'auto-masque à l'impression)
- `app/cv/page.tsx` : bouton intégré dans l'en-tête

Couvre US-CV-02 (export).

Tests validés :
- `npm run test:run` → **70 tests passants** (68 + PrintButton 2 : a11y + classe no-print, clic → `window.print`)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/cv` statique

---

### Issue #68 — [3.4] Fidélité PDF imprimé (A4, sauts de page, en-tête)

Affine le rendu imprimé de `/cv` (option print navigateur retenue — pas de Pandoc en CI).

- `app/globals.css` (bloc `@media print`) : `@page { size: A4; margin: 1.5cm }`, `print-color-adjust: exact`, `font-size: 11pt`, `main` sans padding, `break-inside: avoid` sur `section`/`li`/`.break-avoid`, `break-after: avoid` sur les titres
- `components/sections/CvPrintHeader.tsx` : en-tête `.print-only` (identité + email/site/GitHub) — invisible à l'écran, en tête du PDF
- `app/cv/page.tsx` : `CvPrintHeader` en haut du document

Couvre US-CV-02 (fidélité).

Tests validés :
- `npm run test:run` → **72 tests passants** (70 + CvPrintHeader 2 : contenu + conteneur `.print-only` + props)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès (`✓ Compiled`), `/cv` statique

---

### Issue #69 — [3.5] Page /contact : mailto + icônes réseaux

Page `/contact` (mode editorial) : email (mailto), GitHub, LinkedIn, bouton copier l'email.

- `lib/data/socials.ts` : `CONTACT_EMAIL` + `SOCIALS` (Email mailto, GitHub factuel, LinkedIn handle à confirmer — donnée éditable)
- `components/sections/ContactView.tsx` (pur) : liste des canaux, liens externes `rel="noopener noreferrer"` + `aria-label`, slot `action`
- `components/ui/CopyEmailButton.tsx` (client) : `navigator.clipboard.writeText` + retour visuel "Email copié ✓", dégradation propre (le mailto reste)
- `app/contact/page.tsx` : metadata, mode editorial, h1 + intro

Couvre US-CT-01.

Tests validés :
- `npm run test:run` → **75 tests passants** (72 + ContactView 2 + CopyEmailButton 1 — test du comportement observable, userEvent fournit un presse-papier fonctionnel)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/contact` statique

---

### Issue #70 — [3.6] QR vCard SVG (optionnel)

QR code (SVG) encodant une vCard sur `/contact`, + repli .vcf téléchargeable.

- `lib/vcard.ts` (pur) : `buildVCard` (vCard 3.0, CRLF) + `vcardDataUri` (data URI `text/vcard`)
- `components/sections/ContactQrCode.tsx` (server async) : `qrcode` → SVG inline, `role="img"` + `aria-label`, lien `download="leon-heu.vcf"`
- `app/contact/page.tsx` : section QR sous les canaux
- Deps : `qrcode@^1.5.4` + `@types/qrcode`

Couvre US-CT-02.

Tests validés :
- `npm run test:run` → **78 tests passants** (75 + vcard 2 + ContactQrCode 1 : SVG `role=img` + lien .vcf data URI)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/contact` statique

---

### Issue #71 — [3.7] Recherche client Fuse.js sur /projets

Recherche temps réel (titre/résumé/tags) sur `/projets`, complémentaire du filtre tags serveur (#2.4).

- `lib/project-search.ts` (pur) : `searchProjects(projects, query)` Fuse.js (`threshold 0.4`, `ignoreLocation`), requête vide → liste inchangée
- `components/sections/ProjectsSearch.tsx` (client) : input `type="search"` labellisé (`sr-only`), `aria-controls`/`aria-live`, `useMemo` ; filtrage instantané (dataset réduit → pas de debounce, choix UX documenté) ; SSR rend la liste complète → dégradation propre sans JS
- `app/projets/page.tsx` : `ProjectsListView` remplacé par `ProjectsSearch` (réutilise la vue liste + état vide)
- Dép : `fuse.js@^7.3.0`

Couvre US-PJ-03.

Tests validés :
- `npm run test:run` → **84 tests passants** (78 + project-search 4 + ProjectsSearch 2 : filtre live + état vide)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/projets` `ƒ`

---

### Issue #72 — [3.8] Page /mentions-legales rédigée

Page légale (mode editorial) avec contenu réel et définitif (site vitrine sans collecte).

- `app/mentions-legales/page.tsx` : metadata + 5 sections `aria-labelledby` — Éditeur (Léon HEU), Hébergement (Proxmox auto-hébergé + domaine OVH SAS Roubaix), Propriété intellectuelle, Données personnelles & cookies (aucune collecte, aucun traceur), Liens externes
- Email réutilisé depuis `lib/data/socials.ts` ; lien depuis le footer (déjà présent)
- Aucun placeholder, texte V1 définitif

Couvre US-TR-04.

Tests validés :
- `npm run test:run` → **86 tests passants** (84 + MentionsLegales 2 : H1 + sections + absence de collecte)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/mentions-legales` statique

---

### Issue #73 — [3.9] sitemap.ts + robots.ts

SEO de base via les metadata routes Next App Router.

- `lib/seo.ts` (pur) : `siteUrl()` (`NEXT_PUBLIC_SITE_URL` défaut `https://leonheu.fr`, slash final retiré) + `buildSitemapEntries(base, slugs)` (6 routes statiques + pages projets, URLs absolues, priorités)
- `app/sitemap.ts` : async, `getPublishedProjects()` (fallback mock → jamais d'échec build) → `buildSitemapEntries`
- `app/robots.ts` : `allow: "/"` + `sitemap` absolu

Couvre US-TR-05.

Tests validés :
- `npm run test:run` → **89 tests passants** (86 + seo 3 : siteUrl défaut/env, entrées statiques+projets)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, `/sitemap.xml` + `/robots.txt` générés (`○`)

---

### Issue #74 — [3.10] Tests TF-WEB recette manuelle (E2E CV / Contact / recherche)

Extension de la suite Playwright (bloquante) avec les parcours Sprint 3.

- `tests/e2e/cv-contact.e2e.spec.ts` :
  - TF-WEB-04 `/cv` : h1 + section Expériences + bouton "Télécharger le CV en PDF"
  - TF-WEB-04 `/contact` : lien email `mailto:` + GitHub + bouton "Copier l'adresse email"
  - TF-WEB-08 `/projets` : recherche client → état vide sur requête sans résultat, retour liste à la réinitialisation
- Déterministe sans DB (fallback mock pour `/projets`), reste dans le job `web-e2e-lighthouse` bloquant (aucun changement CI nécessaire)

Couvre Cahier de tests TF-WEB-04, TF-WEB-08.

Tests validés :
- `npm run lint` / `npm run typecheck` → 0 ; TU unit inchangés (89)
- ⚠ Régression : le spec contact violait le strict mode Playwright (lien Email présent aussi dans le Footer global) ; PR #85 mergée à tort sur CI rouge → corrigée par #86

---

### Issue #86 — [3.10-fix] E2E /contact strict-mode violation (régression #85)

Correctif d'une régression : la PR #85 (#74) a été mergée alors que `web-e2e-lighthouse` était rouge (pas de branch protection requérant les checks). Le spec `/contact` matchait 2 liens « Email » (page **et** `Footer` global) → strict mode violation Playwright.

- `tests/e2e/cv-contact.e2e.spec.ts` : toutes les requêtes `/cv` et `/contact` scopées à `page.getByRole("main")` (exclut Header/Footer)
- Process corrigé : merge conditionné à une CI verte vérifiée explicitement (plus de merge chaîné inconditionnel)

Tests validés :
- Local : `npm run build` + `npm run test:e2e` → **5/5 specs verts** (projets + cv-contact)
- CI `web-e2e-lighthouse` verte et bloquante avant merge (vérifiée)

---

### Issue #75 — [3.11] Sprint 3 review + release v0.4.0

Clôture du Sprint 3 : revue, release develop→main, tag `v0.4.0`.

- `Docs/claude/Sprint docs/sprint3-cv-contact-recherche.md` : issues + PRs, stack (qrcode, fuse.js), décisions (print sans Pandoc, recherche vs filtre, incident merge CI rouge #85→#86 + process corrigé), dette (recommandation branch protection), métriques (89 TU / 6 TF / 5 E2E), DoD §6 cochée, prépa Sprint 4 (Admin)
- PR `release: Sprint 3 - CV / Contact / Recherche` develop→main (merge commit)
- Tag `v0.4.0` + `gh release` ; milestone `M3` fermée
- Mémoire projet mise à jour

Tests validés :
- Récap conforme au format Sprint 2, versions cohérentes
- Toutes les issues Sprint 3 closed sur le Board, M3 fermée
- CI verte sur `develop` avant release

---

## Sprint 4 — Admin

### Issue #90 — [4.1] Schéma admin — vérification (aucune nouvelle migration)

Le schéma `User`/`Article`/`ArticleTag` (+ `Project`/`Tag`/`ProjectTag`) existe depuis le Sprint 0 (#14) et la baseline `20260516000000_init` (#42) le couvre. Vérification de parité avant le CRUD admin.

- `git log -- web/prisma/schema.prisma` : un seul commit (#14) → schéma inchangé depuis le Sprint 0
- Comparaison normalisée `prisma migrate diff --from-empty --to-schema-datamodel` vs migration committée : **73 lignes identiques** → parité stricte, aucune nouvelle migration requise
- `prisma validate` → schéma valide
- Champs suffisants pour l'admin : `User.role`, timestamps, relations `ProjectTag`/`ArticleTag`, enums statut

Tests validés :
- Parité schéma ↔ baseline migration prouvée (diff normalisé vide)
- CI verte (branch protection désormais active sur develop/main)

---

### Issue #91 — [4.2] Seed admin — robustification + garde secret

Le seed (#14) crée déjà 1 admin idempotent (`upsert`, bcrypt cost 12, env-driven). Robustification avant l'arrivée de l'auth.

- `lib/admin-guard.ts` (pur) : `isPlaceholderSecret` (vide / < 12 car. / placeholder connu)
- `prisma/seed.ts` : avertissement non bloquant si `ADMIN_PASSWORD` faible/défaut ou `AUTH_SECRET` absent/faible (hygiène avant Sprint 4 Auth.js) ; ne logue jamais le mot de passe
- `.env.example` : ajout `ADMIN_NAME`
- Idempotence/cost 12 confirmés (inchangés)

Tests validés :
- `npm run test:run` → **92 tests passants** (89 + admin-guard 3)
- `npm run lint` / `npm run typecheck` → 0
- CI verte (3 checks, branch protection)

---

### Issue #92 — [4.3] Setup Auth.js v5 (credentials Prisma + bcrypt)

Authentification admin avec Auth.js v5 (`next-auth@beta`), provider Credentials, session JWT.

- `auth.config.ts` **Edge-safe** (aucun import Prisma/bcrypt) : `pages.signIn=/login`, `session jwt`, `trustHost`, callbacks `authorized` (garde `/admin/*`), `jwt`/`session` (injectent `id`+`role`) — réutilisable par le middleware (#4.4)
- `lib/credentials.ts` (pur) : `parseCredentials` (objet, email normalisé+regex, password présent) — testable
- `auth.ts` (Node) : `NextAuth({...authConfig, providers:[Credentials({authorize})]})` ; `authorize` → `parseCredentials` → **import Prisma paresseux** (build sans `DATABASE_URL` OK) → `findUnique` → `bcrypt.compare` → `{id,email,name,role}` ou `null` (aucune énumération, pas de hash renvoyé)
- `app/api/auth/[...nextauth]/route.ts` : `GET`/`POST` handlers
- `types/next-auth.d.ts` : augmentation `Session`/`User`/`JWT` (id, role)
- Branche `feat/web-authjs`, dép `next-auth@^5.0.0-beta.31`

Couvre US-AD-01 (socle auth).

Tests validés :
- `npm run test:run` → **99 tests passants** (92 + credentials 3 + auth-config 4 : authorized garde /admin, jwt/session)
- `npm run lint` / `npm run typecheck` → 0
- `npm run build` → succès, route `/api/auth/[...nextauth]` (`ƒ`)

---

### Issue #93 — [4.4] Middleware Next.js de protection /admin/*

Protection des routes admin via le middleware Auth.js (pattern split Edge-safe).

- `middleware.ts` : `const { auth } = NextAuth(authConfig); export default auth;` (authConfig sans Prisma/bcrypt → Edge-safe), `matcher: ["/admin/:path*"]`
- ⚠ Contrainte Next 16 : le middleware doit être un **export direct** (default ou `export const middleware`), **pas un export déstructuré** (`export const { auth: middleware }` → "must export a function"). 1re tentative rouge en CI (build), corrigée sur la même branche ; build désormais validé par **code retour** (pas par grep)
- Le callback `authorized` (#92) renvoie `false` pour `/admin/*` sans session → Auth.js redirige vers `/login` avec `callbackUrl` automatique
- Logique de garde déjà couverte par `auth-config.test.ts` (#92) ; parcours E2E prévu #4.15

Couvre US-AD-01 (protection).

Tests validés :
- `npm run test:run` → 99 tests passants (inchangé — garde testée via authConfig)
- `npm run lint` / `npm run typecheck` → exit 0
- `npm run build` → exit 0, middleware reconnu (`ƒ Proxy (Middleware)`)

---

### Issue #94 — [4.5] Page /login + Server Action

Page de connexion admin avec Server Action Auth.js, message d'erreur générique.

- `app/login/actions.ts` (`"use server"`) : `authenticate(prev, formData)` → `signIn("credentials", { redirectTo })` ; `AuthError` → `{ error: "Identifiants invalides." }` (aucune énumération) ; redirections (succès) relancées ; `callbackUrl` validé (préfixe `/`)
- `components/auth/LoginForm.tsx` (client) : `useActionState`, champs labellisés + `autoComplete`, `role="alert"` erreur, état `pending`, `callbackUrl` en input caché — action **injectée** (testable)
- `app/login/page.tsx` : metadata `robots: noindex`, `searchParams.callbackUrl` (Promise Next 16), mode editorial

Couvre US-AD-01 (login).

Tests validés :
- `npm run test:run` → **101 tests passants** (99 + LoginForm 2 : champs/callbackUrl + affichage erreur via action)
- `npm run lint` / `npm run typecheck` → exit 0
- `npm run build` → exit 0 (validé par code retour)

---

### Issue #95 — [4.6] Rate limit login (5 / 15 min)

Protection anti-bruteforce sur la connexion.

- `lib/rate-limit.ts` (pur, `now` injectable) : limiteur fenêtre fixe en mémoire (par instance serveur — suffisant V1 self-host, documenté), `rateLimit(key, limit, windowMs)` → `{ allowed, remaining, retryAfterMs }`, `_resetRateLimitStore` (tests)
- `app/login/actions.ts` : clé `login:<ip>:<email>` (IP via `x-forwarded-for`), **5 / 15 min** ; dépassement → message **générique** "Trop de tentatives. Réessayez plus tard." (pas d'énumération)

Couvre US-TR-03.

Tests validés :
- `npm run test:run` → **104 tests passants** (101 + rate-limit 3 : seuil, reset fenêtre, isolation des clés)
- `npm run lint` / `npm run typecheck` → exit 0
- `npm run build` → exit 0

---

### Issue #96 — [4.7] Page /admin dashboard

Tableau de bord admin (protégé middleware, mode tech).

- `lib/admin-stats.ts` : `getAdminStats()` (Prisma lazy `count`, fallback 0)
- `app/admin/actions.ts` : `logout()` → `signOut({ redirectTo: "/login" })`
- `components/admin/AdminDashboardView.tsx` (pur) : 3 compteurs, user, nav projets/tags/articles, bouton déconnexion (action injectée)
- `app/admin/page.tsx` : `auth()` + `getAdminStats()`, `force-dynamic`, `robots noindex`

Couvre US-AD-03.

Tests validés :
- `npm run test:run` → **105 tests passants** (104 + AdminDashboardView 1)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0

---

### Issue #97 — [4.8] /admin/projects liste + recherche + filtres

- `lib/admin-projects.ts` : `listAdminProjects({q,status})` (tous statuts, recherche `title`/`slug` insensitive, filtre statut, Prisma lazy + fallback [])
- `components/admin/AdminProjectsTable.tsx` (pur) : form GET recherche/statut, table, liens éditer + nouveau, état vide accessible
- `app/admin/projects/page.tsx` : `searchParams` (Promise), `force-dynamic`, `robots noindex`

Couvre US-AD-04 (liste).

Tests validés :
- `npm run test:run` → **109 tests passants** (105 + admin-projects 2 + AdminProjectsTable 2 ; fallback boilerplate non re-testé — déjà couvert ailleurs, mock de rejet fragile vitest)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0

---

### Issue #98 — [4.9] /admin/projects/new + Server Action create

- `lib/project-input.ts` (pur) : `slugify` + `validateProjectInput(FormData)` (titre/résumé requis, slug auto, statut, tags CSV slugifiés/dédoublonnés)
- `app/admin/projects/actions.ts` (`"use server"`) : `persist` partagé → `createProject`/`updateProject`/`deleteProject` ; slug unique vérifié, tags `connectOrCreate`, `revalidatePath` + `redirect` hors try (NEXT_REDIRECT non avalé)
- `components/admin/ProjectForm.tsx` (client, réutilisable create/edit) : `useActionState`, champs labellisés, `role="alert"`, action injectée
- `app/admin/projects/new/page.tsx` : `robots noindex`

Couvre US-AD-04 (création).

Tests validés :
- `npm run test:run` → **114 tests passants** (109 + project-input 4 + ProjectForm 1)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0

---

### Issue #99 — [4.10] /admin/projects/[id] édition + delete

- `lib/admin-project-detail.ts` : `toFormInitial` (pur) + `getAdminProject(id)` (lazy + fallback null)
- `app/admin/projects/[id]/page.tsx` : `notFound()` si absent, `ProjectForm` pré-rempli + `updateProject.bind(null,id)`, form delete `deleteProject.bind(null,id)`, `force-dynamic noindex`
- Réutilise les Server Actions `updateProject`/`deleteProject` (#98)

Couvre US-AD-04 (édition/suppression).

Tests validés :
- `npm run test:run` → **115 tests passants** (114 + admin-project-detail 1)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0

---

### Issue #100 — [4.11] /admin/tags CRUD inline

- `lib/tag-input.ts` (pur) : `normalizeTagName` (requis, ≤40, slug)
- `lib/admin-tags.ts` : `listTags()` (+ `_count.projects`, lazy + fallback [])
- `app/admin/tags/actions.ts` : `createTag` (slug unique), `renameTag(id)`, `deleteTag(id)`, `revalidatePath`
- `components/admin/AddTagForm.tsx` (client, `useActionState`, `role="alert"`)
- `app/admin/tags/page.tsx` : add form + rename/delete inline (Server Actions `bind`), état vide, `force-dynamic noindex`

Couvre US-AD-05.

Tests validés :
- `npm run test:run` → **120 tests passants** (115 + tag-input 2 + admin-tags 1 + AddTagForm 2)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0

---

### Issue #101 — [4.12] Upload images /api/admin/upload + sharp

- `lib/upload.ts` (pur) : `validateUpload(type, size)` (jpeg/png/webp, ≤ 5 Mo)
- `app/api/admin/upload/route.ts` : `POST` — `auth()` obligatoire (401 sinon), validation, `sharp` **import paresseux** (resize 1600 inside + webp q80), nom `randomUUID().webp`, écriture `public/uploads` (gitignored), `201 { url }`
- Dép : `sharp@^0.34.5`

Couvre US-AD-06.

Tests validés :
- `npm run test:run` → **123 tests passants** (120 + upload 3 : formats, vide, trop volumineux)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0 (sharp en import paresseux → build OK)

---

### Issue #102 — [4.13] /admin/articles CRUD draft (sans publication V1)

- `lib/article-input.ts` (pur) : `validateArticleInput` (titre/résumé requis, slug auto, tags CSV)
- `lib/admin-articles.ts` : `listAdminArticles` + `articleToFormInitial` (pur) + `getAdminArticle` (lazy fallback null)
- `app/admin/articles/actions.ts` : `persist` (create/update) **statut forcé `DRAFT`**, `deleteArticle`, slug unique, `connectOrCreate` tags, `redirect` hors try
- `components/admin/ArticleForm.tsx` (client `useActionState`) + pages liste / new / `[id]` (édition + delete, `notFound`), `force-dynamic noindex`
- Aucune route publique article (blog V2)

Couvre US-AD-07.

Tests validés :
- `npm run test:run` → **126 tests passants** (123 + article-input 2 + admin-articles 1)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0

---

### Issue #103 — [4.14] Tests TF API admin (auth, CRUD, rate limit)

- `tests/tf/admin.tf.test.ts` (projet vitest `tf`, vraie DB en CI ; `describe.skip` sans `DATABASE_URL`) : seed isolé (préfixe `tfadmin-`, cleanup avant/après)
  - TF-AUTH-01/02 : `authorizeCore` (parseCredentials + `findUnique` + `bcrypt.compare`) — identifiants valides/invalides/inconnu
  - TF-AD-01..07 : `listAdminProjects` (+filtre), `getAdminProject`, `listTags` (+compte), `listAdminArticles`/`getAdminArticle`, `getAdminStats`
  - rate limit : blocage au-delà du seuil sur DB seedée

Couvre Cahier TF-AD-01..07 / TF-AUTH-01,02.

Tests validés :
- Local : `lint`/`typecheck` exit 0, `test:run` 126 unit, `test:tf` 14 *skipped* (2 fichiers, pas de DB)
- **CI `web-tests`** : 14 TF verts sur la DB de service (projets + admin) — preuve empirique sur la PR

---

### Issue #104 — [4.15] Tests E2E login admin

- `tests/e2e/admin-login.e2e.spec.ts` (bloquant, scopé `<main>`) : TE-04 — `/admin` non connecté → redirection `/login` ; identifiants invalides → message générique
- **Durcissement `auth.ts`** : `authorize` enveloppe le lookup Prisma/bcrypt dans un try/catch → renvoie `null` (réponse uniforme « invalide », jamais de 500 ni de fuite, anti-énumération) — corrige aussi le déterminisme E2E sans DB
- `ci.yml` (`web-e2e-lighthouse`) : `env.AUTH_SECRET` factice au niveau du job (Auth.js configuré pour les E2E ; sans secret → erreur `Configuration` non déterministe)
- Validé **en local** (`AUTH_SECRET` exporté, mirroir CI) : `npm run test:e2e` → **7/7 specs verts**

Couvre Cahier TE-04.

Tests validés :
- Local : `lint`/`typecheck` exit 0, `test:run` 126 unit, `test:e2e` 7/7 (avec AUTH_SECRET)
- **CI `web-e2e-lighthouse`** : E2E bloquants verts (AUTH_SECRET job) — preuve sur la PR

---

### Issue #105 — [4.16] Sprint 4 review + release v0.5.0

Clôture du Sprint 4 (le plus chargé) : revue, release develop→main, tag `v0.5.0`.

- `Docs/claude/Sprint docs/sprint4-admin.md` : 15 issues + PRs, stack (next-auth v5, sharp), décisions (split Edge/Node, authorize uniforme, export middleware, rate limit, upload, branch protection), dette, métriques (126 TU / 14 TF / 7 E2E), DoD §7 cochée, prépa Sprint 5 (Mobile)
- PR `release: Sprint 4 - Admin` develop→main (merge commit) ; tag `v0.5.0` + `gh release` ; milestone M4 fermée
- Mémoire projet mise à jour

Tests validés :
- Récap conforme au format Sprint 3, versions cohérentes
- Toutes les issues Sprint 4 closed, M4 fermée
- CI verte sur `develop` avant release

---

### Correctif post-S4 — LoginForm.test.tsx non commité (#94)

Honnêteté/traçabilité : `web/tests/unit/LoginForm.test.tsx` (créé au #94) n'avait pas été ajouté au `git add` du commit 4.5 → resté **untracked**. Il s'exécutait en local (d'où les comptes TU du JOURNAL ≥ #94) mais **pas en CI** : `LoginForm` n'était pas couvert côté CI, et les comptes CI réels étaient inférieurs de 2 aux chiffres annoncés.

- Fichier intégré au dépôt (2 tests : champs/callbackUrl + affichage erreur via action)
- CI passe donc de 124 → **126 TU** (alignée sur le JOURNAL)
- Leçon : vérifier `git status` (untracked) en fin d'issue, pas seulement `git add <chemins>` ciblés

Tests validés :
- `npm run test:run` → 126 (le fichier orphelin désormais tracké et exécuté en CI)
- CI verte (branch protection)

---

## Sprint 5 — Mobile

### Issue #124 — [5.0] API publique web GET /api/projects (+ /[slug])

Réconciliation : le web est en Server Components/Prisma, aucune API JSON. L'app mobile (Expo) ne peut pas importer Prisma → exposer une API publique en lecture.

- `app/api/projects/route.ts` : `GET` (réutilise `getPublishedProjects`, filtre `?tags=`), `Cache-Control` + CORS GET, `OPTIONS` 204, `force-dynamic`
- `app/api/projects/[slug]/route.ts` : `GET` → détail ou **404 JSON**, CORS, `OPTIONS`
- Aucune donnée admin exposée (réutilise les fonctions publiques + fallback mock)

Couvre US-PJ-04 (API) — prérequis #5.4/#5.5.

Tests validés :
- `npm run test:run` → **130 tests passants** (126 + api-projects 4 : liste+CORS, filtre tags, détail, 404). Correctif `vi.hoisted` (factory `vi.mock` ne peut référencer des `const` non hoistés)
- `npm run lint` / `npm run typecheck` / `npm run build` → exit 0

---

### Issue #125 — [5.1] Init projet Expo SDK 54 dans mobile/

Scaffold de l'app Expo dans `mobile/` (suppression `.gitkeep`).

- `npx create-expo-app@latest mobile --template default` (Expo **SDK 54.0.33**, React Native 0.81, expo-router 6, TypeScript, reanimated 4 déjà inclus)
- **Fichiers IA supprimés** : `mobile/AGENTS.md`, `mobile/CLAUDE.md`, `mobile/.claude/` (générés par le scaffold, interdits par la méthodo)
- `package.json` : ajout script `typecheck` (`tsc --noEmit`)
- `mobile/.gitignore` du template (node_modules/.expo/dist ignorés) ; `node_modules` non commité

Couvre US-MOB-01.

Tests validés :
- `mobile` : `npm run typecheck` exit 0, `npm run lint` (expo lint) exit 0
- Aucun fichier IA résiduel ; web inchangé (CI web verte, `mobile-checks` tolérant jusqu'à #5.13)

---

### Issue #126 — [5.2] expo-router + layout (tabs) 4 onglets

- `app/(tabs)/_layout.tsx` réécrit : 4 onglets **Accueil / Projets / À propos / Contact** (titres FR, `tabBarAccessibilityLabel`, icônes)
- `components/ui/icon-symbol.tsx` : MAPPING étendu (`folder.fill`→folder, `person.fill`→person, `envelope.fill`→mail)
- Suppression de l'onglet template `explore.tsx` ; stubs `projects.tsx`/`about.tsx`/`contact.tsx` (contenu enrichi #5.4/#5.7/#5.8)

Couvre US-MOB-02.

Tests validés :
- `mobile` : `npm run typecheck` exit 0, `npm run lint` exit 0
- Navigation tabs fonctionnelle (4 routes résolues)

---

### Issue #127 — [5.3] Écran (tabs)/index accueil simplifié

- `app/(tabs)/index.tsx` réécrit (sans le boilerplate template) : titre « Léon HEU », sous-titre, pitch, CTA `Link href="/projects"`
- `ThemedText`/`ThemedView` du template réutilisés

Tests validés :
- `mobile` : `npm run typecheck` / `npm run lint` exit 0

---

### Issue #128 — [5.4] Écran Projets : FlatList + TanStack Query

- Deps : `@tanstack/react-query` + infra tests `jest-expo` (`@testing-library/react-native`, jest config preset + `moduleNameMapper @/`)
- `lib/api.ts` : `fetchProjects`/`fetchProject` (base `EXPO_PUBLIC_API_URL` défaut prod, `fetch` injectable, 404→null, throw si !ok)
- `lib/query-client.ts` (singleton) + `app/_layout.tsx` enveloppé `QueryClientProvider`
- `hooks/use-projects.ts` : `useProjects` / `useProject`
- `app/(tabs)/projects.tsx` : `FlatList` (cartes titre/résumé/tags), états loading/erreur/vide

Couvre US-MOB-03 (consomme l'API #5.0).

Tests validés :
- `mobile` : `npm run typecheck` / `npm run lint` exit 0 ; `npm test` (jest-expo) → **5/5** (lib-api : mapping, !ok, 404, détail)

---

### Issue #129 — [5.5] Écran détail projet + partage

- `app/projects/[slug].tsx` : `useProject(slug)`, états loading/erreur/404, contenu (titre/résumé/tags/corps), `Stack.Screen` titre dynamique, bouton **Partager** (`Share` natif)
- `lib/share.ts` (pur) : `buildShareMessage` (titre + résumé + lien web `EXPO_PUBLIC_SITE_URL/projets/slug`)
- `app/(tabs)/projects.tsx` : cartes enveloppées `Link href="/projects/[slug]"` (`Pressable`, `accessibilityRole`)

Couvre US-MOB-04.

Tests validés :
- `mobile` : `npm run typecheck` / `npm run lint` exit 0 ; `npm test` → **6/6** (lib-api 5 + share 1)

---

### Issue #130 — [5.6] Pull-to-refresh catalogue

- `app/(tabs)/projects.tsx` : `RefreshControl` (refreshing=`isRefetching`, onRefresh=`refetch` TanStack Query)

Couvre US-MOB-05.

Tests validés :
- `mobile` : typecheck / lint exit 0 ; `npm test` 6/6 (comportement RefreshControl couvert par la recette #5.12)

---

### Issue #131 — [5.7] Écran (tabs)/about

- `app/(tabs)/about.tsx` : bio courte (cohérente avec le web `/about`), `ScrollView`

Tests validés :
- `mobile` : typecheck / lint exit 0

---

### Issue #132 — [5.8] Écran (tabs)/contact + mailto/share

- `lib/contact.ts` (pur) : `buildMailtoUrl` (sujet encodé), `CONTACT_EMAIL`, `GITHUB_URL`
- `app/(tabs)/contact.tsx` : boutons Email (`Linking` mailto), GitHub (`Linking`), Partager (`Share`)

Couvre US-CT-01.

Tests validés :
- `mobile` : typecheck / lint exit 0 ; `npm test` → **8/8** (+ contact 2)

---

### Issue #133 — [5.9] Animations transitions Reanimated

- `hooks/use-reduce-motion.ts` : suit `AccessibilityInfo` (reduceMotion + listener)
- `app/(tabs)/projects.tsx` : cartes en `Animated.View` `FadeInDown` échelonné (`delay index*50`), **désactivé si reduce motion**

Tests validés :
- `mobile` : typecheck / lint exit 0 ; `npm test` 8/8 (anim/a11y vérifiées en recette #5.12)

---

### Issue #134 — [5.10] Configuration EAS Build (profil preview)

- `mobile/eas.json` : profils `development` / **`preview`** (`distribution: internal`, `android.buildType: apk`) / `production` (`autoIncrement`)
- `mobile/app.json` : `name` "Léon HEU — Portfolio", `slug` `leon-portfolio`, `android.package` + `ios.bundleIdentifier` `fr.leonheu.portfolio`
- Build cloud APK = étape Léon (#5.11, credentials EAS) : `cd mobile && npx eas login && npx eas build -p android --profile preview`

Couvre US-MOB-01 (config).

Tests validés :
- `mobile` : typecheck / lint exit 0 ; `eas.json`/`app.json` JSON valides (config uniquement, pas de build cloud ici)

---

### Issue #135 — [5.11] Build APK preview + test device

⚠ **Étape manuelle Léon** (credentials EAS) — non automatisable, comme `docker/migrate` au Sprint 2. Config livrée (#134). Issue **laissée ouverte** (dépendance externe), procédure documentée en commentaire d'issue + recette #5.12. Le Sprint 5 est clôturé avec cette issue explicitement en attente.

---

### Issue #136 — [5.12] Recette manuelle TM + proxies automatisés

- `Docs/claude/leon-portfolio/mobile-recette.md` : checklist **TM-01..08** (device, à dérouler par Léon après l'APK #5.11)
- Proxies automatisés (jest-expo, sans device) : `lib/api`, `lib/share`, `lib/contact` + **smoke render** des écrans statiques About/Contact

Couvre Cahier de tests TM-*.

Tests validés :
- `mobile` : typecheck / lint exit 0 ; `npm test` → **10/10** (4 suites : lib-api 5, share 1, contact 2, screens 2)

---
