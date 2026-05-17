# Comparatif technique — 3 architectures × 5 critères

**Projet :** leon-portfolio
**Auteur :** HEU Léon
**Version :** 1.0 — Justification du choix Next.js 15 full-stack
**Décision finale :** Architecture A — Next.js 15 full-stack + Expo mobile

---

## 1. Architectures évaluées

### Architecture A — Next.js 15 full-stack + Expo

- **Web** : Next.js 15 (App Router, RSC, Server Actions, ISR) en un seul package
- **API** : Route Handlers dans `app/api/*` côté Next.js, documentée OpenAPI 3.1 via `zod-to-openapi`
- **Mobile** : app Expo SDK 54 séparée consommant l'API Next.js
- **ORM** : Prisma + PostgreSQL
- **Auth** : Auth.js v5 credentials + bcrypt

### Architecture B — Astro 5 + API séparée Nest.js + Expo

- **Web** : Astro 5 statique-first avec React islands (`client:visible`) pour zones interactives
- **API** : Nest.js séparé (TypeScript, modules, contrôleurs, services), hébergé indépendamment
- **Mobile** : app Expo SDK 54 consommant l'API Nest.js
- **ORM** : TypeORM ou Prisma + PostgreSQL
- **Auth** : Passport.js (Nest) avec JWT pour web et mobile

### Architecture C — Vite + React SPA + API Hono/Fastify + Expo

- **Web** : SPA React (Vite + React Router) avec rendu 100% client
- **API** : Hono ou Fastify séparé, plus minimaliste que Nest.js
- **Mobile** : app Expo SDK 54
- **ORM** : Drizzle ou Prisma + PostgreSQL
- **Auth** : JWT custom avec lucia-auth ou maison

---

## 2. Tableau de scoring (échelle 1-5, 5 = excellent)

| Critère | Poids | A : Next.js + Expo | B : Astro + Nest + Expo | C : Vite SPA + Hono + Expo |
|---|---|---|---|---|
| **DX et productivité** | 20% | **5** | 3 | 3 |
| **Performance + SEO** | 20% | 4 | **5** | 2 |
| **Animations (GSAP/Framer)** | 20% | **5** | 4 | 4 |
| **Admin / CRUD / Auth** | 25% | **5** | 4 | 3 |
| **Mobile compagnon (code/types)** | 15% | **5** | 3 | 3 |
| **Score pondéré** | 100% | **4.85** | 3.85 | 2.95 |

---

## 3. Détail par critère

### 3.1 DX et productivité (poids 20%)

**A — Next.js : 5/5**
- Un seul package pour le web (front + API), un seul `npm run dev`
- TypeScript natif, ESLint config zero-conf
- Tailwind v4 intégré sans surcouche
- Hot reload performant en App Router
- Documentation excellente, communauté massive
- Server Actions évitent le boilerplate API pour les formulaires admin

**B — Astro + Nest : 3/5**
- Deux packages à orchestrer (Astro frontend + Nest backend)
- Astro statique-first, mais admin CRUD nécessite contournements (server endpoints Astro ou API distante)
- Nest.js verbose : décorateurs, modules, contrôleurs, services, providers
- Bonne séparation des préoccupations mais charge cognitive plus élevée pour solo dev

**C — Vite SPA + Hono : 3/5**
- Vite très rapide en HMR
- React Router à configurer manuellement
- Hono ultra-léger mais SPA = pas de SSR donc SEO + Open Graph plus difficile
- Plus de boilerplate (state management, data fetching, routing manuel)

---

### 3.2 Performance + SEO (poids 20%)

**A — Next.js : 4/5**
- SSR + RSC + ISR natifs
- Génération statique des pages projets/CV/about possible (revalidation à la demande)
- Métadonnées App Router excellente
- OG images dynamiques via `@vercel/og` ou route handler
- Lighthouse 95+ atteignable avec config soignée
- Bundle JS un peu plus lourd que Astro (sauf si on optimise au max RSC)

**B — Astro : 5/5**
- Statique par défaut, JS quasi-zero
- Lighthouse 100 sur pages publiques sans effort
- Excellent pour blog technique avec MDX
- Server endpoints suffisants pour preview API mais admin = pénible
- SEO impeccable

**C — Vite SPA : 2/5**
- SPA = blank screen initial, mauvais pour SEO sans SSR
- Crawlers Google rendent JS mais bots LinkedIn/Twitter ne lisent souvent que HTML
- OG dynamique compliqué (nécessite SSR ou prerender service)
- Score Lighthouse perf souvent < 80 sans optimisation poussée

---

### 3.3 Animations GSAP / Framer Motion (poids 20%)

**A — Next.js : 5/5**
- React-first → Framer Motion idiomatique
- GSAP avec `useGSAP` hook officiel React
- `'use client'` directive permet contrôle fin du client vs serveur
- Page transitions via `framer-motion` AnimatePresence
- Tilt, parallax, scroll-triggered : zéro friction

**B — Astro + React islands : 4/5**
- Possible mais on retombe sur React dans les islands
- Communication entre islands plus lourde (custom events ou Nano Stores)
- Transitions de page Astro natives (View Transitions) — bien pour des transitions simples, plus limité pour des animations complexes orchestrées
- GSAP fonctionne dans les islands

**C — Vite SPA : 4/5**
- React-first, comme A
- Pas de SSR donc certains effets (initial state animation) plus simples
- Pas d'avantage particulier vs Next.js

---

### 3.4 Admin / CRUD / Auth (poids 25%) — critère majeur

**A — Next.js : 5/5**
- Auth.js v5 intégré nativement (credentials, OAuth, magic link)
- Server Actions pour les formulaires admin (zero API endpoint à écrire pour des cas simples)
- Route Handlers pour l'API REST consommée par mobile
- Middleware Next.js pour la protection `/admin/*`
- Documentation OpenAPI via `zod-to-openapi` straightforward
- Single repo, single deploy

**B — Astro + Nest : 4/5**
- Nest excellent pour API structuré (guards, interceptors, pipes)
- Auth Passport.js robuste mais verbose
- Admin UI à coder côté Astro avec server endpoints — frictionnel
- Deux deploys à coordonner (Astro + Nest)
- OpenAPI natif Nest (`@nestjs/swagger`)

**C — Vite SPA + Hono : 3/5**
- Pas d'auth out-of-the-box, lucia-auth à intégrer
- Admin UI SPA sans SSR : moins idéal pour formulaires (mais OK avec Tanstack Query)
- Hono très léger mais peu de patterns établis pour grosse API admin
- Deux deploys, double cookie-domain pour auth

---

### 3.5 Mobile compagnon (poids 15%)

**A — Next.js : 5/5**
- Partage des types TypeScript via package shared (`packages/shared/types.ts`)
- Schémas Zod partagés serveur + client + mobile
- API REST documentée OpenAPI → mobile peut générer son client (orval, openapi-typescript-codegen)
- Auth.js fournit endpoints standards consommables par mobile via JWT secondaire ou session bearer

**B — Astro + Nest : 3/5**
- Nest API consommée par mobile sans souci
- Mais 3 codebases à maintenir (Astro web + Nest API + Expo mobile)
- Partage des types possible mais nécessite monorepo Nx/Turborepo

**C — Vite SPA + Hono : 3/5**
- Similaire à B
- 3 codebases
- Types partageables mais boilerplate monorepo

---

## 4. Critères secondaires (non scorés)

| Critère | A | B | C |
|---|---|---|---|
| Hébergement self-host | ✅ image Docker standalone | ✅ 2 images | ✅ 2 images + serve static |
| Coût (budget 0€) | ✅ tout dans 1 container | ✅ mais 2 containers | ✅ mais 2 containers |
| Migration depuis V0 | Repo vide, neutre | Repo vide, neutre | Repo vide, neutre |
| Recrutement futur (signal CV) | Next.js = stack très demandée 2026 | Astro émergent + Nest mature | Vite SPA = stack legacy 2026 |
| Compatibilité Storybook | ✅ Storybook 8 React | ✅ Storybook 8 React (sur islands) | ✅ Storybook 8 React |
| OpenAPI 3.1 généré | ✅ zod-to-openapi | ✅ Nest natif | ✅ zod-to-openapi + plug |
| Tests Vitest | ✅ | ✅ | ✅ |
| Tests E2E Playwright | ✅ | ✅ | ✅ |

---

## 5. Risques identifiés (architecture A retenue)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| App Router instabilité (canary features) | Faible | Moyen | Rester sur features stables, éviter Partial Prerendering en V1 |
| Auth.js v5 encore en beta au moment du démarrage | Moyenne | Moyen | Pinning version + roadmap claire vers stable, fallback NextAuth v4 documenté |
| Bundle JS trop lourd pour mobile 4G | Moyenne | Élevé | RSC max + audit Lighthouse + budget perf bloquant en CI |
| GSAP ScrollTrigger côté SSR | Faible | Faible | Wrapper dans `'use client'`, fallback statique |
| Coût free tier Vercel (si bascule) | N/A | N/A | Self-host dès V1, pas de dépendance Vercel |

---

## 6. Décision

**Architecture A — Next.js 15 full-stack + Expo Mobile**

Justifications principales :
1. **Score pondéré 4.85/5** vs 3.85 (B) vs 2.95 (C)
2. Solo dev → un seul codebase web à maintenir (front + API)
3. Animations React-first → GSAP/Framer idiomatique
4. Admin CRUD avec Server Actions + middleware = très peu de boilerplate
5. Mobile partage types et schémas via monorepo workspace (option `npm workspaces` ou simple package importé)
6. Hébergement Docker standalone simple sur le serveur

Cf. `pertinence-solution.md` pour l'argumentation détaillée.
