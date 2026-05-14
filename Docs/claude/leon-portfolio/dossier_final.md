# Dossier projet — leon-portfolio

**Projet :** leon-portfolio — Portfolio personnel dynamique et animé
**Auteur :** HEU Léon
**Domaine de prod :** `leonheu.fr`
**Version dossier :** 1.0 — initial (sera complété en fin de Sprint 7)
**Format cible :** 10-15 pages PDF exportées via Pandoc ou impression Markdown

---

## Sommaire

1. Présentation du projet
2. Acteurs et public cible
3. Périmètre fonctionnel V1
4. Architecture technique
5. Modèle de données
6. Plan de développement et planning Scrum
7. Tests et qualité
8. Sécurité et conformité
9. Déploiement et exploitation
10. Bilan technique et dette
11. Roadmap V2+
12. Annexes

---

## 1. Présentation du projet

### 1.1 Pitch

**leon-portfolio** est un portfolio personnel dynamique et animé regroupant les projets, le parcours et les contributions open source de HEU Léon. L'objectif est triple :
- Servir de **vitrine pour recruteurs et clients freelance** francophones
- **Démontrer des compétences techniques** modernes (animations avancées, performance, accessibilité, mobile)
- Centraliser un **hub GitHub** agrégeant les repos publics avec leur activité

Une structure de blog technique est prévue dès la V1 (admin + DB) mais la page publique des articles est différée en V2.

### 1.2 Contexte

Side project personnel sans contrainte client. Le délai initial souhaité (2-3 jours) a été rebasculé sur un planning honnête de **8 sprints d'1 semaine** vu le périmètre demandé (web + mobile + admin + tests E2E + Lighthouse + Storybook + pentest).

### 1.3 Domaine et hébergement

- **Domaine** : `leonheu.fr` (OVH)
- **Hébergement** : Proxmox personnel, VM Debian 12, Docker Compose
- **Coût total** : 0 € hors domaine OVH (~10 €/an) — pas de SaaS payant

---

## 2. Acteurs et public cible

### 2.1 Acteurs

| Acteur | Description | Plateformes | Droits |
|---|---|---|---|
| Visiteur public | Recruteur, client freelance, dev curieux | Web + Mobile | Lecture seule |
| Admin (HEU Léon) | Auteur du portfolio | Web uniquement | CRUD projets, articles, tags + auth |

### 2.2 Public cible

- **Cible principale** : recruteurs tech francophones (RH, CTO, lead dev)
- **Cible secondaire** : pairs développeurs (signal CV via le repo open-source du portfolio lui-même)
- **Langue** : Français exclusivement (i18n hors périmètre V1)
- **Accessibilité visée** : WCAG AA + respect strict `prefers-reduced-motion`

---

## 3. Périmètre fonctionnel V1

### 3.1 Modules retenus

| Module | Web public | Web admin | Mobile |
|---|---|---|---|
| Accueil | ✅ | — | ✅ (simplifié) |
| Projets (catalogue + détail) | ✅ | ✅ CRUD | ✅ |
| CV / Parcours | ✅ | — | ❌ (lien externe) |
| About | ✅ | — | ✅ |
| Contact | ✅ mailto | — | ✅ mailto + share |
| Articles (blog) | V2 | ✅ CRUD draft | ❌ |
| Hub GitHub | ✅ | — | ❌ |
| Auth admin | ❌ | ✅ Auth.js | ❌ |

### 3.2 Hors périmètre V1

- Page publique du blog (différée V2)
- Newsletter / mailing list
- Commentaires sur articles
- Analytics avancés (Plausible, Umami, GA)
- Internationalisation (FR uniquement)
- Tracker événements / dashboard analytics
- Auth mobile (lecture publique uniquement V1)

### 3.3 Backlog résumé

35 user stories rédigées dans `User_stories.md`, réparties :
- **Vitrine (VI)** : 6 stories
- **Projets (PJ)** : 5 stories
- **CV (CV)** : 2 stories
- **Contact (CT)** : 2 stories
- **Admin (AD)** : 7 stories
- **Blog (BL)** : 2 stories V2
- **Mobile (MOB)** : 5 stories
- **Transverse (TR)** : 6 stories (sécurité, SEO, a11y)

Couverture priorités :
- P1 (Must) : 14 stories
- P2 (Should) : 14 stories
- P3 (Could) : 4 stories
- P4 (Won't V1) : 3 stories

---

## 4. Architecture technique

### 4.1 Stack retenue

| Couche | Technologie | Version cible |
|---|---|---|
| Framework web full-stack | Next.js | 15.x (App Router) |
| Langage | TypeScript | 5.x strict |
| Styling | Tailwind CSS | v4 |
| Composants UI | shadcn/ui + Radix Primitives | latest |
| Animations web | GSAP + Framer Motion | 3.x / 12.x |
| Forms | React Hook Form + Zod | latest |
| ORM | Prisma | 5.x |
| Base de données | PostgreSQL | 16 |
| Auth | Auth.js | 5.x (beta) |
| Mobile | Expo SDK / React Native | 54+ / 0.81+ |
| Animations mobile | React Native Reanimated | 3.x |
| HTTP mobile | axios + TanStack Query | latest |
| Stockage sécurisé mobile | expo-secure-store | latest |
| Design System | Storybook | 8.x |
| Documentation API | zod-to-openapi + Scalar | latest |
| Conteneurisation | Docker + Docker Compose | latest |
| Reverse proxy | Caddy | 2.x |
| CI/CD | GitHub Actions | — |
| Tests unitaires | Vitest | 2.x |
| Tests E2E | Playwright | latest |
| Tests perf | Lighthouse CI | latest |
| Build mobile | EAS Build | free tier |

Justification détaillée dans `comparatif-techniques.md` et `pertinence-solution.md`.

### 4.2 Architecture globale

```
┌──────────────────────────────────────────────────────────────────────┐
│                      VISITEUR (web)                                   │
└──────────────┬───────────────────────────────────────────────────────┘
               │ HTTPS leonheu.fr
               ▼
        ┌──────────────┐
        │    CADDY     │  TLS auto Let's Encrypt + reverse proxy
        └──────┬───────┘
               │
               ▼
        ┌─────────────────────────────────┐
        │   NEXT.JS 15 (container Docker) │
        │   ┌───────────┐  ┌──────────┐   │
        │   │ App Router│  │   API    │   │
        │   │   (RSC)   │  │ Route    │   │
        │   │           │  │ Handlers │   │
        │   └─────┬─────┘  └────┬─────┘   │
        │         │             │         │
        │         └──────┬──────┘         │
        │                ▼                │
        │         ┌──────────────┐        │
        │         │   PRISMA     │        │
        │         └──────┬───────┘        │
        └────────────────┼────────────────┘
                         ▼
                  ┌──────────────┐
                  │  POSTGRES 16 │ (volume Docker persistant)
                  └──────────────┘
                         │
                         │ pg_dump quotidien
                         ▼
                  ┌──────────────┐
                  │  /backup/    │
                  └──────────────┘

        ┌─────────────────────────────────┐
        │   MOBILE (Expo Go ou APK EAS)   │
        │                                  │
        │   axios + TanStack Query        │──── HTTPS api ────► leonheu.fr/api/*
        │   expo-router + Reanimated 3    │
        └─────────────────────────────────┘
```

### 4.3 Structure monorepo

Détail complet dans `Plan_developpement.md § 2.3`. Synthèse :

```
leon-portfolio/
├── web/              # Next.js 15 full-stack (front + API + Storybook)
├── mobile/           # Expo SDK 54
├── docs/             # Docs publiques dans le repo
├── tests/            # Cahier de tests + procédures + PV
├── infra/            # docker-compose + Caddyfile + scripts
├── .github/          # Workflows CI/CD + templates
└── ...
```

### 4.4 Choix architecturaux clés

| Décision | Justification |
|---|---|
| Next.js full-stack (pas d'API séparée) | Solo dev → 1 codebase, Server Actions, Auth.js intégré |
| Postgres + Prisma | Standard pro, type-safety end-to-end, migrations versionnées |
| Auth.js v5 credentials + bcrypt | Mature, extensible (OAuth GitHub futur), middleware Next |
| Caddy reverse proxy | Config minimale, TLS auto Let's Encrypt, dashboard pas critique |
| GSAP + Framer Motion | Complémentaires (scroll-driven vs micro-interactions React) |
| Expo plutôt que RN CLI ou Flutter | Zero setup natif, EAS Build gratuit, partage code TS web |

---

## 5. Modèle de données

### 5.1 Entités

| Entité | Description | Cardinalités principales |
|---|---|---|
| `User` | Compte admin (1 seul en pratique V1) | — |
| `Project` | Projet curé (titre, slug, content MDX, image, status) | N-N avec `Tag` |
| `Article` | Article blog (status draft/published, content MDX) | N-N avec `Tag` |
| `Tag` | Tag partagé projets + articles | N-N avec `Project` et `Article` |
| `ProjectTag`, `ArticleTag` | Tables pivot | — |

Détail complet (DBML + DDL + Prisma) dans `mld.md`.

### 5.2 Volume estimé V1

| Table | Lignes V1 | Lignes V2 estimé |
|---|---|---|
| users | 1 | 1-3 |
| projects | 5-20 | 30-50 |
| articles | 0 publiés (5-10 draft) | 20-50 |
| tags | 10-20 | 30 |
| project_tags | 20-50 | 100 |
| article_tags | 20-50 | 200 |

Très faible volume → pas d'optimisation BDD particulière nécessaire au-delà des index slug et status.

### 5.3 Backup et reprise

- `pg_dump` quotidien automatique dans `/backup/` (rétention 14 jours)
- Snapshot Proxmox hebdomadaire (rétention 4 semaines)
- Procédure de restauration documentée dans `installation.md § 5.6`

---

## 6. Plan de développement et planning Scrum

### 6.1 Sprints (8 × 1 semaine)

| Sprint | Focus | Période visée |
|---|---|---|
| 0 — Foundations | Setup repo + stack + CI + direction visuelle | S1 |
| 1 — Vitrine Hero | Accueil animé + Nav + About + Dark mode | S2 |
| 2 — Projets | Catalogue + détail + GitHub API | S3 |
| 3 — CV / Contact / Recherche | Timeline CV + PDF + Contact + Recherche client | S4 |
| 4 — Admin | Auth.js + CRUD projets + articles draft + upload | S5 |
| 5 — Mobile | Expo + tabs + écrans + EAS preview | S6 |
| 6 — Hardening | Sécurité OWASP + Lighthouse + E2E + a11y | S7 |
| 7 — Release | Docs + dossier + mise en prod + v1.0.0 | S8 |

Détail dans `Planning_Scrum.md` : issues numérotées par sprint, estimations horaires, DoD, gantt.

### 6.2 Cérémonies

- Sprint planning lundi matin (30 min)
- Daily : 2 min mental (solo)
- Sprint review dimanche soir (30 min) + fichier `sprintN-titre.md`
- Sprint retro intégrée au review

### 6.3 Risques majeurs

- **Charge cognitive 8 sprints solo** : autorisation de reporter 1 sprint si débordement
- **Auth.js v5 beta** : pin version + suivi changelog
- **Sprint 4 chargé (admin)** : tampon sur Sprint 5
- **Pentest découvre faille bloquante (S6)** : tampon Sprint 7

---

## 7. Tests et qualité

### 7.1 Types de tests

| Type | ID | Outil | Périmètre |
|---|---|---|---|
| Unitaires | TU-* | Vitest | Logique métier, helpers, hooks |
| Fonctionnels API | TF-* | Vitest + Prisma testcontainers | Routes API, auth, CRUD |
| Fonctionnels Web | TF-WEB-* | Recette manuelle Chrome/FF/Safari | Parcours visiteur |
| Mobile | TM-* | Expo Go + cahier | Écrans, partage, perf mobile |
| Non-régression | TNR-* | GitHub Actions | Sous-ensemble TU+TF+TE bloquant en PR |
| Sécurité | TS-* | Manuel + curl | OWASP Top 10, headers, CORS |
| E2E auto | TE-* | Playwright | Parcours critiques en CI |
| Performance | TP-* | Lighthouse CI | Budgets bloquants en CI |

Catalogue complet dans `Cahier_de_tests.md` (60+ cas documentés).

### 7.2 CI/CD

- **CI** : GitHub Actions, 3 jobs en parallèle (web-tests / web-e2e-lighthouse / mobile-checks)
- **CD staging** : auto sur merge `develop` → image Docker + SSH VM staging
- **CD prod** : auto sur merge `main` → image Docker + SSH VM prod
- **Concurrency** group `${{ github.ref }}` pour annuler les runs précédents

### 7.3 Budgets perf

| Métrique | Seuil |
|---|---|
| Lighthouse Performance (accueil) | ≥ 90 |
| Lighthouse Performance (autres pages) | ≥ 85 |
| Lighthouse A11y | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| TBT | < 200ms |

---

## 8. Sécurité et conformité

### 8.1 Mesures appliquées

| Mesure | Détail |
|---|---|
| HTTPS partout | Caddy + Let's Encrypt, redirect 301 HTTP→HTTPS |
| HSTS | `max-age=15552000; includeSubDomains` (6 mois) |
| CSP | `default-src 'self'; img-src 'self' https:; script-src 'self' 'unsafe-inline'` (relâché pour GSAP/Framer) |
| Headers | X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin |
| Hash mdp | bcrypt cost 12 |
| Rate limit | Login : 5 / 15min, API publique : 100 / min |
| Auth session | Cookie HTTP-only, SameSite=Lax, Secure prod |
| Validation entrées | Zod côté serveur (Server Actions + Route Handlers) |
| Upload | Validation MIME + magic bytes + taille + dimensions + compression sharp |
| Logs Docker | `docker compose logs` accessible (V2 : Loki) |

### 8.2 RGPD

Décision Bloc 5 : **pas d'enjeu RGPD réel** pour les visiteurs.
- Pas de formulaire contact (lien `mailto:` direct → pas de traitement DP côté serveur)
- Pas de cookies tracking
- Pas d'analytics
- Page mentions légales basique (éditeur + hébergeur + contact)
- Seul l'admin = HEU Léon stocké en DB (auto-traitement, hors champ RGPD strict)

### 8.3 Pentest OWASP Top 10

Audit manuel prévu en Sprint 6 (cf. `procedure-validation.md § 6`). Rapport stocké dans `Docs/claude/Sprint docs/sprint6-hardening-report.md`.

---

## 9. Déploiement et exploitation

### 9.1 Environnements

| Environnement | URL | VM Proxmox | Branche |
|---|---|---|---|
| Dev local | localhost:3000 | — | feat/* |
| Staging | staging.leonheu.fr | portfolio-staging | develop |
| Production | leonheu.fr | portfolio-prod | main |

### 9.2 Process de release

1. PRs feature → develop (review + CI verte + merge)
2. Fin de sprint : PR récap `release: Sprint N` develop → main (merge après CI verte)
3. Workflow `deploy-prod.yml` SSH VM prod
4. Smoke tests prod (J5 cf. procedure-validation)
5. Tag intermédiaire `v0.N.0` optionnel
6. Tag `v1.0.0` après Sprint 7

### 9.3 Rollback

- Toutes les images Docker taggées avec SHA commit + branche
- Modification ligne `image:` dans `docker-compose.yml` sur la VM + `up -d`
- Procédure documentée dans `installation.md § 6.3`

### 9.4 Monitoring V1

- Logs Docker : `docker compose logs` (manuel)
- Healthcheck Caddy : `GET /api/health` retourne 200 + version
- Backup pg_dump quotidien testé en restoration
- Snapshot Proxmox hebdo testé en restoration

### 9.5 Monitoring V2 (prévu)

- Loki + Grafana auto-hébergés sur Proxmox
- Dashboards : requêtes/sec, latence, erreurs 5xx, taux 401
- Alertes Telegram ou email sur erreurs

---

## 10. Bilan technique et dette

> Section à compléter en fin de Sprint 7 — voici le squelette.

### 10.1 Métriques finales

- Commits sur develop : _N_
- Pull Requests mergées : _N_
- Lignes de code : web _N_ / mobile _N_
- Tests : _N_ TU, _N_ TF, _N_ TE, couverture _X_%
- Lighthouse moyen : _N_ (perf), _N_ (a11y)
- Temps total passé : _N_ h

### 10.2 Dette technique identifiée

À documenter au fil des sprints dans les `sprintN-titre.md` puis consolidée ici.

Items prévisibles :
- Bundle JS Next.js à optimiser (RSC max, dynamic imports)
- Mobile : pas d'auth V1, structure prête pour V2
- Logs / monitoring : `docker compose logs` minimaliste, Loki en V2
- Upload images : volume Docker local, à externaliser S3-like en V2

### 10.3 Choix structurants à relire

- Décision API monolithique (Route Handlers Next) vs API séparée : OK pour V1, à réévaluer si volume requêtes mobile explose
- Auth.js v5 beta : releaser stable V5 avant migration V2
- Caddy vs Traefik : OK si pas plus de containers

---

## 11. Roadmap V2+

| Évolution | Sprint estimé | Priorité |
|---|---|---|
| Pages publiques articles (blog V2) | 1 sprint | P1 |
| Internationalisation FR + EN | 2 sprints | P2 |
| Auth mobile + écrans admin mobile | 2 sprints | P3 |
| Analytics self-host (Plausible local) | 0.5 sprint | P2 |
| Monitoring (Grafana + Loki) | 1 sprint | P2 |
| Image externalisée (MinIO sur Proxmox) | 0.5 sprint | P3 |
| OAuth GitHub login admin | 0.5 sprint | P3 |
| Migration Auth.js stable v5 (quand release) | 0.5 sprint | P1 (sécurité) |
| Newsletter (V3) | 1 sprint | P4 |
| Commentaires articles (V3) | 2 sprints | P4 |

---

## 12. Annexes

### 12.1 Documents liés

- `Plan_developpement.md` — Périmètre, stack, architecture, conventions GitHub
- `Planning_Scrum.md` — Découpage en 8 sprints, issues estimées, gantt, risques
- `User_stories.md` — 35 stories rédigées avec critères d'acceptation + traçabilité
- `Cahier_de_tests.md` — 60+ cas (TU, TF, TF-WEB, TM, TS, TE, TP, TS-A11Y)
- `mld.md` — Modèle Logique de Données (DBML + Prisma + DDL Postgres)
- `comparatif-techniques.md` — 3 archis × 5 critères pondérés
- `pertinence-solution.md` — Argumentation du choix Next.js full-stack
- `installation.md` — Guide dev local + prod Proxmox + troubleshooting
- `procedure-validation.md` — Recette en 6 jalons (J1 à J6)
- `pv-recette.md` — Modèle vierge de PV interne

### 12.2 Liens externes

| Lien | Description |
|---|---|
| https://leonheu.fr | Production |
| https://staging.leonheu.fr | Staging |
| https://storybook.leonheu.fr | Storybook (Basic Auth) |
| https://leonheu.fr/api/docs | OpenAPI Scalar UI |
| https://github.com/<username>/leon-portfolio | Repo source |
| https://github.com/<username>/leon-portfolio/projects | Project Board |

### 12.3 Comptes de test

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Admin | `ADMIN_EMAIL` env | `ADMIN_PASSWORD` env (à changer en prod) |

### 12.4 Glossaire

| Terme | Définition |
|---|---|
| App Router | Système de routage Next.js basé sur les dossiers `app/` |
| RSC | React Server Components — composants rendus côté serveur |
| ISR | Incremental Static Regeneration — pages statiques revalidées à la demande |
| MDX | Markdown + JSX — Markdown avec composants React intégrés |
| Server Actions | Fonctions Next.js callables depuis un form, sans endpoint API explicite |
| WCAG AA | Niveau d'accessibilité moyen (contraste 4.5:1, navigation clavier, etc.) |
| OWASP Top 10 | Top 10 des vulnérabilités web par l'OWASP Foundation |
| EAS Build | Service de build cloud d'Expo |
| ScrollTrigger | Plugin GSAP pour animations scroll-driven |
| Reanimated | Lib animations React Native 60fps via worklets natifs |
