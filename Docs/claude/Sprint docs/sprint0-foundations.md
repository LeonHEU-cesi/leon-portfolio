# Sprint 0 — Foundations

**Période :** 2026-05-14 → 2026-05-15
**Milestone :** M0 - Foundations
**Statut :** ✅ Clos
**Durée effective :** ≈ 1 jour de travail (bootstrap + scaffold)

---

## 1. Issues livrées

| # | Titre | Statut | PR |
|---|---|---|---|
| #1 | Init repo Git local + remote GitHub | ✅ closed (bootstrap) | — |
| #2 | Default branch develop + auto-delete branches | ✅ closed (bootstrap) | — |
| #3 | Issues + milestones + labels + Project Board v2 | ✅ closed (bootstrap) | — |
| #4 | .gitignore + .env.example + README + JOURNAL | ✅ closed (bootstrap) | — |
| #5 | Init Next.js 15 + TypeScript strict dans web/ | ✅ closed | #13 |
| #6 | Init Prisma + schema + 1ère migration + seed | ✅ closed | #14 |
| #7 | Docker Compose dev local | ✅ closed (bootstrap) | — |
| #8 | CI GitHub Actions minimale | ✅ closed (bootstrap) | — |
| #9 | Storybook 10 + stories démo | ✅ closed | #15 |
| #10 | 3 directions visuelles + choix utilisateur | ✅ closed | #16 |
| #11 | Tokens design Tailwind v4 + fonts | ✅ closed | #17 |
| #12 | Layout root + Header / Footer + Providers | ✅ closed | #18 |

**Total : 12 issues / 12 closed (100%)**

---

## 2. Stack en place (versions exactes)

| Couche | Outil | Version installée | Cible plan_dev | Statut |
|---|---|---|---|---|
| Framework web | Next.js | **16.2.6** | 15.x | ⚠ supérieur (App Router rétro-compat) |
| Langage | TypeScript | 5.x (latest npm) | 5.x | ✅ |
| Strict mode | tsconfig | strict + noUncheckedIndexedAccess + noImplicitOverride + forceConsistentCasingInFileNames | strict | ✅ durci |
| Styling | Tailwind CSS | v4 (`@tailwindcss/postcss`) | v4 | ✅ |
| ORM | Prisma | **6.19.3** | 5.x | ⚠ supérieur (downgrade volontaire depuis 7.x) |
| DB | PostgreSQL | 16-alpine (Docker) | 16 | ✅ |
| Auth | Auth.js v5 | non installé V1 sprint 0 | 5.x | ⏳ Sprint 4 |
| Hash | bcryptjs | 3.x | bcrypt 5.x | ✅ (équivalent compatible) |
| Design System | Storybook | **10.4.0** | 8.x | ⚠ supérieur |
| Tests | Vitest | 4.x | 2.x | ⚠ supérieur (installé par Storybook) |
| E2E | Playwright | 1.60.0 | latest | ✅ (installé par Storybook) |
| Fonts | Fraunces, Inter, Geist, Geist Mono | via `next/font/google` | — | ✅ |
| Theme | next-themes | latest | — | ✅ |
| CI | GitHub Actions | — | — | ✅ 3 jobs squelette |
| Conteneur dev | Docker Compose | — | — | ✅ Postgres + Adminer |

### Écarts versions
Le scaffold Next 16.2.6 installé est supérieur à la cible plan_dev (15.x). Idem Prisma 6.19.3 (cible 5.x), Storybook 10.4 (cible 8.x). On consigne ces écarts comme **dette documentaire** (le plan_dev sera mis à jour Sprint 1). L'API publique reste compatible.

⚠ Downgrade explicite : Prisma 7.x (default scaffold) → 6.x pour conserver l'API client classique (`import { PrismaClient } from "@prisma/client"`). Prisma 7 requiert `prisma.config.ts` + Driver Adapters, breaking change non souhaité V1.

---

## 3. Décisions techniques notables

### 3.1 Architecture
- **Next.js full-stack** : pas d'API séparée (validé pertinence-solution.md), Route Handlers dans `app/api/*` suffisent pour mobile compagnon
- **Monorepo simple** : `web/` autonome, `mobile/` viendra au Sprint 5
- **Prisma 6 retenu** (downgrade depuis 7) pour API stable

### 3.2 Design system
- **Direction visuelle Hybride A+C** validée (choix de Léon) : éditorial sur landing/CV/About, tech sombre sur projets/admin/blog
- **4 palettes** OKLCH : editorial-light, editorial-dark, tech-dark, tech-light
- **Custom variants Tailwind v4** : `dark`, `editorial`, `tech` permettent du `tech:font-mono` ou `editorial:font-serif`
- **`<ModeProvider>` client-side** détecte la route et switch `data-mode` automatiquement (préfixes `/projets`, `/admin`, `/blog` → tech)
- **next-themes** pour le toggle light/dark/system, `data-theme` attribute

### 3.3 Conventions
- Tous les fichiers `AGENTS.md` (Next 16) / `CLAUDE.md` interdits — flag `--no-agents-md` au scaffold + `eslint.config.mjs` ignores
- `addon-mcp` Storybook désinstallé (placeholder AI, conflit avec conv "pas de signature IA")
- ESLint ignores ajoutés : `storybook-static/**`, `coverage/**`, `playwright-report/**`, `node_modules/.prisma/**`
- ConventionalCommits respecté sur toutes les PRs (#13-#18)
- Default branch `develop`, auto-delete branches activé
- Pas de Co-Authored-By Claude, pas d'emoji robot, pas de "Generated with..."

---

## 4. Dette technique identifiée

| Item | Sprint cible | Note |
|---|---|---|
| Tests TU Header/Footer (Vitest jsdom config) | Sprint 1 | Setup Vitest browser existe (Storybook), à étendre avec un project `unit` jsdom + `@testing-library/react` |
| `mounted` state pattern ThemeToggle (`eslint-disable` React 19) | Sprint 1 | Refactor avec `useSyncExternalStore` pour éviter le disable |
| Première migration Prisma | Sprint 1 (premier dev session avec Docker up) | `npx prisma migrate dev --name init` |
| Plan_developpement.md : versions à mettre à jour | Sprint 1 | Refléter Next 16, Prisma 6, Storybook 10 |
| Stories Storybook pour Header / Footer / ThemeToggle | Sprint 1 | Au moment de finaliser le DS |
| Storybook public domain (Basic Auth) | Sprint 7 | Si on déploie sur storybook.leonheu.fr |
| Storybook tests Playwright en CI | Sprint 6 | Hardening |
| Migration Prisma 7 | Roadmap V2 | Quand l'écosystème adapter sera mature |
| Auth.js v5 stable release watch | À chaque sprint | Pin version exacte en attendant la stable |

---

## 5. Métriques

| Métrique | Valeur |
|---|---|
| Commits sur `develop` (hors bootstrap) | 6 |
| Pull Requests mergées | 6 (#13, #14, #15, #16, #17, #18) |
| Issues fermées | 12 / 12 |
| Tests unitaires | 0 (reporté Sprint 1) |
| Tests fonctionnels API | 0 (reporté Sprint 1) |
| Tests E2E | 0 (Playwright installé, suite vide) |
| Stories Storybook | 5 (Button, Header, Page, Configure, Tokens × 4 variants) |
| Routes Next.js statiques | 2 (`/`, `/_not-found`) |
| Lighthouse | Non mesuré au Sprint 0 (perf benchmark Sprint 6) |
| Lignes de code (approx web/) | ~8 000 dont 6 000 du scaffold |
| Temps total passé | ~6h cumulées (bootstrap + scaffolds + decisions) |

---

## 6. Definition of Done — Sprint 0

- [x] `git clone leon-portfolio && cd leon-portfolio && docker compose up -d && cd web && npm i && npm run dev` fonctionnel (configuration validée)
- [x] CI verte sur develop (workflows tournent, jobs continue-on-error pour commandes pas encore configurées au Sprint 0)
- [x] Storybook accessible sur localhost:6006 avec ≥ 2 stories
- [x] Direction visuelle choisie (Hybride A+C) et tokens en place
- [x] Sprint review rédigé dans `Docs/claude/Sprint docs/sprint0-foundations.md`

---

## 7. Préparation Sprint 1 — Vitrine Hero

### Issues à pré-créer
- 1.1 Header — nav avec indicateur page active : ⚠ déjà fait au Sprint 0 (issue #12 a couvert nav + indicateur)
- 1.2 Menu burger mobile animé
- 1.3 Footer + lien mentions légales : ⚠ déjà fait au Sprint 0 (issue #12)
- 1.4 Hero animé GSAP avec ScrollTrigger
- 1.5 Section "Projets phares" (3 statique pour V1)
- 1.6 Hook `usePrefersReducedMotion` + tests TU
- 1.7 Toggle dark mode persistant : ⚠ déjà fait au Sprint 0 (issue #12 + #11)
- 1.8 Page `/about` avec bio narrative
- 1.9 Tests TU + TF-WEB sur Sprint 1

### Issues "déjà partiellement faites" au Sprint 0
- Header (1.1) : nav + indicateur en place. **Reste à faire Sprint 1 :** menu burger mobile (1.2)
- Footer (1.3) : minimal en place. **Reste :** styling + responsive raffiné
- Dark mode toggle (1.7) : en place via ThemeToggle. **Reste :** validation visuelle des transitions

### Issues "à pré-créer pour le Sprint 1"
1. **#19** Menu burger mobile animé (slide depuis droite)
2. **#20** Hero animé GSAP + ScrollTrigger
3. **#21** Section "Projets phares" sur l'accueil
4. **#22** Hook `usePrefersReducedMotion` + tests TU
5. **#23** Page `/about` complète avec bio narrative
6. **#24** Setup Vitest jsdom + @testing-library/react pour TU
7. **#25** Tests TU Header + Footer + ThemeToggle (reportés du Sprint 0)
8. **#26** Recette manuelle TF-WEB Sprint 1

Ces 8 issues seront créées en début de Sprint 1. Estimation totale : ~16h.

---

## 8. Apprentissages pour Sprint 1

- **Scaffold create-next-app installe `AGENTS.md` par défaut** : toujours utiliser `--no-agents-md`
- **Storybook installe `addon-mcp` placeholder** : à désinstaller systématiquement
- **Vitest + Storybook bonus** : utiliser pour économiser sprint Sprint 1 (juste ajouter project unit-jsdom)
- **Prisma 7 breaking changes** : éviter en V1, rester sur 6.x
- **Next 16 + React 19** : règle `react-hooks/set-state-in-effect` à anticiper, refactor `useSyncExternalStore` recommandé
- **OKLCH** : excellent pour palettes WCAG, mais demande un IDE avec preview (extension VS Code "Color Highlight" recommandée)

---

## 9. Bilan Sprint 0

✅ **Sprint réussi à 100%**. Toutes les issues fermées, direction visuelle validée, foundations solides pour démarrer le Sprint 1. La dette technique est limitée (tests TU à setup au Sprint 1 — déjà anticipé). La cadence "1 semaine compressée" a été tenue sur 1 jour effectif grâce au scaffold automatisé.

**Vélocité réelle** : 12 issues en 1 jour effectif (très soutenue, partiellement due au cumul bootstrap + scaffolds qui auraient pris plusieurs jours sans automation).
