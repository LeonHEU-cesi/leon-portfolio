# Dossier projet — leon-portfolio

**Projet :** leon-portfolio — Portfolio personnel dynamique et animé
**Auteur :** HEU Léon
**Domaine de prod :** `leonheu.fr`
**Version dossier :** 1.0 — finalisé en clôture Sprint 7 (release **v1.0.0**)
**Format cible :** 10-15 pages (export PDF via impression Markdown)

> Dépôt **public** : ce dossier et le dépôt ne divulguent **aucun détail
> d'infrastructure réel** (hôte, registrar, IP, e-mails de service). Les
> valeurs réelles sont tenues dans un **kit de déploiement privé hors
> dépôt** (cf. §9.6).

---

## Sommaire

1. Présentation du projet
2. Acteurs et public cible
3. Périmètre fonctionnel V1
4. Architecture technique
5. Modèle de données
6. Déroulé Scrum (8 sprints)
7. Tests et qualité
8. Sécurité et conformité
9. Déploiement et exploitation
10. Bilan technique et dette
11. Roadmap V2+
12. Annexes

---

## 1. Présentation du projet

### 1.1 Pitch

**leon-portfolio** est un portfolio personnel dynamique et animé regroupant
les projets, le parcours et les contributions de HEU Léon. Objectif triple :

- vitrine pour **recruteurs et clients freelance** francophones ;
- **démonstration de compétences** (animations avancées, performance,
  accessibilité, mobile, sécurité, CI/CD) ;
- **hub GitHub** agrégeant les repos publics.

La structure de blog est livrée en base + admin dès la V1 ; la page
publique des articles est différée en V2.

### 1.2 Contexte

Side project personnel sans contrainte client. Le délai initial souhaité
(2-3 jours) a été rebasculé sur un planning honnête de **8 sprints d'une
semaine** vu le périmètre (web + mobile + admin + API + tests
E2E/axe/Lighthouse + pentest + CI/CD), exécuté en cadence compressée.

### 1.3 Domaine et hébergement

- **Domaine** : `leonheu.fr`
- **Hébergement** : serveur Linux auto-hébergé, Docker Compose
- **Coût** : 0 € hors nom de domaine (~10 €/an) — aucun SaaS payant

---

## 2. Acteurs et public cible

| Acteur | Description | Plateformes | Droits |
|---|---|---|---|
| Visiteur public | Recruteur, client, dev curieux | Web + Mobile | Lecture seule |
| Admin (HEU Léon) | Auteur du portfolio | Web uniquement | CRUD projets/articles/tags + auth |

- **Cible principale** : recruteurs tech francophones
- **Cible secondaire** : pairs développeurs (le repo du portfolio est lui-même un signal)
- **Langue** : Français (i18n hors périmètre V1)
- **Accessibilité visée** : WCAG AA + respect strict `prefers-reduced-motion`

---

## 3. Périmètre fonctionnel V1

### 3.1 Modules livrés

| Module | Web public | Web admin | Mobile |
|---|---|---|---|
| Accueil animé | ✅ | — | ✅ (simplifié) |
| Projets (catalogue + détail) | ✅ | ✅ CRUD | ✅ |
| Recherche/filtre projets | ✅ (fuse.js lazy) | — | ✅ |
| CV / Parcours | ✅ (impression) | — | ❌ (lien web) |
| About | ✅ | — | ✅ |
| Contact | ✅ `mailto:` | — | ✅ `mailto:` + share |
| Hub GitHub | ✅ (ISR) | — | ❌ |
| Articles (blog) | V2 | ✅ CRUD draft | ❌ |
| Auth admin | ❌ | ✅ Auth.js v5 | ❌ |
| API publique REST | ✅ `/api/projects(+/[slug])` | — | ✅ consommée |
| Doc API | ✅ OpenAPI 3.1 + Scalar `/api/docs` | — | — |

### 3.2 Hors périmètre V1

Page publique blog (V2), newsletter, commentaires, analytics, i18n,
auth mobile (lecture publique uniquement).

### 3.3 Backlog

35 user stories (`User_stories.md`) — Vitrine 6, Projets 5, CV 2, Contact
2, Admin 7, Blog 2 (V2), Mobile 5, Transverse 6. Priorités : 14 P1, 14 P2,
4 P3, 3 P4 (Won't V1).

---

## 4. Architecture technique

### 4.1 Stack réelle (V1.0.0)

| Couche | Technologie | Version réelle |
|---|---|---|
| Framework web | Next.js (App Router, RSC, Server Actions, ISR, `output: standalone`) | **16.2.6** |
| UI runtime | React / React DOM | **19.2.4** |
| Langage | TypeScript strict (`noUncheckedIndexedAccess`) | 5.x |
| Styling | Tailwind CSS (tokens OKLCH, variants editorial/tech/dark) | v4 |
| Composants UI | Tailwind direct (pas de shadcn/Radix en V1) | — |
| Animations web | gsap + framer-motion | 3.15 / 12.38 |
| Validation | Server Actions + validateurs purs testés (`*-input.ts`) | — |
| ORM | Prisma (baseline migration versionnée, `migrate deploy`) | **6.19.3** |
| Base de données | PostgreSQL | 16-alpine |
| Auth | Auth.js (next-auth) Credentials + bcryptjs, JWT, split Edge/Node | ^5.0.0-beta.31 |
| API publique/mobile | Next Route Handlers + `fetch` (CORS, fallback) | — |
| Doc API | OpenAPI 3.1 (module pur) + Scalar UI CDN, CSP scopée | 3.1.0 |
| Mobile | Expo SDK / React Native | 54 / 0.81 |
| Navigation mobile | expo-router (file-based, tabs) | v6 |
| Animations mobile | react-native-reanimated (reduce-motion) | 4.1 |
| Données mobile | @tanstack/react-query + `fetch` (pas d'axios) | 5 |
| Design System | Storybook (stories tokens) | 10.4 |
| Conteneurisation | Docker + Compose (dev/staging/prod) | — |
| Reverse proxy | Caddy (TLS auto Let's Encrypt) | 2 |
| Hébergement | Serveur Linux auto-hébergé | — |
| Tests unitaires/intég. | Vitest (projets `unit` jsdom + `tf` Postgres réel) | 4.1.6 |
| Tests E2E + a11y | Playwright + @axe-core/playwright | 1.60 / 4.11 |
| Perf | @lhci/cli (budgets) | 0.15 |
| Tests mobile | jest-expo + @testing-library/react-native | — |
| CI/CD | GitHub Actions (3 jobs) + deploy-staging/prod gardés | — |

Justification des choix : `comparatif-techniques.md`, `pertinence-solution.md`.

### 4.2 Architecture globale

```
Visiteur web ──HTTPS leonheu.fr──► Caddy (reverse proxy, TLS auto)
                                     │
                                     ▼
                       Next.js 16 (conteneur, standalone)
                       ├─ App Router (RSC) + Server Actions
                       ├─ Route Handlers /api/* (public + admin)
                       └─ Prisma (import paresseux, fallback mock)
                                     │
                                     ▼
                          PostgreSQL 16 (volume persistant)
                                     │  pg_dump quotidien (script)
                                     ▼
                          Sauvegardes (rétention + système)

App mobile (Expo / APK EAS) ──fetch + TanStack Query──► leonheu.fr/api/projects
```

Dégradation propre : le client Prisma est importé paresseusement et chaque
accès données a un **fallback mock** → `next build` et la CI fonctionnent
sans base. `migrate deploy` applique la baseline en CI (service Postgres)
et en prod.

### 4.3 Structure monorepo

```
leon-portfolio/
├── web/        # Next.js 16 (front + API + Storybook + tests)
├── mobile/     # Expo SDK 54
├── infra/      # docker-compose.{dev,staging,prod}.yml + Caddyfile* + scripts/
├── .github/    # workflows CI + deploy-* gardés + dependabot.yml
├── Docs/        # documentation projet
└── JOURNAL.md / *.md racine
```

### 4.4 Décisions structurantes

| Décision | Justification |
|---|---|
| Next.js full-stack (pas d'API séparée) | Solo dev, 1 codebase, Server Actions, Auth.js intégré |
| Prisma + Postgres, baseline versionnée | Type-safety, `migrate deploy` CI/prod reproductible |
| Auth.js v5 Credentials + bcryptjs | `authorize` try/catch → `null` uniforme (anti-énumération) |
| Import Prisma paresseux + fallback mock | Build/CI sans DB, résilience runtime |
| OpenAPI 3.1 = module **pur** + Scalar CDN | Doc testable unitairement, zéro dépendance lourde |
| `useSyncExternalStore` (matchMedia/hydratation) | Élimine `setState`-in-effect → **0 eslint-disable** |
| Tailwind direct (pas shadcn) | Périmètre maîtrisé, tokens OKLCH maison |
| Fuse.js en import dynamique | Hors bundle initial `/projets` (perf) |
| Repo neutre + kit déploiement privé hors dépôt | Pas de divulgation d'infra sur un repo public |

---

## 5. Modèle de données

| Entité | Description | Cardinalités |
|---|---|---|
| `User` | Compte admin (1 en pratique) | — |
| `Project` | Projet curé (slug, content, status, isFeatured) | N-N `Tag` |
| `Article` | Article blog (status draft/published) | N-N `Tag` |
| `Tag` | Tag partagé projets/articles | N-N `Project`/`Article` |
| pivots | `ProjectTag`, `ArticleTag` | — |

Détail (DBML + Prisma + DDL) : `mld.md`. Volume V1 très faible (1 user,
quelques dizaines de projets/tags) → index `slug`/`status` suffisants.

Sauvegarde/reprise : `infra/scripts/pg_backup.sh` (dump gzip quotidien,
rétention 14 j) + `pg_restore.sh` ; sauvegarde système périodique côté
hôte. Procédure : `deploiement-prod.md`.

---

## 6. Déroulé Scrum (8 sprints)

| Sprint | Focus | Release |
|---|---|---|
| 0 — Foundations | Repo, stack, CI, schéma/seed, direction visuelle | v0.1.0 |
| 1 — Vitrine Hero | Accueil GSAP/ScrollTrigger, nav, burger mobile, About, dark mode | v0.2.0 |
| 2 — Projets | Catalogue + détail + filtres + hub GitHub | v0.3.0 |
| 3 — CV / Contact / Recherche | Timeline CV, contact, recherche client, branch protection | v0.4.0 |
| 4 — Admin | Auth.js v5, CRUD projets/articles, upload sharp | v0.5.0 |
| 5 — Mobile | Expo (tabs, écrans), API publique JSON, EAS preview | v0.6.0 |
| 6 — Hardening | Headers sécurité, magic-bytes, axe bloquant, OWASP, Lighthouse CI, CD staging | v0.7.0 |
| 7 — Release | OpenAPI/Scalar, CD prod gardé, backups, smoke, Dependabot, neutralisation, docs | **v1.0.0** |

Cérémonies : planning lundi, review fin de sprint (`sprintN-*.md`),
Conventional Commits, PR feature → `develop`, PR récap `develop` → `main`
(merge commit) + tag `vX.Y.0`. CI verte **vérifiée explicitement** avant
tout merge ; branch protection active sur `develop` et `main`.

---

## 7. Tests et qualité

### 7.1 Stratégie réelle

| Type | Outil | Périmètre | Volume V1 |
|---|---|---|---|
| Unitaires (`unit`) | Vitest + Testing Library (jsdom) | logique, hooks, validateurs, OpenAPI | **147 TU** |
| Fonctionnels (`tf`) | Vitest sur **Postgres réel** (service CI) | accès données, CRUD | **14 TF** |
| E2E + a11y | Playwright + @axe-core/playwright | 6 specs, parcours + **axe bloquant** | **16 E2E** |
| Smoke prod | Playwright (URL paramétrable) | post-déploiement TF-WEB-01..08 | **8 checks** |
| Mobile | jest-expo + RNTL | composants/écrans | **10 jest** |
| Perf | @lhci/cli | budgets a11y/bp/seo, perf warn | budgets CI |

Pas de testcontainers : un **service Postgres GitHub Actions** + `prisma
migrate deploy` fournit la base réelle des TF. Recette manuelle
(mobile device, lecteur d'écran) : `procedure-validation.md`,
`a11y-screenreader.md`, `mobile-recette.md`.

### 7.2 CI/CD

GitHub Actions, 3 jobs : `Web (lint + typecheck + Vitest + TF)`,
`Web (E2E Playwright + Lighthouse CI)` (PR-only, après `build`),
`Mobile (expo-doctor + tsc + Jest)`. `npm audit` (high+) non bloquant
(OWASP A06) + **Dependabot** 3 écosystèmes. CD `deploy-staging.yml`
(push `develop`) et `deploy-prod.yml` (push `main` / tag `v*`) sont
**gardés** : no-op propre sans secrets, non requis par la branch
protection. Détail : §9.

### 7.3 Qualité de code

TypeScript strict, ESLint (eslint-config-next), **0 `eslint-disable
react-hooks`**, validateurs purs testés unitairement, build vérifié par
code retour (jamais un grep partiel).

---

## 8. Sécurité et conformité

### 8.1 Mesures appliquées (Sprint 6)

| Mesure | Détail (source `lib/security-headers.ts`) |
|---|---|
| CSP | `default-src 'self'` ; `script/style-src 'self' 'unsafe-inline'` ; `frame-ancestors 'none'` ; `object-src 'none'` (nonce → V2) |
| CSP scopée | `/api/docs` élargie au CDN Scalar uniquement ; CSP stricte ailleurs |
| HSTS | `max-age=63072000; includeSubDomains; preload` |
| Headers | X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy |
| Hash mdp | bcryptjs (cost 12) |
| Auth | `authorize` try/catch → `null` uniforme (anti-énumération), rate limiting, middleware garde `/admin` |
| Upload | magic-bytes (signature vs type déclaré) avant sharp + taille/dimensions |
| XSS | contenu rendu **texte échappé** React (pas de `dangerouslySetInnerHTML` sur input) |
| a11y/contraste | tokens OKLCH corrigés AA, audit **axe bloquant** (0 serious/critical, 5 pages) |

Rapport OWASP Top 10 : `pentest-owasp.md`. Mesure live (Observatory,
en-têtes) = post-déploiement côté mainteneur.

### 8.2 RGPD / LCEN

Pas d'enjeu RGPD réel : aucun formulaire serveur (`mailto:` direct),
aucun cookie de tracking, aucun analytics. Mentions légales : éditeur
identifié, hébergement décrit de façon **neutre** (auto-hébergement,
sans divulgation d'infra). Seul l'admin (HEU Léon) est stocké en base.

### 8.3 Neutralité du dépôt public

Sur consigne du mainteneur : le dépôt **ne divulgue aucune topologie
d'hébergement** (hôte, registrar, IP, e-mails de service). Templates
neutres + secrets via GitHub Actions / `infra/.env` hors versionnement +
**kit de déploiement privé hors dépôt** (cf. §9.6). `.gitignore` durci,
`.gitattributes` (LF obligatoire pour les scripts).

---

## 9. Déploiement et exploitation

### 9.1 Environnements

| Env | URL | Branche | Déclencheur CD |
|---|---|---|---|
| Dev local | `localhost:3000` | `feat/*` | — |
| Staging | `staging.leonheu.fr` | `develop` | push `develop` |
| Production | `leonheu.fr` | `main` | push `main` / tag `v*` |

### 9.2 Stack de déploiement

`infra/docker-compose.prod.yml` : `web` (Next standalone) + `postgres` +
`caddy`. Variables sensibles **obligatoires** (`:?`), aucune valeur réelle
dans le dépôt. Caddy émet/renouvelle le TLS (e-mail ACME via env
`ACME_EMAIL`).

### 9.3 Process de release

PR feature → `develop` (CI verte vérifiée + merge). Fin de sprint : PR
récap `develop` → `main` (**merge commit**, CI verte vérifiée), tag
`vX.Y.0`, GitHub release. `deploy-prod.yml` (gardé) : backup → `git pull`
→ `compose up --build` → `migrate deploy` → smoke.

### 9.4 Rollback

`git checkout <tag>` + `compose up -d --build` ; données via
`pg_restore.sh` ; sinon sauvegarde système. Détail : `deploiement-prod.md`.

### 9.5 Monitoring V1 / V2

V1 : logs Docker, smoke harness post-déploiement, backups testés en
restauration. V2 : stack logs/metrics auto-hébergée + alerting (A09).

### 9.6 Kit de déploiement privé (hors dépôt)

Les valeurs réelles (hôte, registrar, IP, secrets, runbook opérationnel)
vivent dans un répertoire **hors du dépôt Git**, jamais versionné. Le
dépôt public ne contient que `deploiement-{prod,staging}.md` génériques.
Étapes dépendantes de l'hôte (provisioning, DNS, secrets, sauvegarde
système) = gestes du mainteneur, documentés neutrement.

---

## 10. Bilan technique et dette

### 10.1 Métriques finales (v1.0.0)

| Indicateur | Valeur |
|---|---|
| Sprints livrés | **8** (0 → 7) |
| Releases GitHub | **8** (v0.1.0 → **v1.0.0**) |
| Commits `develop` | ≈ 90 |
| Pull Requests mergées | ≈ 100 (1 PR ≥ 1 issue, CI-gated) |
| Tests web | **147 TU + 14 TF + 16 E2E + 8 smoke** |
| Tests mobile | **10 jest** |
| `eslint-disable react-hooks` | **0** |
| Sécurité | headers CSP/HSTS, magic-bytes, axe bloquant, OWASP, Dependabot |
| Incidents process | 2 commits sur `develop` par erreur — **bloqués/rattrapés via branch protection**, aucun impact |

### 10.2 Dette technique (→ V2)

| Item | Raison du report |
|---|---|
| CSP nonce (retirer `'unsafe-inline'`) | Durcissement, complexité Next/Tailwind |
| Page publique blog | Différée (structure DB/admin livrée) |
| i18n FR/EN | Hors périmètre V1 |
| Auth mobile + admin mobile | Lecture publique suffisante V1 |
| Monitoring/alerting prod (A09) | Stack observabilité V2 |
| Stories Storybook écrans (web/mobile) | Couverture Design System V2 |
| Externalisation stockage images | Volume conteneur suffisant V1 |
| Migration Auth.js stable v5 | Quand release stable (P1 sécurité) |

### 10.3 Apprentissages

- **Branch protection = filet réel** : a stoppé 2 pushs directs `develop`
  par erreur (oubli `git checkout -b`), zéro impact — toujours brancher avant d'éditer.
- **CI verte vérifiée explicitement** avant merge (jamais
  `watch ; merge` inconditionnel) ; build jugé au **code retour**.
- **Valider E2E/axe en local** avant push (boucle ~30 s vs ~5 min CI) ;
  auditer a11y en `reduced-motion`.
- **`useSyncExternalStore`** : pattern propre matchMedia/hydratation.
- **Repo public ≠ doc d'infra** : neutraliser tôt, kit réel hors dépôt.

---

## 11. Roadmap V2+

| Évolution | Priorité |
|---|---|
| Pages publiques blog | P1 |
| Migration Auth.js stable v5 | P1 (sécurité) |
| CSP nonce | P2 |
| Monitoring/alerting auto-hébergé | P2 |
| Analytics self-host | P2 |
| i18n FR + EN | P2 |
| Auth mobile + écrans admin mobile | P3 |
| Stories Storybook écrans | P3 |
| Externalisation images (objet) | P3 |
| Newsletter / commentaires | P4 |

---

## 12. Annexes

### 12.1 Documents liés

- `Plan_developpement.md` — périmètre, stack, architecture, conventions
- `Planning_Scrum.md` — 8 sprints, issues estimées, risques
- `User_stories.md` — 35 stories + critères d'acceptation
- `Cahier_de_tests.md` — catalogue TU/TF/TF-WEB/TM/TS/TE/TP
- `mld.md` — modèle de données (DBML + Prisma + DDL)
- `comparatif-techniques.md`, `pertinence-solution.md` — choix d'archi
- `installation.md` — dev local + déploiement (générique) + troubleshooting
- `procedure-validation.md` — recette par jalons + check-list
- `deploiement-prod.md` / `deploiement-staging.md` — déploiement neutre
- `pentest-owasp.md`, `a11y-screenreader.md`, `mobile-recette.md`
- `Docs/claude/Sprint docs/sprint{0..7}-*.md` — revues de sprint
- `pv-recette.md` — modèle vierge de PV

### 12.2 Liens

| Lien | Description |
|---|---|
| https://leonheu.fr | Production |
| https://leonheu.fr/api/docs | OpenAPI Scalar UI |
| https://leonheu.fr/api/projects | API publique (JSON) |
| https://github.com/LeonHEU-cesi/leon-portfolio | Dépôt source |
| https://github.com/LeonHEU-cesi/leon-portfolio/releases | Releases v0.1.0 → v1.0.0 |

### 12.3 Comptes de test

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Admin | `ADMIN_EMAIL` (env) | `ADMIN_PASSWORD` (env, à changer en prod) |

### 12.4 Glossaire

| Terme | Définition |
|---|---|
| App Router | Routage Next.js basé sur `app/` |
| RSC | React Server Components |
| ISR | Incremental Static Regeneration |
| Server Actions | Fonctions serveur appelables depuis un form |
| OpenAPI / Scalar | Spec API 3.1 + UI de référence |
| WCAG AA | Niveau d'accessibilité (contraste 4.5:1, clavier…) |
| OWASP Top 10 | Top 10 des vulnérabilités web |
| EAS Build | Build cloud Expo |
| Branch protection | Règles GitHub bloquant un merge sur CI rouge |
