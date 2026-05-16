# Sprint 5 — Mobile

**Période :** 2026-05-16
**Milestone :** M5 - Mobile
**Statut :** ✅ Clos (1 issue en attente externe documentée — #135 build APK)
**Durée effective :** ≈ 1 journée

---

## 1. Issues livrées

| # | Titre | PR |
|---|---|---|
| #124 | [5.0] API publique web `/api/projects` (+ `/[slug]`) | #139 |
| #125 | [5.1] Init Expo SDK 54 dans `mobile/` | #140 |
| #126 | [5.2] expo-router (tabs) 4 onglets | #141 |
| #127 | [5.3] Écran Accueil | #142 |
| #128 | [5.4] Écran Projets FlatList + TanStack Query | #143 |
| #129 | [5.5] Écran détail + partage | #144 |
| #130 | [5.6] Pull-to-refresh | #145 |
| #131 | [5.7] Écran About | #146 |
| #132 | [5.8] Écran Contact mailto/share | #147 |
| #133 | [5.9] Animations Reanimated (reduce-motion) | #148 |
| #134 | [5.10] Config EAS Build preview | #149 |
| #135 | [5.11] Build APK + device | ⏳ **étape Léon (credentials EAS)** — ouverte, documentée |
| #136 | [5.12] Recette TM + proxies automatisés | #150 |
| #137 | [5.13] Durcir CI mobile-checks | #151 |
| #138 | [5.14] Sprint 5 review + release v0.6.0 | ▶ en cours |

**Total : 13/14 issues codables livrées + review ; #135 en attente externe (EAS) documentée.**

---

## 2. Stack ajoutée Sprint 5

| Outil | Version | Usage |
|---|---|---|
| **Expo SDK** | ~54.0.33 | App mobile |
| **expo-router** | ~6.0 | Navigation file-based (tabs) |
| **React Native** | 0.81 | — |
| **@tanstack/react-query** | ^5.100 | Données API (cache, refetch) |
| **react-native-reanimated** | ~4.1 (inclus template) | Transitions |
| **jest-expo** + @testing-library/react-native | ^55 | Tests mobile |

API web : aucune nouvelle dépendance (routes réutilisant la couche existante).

---

## 3. Décisions techniques notables

### 3.1 Réconciliation API (web)
- Le web était 100 % Server Components/Prisma → **aucune API JSON**. Ajout de routes publiques `/api/projects` (+`/[slug]`) réutilisant `getPublishedProjects`/`getProjectBySlug` (fallback mock, cache+CORS, 404 JSON). C'est l'unique point de contact mobile↔web.

### 3.2 Scaffold Expo
- `create-expo-app --template default` (Expo 54). **Fichiers IA générés supprimés** (`AGENTS.md`, `CLAUDE.md`, `.claude/`) — règle méthodo.
- Base API configurable `EXPO_PUBLIC_API_URL` (défaut prod), `fetch` injectable → testable.

### 3.3 Tests
- Infra `jest-expo` introduite au #5.4 (config preset + `moduleNameMapper @/`). **10 tests** : `lib/api`, `lib/share`, `lib/contact`, smoke écrans.
- Correctif `vi.hoisted` côté web (#5.0) : factory `vi.mock` ne peut référencer des `const` non hoistés.
- Recette device TM-01..08 documentée (`Docs/claude/leon-portfolio/mobile-recette.md`) — complète les proxies pour les comportements natifs.

### 3.4 CI
- `mobile-checks` **durci** : cache npm lockfile + `npm ci`/lint/typecheck/jest **bloquants** (placeholder tolérant depuis le Sprint 0 supprimé). `expo-doctor` toléré (avertissements de versions bénins).

### 3.5 Build APK (#5.11) — dépendance externe
- Comme `docker/migrate` au Sprint 2 : le build cloud EAS exige le compte Expo de Léon (`eas login` interactif). Config livrée (`eas.json` profil preview, `app.json` bundle id). Issue **laissée ouverte**, procédure documentée (commentaire issue + recette). Le Sprint est timeboxé : M5 fermée, #135 explicitement en attente.

---

## 4. Dette technique / recommandations

| Item | Cible | Note |
|---|---|---|
| #135 build APK + recette device | Léon (EAS) | Dépendance credentials externe |
| Tests composants écran limités (smoke) | Sprint 6 | RTL + provider Query si besoin de couverture parcours |
| Composants template inutilisés (hello-wave, parallax) | Sprint 6 nettoyage | Sans impact lint/typecheck |
| Reste (Lighthouse, Plan_dev versions, web/.env) | Sprint 6 | Hérité |

---

## 5. Métriques

| Métrique | Valeur | Évolution |
|---|---|---|
| Issues fermées | 13/14 codables ; #135 attente externe ; #138 en cours | — |
| PR mergées | 13 (#139→#151) + review + release | — |
| Tests web (TU) | **130** | +4 (api-projects) |
| Tests web TF / E2E | 14 / 7 | inchangé |
| Tests mobile (jest-expo) | **10** | 🆕 |
| CI | `mobile-checks` réel & bloquant 🆕 ; web inchangé vert | durcissement |
| Routes mobile | 4 tabs + détail `projects/[slug]` | 🆕 app |
| Temps total | ≈ 1 journée | — |

---

## 6. Definition of Done — Sprint 5 (Planning_Scrum §8)

- [x] App démarre (scaffold + 4 tabs + écrans) — Expo Go/dev
- [x] Catalogue + détail + partage fonctionnels (API + Share natif)
- [ ] APK preview généré et installé sur device → **#5.11, étape Léon (EAS)**
- [x] Recette TM documentée + proxies automatisés (10 jest)
- [x] Sprint review dans `sprint5-mobile.md`

> DoD complète **hors #5.11** (dépendance externe credentials EAS, documentée).

---

## 7. Préparation Sprint 6 — Hardening

`Planning_Scrum.md` §9 : sécurisation OWASP, budgets perf Lighthouse bloquants, E2E complets, audit a11y, déploiement **staging** (`staging.leonheu.fr`, VM Proxmox). Inclut le rattrapage de la dette accumulée (Lighthouse CI, Plan_dev versions, nettoyage template mobile, refactor eslint-disable web).

---

## 8. Apprentissages pour Sprint 6

- **Scaffolds génèrent des fichiers IA** (`create-expo-app` → AGENTS.md/CLAUDE.md/.claude) : toujours purger avant le 1er commit.
- **`vi.mock` + `const` non hoistés** → `vi.hoisted` (sinon "Cannot access before initialization").
- Une app mobile a besoin d'une **API** : anticiper la couche d'exposition quand le back est en Server Components.
- Étapes à credentials externes (EAS, prod) : livrer la config + documenter, ne pas simuler.

---

## 9. Bilan Sprint 5

✅ **App mobile Expo livrée** : 4 onglets, catalogue (TanStack Query sur API publique), détail + partage natif, pull-to-refresh, animations reduce-motion-safe, config EAS. API web réconciliée. CI `mobile-checks` enfin réelle et bloquante. Seul le build APK physique (#5.11) reste côté Léon (compte EAS), proprement documenté — le sprint est clôturé en timebox.
