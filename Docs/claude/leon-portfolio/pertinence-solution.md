# Pertinence de la solution retenue

**Projet :** leon-portfolio
**Auteur :** HEU Léon
**Version :** 1.0 — Argumentation du choix architectural
**Solution retenue :** Architecture A — Next.js 15 full-stack + Expo SDK 54 mobile

---

## 1. Rappel des contraintes initiales

| Contrainte | Implication |
|---|---|
| Budget 0 € | Self-host obligatoire, free tiers uniquement |
| Hébergement serveur perso | Image Docker portable, reverse proxy local, TLS auto |
| Solo dev | Codebase à charge cognitive limitée, un seul stack |
| Mobile compagnon | Partage de types et schémas indispensable |
| Animations avancées | React-first, écosystème animation mature |
| WCAG AA + SEO + OG dynamique | SSR/SSG natifs, métadonnées injectables côté serveur |
| Storybook + OpenAPI + tests E2E/Lighthouse | Outils Vite/Vitest/Playwright/Lighthouse mainstream |
| Délai 6-8 sprints d'1 semaine | Pas de temps pour configurer 3 toolchains parallèles |

---

## 2. Pourquoi Next.js 15 plutôt qu'Astro

| Aspect | Next.js 15 | Astro 5 |
|---|---|---|
| Stack unifiée web + API | ✅ App Router + Route Handlers | ❌ Astro = front, API à part |
| Admin CRUD natif | ✅ Server Actions + middleware | ⚠ Server endpoints + boilerplate UI |
| Auth.js out-of-the-box | ✅ | ⚠ libs tierces |
| SEO statique | ✅ Génération statique + ISR | ✅ Statique par défaut |
| Animations React | ✅ Framer + GSAP natifs | ✅ via islands React |
| Bundle JS | Moyennement contrôlable | Quasi-zero par défaut |

→ **Next.js l'emporte sur l'admin et la productivité solo dev**. Astro brille pour blog statique pur, mais le besoin admin V1 (CRUD) penche pour Next.js.

---

## 3. Pourquoi Next.js full-stack plutôt qu'API séparée (Nest.js / Hono)

| Aspect | Next.js full-stack | API séparée + Front Next.js |
|---|---|---|
| Codebases à maintenir | 1 (web/) | 2 (web/ + api/) |
| Deployments | 1 image Docker | 2 containers à orchestrer |
| Auth | Auth.js single domaine | Cookie cross-origin + CORS à gérer |
| Types partagés web/mobile | Imports directs ou workspace | Boilerplate monorepo |
| Server Actions | ✅ formulaires admin sans endpoint dédié | ❌ obligation d'écrire endpoints |
| Évolution future API publique | Routes Handlers documentées OpenAPI | API séparée plus prête pour scaling |

→ **Full-stack retenu pour V1**. Si le portfolio évolue vers une API publique vraiment consommée par des tiers (autre que mobile compagnon), une extraction de `web/app/api/` vers un Nest.js dédié reste possible sans réécriture du front.

---

## 4. Pourquoi Expo plutôt que React Native CLI ou Flutter

| Critère | Expo SDK 54 | React Native CLI | Flutter |
|---|---|---|---|
| Setup initial | < 5 min | 30+ min (Android Studio, Xcode) | < 10 min |
| Build & deploy | EAS Build cloud (free tier) | Build manuel local | flutter build apk |
| Partage code web | TypeScript identique | TypeScript identique | Dart séparé, 0% partage |
| Dev itératif | Expo Go scan QR | Build natif obligatoire | Hot reload |
| Animations | Reanimated 3 (60fps) | Reanimated 3 | Animations natives Flutter |
| Ecosystème UI | React Native Paper + shadcn-rn | idem | Material widgets Flutter |
| Compatibilité avec API REST | Partage de types Zod | idem | DTOs Dart à coder |

→ **Expo retenu** : zero setup natif, EAS Build gratuit suffit pour APK demo, et le partage de schémas Zod entre web et mobile est trivial. Flutter aurait été pertinent pour des animations très complexes mais romprait le partage de code.

---

## 5. Pourquoi PostgreSQL + Prisma plutôt que SQLite ou MongoDB

| Critère | Postgres + Prisma | SQLite + Prisma | MongoDB + Mongoose |
|---|---|---|---|
| Standard pro (signal CV) | ✅ Top demandé 2026 | ❌ Embedded only | ✅ encore demandé |
| Hébergement auto-hébergé | ✅ Container Docker standard | ✅ fichier local | ✅ Container |
| Migrations | ✅ Prisma Migrate (versionnées) | ✅ idem | ⚠ pas de schéma strict |
| Relations many-to-many | ✅ pivot SQL classique | ✅ idem | ⚠ embed vs ref débat |
| Full-text search | ✅ tsvector + GIN | ⚠ FTS5 module | ⚠ Atlas Search (cloud) |
| Backup / restore | `pg_dump` standard | copie de fichier | `mongodump` |
| Type-safety client | Prisma Client typé | Prisma Client typé | Mongoose schema |

→ **Postgres retenu** : aligné sur les attentes professionnelles, Prisma typé end-to-end, full-text search disponible si besoin (recherche serveur projets/articles). SQLite était une option budget-friendly mais limite l'évolutivité et le signal CV.

---

## 6. Pourquoi Caddy plutôt que Traefik ou Nginx pour le reverse proxy

| Critère | Caddy 2 | Traefik 3 | Nginx |
|---|---|---|---|
| Config initiale | 1 Caddyfile lisible | YAML/CLI + labels Docker | nginx.conf verbose |
| TLS auto Let's Encrypt | ✅ natif zero-config | ✅ avec ACME provider | ❌ certbot externe |
| Dashboard | ⚠ basique | ✅ riche | ❌ |
| Plugins | Plugins Go (compil) | Middlewares natifs | Modules à compiler |
| Reload zero-downtime | ✅ | ✅ | ✅ |

→ **Caddy retenu** : simplicité de la config (~10 lignes pour leon-portfolio), TLS auto sans réfléchir. Traefik aurait été pertinent si on avait beaucoup de containers à orchestrer dynamiquement. Pour 1 site + staging + storybook, Caddy suffit largement.

---

## 7. Pourquoi Auth.js v5 plutôt qu'auth maison ou Lucia

| Aspect | Auth.js v5 | Lucia v3 | Auth maison |
|---|---|---|---|
| Maturité | Mature (héritier NextAuth) | Mature (mais maintainer a annoncé fin de maintenance) | Variable |
| Intégration Next.js 15 | ✅ first-class App Router | ✅ adapter Next | À coder |
| Providers | Credentials + OAuth + email natifs | À assembler | À coder |
| Documentation | Abondante | Bonne | N/A |
| Évolution future (OAuth GitHub) | ✅ ajout d'un provider en 5 lignes | ✅ idem | À coder |
| Risque | Beta v5 instable | Maintenance en pause | Trous de sécurité |

→ **Auth.js v5 retenu** malgré le statut beta : couvre tous les besoins V1 + V2 sans réinvention, l'écosystème pivotera autour de v5 à terme. Lucia écarté car le maintainer principal a annoncé l'arrêt de la maintenance fin 2024.

---

## 8. Pourquoi GSAP + Framer Motion combinés

| Outil | Force | Faiblesse | Cas d'usage leon-portfolio |
|---|---|---|---|
| GSAP 3 | Animations scroll-driven complexes, timeline, ScrollTrigger | Lourd (~50 KB gzip), license requise pour usage commercial des plugins SplitText/MorphSVG | Hero animé, sections scroll-driven, timeline CV |
| Framer Motion 12 | Animations React idiomatiques, AnimatePresence, layout animations | Moins puissant pour scroll orchestré | Page transitions, hover cards, micro-interactions |

→ **Les deux retenus**, complémentaires. GSAP pour les scènes complexes, Framer pour le quotidien des composants.

---

## 9. Compromis acceptés

| Compromis | Conséquence | Justification |
|---|---|---|
| Pas de CMS headless externe | CRUD admin à coder | Self-host total, 0 € de SaaS |
| Pas de S3 / Cloudinary | Upload sur volume Docker | Idem, 0 € |
| Pas de monitoring SaaS (Sentry, Datadog) | Logs Docker manuels | Idem, prévu en V2 avec auto-héberge Loki/Grafana |
| Bundle JS Next.js > Astro | Audit Lighthouse strict pour rester < budget | Acceptable pour les bénéfices Server Actions + Auth |
| Beta Auth.js v5 | Suivi évolutions, pin de version | Investissement long terme |
| Pas d'analytics V1 | Pas de mesure visiteurs | Décision RGPD pas d'enjeu (Bloc 5) |

---

## 10. Conclusion

L'architecture **Next.js 15 full-stack + Expo Mobile + Postgres/Prisma + Caddy** est retenue pour V1 car elle :

1. ✅ Maximise la productivité d'un solo dev (un seul codebase web)
2. ✅ Honore toutes les contraintes (0 € de SaaS, self-host, WCAG AA, SEO/OG dynamique)
3. ✅ Permet animations avancées React-first (GSAP + Framer)
4. ✅ Partage proprement les types et schémas avec le mobile Expo
5. ✅ Reste évolutive : l'API peut être extraite plus tard sans réécrire le front
6. ✅ Signal CV moderne : Next.js 15 + Expo + Prisma + Postgres = stack très demandée 2026

Cette pertinence est à relire en fin de Sprint 4 (post-admin) et en fin de Sprint 6 (post-hardening) pour valider que les choix tiennent à l'usage.
