# Sprint 2 — Projets

**Période :** 2026-05-16
**Milestone :** M2 - Projets
**Statut :** ✅ Clos
**Durée effective :** ≈ 1 journée

---

## 1. Issues livrées

### Prérequis CI (régression latente traitée en ouverture de sprint)

| # | Titre | Statut | PR |
|---|---|---|---|
| #38 | fix(ci) : le workflow ne compile pas (YAML L119) | ✅ closed | #39 |
| #40 | chore(ci) : bump actions checkout/setup-node v4→v5 | ✅ closed | #41 |

### Issues Sprint 2

| # | Titre | Statut | PR |
|---|---|---|---|
| #42 | [2.1] Baseline migration Prisma init committée | ✅ closed | #53 |
| #43 | [2.2] Seed enrichi : 5 projets publiés + tags | ✅ closed | #54 |
| #44 | [2.3] Page /projets Prisma + swap mock home | ✅ closed | #55 |
| #45 | [2.4] Filtres tags (chips) avec sync URL | ✅ closed | #56 |
| #46 | [2.5] Page /projets/[slug] : détail + 404 | ✅ closed | #57 |
| #47 | [2.6] GitHubService + cache ISR 24h | ✅ closed | #58 |
| #48 | [2.7] Section "Mes repos publics" sur /projets | ✅ closed | #59 |
| #49 | [2.8] Animations cards hover — raffinement | ✅ closed | #60 |
| #50 | [2.9] Tests TF couche Projets sur DB réelle + CI | ✅ closed | #61 |
| #51 | [2.10] Tests E2E Playwright catalogue → détail | ✅ closed | #62 |
| #52 | [2.11] Sprint 2 review + release v0.3.0 | ▶ en cours |  |

**Total : 10/10 issues feature/test closed + 2 fixes CI prérequis, sprint review en cours.**

---

## 2. Stack en place (versions exactes, mise à jour)

| Couche | Outil | Version | Note |
|---|---|---|---|
| Framework web | Next.js | 16.2.6 | ✅ |
| Langage | TypeScript | 5.x strict | ✅ |
| Styling | Tailwind CSS | v4 | ✅ |
| ORM | Prisma | 6.19.3 | ✅ migrations désormais versionnées |
| DB | PostgreSQL | 16-alpine | ✅ |
| Animations | GSAP 3.15 / framer-motion 12.38 | — | ✅ |
| Tests unitaires | Vitest | 4.1.6 | ✅ 3 projects (`unit`, **`tf` 🆕**, `storybook`) |
| Tests E2E | Playwright | 1.60 | ✅ |
| **Runner E2E** | **@playwright/test** | **^1.60** | **🆕 Sprint 2** |
| CI | GitHub Actions | — | ✅ **réparée + durcie** ; actions **checkout/setup-node v5** 🆕 |
| Conteneur dev | Docker Compose | — | ✅ |

---

## 3. Décisions techniques notables

### 3.1 CI réparée (régression latente critique)
- **La CI n'avait jamais compilé depuis le bootstrap** : `ci.yml` L119, un `run:` scalaire YAML *plain* contenant `0: ` → `mapping values are not allowed here` → `startup_failure`, 0 job sur 100 % des runs. Les vérifs ne passaient qu'en local.
- Fix #39 (reformulation L119 sans `: `) + retrait du cache npm du job `mobile-checks` (lockfile absent jusqu'au Sprint 5).
- Hardening #41 : `actions/checkout` et `actions/setup-node` v4→v5 (dépréciation forcée Node 24 au 2026-06-02).
- **Prouvé empiriquement** : 3 jobs verts, jobs réellement créés.

### 3.2 Baseline migration Prisma
- Schéma posé Sprint 0 (#6) mais aucune migration versionnée. Baseline via `prisma migrate diff --from-empty --to-schema-datamodel` (aucun reset de la DB de dev).
- `.gitignore` corrigé (pattern erroné `web/prisma/migrations/dev/`). Débloque `migrate deploy` CI/prod et les TF.

### 3.3 Couche données + résilience build
- `lib/projects.ts` : `getPublishedProjects(tagSlugs)`, `getProjectBySlug`, `getAllTags`, `getFeaturedProjects` — **import Prisma paresseux** (`await import`) + try/catch fallback mock → `next build` sans `DATABASE_URL` ne casse pas (`/` statique sur mock, `/projets` & `/projets/[slug]` en `force-dynamic`).
- Split présentationnel : composants `*View` purs (testables sync) + Server Components async.

### 3.4 Filtres tags
- 100 % côté serveur : chips = `<Link>`, état dans l'URL (`?tags=a,b` trié), `parseSelectedTags`/`toggleTagHref` purs. Sans JS client, partageable, a11y (`aria-current`, focus visible).

### 3.5 GitHubService
- `fetch` injectable (testable sans réseau), header `Bearer` si `GITHUB_TOKEN`, exclut forks/archivés, **`[]` sur toute erreur** (jamais d'exception), `unstable_cache` 24h.

### 3.6 Stratégie de tests
- **Vitest 3e projet `tf`** (Node) sur **vraie base Postgres** en CI (`prisma migrate deploy` ajouté à `web-tests`), `describe.skip` propre en local sans `DATABASE_URL`.
- **E2E Playwright** rendu **bloquant** (`web-e2e-lighthouse`), parcours déterministe sans DB grâce au fallback mock.

---

## 4. Dette technique identifiée

| Item | Sprint cible | Note |
|---|---|---|
| `Plan_developpement.md` versions obsolètes (Next16/Prisma6/SB10) + stack Sprint 2 | Sprint 6 / passe doc | Non bloquant |
| Lighthouse CI non configuré (`lhci` reste `continue-on-error`) | Sprint 6 | Hors scope Sprint 2 |
| `web/.env` absent du working tree (local Léon) | À régulariser | CI fournit son `DATABASE_URL` ; pages runtime locales nécessitent un `.env` |
| Fallback `getPublishedProjects` ignore le filtre tag (chemin dégradé) | — | Acceptable, documenté |
| Contenu projet rendu `whitespace-pre-line` (pas de MDX) | V2 | Rendu Markdown riche reporté |
| 3 `eslint-disable react-hooks/set-state-in-effect` | Sprint 6 | Hérité Sprint 1 |
| Stories Storybook nouvelles sections (ProjectsList, TagFilter, ProjectDetail, GitHubRepos) | Sprint 6 | Couverture Design System |
| Migration Prisma 7 (`prisma.config.ts`) | V2 | Roadmap |

---

## 5. Métriques

| Métrique | Valeur | Évolution |
|---|---|---|
| Commits sur `develop` (Sprint 2) | 10 (#53→#62) + 2 fixes CI (#39,#41) | — |
| Pull Requests mergées | 12 (#39,#41,#53→#62) + release | — |
| Issues fermées | 10/10 features + 2 CI ; #52 en cours | 12/13 |
| Tests unitaires (TU) | **65 passants** | +32 vs Sprint 1 (33) |
| Tests fonctionnels (TF) | **6** (DB réelle en CI) | 🆕 |
| Tests E2E | **2 specs** (TE-01, TE-03), bloquants CI | +2 (était vide) |
| Test files | 17 unit + 1 tf + 1 e2e | +9 |
| Routes Next.js | 5 — statiques `/`,`/_not-found`,`/about` + `ƒ` `/projets`,`/projets/[slug]` | +2 dynamiques |
| CI | **réparée** (jamais verte avant) + `migrate deploy` + TF + E2E bloquant | majeur |
| Temps total Sprint 2 | ≈ 1 journée | — |

---

## 6. Definition of Done — Sprint 2 (Planning_Scrum §5)

- [x] Catalogue fonctionnel avec filtres URL-sync (`/projets` + `?tags=`)
- [x] Détail projet 404 propre si inexistant ou DRAFT (`/projets/[slug]`)
- [x] GitHub repos affichés avec cache 24h (`GitHubService` + section)
- [x] Tests TF + TE passent (6 TF sur DB CI, 2 E2E bloquants)
- [x] Sprint review dans `sprint2-projets.md`

---

## 7. Préparation Sprint 3 — CV / Contact / Recherche

Issues à pré-créer (Planning_Scrum §6, estimation ~15h) :

| # estimé | Titre | Priorité |
|---|---|---|
| 3.1 | Page `/cv` timeline expériences animée au scroll | P1 |
| 3.2 | Sections Compétences + Formations + Langues + Loisirs | P1 |
| 3.3 | CSS `@media print` + bouton "Télécharger PDF" | P2 |
| 3.4 | Génération PDF (build script ou statique `public/`) | P2 |
| 3.5 | Page `/contact` mailto + icônes réseaux | P1 |
| 3.6 | QR vCard SVG (optionnel) | P3 |
| 3.7 | Recherche client Fuse.js sur `/projets` | P2 |
| 3.8 | Page `/mentions-legales` rédigée | P2 |
| 3.9 | `sitemap.ts` + `robots.ts` | P2 |
| 3.10 | Tests TF-WEB recette manuelle | P2 |

**Prérequis Sprint 3 :** aucun bloquant. Recommandé : régulariser `web/.env` local pour tester les pages runtime branchées DB.

---

## 8. Apprentissages pour Sprint 3

- **Forensique CI** : `conclusion: failure` + `jobs: []` + `0s` = `startup_failure` (workflow non compilé). Toujours valider le YAML d'un workflow (un `: ` dans un scalaire *plain* casse tout).
- **Next + Prisma sans DB au build** : import dynamique du client dans un try/catch + fallback = build vert même sans `DATABASE_URL` ; réserver `force-dynamic` aux pages réellement DB-driven.
- **Tests à 3 niveaux** : `unit` (mock Prisma, jsdom) / `tf` (vraie DB Node en CI) / `e2e` (parcours, fallback mock). Le `describe.skip` conditionné à `DATABASE_URL` garde le local fluide.
- **Filtres URL server-side** : helpers purs + `<Link>` = testables unitairement, accessibles, sans JS client.

---

## 9. Bilan Sprint 2

✅ **Sprint réussi à 100 %** (10/10 issues feature/test + 2 fixes CI prérequis ; #52 review en cours). Module Projets complet : catalogue Prisma, filtres URL, détail 404, hub GitHub caché, animations raffinées, et surtout **une CI enfin réellement opérationnelle** (elle n'avait jamais compilé) avec tests TF sur DB de service et E2E bloquants.

**Highlights** :
- CI réparée : régression latente depuis le bootstrap diagnostiquée et corrigée, prouvée empiriquement
- 65 TU (+32), 6 TF sur vraie base, 2 E2E bloquants — pyramide de tests à 3 niveaux
- Dette Sprint 1 (#26 FeaturedProjects mock → Prisma) soldée
- Baseline migration versionnée → `migrate deploy` CI/prod opérationnel
