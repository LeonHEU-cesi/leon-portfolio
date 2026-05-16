# Sprint 4 — Admin

**Période :** 2026-05-16
**Milestone :** M4 - Admin
**Statut :** ✅ Clos
**Durée effective :** ≈ 1 journée (sprint le plus chargé du plan)

---

## 1. Issues livrées

| # | Titre | PR |
|---|---|---|
| #90 | [4.1] Vérif schéma admin (parité prouvée) | #106 |
| #91 | [4.2] Seed admin robustifié + garde secret | #107 |
| #92 | [4.3] Setup Auth.js v5 (credentials Prisma + bcrypt) | #108 |
| #93 | [4.4] Middleware /admin/* (incident export → corrigé) | #109 |
| #94 | [4.5] Page /login + Server Action | #110 |
| #95 | [4.6] Rate limit login 5/15 min | #111 |
| #96 | [4.7] Page /admin dashboard | #112 |
| #97 | [4.8] /admin/projects liste + recherche + filtres | #113 |
| #98 | [4.9] /admin/projects/new + Server Action create | #114 |
| #99 | [4.10] /admin/projects/[id] édition + delete | #115 |
| #100 | [4.11] /admin/tags CRUD inline | #116 |
| #101 | [4.12] Upload images /api/admin/upload + sharp | #117 |
| #102 | [4.13] /admin/articles CRUD draft | #118 |
| #103 | [4.14] Tests TF admin (auth, CRUD, rate limit) | #119 |
| #104 | [4.15] Tests E2E login admin + durcissement authorize | #120 |
| #105 | [4.16] Sprint 4 review + release v0.5.0 | ▶ en cours |

**Total : 15/15 issues feature/test closed, review en cours.**

---

## 2. Stack ajoutée Sprint 4

| Outil | Version | Usage |
|---|---|---|
| **next-auth (Auth.js v5)** | ^5.0.0-beta.31 | Auth credentials, session JWT |
| **sharp** | ^0.34.5 | Resize + webp upload images |
| Reste | Next 16.2.6 / Prisma 6.19.3 / Vitest 4.1.6 | inchangé |

---

## 3. Décisions techniques notables

### 3.1 Auth.js v5 — pattern split Edge/Node
- `auth.config.ts` **Edge-safe** (aucun Prisma/bcrypt) → consommé par le middleware ; `auth.ts` (Node) ajoute le provider Credentials. Import Prisma **paresseux** dans `authorize` (build sans `DATABASE_URL` OK).
- `authorize` enveloppé try/catch → renvoie `null` sur toute erreur : réponse **uniforme « invalide »**, jamais de 500 ni de fuite (anti-énumération), et déterminisme E2E sans DB.
- Session JWT, `role`/`id` propagés via callbacks, types augmentés.

### 3.2 Middleware — contrainte d'export
- Next 16 exige un **export direct** (`export default auth`) — un export déstructuré (`export const { auth: middleware }`) casse le build ("must export a function"). Incident #93 : 1ʳᵉ tentative rouge en CI, **bloquée par le gate**, corrigée. Désormais build validé par **code retour** (plus par grep).

### 3.3 Server Actions & sécurité
- CRUD projets/tags/articles via Server Actions ; `redirect()` **hors try** (NEXT_REDIRECT non avalé) ; slug unique vérifié ; tags `connectOrCreate`.
- Rate limit login **5 / 15 min** (limiteur pur en mémoire, par instance — documenté V1) ; message générique.
- Upload : `auth()` obligatoire (401), validation type/taille pure, `sharp` resize+webp, nom `uuid`, volume `public/uploads` (gitignored).
- Articles **DRAFT only** (pas de route publique — blog V2). Pages admin `force-dynamic` + `robots noindex`.

### 3.4 CI
- `web-e2e-lighthouse` : `env.AUTH_SECRET` factice au niveau du job (sinon Auth.js → erreur `Configuration` non déterministe).
- Branch protection (active depuis S3) : a **empêché tout merge sur CI rouge** ; combinée au gate explicite, l'incident #93 n'a jamais atteint develop en rouge.

---

## 4. Dette technique / recommandations

| Item | Cible | Note |
|---|---|---|
| Rate limit en mémoire (par instance) | V2 si multi-instances | Redis/Upstash si scale horizontal |
| Pas de stories Storybook pour les écrans admin | Sprint 6 | Couverture Design System |
| Upload : pas d'antivirus / magic-byte check (type déclaré) | Sprint 6 (hardening) | Acceptable usage perso authentifié |
| `web/.env` local absent (Léon) | À régulariser | CI OK (services + AUTH_SECRET job) |
| Lighthouse CI non configuré | Sprint 6 | Hérité |

---

## 5. Métriques

| Métrique | Valeur | Évolution |
|---|---|---|
| Issues fermées | 15/15 ; #105 en cours | — |
| PR mergées | 15 (#106→#120) + review + release | — |
| Tests unitaires (TU) | **126** | +37 vs Sprint 3 (89) |
| Tests fonctionnels (TF) | **14** (projets 6 + admin 8, DB réelle CI) | +8 |
| Tests E2E | **7** (3 specs : projets, cv-contact, admin-login) | +2 |
| Incidents CI | 1 (#93 export middleware) — bloqué par gate+protection, corrigé intra-sprint | — |
| Temps total | ≈ 1 journée | sprint le plus chargé |

---

## 6. Definition of Done — Sprint 4 (Planning_Scrum §7)

- [x] Login / logout fonctionnels avec rate limit
- [x] CRUD projets complet via UI
- [x] CRUD tags inline
- [x] CRUD articles draft (sans page publique)
- [x] Upload images compressé en webp
- [x] Tests TF + TE Admin passent (14 TF + E2E admin bloquants)
- [x] Sprint review dans `sprint4-admin.md`

---

## 7. Préparation Sprint 5 — Mobile

`Planning_Scrum.md` §8 — app Expo (catalogue projets en lecture, pas d'auth V1) consommant l'API web. Issues 5.x à pré-créer. Prérequis : compte EAS (build APK), `mobile/` à scaffolder (le job CI `mobile-checks` est un placeholder tolérant jusque-là).

---

## 8. Apprentissages pour Sprint 5

- **Auth.js v5** : split config Edge/Node indispensable ; `authorize` ne doit jamais throw (réponse uniforme) ; middleware = export direct.
- **Valider les E2E en local** (`AUTH_SECRET` exporté, après `build`) avant push — coûte moins cher qu'un aller-retour CI.
- **Build = code retour**, jamais un grep partiel (leçon #93).
- Branch protection + gate explicite = double filet ; aucun rouge n'atteint develop.

---

## 9. Bilan Sprint 4

✅ **Sprint le plus chargé bouclé** (15/15). Back-office complet et sécurisé : Auth.js v5 (credentials, JWT, garde middleware), login + rate limit anti-bruteforce, CRUD projets / tags / articles, upload images webp, 14 TF sur base réelle + E2E admin bloquants. 1 incident CI (export middleware) **intercepté par le filet branch-protection + gate** et corrigé sans pollution de develop.
