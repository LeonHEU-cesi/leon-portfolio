# Plan de développement — leon-portfolio

**Projet :** leon-portfolio — Portfolio personnel dynamique et animé
**Auteur :** HEU Léon
**Version :** 1.0 — Plan initial validé le 2026-05-14
**Domaine de prod :** `leonheu.fr`

---

## 1. Périmètre

### 1.1 Modules retenus

| Module | Description | Statut V1 |
|---|---|---|
| Vitrine publique | Pages Accueil, Projets, CV, About, Contact | **Obligatoire** |
| Animations & UX | GSAP scroll-driven + Framer Motion + dark mode + recherche client | **Obligatoire** |
| Hub GitHub | Intégration GitHub API pour repos publics (cache ISR 24h) | **Obligatoire** |
| Back-office admin | Login + CRUD projets + CRUD articles + CRUD catégories | **Obligatoire** |
| Mobile compagnon | App Expo en lecture (catalogue projets, About, Contact) | **Obligatoire** |
| Blog public | Pages liste + détail articles | **V2 (structure DB livrée en V1, publication différée)** |
| Newsletter | Capture email visiteurs | **Hors périmètre** |
| Commentaires articles | Disqus, Giscus, custom | **Hors périmètre** |
| Analytics | Plausible, Umami, GA | **Hors périmètre** |
| i18n (EN) | Site bilingue | **Hors périmètre** |

### 1.2 Trois surfaces clientes

Le projet livre **deux surfaces** consommant la même API REST documentée OpenAPI :

1. **Web (Next.js 16)** — Front public (visiteurs) + back-office admin (toi) + API Route Handlers publics
2. **App mobile (Expo SDK 54)** — Compagnon en lecture pour catalogue projets, About, Contact

### 1.3 Répartition Web / Mobile

| Module | Web public | Web admin | Mobile |
|---|---|---|---|
| Accueil | ✅ | — | ✅ (écran d'accueil simplifié) |
| Projets (catalogue) | ✅ | ✅ (CRUD) | ✅ (FlatList) |
| Projets (détail) | ✅ | ✅ (édition) | ✅ |
| CV / Parcours | ✅ | — | ❌ (lien externe vers la page web) |
| About | ✅ | — | ✅ |
| Contact | ✅ (mailto:) | — | ✅ (mailto: + share) |
| Articles (blog) | V2 | ✅ (CRUD admin V1) | ❌ |
| Auth | ✅ (admin) | ✅ | ❌ (V1) |

**Justification absence mobile pour CV** : contenu long et hiérarchique mieux servi sur web (impression PDF, scroll desktop). L'app mobile cible la consultation rapide en mobilité.

### 1.4 Acteurs et règles d'accès

- **Visiteur anonyme** : toutes les pages publiques + catalogue mobile, sans authentification
- **Admin (HEU Léon)** : back-office complet web uniquement
- **Pas d'auth mobile V1** — toutes les routes publiques

⚠ Les routes publiques (`/`, `/projets`, `/projets/[slug]`, `/cv`, `/about`, `/contact`) ne doivent **PAS** être protégées par middleware.

### 1.5 Livrables V1

1. Site web fonctionnel hébergé sur `leonheu.fr` (HTTPS)
2. Back-office admin hébergé sur `leonheu.fr/admin` (login)
3. APK mobile via EAS Build (consultable sur device de test)
4. API REST documentée OpenAPI (Scalar UI accessible sur `/api/docs`)
5. Storybook déployé sur sous-domaine `storybook.leonheu.fr` (optionnel V1.1)
6. Documentation technique complète (MLD, comparatif, pertinence, installation)
7. Cahier de tests (TU + TF + TF-WEB + TM + TS + TE + TP) couvrant les modules clés
8. Procédure de validation + modèle de PV de recette (modèle vierge)
9. Dossier projet 10-15 pages (manuel utilisateur + bilan technique)

---

## 2. Architecture technique

### 2.1 Stack complète

> **Versions réelles (mises à jour Sprint 6, #6.13)** — alignées sur le
> code et `~/.claude/.../project_stack`. Plusieurs versions sont
> supérieures aux cibles initiales (conservées car rétro-compatibles).

| Couche | Technologie | Version réelle | Note |
|---|---|---|---|
| Framework web full-stack | Next.js | **16.2.6** | App Router, RSC, Server Actions, ISR ; `output: standalone` (Docker) |
| Langage | TypeScript | 5.x strict (`noUncheckedIndexedAccess`) | ✅ |
| Styling | Tailwind CSS | v4 | tokens OKLCH, custom variants dark/editorial/tech |
| Composants UI web | Tailwind direct (pas shadcn/Radix V1) | — | shadcn non installé ; composants maison |
| Animations web | gsap **3.15** + framer-motion **12.38** | ✅ | Hero scroll + micro-interactions, reduced-motion |
| Forms / validation | Server Actions + validateurs purs (`*-input.ts`) | — | React Hook Form/Zod non utilisés (validateurs testés unitairement) |
| ORM | Prisma | **6.19.3** | downgrade volontaire vs 7 ; baseline migration versionnée |
| Base de données | PostgreSQL | **16-alpine** | dev compose + staging |
| Auth | Auth.js (next-auth) | **^5.0.0-beta.31** | Credentials + bcrypt, session JWT, split Edge/Node |
| Hash mdp | **bcryptjs 3.x** | — | équivalent bcrypt, cost 12 |
| API publique/mobile | Next.js Route Handlers `/api/projects(+/[slug])` + `fetch` | ✅ | JSON lecture + CORS (pas d'axios) |
| Mobile | Expo SDK **54.0.33** / RN **0.81** | ✅ | expo-router, EAS preview configuré |
| Navigation mobile | expo-router | **v6** | file-based (tabs) |
| Animations mobile | react-native-reanimated | **4.1** | reduce-motion respecté |
| Données mobile | **@tanstack/react-query 5** + `fetch` | ✅ | cache/refetch (pas d'axios) |
| Stockage sécurisé mobile | — (non requis V1) | — | mobile en lecture, pas d'auth |
| Design System | Storybook | **10.4.0** | stories tokens (extension écrans → V2) |
| Documentation API | OpenAPI 3.1 (module pur) + Scalar `/api/docs` | ✅ | livré Sprint 7 (#189), CSP scopée |
| Conteneurisation | Docker + Compose | ✅ | dev + **staging** (#6.11) |
| Reverse proxy | Caddy 2 | ✅ | `Caddyfile` prod + `Caddyfile.staging` (TLS auto) |
| Hébergement | Serveur Linux auto-hébergé (Docker) | cible | déploiement staging #6.11/#6.12 = étape mainteneur |
| Build mobile | EAS Build | config `eas.json` preview | build cloud APK = étape Léon (#5.11) |
| Tests unitaires | Vitest | **4.1.6** | projets `unit` (jsdom) + `tf` (node, vraie DB) |
| Tests fonctionnels | Vitest projet `tf` sur Postgres CI (service) | ✅ | pas de testcontainers (service GitHub Actions) |
| Tests E2E | Playwright **1.60** + @playwright/test + @axe-core/playwright | ✅ | chromium ; axe a11y bloquant |
| Tests perf | @lhci/cli **0.15** | ✅ | budgets (a11y/bp/seo error, perf warn) |
| Mobile tests | jest-expo **55** + @testing-library/react-native | ✅ | `mobile-checks` CI réel+bloquant |
| Sécurité | Headers CSP/HSTS/X-Frame (#6.1), magic-bytes upload (#6.2), rate limit | ✅ | revue OWASP `pentest-owasp.md` |
| CI | GitHub Actions | ✅ | 3 jobs + `npm audit`/Dependabot (A06) + `deploy-staging`/`deploy-prod` gardés ; branch protection active |

### 2.2 Architecture (pas MVC strict)

Next.js 16 + Prisma ne suivent pas le MVC classique. On retient une architecture **modulaire par feature** :

- **Routes** (`web/app/`) : pages RSC et Route Handlers (API)
- **Composants** (`web/components/`) : UI atomique (shadcn), composés (sections), templates (layouts)
- **Modèles** (`web/prisma/schema.prisma`) : entités `User`, `Project`, `Article`, `Tag`, `Category`
- **Services** (`web/lib/services/`) : logique métier (GitHubService, AuthService, ProjectService)
- **Validation** (`web/lib/schemas/`) : schémas Zod partagés serveur+client
- **API contract** (`web/lib/openapi/`) : génération OpenAPI depuis schémas Zod

Cf. doc `pertinence-solution.md` pour la justification du choix Next.js full-stack vs API séparée.

### 2.3 Structure du monorepo

```
leon-portfolio/
├── web/                                 # Next.js 16 full-stack
│   ├── app/
│   │   ├── (public)/                   # Routes publiques (visiteur)
│   │   │   ├── page.tsx                # Accueil
│   │   │   ├── projets/
│   │   │   ├── cv/
│   │   │   ├── about/
│   │   │   └── contact/
│   │   ├── (admin)/
│   │   │   ├── login/
│   │   │   └── admin/                  # Back-office (middleware auth)
│   │   ├── api/                        # Route Handlers
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── articles/
│   │   │   ├── github/
│   │   │   ├── og/                     # OG images dynamiques
│   │   │   └── docs/                   # Scalar UI
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                         # shadcn primitives
│   │   ├── sections/                   # Hero, Footer, etc.
│   │   └── admin/                      # Composants back-office
│   ├── lib/
│   │   ├── services/
│   │   ├── schemas/                    # Zod schemas + OpenAPI gen
│   │   ├── auth.ts
│   │   └── prisma.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── stories/                        # Storybook
│   ├── tests/
│   │   ├── unit/                       # Vitest TU
│   │   ├── feature/                    # Vitest TF (API)
│   │   └── e2e/                        # Playwright TE
│   ├── public/
│   ├── .storybook/
│   ├── lighthouserc.cjs
│   ├── playwright.config.ts
│   ├── vitest.config.ts
│   └── package.json
├── mobile/                              # Expo SDK 54
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx               # Accueil mobile
│   │   │   ├── projects.tsx            # Catalogue
│   │   │   ├── about.tsx
│   │   │   └── contact.tsx
│   │   ├── projects/[slug].tsx
│   │   └── _layout.tsx
│   ├── components/
│   ├── lib/
│   │   ├── api.ts
│   │   └── queries.ts
│   ├── app.json
│   ├── eas.json
│   └── package.json
├── docs/                                # Docs techniques publiques (dans le repo)
│   ├── mld.md
│   ├── comparatif-techniques.md
│   ├── pertinence-solution.md
│   └── installation.md
├── tests/                               # Cahier + procédure + PV
│   ├── cahier-de-tests.md
│   ├── procedure-validation.md
│   └── pv-recette.md
├── infra/
│   ├── docker-compose.yml              # Stack prod
│   ├── docker-compose.dev.yml          # Stack dev locale
│   ├── Caddyfile                       # Reverse proxy prod
│   └── backup.sh                       # Script pg_dump
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-prod.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature.md
│   │   └── bug.md
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── .env.example
├── .gitignore
├── JOURNAL.md
└── README.md
```

### 2.4 Ports exposés (dev local)

| Service | Port | URL |
|---|---|---|
| Next.js (web + API) | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Storybook | 6006 | http://localhost:6006 |
| Expo dev server | 8081 | (QR code) |
| Scalar API docs | 3000/api/docs | http://localhost:3000/api/docs |

### 2.5 Communication mobile ↔ API

- **Emulator Android** : `http://10.0.2.2:3000` (alias host)
- **Device physique via Expo Go** : `http://<IP-locale-PC>:3000` (ex `192.168.1.42`)
- **Fallback** : `npx expo start --tunnel`
- **Prod** : `https://leonheu.fr` (HTTPS uniquement, sinon iOS bloque)
- Variable `EXPO_PUBLIC_API_URL` dans `mobile/.env`
- Pas de token côté mobile en V1 (consultation publique uniquement)

### 2.6 Hébergement prod

Serveur Linux auto-hébergé, exposé en HTTPS, exécutant la stack
Docker Compose :

```
Serveur (HTTPS 80/443)
  └── Caddy (reverse proxy, TLS auto Let's Encrypt)
        ├── leonheu.fr           → conteneur Next.js :3000
        ├── staging.leonheu.fr   → conteneur Next.js staging
        └── storybook.leonheu.fr → Storybook (Basic Auth, optionnel)
  ├── Conteneur Next.js (image standalone)
  ├── Conteneur Postgres 16 (volume persistant)
  └── Cron pg_dump quotidien + sauvegarde système périodique
```

DNS (chez le bureau d'enregistrement) : `leonheu.fr` / `www` /
`staging` / `storybook` → adresse publique du serveur. Détails
opérationnels réels = kit de déploiement privé hors dépôt.

---

## 3. Organisation GitHub

### 3.1 Branches

- `main` : version stable, taggée à chaque release majeure (`v1.0.0`)
- `develop` : intégration continue — **default branch GitHub**
- `feat/<scope>` : fonctionnalités (`feat/web-hero`, `feat/api-projects`, `feat/mobile-catalog`)
- `fix/<scope>` : corrections
- `chore/<scope>` : maintenance (deps, CI, refacto)
- `docs/<scope>` : documentation

### 3.2 Milestones

`M0-Setup`, `M1-Design-Hero`, `M2-Projects`, `M3-CV-About`, `M4-Admin-Auth`, `M5-Mobile`, `M6-Tests-Hardening`, `M7-Doc-Release`

### 3.3 Labels

- **Sprint** : `sprint-0`, `sprint-1`, `sprint-2`, …
- **Scope** : `scope-web`, `scope-api`, `scope-mobile`, `scope-docs`, `scope-infra`, `scope-tests`
- **Module** : `module-vitrine`, `module-admin`, `module-mobile`, `module-design-system`, `module-blog`
- **Priorité MoSCoW** : `priorite-p1` (Must), `priorite-p2` (Should), `priorite-p3` (Could), `priorite-p4` (Won't)
- **Type** : `type-feat`, `type-fix`, `type-docs`, `type-test`, `type-chore`, `type-refactor`
- **Spéciaux** : `regression`, `security`, `performance`, `accessibility`

### 3.4 Conventional Commits avec scope

```
feat(web): page projets avec filtrage par tags
feat(api): endpoint GET /api/projects avec filtres et pagination
feat(mobile): écran détail projet avec partage
test(api): tests Feature route /api/projects
docs: MLD avec export DBML
chore(ci): job lighthouse en parallèle
```

### 3.5 CI GitHub Actions

3 jobs en parallèle dans `.github/workflows/ci.yml` :

1. **web-tests** : Vitest (TU + TF API) avec service Postgres + Prisma migrate + `npm run build`
2. **web-e2e-lighthouse** : Playwright + Lighthouse CI (sur preview deployment)
3. **mobile-checks** : `npx expo-doctor` + `npx tsc --noEmit` + Jest (composants critiques)

`concurrency` group `${{ github.ref }}` pour annuler les runs précédents.

### 3.6 CD

- **Staging** : sur merge `develop` → workflow `deploy-staging.yml` SSH sur VM staging + `docker compose pull && up -d`
- **Prod** : sur merge `main` (via PR récap fin de sprint) → workflow `deploy-prod.yml` idem sur VM prod
- Secrets GitHub : `STAGING_SSH_KEY`, `PROD_SSH_KEY`, `GHCR_PAT`

---

## 4. Découpage technique par module

### 4.1 Module Vitrine publique (Web)

**Pages** :
- `/` : Hero animé GSAP (scroll-driven) + section "Projets phares" (3 derniers) + section "À propos" résumée + CTA contact
- `/projets` : grille filtrable par tag/stack, recherche client, animations cards
- `/projets/[slug]` : détail projet avec gallery, stack, repo, démo live, README rendu
- `/cv` : timeline expériences + formations + compétences + bouton "Télécharger PDF"
- `/about` : narratif perso, valeurs, photos
- `/contact` : lien mailto direct + réseaux sociaux + QR vCard

**Composants** :
- `<HeroAnimated>` : GSAP ScrollTrigger pour entrée échelonnée + curseur custom
- `<ProjectCard>` : Framer Motion hover + tilt
- `<DarkModeToggle>` : `next-themes` + persistance
- `<SearchBar>` : recherche client (Fuse.js)

### 4.2 Module Hub GitHub

**API** :
- Cache ISR 24h via `unstable_cache` Next.js
- Token PAT lecture publique en `GITHUB_TOKEN` env
- Endpoint serveur `web/lib/services/github.ts` : `getPublicRepos(username)`, `getRepoLanguages(repo)`, `getRepoStars(repo)`
- Affichage : carte par repo avec stars, langage principal, description, lien GitHub

**Comportement** :
- Affiché dans `/projets` (section "Mes repos publics")
- Filtrable côté client par langage
- Skeleton loader pendant ISR cold start

### 4.3 Module Back-office admin (Web)

**Pages** :
- `/login` : form email/mdp
- `/admin` : dashboard (stats simples : nb projets, nb articles, dernière session)
- `/admin/projects` : tableau + recherche + filtres
- `/admin/projects/new` : form création
- `/admin/projects/[id]` : édition
- `/admin/articles` : tableau brouillon/publié
- `/admin/articles/new` + `/admin/articles/[id]` : éditeur MDX
- `/admin/tags` : CRUD inline

**Sécurité** :
- Middleware Next.js protège `/admin/*` (sauf `/login`)
- Auth.js v5 credentials provider + bcrypt
- Rate limit `5 tentatives / 15 min` sur `POST /api/auth/login` (via `@upstash/ratelimit` mémoire ou Redis local)
- Session cookie HTTP-only, SameSite=Lax, Secure en prod
- CSRF protection via Auth.js

### 4.4 Module Mobile (Expo)

**Écrans** :
- `(tabs)/index.tsx` : accueil simplifié + lien vers catalogue
- `(tabs)/projects.tsx` : FlatList projets virtualisée + filtres BottomSheet + pull-to-refresh
- `(tabs)/about.tsx` : bio + photos
- `(tabs)/contact.tsx` : mailto + share via `expo-sharing`
- `projects/[slug].tsx` : ScrollView avec image header + bouton partage FAB

**Particularités** :
- Pas d'auth V1
- Pas d'écran admin
- API publique consommée via `EXPO_PUBLIC_API_URL/api/projects` (cf. § 2.5)
- Animations via React Native Reanimated 3 (sharedTransition entre liste et détail)

---

## 5. Stratégie de tests

### 5.1 Sept types de tests

| Type | ID | Outil | Quand |
|---|---|---|---|
| Unitaires | TU-* | Vitest | À chaque commit feature |
| Fonctionnels API | TF-* | Vitest + testcontainers | À chaque PR (CI) |
| Fonctionnels Web manuels | TF-WEB-* | Cahier de tests | Recette manuelle fin de sprint |
| Mobile manuels | TM-* | Cahier de tests + Expo Go | Recette manuelle fin de sprint |
| Non-régression | TNR-* | GitHub Actions | À chaque PR vers develop ou main |
| Sécurité | TS-* | Scripts + manuel | Avant ouverture prod (Sprint Hardening) |
| E2E auto | TE-* | Playwright | À chaque PR (CI) |
| Performance | TP-* | Lighthouse CI | À chaque PR (CI) |

### 5.2 Couverture cible

- **API** : tous les endpoints critiques avec 1 cas nominal + 1 cas d'erreur + 1 cas sécurité
- **Composants UI critiques** : `<ProjectCard>`, `<DarkModeToggle>`, `<HeroAnimated>`, `<ContactLink>` testés en Vitest + Storybook
- **Parcours visiteur** : 5 scénarios Playwright (homepage → projet → CV → about → contact)
- **Budgets perf** : LCP < 2.5s, CLS < 0.1, TBT < 200ms, score > 90 sur chaque page publique

### 5.3 Recette manuelle

- **Web** : `tests/cahier-de-tests.md` checklist navigateur (Chrome + Firefox + Safari + Edge) sur 375px / 768px / 1280px
- **Mobile** : Expo Go sur Android (Pixel 7 émulé) + iOS (simulateur si Mac dispo, sinon Expo Go cloud)

---

## 6. Planning (résumé)

Détail complet dans `Planning_Scrum.md`.

Estimation honnête (cadence 1 semaine compressé) : **6-8 sprints** selon vitesse.

| Sprint | Focus | Durée |
|---|---|---|
| Sprint 0 | Setup repo + stack + CI/CD + design direction + Storybook | 1 sem |
| Sprint 1 | Module Vitrine (Hero animé + Accueil + About) | 1 sem |
| Sprint 2 | Module Projets (catalogue + détail + GitHub API) | 1 sem |
| Sprint 3 | Module CV + Contact + Dark mode + Recherche | 1 sem |
| Sprint 4 | Module Admin (auth + CRUD projets + articles draft) | 1 sem |
| Sprint 5 | Mobile (Expo + écrans + EAS Build) | 1 sem |
| Sprint 6 | Hardening (sécurité OWASP + perf Lighthouse + E2E + a11y audit) | 1 sem |
| Sprint 7 | Doc + Release (docs, dossier, mise en prod, monitoring) | 1 sem |

Total ≈ **8 semaines** pour un projet propre. Réajustable selon vélocité.

---

## 7. Checklist avant release V1

### 7.1 Web

- [ ] Toutes les routes publiques répondent < 1s en SSR
- [ ] Vitest passe à 100% sur les tests unitaires
- [ ] Vitest passe à 100% sur les tests fonctionnels API
- [ ] Playwright passe sur les 5 scénarios E2E
- [ ] Lighthouse > 90 sur Accueil, Projets, CV, About
- [ ] Storybook publié sur `storybook.leonheu.fr` (optionnel)
- [ ] OpenAPI accessible sur `/api/docs`
- [ ] Sitemap.xml et robots.txt valides
- [ ] OG images dynamiques fonctionnelles
- [ ] JSON-LD `Person` validé sur Schema.org validator

### 7.2 Mobile

- [ ] App démarre via Expo Go (Android + iOS)
- [ ] Catalogue projets charge depuis l'API prod
- [ ] APK généré via EAS Build et testé sur device physique
- [ ] Pas de console errors / warnings

### 7.3 Infra prod

- [ ] HTTPS valide sur `leonheu.fr` + redirect HTTP → HTTPS
- [ ] HSTS header présent (max-age >= 6 mois)
- [ ] CSP header configuré
- [ ] Backup pg_dump quotidien testé (restoration validée)
- [ ] Sauvegarde système périodique testée
- [ ] Logs container Docker accessibles via `docker logs`

### 7.4 Sécurité

- [ ] Pentest manuel OWASP Top 10 effectué (cf. cahier de tests § TS)
- [ ] Pas de secret en clair dans le repo (`.env` ignoré)
- [ ] Rate limit testé sur login admin (TS-AUTH-03)
- [ ] Headers de sécurité validés (Mozilla Observatory grade B mini)

### 7.5 Documentation

- [ ] Tous les docs `Docs/claude/leon-portfolio/` rédigés
- [ ] README à jour avec install + comptes test + structure
- [ ] JOURNAL.md complet (1 entrée par issue feature)
- [ ] Tag `v1.0.0` posé sur `main`
