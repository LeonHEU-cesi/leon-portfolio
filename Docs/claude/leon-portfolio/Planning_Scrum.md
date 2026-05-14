# Planning Scrum — leon-portfolio

**Projet :** leon-portfolio
**Auteur :** HEU Léon
**Version :** 1.0 — Plan initial, 8 sprints d'1 semaine
**Période visée :** 2026-05-14 → 2026-07-09 (8 semaines)
**Méthodologie :** Scrum solo dev, sprint 1 semaine, récap obligatoire fin de sprint

---

## 1. Vue d'ensemble

| # | Sprint | Période | Focus | Issues estimées |
|---|---|---|---|---|
| 0 | **Foundations** | S1 — 14 → 21 mai | Repo, stack, CI/CD, direction visuelle, design system | 10-12 |
| 1 | **Vitrine Hero** | S2 — 21 → 28 mai | Accueil animé + Nav + About + Dark mode | 8-10 |
| 2 | **Projets** | S3 — 28 mai → 4 juin | Catalogue + détail + GitHub API | 10-12 |
| 3 | **CV / Contact / Recherche** | S4 — 4 → 11 juin | Timeline CV + PDF + Contact + Recherche client | 8-10 |
| 4 | **Admin** | S5 — 11 → 18 juin | Auth.js + CRUD projets + articles draft + upload | 12-14 |
| 5 | **Mobile** | S6 — 18 → 25 juin | Expo + tabs + écrans + EAS preview | 8-10 |
| 6 | **Hardening** | S7 — 25 juin → 2 juil | Sécurité OWASP + perf Lighthouse + E2E + a11y audit | 8-10 |
| 7 | **Release** | S8 — 2 → 9 juil | Docs, dossier, mise en prod, monitoring, v1.0.0 | 8-10 |

**Total estimé** : ~80 issues sur 8 sprints. Cadence soutenue → revue intermédiaire au sprint 4 pour réajuster si besoin.

---

## 2. Cérémonies Scrum (solo dev adaptées)

| Cérémonie | Fréquence | Durée | Output |
|---|---|---|---|
| Sprint planning | Début sprint (lundi matin) | 30 min | Issues planifiées dans Project Board, milestone du sprint |
| Daily standup | (Optionnel solo) | 2 min mentaux | État d'avancement, blocage du jour |
| Sprint review | Fin sprint (dimanche soir) | 30 min | Fichier `Docs/claude/Sprint docs/sprintN-titre.md` + PR récap develop→main |
| Sprint retrospective | Fin sprint (intégré au review) | 15 min | Section "Dette technique" + "Choses à améliorer sprint suivant" du fichier sprint |

**Adaptation solo dev** : pas de daily formel, mais entrée JOURNAL.md à chaque issue + commit message clair.

---

## 3. Sprint 0 — Foundations

### Objectif
Bootstrap complet : repo Git + GitHub, stack Next/Prisma/Postgres en local, CI minimale, direction visuelle proposée et validée, Storybook + token design.

### Issues

| ID | Titre | Scope | Estimation |
|---|---|---|---|
| 0.1 | Init repo Git local + remote GitHub | scope-infra | 1h |
| 0.2 | Default branch develop + auto-delete branches | scope-infra | 0.5h |
| 0.3 | Issues + milestones + labels + Project Board v2 | scope-infra | 2h |
| 0.4 | `.gitignore` + `.env.example` + README initial | scope-docs | 1h |
| 0.5 | Init Next.js 15 + TypeScript strict dans `web/` | scope-web | 1h |
| 0.6 | Init Prisma + schema + 1ère migration | scope-web | 1h |
| 0.7 | Docker Compose dev local (Postgres + Adminer) | scope-infra | 1h |
| 0.8 | CI GitHub Actions minimale (lint + typecheck + build) | scope-infra | 1.5h |
| 0.9 | Storybook 8 + 2 stories démo | scope-web | 1.5h |
| 0.10 | Proposer 3 directions visuelles (sobre / éditorial / brutaliste) → choix | scope-docs | 2h |
| 0.11 | Tokens design (palette, typo, espacement) Tailwind v4 | scope-web | 1h |
| 0.12 | Layout root + composants header / footer minimaux | scope-web | 1.5h |

**Estimation totale** : ~14h. Aggressive pour 1 semaine — tampon sur 0.10 (direction visuelle peut traîner).

### Definition of Done

- [ ] `git clone leon-portfolio && cd leon-portfolio && docker compose up -d && cd web && npm i && npm run dev` fonctionne
- [ ] CI passe sur la branche develop
- [ ] Storybook accessible sur localhost:6006 avec 2 stories
- [ ] Direction visuelle choisie et tokens en place
- [ ] Sprint review rédigé dans `Docs/claude/Sprint docs/sprint0-foundations.md`

---

## 4. Sprint 1 — Vitrine Hero

### Objectif
Page d'accueil avec hero animé GSAP, navigation, footer, dark mode persistant, page About.

### Issues

| ID | Titre | Scope | Estimation | US |
|---|---|---|---|---|
| 1.1 | Composant `<Header>` + nav avec indicateur de page active | scope-web | 2h | US-VI-03 |
| 1.2 | Menu burger mobile animé | scope-web | 1.5h | US-VI-03 |
| 1.3 | Composant `<Footer>` + lien mentions légales | scope-web | 1h | US-VI-03 |
| 1.4 | Hero animé GSAP avec ScrollTrigger | scope-web | 3h | US-VI-01 |
| 1.5 | Section "Projets phares" (3 statique pour V1) | scope-web | 1.5h | US-VI-02 |
| 1.6 | Hook `usePrefersReducedMotion` + tests TU | scope-web, scope-tests | 1h | US-VI-06 |
| 1.7 | Toggle dark mode persistant (next-themes + cookie) | scope-web | 2h | US-VI-04 |
| 1.8 | Page `/about` avec bio narrative | scope-web | 2h | US-VI-05 |
| 1.9 | Tests TU + TF-WEB sur Sprint 1 | scope-tests | 2h | TU-VI-01,02 / TF-WEB-01,02,06 |

**Estimation totale** : ~16h.

### Definition of Done

- [ ] Accueil hero animé fluide à 60fps
- [ ] `prefers-reduced-motion` honoré (test manuel OS)
- [ ] Dark mode bascule + persiste
- [ ] Page About rédigée et stylée
- [ ] Tests TU et TF-WEB Sprint 1 passent
- [ ] Sprint review dans `sprint1-vitrine-hero.md`

---

## 5. Sprint 2 — Projets

### Objectif
Catalogue de projets avec filtres, page détail, et intégration GitHub API pour repos publics.

### Issues

| ID | Titre | Scope | Estimation | US |
|---|---|---|---|---|
| 2.1 | Schéma Prisma `Project` + `Tag` + `ProjectTag` + migration | scope-web | 1h | — |
| 2.2 | Seed initial 5 projets + tags | scope-web | 1.5h | — |
| 2.3 | Page `/projets` avec grille responsive | scope-web | 2.5h | US-PJ-01 |
| 2.4 | Filtres tags / chips avec URL sync | scope-web | 2h | US-PJ-05 |
| 2.5 | Page `/projets/[slug]` détail | scope-web | 2.5h | US-PJ-02 |
| 2.6 | Service GitHubService + cache ISR 24h | scope-web | 2h | US-PJ-04 |
| 2.7 | Section "Mes repos publics" sur `/projets` | scope-web | 1.5h | US-PJ-04 |
| 2.8 | Animations cards hover (Framer Motion) | scope-web | 1.5h | US-PJ-01 |
| 2.9 | Tests TF API `/api/projects` + GitHub mock | scope-tests | 2h | TF-PJ-01 à 04 |
| 2.10 | Tests E2E parcours catalogue → détail | scope-tests | 1.5h | TE-01, TE-03 |

**Estimation totale** : ~18h.

### Definition of Done

- [ ] Catalogue fonctionnel avec filtres URL-sync
- [ ] Détail projet 404 propre si inexistant
- [ ] GitHub repos affichés avec cache 24h
- [ ] Tests TF + TE passent
- [ ] Sprint review dans `sprint2-projets.md`

---

## 6. Sprint 3 — CV / Contact / Recherche

### Objectif
Page CV avec timeline animée et PDF téléchargeable, page Contact, recherche client sur projets, mentions légales.

### Issues

| ID | Titre | Scope | Estimation | US |
|---|---|---|---|---|
| 3.1 | Page `/cv` avec timeline expériences animée au scroll | scope-web | 3h | US-CV-01 |
| 3.2 | Sections Compétences + Formations + Langues + Loisirs | scope-web | 2h | US-CV-01 |
| 3.3 | CSS `@media print` + bouton "Télécharger PDF" | scope-web | 1h | US-CV-02 |
| 3.4 | Génération PDF avec Pandoc (build script) ou statique dans `public/` | scope-web, scope-docs | 1.5h | US-CV-02 |
| 3.5 | Page `/contact` avec mailto + icônes réseaux | scope-web | 1.5h | US-CT-01 |
| 3.6 | QR vCard SVG (optionnel) | scope-web | 1h | US-CT-02 |
| 3.7 | Recherche client Fuse.js sur `/projets` | scope-web | 2h | US-PJ-03 |
| 3.8 | Page `/mentions-legales` rédigée | scope-docs | 1h | US-TR-04 |
| 3.9 | sitemap.ts + robots.ts | scope-web | 1h | US-TR-05 |
| 3.10 | Tests TF-WEB recette manuelle | scope-tests | 1.5h | TF-WEB-04, 08 |

**Estimation totale** : ~15h.

### Definition of Done

- [ ] Page CV imprimable propre + PDF téléchargeable
- [ ] Contact mailto + réseaux opérationnels
- [ ] Recherche client en temps réel
- [ ] Sitemap + robots valides
- [ ] Sprint review dans `sprint3-cv-contact-recherche.md`

---

## 7. Sprint 4 — Admin

### Objectif
Back-office sécurisé avec login Auth.js, CRUD projets, CRUD articles draft, gestion tags, upload images.

### Issues

| ID | Titre | Scope | Estimation | US |
|---|---|---|---|---|
| 4.1 | Schéma Prisma `User` + `Article` + `ArticleTag` + migration | scope-web | 1h | — |
| 4.2 | Seed admin via script + ADMIN_EMAIL/PASSWORD env | scope-web | 1h | — |
| 4.3 | Setup Auth.js v5 credentials provider | scope-web | 2.5h | US-AD-01 |
| 4.4 | Middleware Next.js sur `/admin/*` | scope-web | 1h | US-AD-01 |
| 4.5 | Page `/login` avec form + Server Action | scope-web | 1.5h | US-AD-01 |
| 4.6 | Rate limit login (5 / 15 min) | scope-web | 1.5h | US-TR-03 |
| 4.7 | Page `/admin` dashboard simple | scope-web | 1h | US-AD-03 |
| 4.8 | Page `/admin/projects` liste + recherche + filtres | scope-web | 2h | US-AD-04 |
| 4.9 | Page `/admin/projects/new` + Server Action create | scope-web | 2h | US-AD-04 |
| 4.10 | Page `/admin/projects/[id]` édition + delete | scope-web | 2h | US-AD-04 |
| 4.11 | Page `/admin/tags` CRUD inline | scope-web | 2h | US-AD-05 |
| 4.12 | Upload images `/api/admin/upload` + sharp resize | scope-web | 2.5h | US-AD-06 |
| 4.13 | Page `/admin/articles` CRUD draft (sans publication V1) | scope-web | 2.5h | US-AD-07 |
| 4.14 | Tests TF API admin (auth, CRUD, rate limit) | scope-tests | 3h | TF-AD-01 à 07 / TF-AUTH-01,02 |
| 4.15 | Tests E2E login admin | scope-tests | 1h | TE-04 |

**Estimation totale** : ~26h — **sprint le plus chargé**, prévoir débordement éventuel sur le sprint 5 (mobile).

### Definition of Done

- [ ] Login / logout fonctionnels avec rate limit
- [ ] CRUD projets complet via UI
- [ ] CRUD tags inline
- [ ] CRUD articles draft (sans page publique)
- [ ] Upload images compressé en webp
- [ ] Tests TF + TE Admin passent
- [ ] Sprint review dans `sprint4-admin.md`

---

## 8. Sprint 5 — Mobile

### Objectif
App Expo SDK 54 avec écrans tabs (Accueil / Projets / About / Contact), consommation de l'API prod, APK généré via EAS preview.

### Issues

| ID | Titre | Scope | Estimation | US |
|---|---|---|---|---|
| 5.1 | Init projet Expo dans `mobile/` + config app.json | scope-mobile | 1.5h | US-MOB-01 |
| 5.2 | expo-router setup avec `(tabs)` layout | scope-mobile | 1.5h | US-MOB-02 |
| 5.3 | Écran `(tabs)/index.tsx` accueil simplifié | scope-mobile | 1h | — |
| 5.4 | Écran `(tabs)/projects.tsx` FlatList + TanStack Query | scope-mobile | 2.5h | US-MOB-03 |
| 5.5 | Écran `projects/[slug].tsx` détail + partage | scope-mobile | 2.5h | US-MOB-04 |
| 5.6 | Pull-to-refresh sur catalogue | scope-mobile | 0.5h | US-MOB-05 |
| 5.7 | Écran `(tabs)/about.tsx` | scope-mobile | 1h | — |
| 5.8 | Écran `(tabs)/contact.tsx` avec mailto + share | scope-mobile | 1h | US-CT-01 |
| 5.9 | Animations transitions Reanimated 3 | scope-mobile | 2h | — |
| 5.10 | Configuration EAS Build preview profile | scope-mobile, scope-infra | 1.5h | US-MOB-01 |
| 5.11 | Premier build APK preview + test sur device physique | scope-mobile | 1.5h | US-MOB-01 |
| 5.12 | Recette manuelle TM-01 à TM-07 | scope-tests | 2h | TM-* |

**Estimation totale** : ~18.5h.

### Definition of Done

- [ ] App démarre sur Android et iOS via Expo Go
- [ ] Catalogue + détail + partage fonctionnels
- [ ] APK preview généré et installé sur device
- [ ] Tous les TM passent
- [ ] Sprint review dans `sprint5-mobile.md`

---

## 9. Sprint 6 — Hardening

### Objectif
Sécurisation OWASP + budgets perf bloquants + tests E2E complets + audit accessibilité + déploiement staging.

### Issues

| ID | Titre | Scope | Estimation | US |
|---|---|---|---|---|
| 6.1 | Headers sécurité (CSP, HSTS, X-Frame-Options) dans `next.config.ts` | scope-web | 1.5h | US-TR-01 |
| 6.2 | Validation magic-bytes upload (au-delà extension) | scope-web | 1h | US-AD-06 |
| 6.3 | Audit XSS sur rendering MDX user-content | scope-web | 2h | TS-INPUT-02 |
| 6.4 | Pentest manuel OWASP Top 10 + rapport | scope-tests | 3h | TS-AUTH-*, TS-INPUT-* |
| 6.5 | Lighthouse CI config + budgets dans `lighthouserc.cjs` | scope-tests | 1.5h | TP-* |
| 6.6 | Optimisation perf : images, code splitting, lazy load | scope-web | 3h | TP-* |
| 6.7 | Playwright config + suite E2E TE-01 à TE-05 | scope-tests | 3h | TE-* |
| 6.8 | Audit axe DevTools sur 5 pages publiques + corrections | scope-web, scope-tests | 2h | TS-A11Y-* |
| 6.9 | Audit NVDA / VoiceOver manuel | scope-tests | 1h | TS-A11Y-03 |
| 6.10 | OG images dynamiques + JSON-LD Person | scope-web | 2.5h | US-TR-06 |
| 6.11 | Workflow `deploy-staging.yml` + VM staging Proxmox | scope-infra | 2.5h | — |
| 6.12 | DNS staging.leonheu.fr + certificat | scope-infra | 1h | — |

**Estimation totale** : ~24h — second sprint chargé.

### Definition of Done

- [ ] Mozilla Observatory grade B+ minimum
- [ ] Lighthouse > 90 sur Accueil, Projets, CV, About
- [ ] Playwright passe en CI
- [ ] axe DevTools : 0 violation contraste
- [ ] NVDA test passé
- [ ] Staging déployé sur `staging.leonheu.fr` HTTPS
- [ ] Sprint review dans `sprint6-hardening.md`

---

## 10. Sprint 7 — Release

### Objectif
Documentation finalisée + dossier projet + mise en prod sur `leonheu.fr` + monitoring basique + tag v1.0.0.

### Issues

| ID | Titre | Scope | Estimation |
|---|---|---|---|
| 7.1 | Rédaction `dossier_final.md` complet (10-15p) | scope-docs | 4h |
| 7.2 | `installation.md` finalisé + troubleshooting | scope-docs | 1.5h |
| 7.3 | `procedure-validation.md` + check-list complète | scope-docs | 1h |
| 7.4 | OpenAPI exposé via Scalar UI sur `/api/docs` | scope-web | 1.5h |
| 7.5 | Workflow `deploy-prod.yml` + VM prod Proxmox | scope-infra | 2h |
| 7.6 | Configuration DNS leonheu.fr (A record) | scope-infra | 0.5h |
| 7.7 | Certificat TLS Let's Encrypt prod | scope-infra | 0.5h |
| 7.8 | Backup pg_dump quotidien + cron | scope-infra | 1h |
| 7.9 | Snapshots Proxmox hebdo configurés | scope-infra | 0.5h |
| 7.10 | Smoke tests prod (TF-WEB-01 à 08 sur prod) | scope-tests | 2h |
| 7.11 | PR release + tag v1.0.0 + release notes | scope-infra | 1h |
| 7.12 | Storybook déployé sur `storybook.leonheu.fr` (optionnel) | scope-infra | 1h |

**Estimation totale** : ~16.5h.

### Definition of Done

- [ ] `leonheu.fr` répond en HTTPS avec tous les modules
- [ ] APK V1 distribuable
- [ ] Backups testés en restoration
- [ ] Documentation complète
- [ ] Tag `v1.0.0` posé sur main
- [ ] Sprint review dans `sprint7-release.md`

---

## 11. Risques et mitigation

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Direction visuelle bloquée | Moyenne | Élevé | Limiter à 3 options proposées au Sprint 0 + décision en 24h max |
| Hero animé GSAP plus long que prévu | Moyenne | Moyen | Tampon dans Sprint 1, fallback animation simple si jeudi pas prêt |
| Auth.js v5 beta breaking changes | Faible | Élevé | Pin version exacte dans package.json, suivi changelog |
| GitHub API rate limit | Faible | Faible | Cache ISR 24h, fallback affichage cache stale |
| Proxmox / DNS non joignable lors du déploiement | Faible | Élevé | Tester staging plusieurs fois avant prod, plan B Vercel preview |
| Charge cognitive 8 sprints solo | Élevée | Moyen | Récap obligatoire + dette technique tracée, autorisation de reporter un sprint |
| Test E2E Playwright flaky | Moyenne | Faible | Retry 2x, `test.slow()` sur scénarios lourds |
| Budget Lighthouse non tenu (bundle Next trop gros) | Moyenne | Moyen | Audit + RSC max + dynamic imports |
| Pentest découvre faille bloquante | Faible | Élevé | Sprint 6 dédié, budget tampon dans Sprint 7 si urgence |

---

## 12. Gantt (vue synthétique)

```
Semaine    | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
-----------|----|----|----|----|----|----|----|----|
Sprint 0   | ██ |    |    |    |    |    |    |    |
Sprint 1   |    | ██ |    |    |    |    |    |    |
Sprint 2   |    |    | ██ |    |    |    |    |    |
Sprint 3   |    |    |    | ██ |    |    |    |    |
Sprint 4   |    |    |    |    | ██ |    |    |    |
Sprint 5   |    |    |    |    |    | ██ |    |    |
Sprint 6   |    |    |    |    |    |    | ██ |    |
Sprint 7   |    |    |    |    |    |    |    | ██ |
```

Tag v1.0.0 attendu : fin S8 (≈ 2026-07-09).

---

## 13. Checklist post-release V1

- [ ] Tag `v1.0.0` posé
- [ ] Release notes GitHub publiées
- [ ] APK V1 disponible (lien dans README)
- [ ] Storybook V1 publié
- [ ] OpenAPI accessible
- [ ] Mentions légales à jour
- [ ] Backup pg_dump testé en restoration
- [ ] Snapshot Proxmox testé en restoration
- [ ] Sprint review final rédigé avec bilan + dette + roadmap V2
- [ ] Mémoire Claude mise à jour (état du projet, dette, choix)

---

## 14. V2 et au-delà (roadmap indicative)

| Évolution | Sprint estimé | Notes |
|---|---|---|
| Pages publiques articles (blog V2) | 1 sprint | Reprendre admin V1 + page liste + détail MDX |
| Internationalisation FR/EN | 2 sprints | next-intl + traductions + sitemap multilingue |
| Auth mobile + admin mobile | 2 sprints | JWT secondaire + écrans admin |
| Analytics self-host (Plausible local) | 0.5 sprint | Docker container + JS minimal |
| Monitoring (Grafana + Loki) | 1 sprint | Sur Proxmox, dashboards Next.js + Postgres |
| Migration CMS headless (si volume articles élevé) | 2 sprints | Sanity / Strapi à arbitrer |
