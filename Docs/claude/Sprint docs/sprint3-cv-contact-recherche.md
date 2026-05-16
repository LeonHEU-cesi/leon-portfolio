# Sprint 3 — CV / Contact / Recherche

**Période :** 2026-05-16
**Milestone :** M3 - CV / Contact / Recherche
**Statut :** ✅ Clos
**Durée effective :** ≈ 1 journée

---

## 1. Issues livrées

| # | Titre | Statut | PR |
|---|---|---|---|
| #65 | [3.1] Page /cv timeline animée au scroll | ✅ closed | #76 |
| #66 | [3.2] Sections Compétences/Formations/Langues/Loisirs | ✅ closed | #77 |
| #67 | [3.3] CSS @media print + bouton PDF | ✅ closed | #78 |
| #68 | [3.4] Fidélité PDF imprimé (A4, sauts de page) | ✅ closed | #79 |
| #69 | [3.5] Page /contact mailto + réseaux | ✅ closed | #80 |
| #70 | [3.6] QR vCard SVG | ✅ closed | #81 |
| #71 | [3.7] Recherche client Fuse.js sur /projets | ✅ closed | #82 |
| #72 | [3.8] Page /mentions-legales | ✅ closed | #83 |
| #73 | [3.9] sitemap.ts + robots.ts | ✅ closed | #84 |
| #74 | [3.10] Tests E2E TF-WEB CV/Contact/recherche | ✅ closed | #85 |
| #86 | [3.10-fix] E2E /contact strict-mode (régression #85) | ✅ closed | #87 |
| #75 | [3.11] Sprint 3 review + release v0.4.0 | ▶ en cours |  |

**Total : 10/10 issues feature/test closed + 1 fix de régression, sprint review en cours.**

---

## 2. Stack en place (ajouts Sprint 3)

| Couche | Outil | Version | Note |
|---|---|---|---|
| **QR code** | **qrcode** | **^1.5.4** (+ @types) | 🆕 vCard SVG /contact |
| **Recherche client** | **fuse.js** | **^7.3.0** | 🆕 recherche floue /projets |
| Runner E2E | @playwright/test | ^1.60 | 2 specs (5 tests) |
| Reste | Next 16.2.6 / Prisma 6.19.3 / Vitest 4.1.6 | — | inchangé |

---

## 3. Décisions techniques notables

### 3.1 Export PDF du CV
- Option « print navigateur » retenue (Planning §6 proposait Pandoc *ou* statique) : **aucune dépendance ni toolchain**. `window.print()` + `@media print` (`@page A4`, `break-inside: avoid`, en-tête `.print-only`).

### 3.2 Recherche vs filtre tags
- Filtre tags = serveur, état URL (#2.4) ; recherche = client Fuse.js (#3.7), complémentaire. Filtrage instantané (dataset réduit, pas de debounce). SSR rend la liste complète → dégradation propre sans JS.

### 3.3 QR vCard
- `qrcode` génère un SVG inline (Server Component), `role="img"` + `aria-label`, repli `.vcf` data URI.

### 3.4 SEO build-safe
- `app/sitemap.ts` via `getPublishedProjects()` (fallback mock) → jamais d'échec build sans DB.

### 3.5 Incident process (régression #85) — important
- **PR #85 mergée alors que `web-e2e-lighthouse` était rouge** : le repo n'a **pas de branch protection** requérant les checks, donc `gh pr merge --squash` a forcé le merge malgré la CI rouge. Cause technique : strict mode Playwright (lien « Email » présent dans la page **et** le `Footer` global).
- **Corrigé** par #86/#87 (requêtes E2E scopées à `<main>`), validé localement (`npm run test:e2e` 5/5) puis CI verte vérifiée **avant** merge.
- **Process corrigé** : le merge est désormais conditionné à une CI verte explicitement vérifiée (fin du merge chaîné inconditionnel).

---

## 4. Dette technique / recommandations

| Item | Cible | Note |
|---|---|---|
| **Branch protection `develop`/`main`** (require status checks) | À décider (Léon) | Empêcherait structurellement un merge sur CI rouge — compatible avec l'auto-merge tant que la CI est verte |
| LinkedIn : handle `in/leon-heu` à confirmer | Léon | Donnée éditable `lib/data/socials.ts` |
| Lighthouse CI non configuré (`lhci` `continue-on-error`) | Sprint 6 | Hérité Sprint 2 |
| `Plan_developpement.md` versions obsolètes + stack S2/S3 | passe doc / Sprint 6 | Non bloquant |
| Contenu projet `whitespace-pre-line` (pas de MDX) | V2 | — |
| `web/.env` absent local (Léon) | À régulariser | CI OK (fallback + service) |

---

## 5. Métriques

| Métrique | Valeur | Évolution |
|---|---|---|
| Issues fermées | 10/10 + 1 fix régression ; #75 en cours | — |
| Pull Requests mergées | 11 (#76→#85, #87) + release | — |
| Tests unitaires (TU) | **89 passants** | +24 vs Sprint 2 (65) |
| Tests fonctionnels (TF) | 6 (DB réelle CI) | inchangé |
| Tests E2E | **5** (2 specs : projets + cv-contact), bloquants | +3 |
| Routes Next.js | 8 statiques (`/`,`/_not-found`,`/about`,`/cv`,`/contact`,`/mentions-legales`,`/sitemap.xml`,`/robots.txt`) + `ƒ` `/projets`,`/projets/[slug]` | +5 |
| Incidents | 1 (merge sur CI rouge) corrigé en intra-sprint | — |
| Temps total Sprint 3 | ≈ 1 journée | — |

---

## 6. Definition of Done — Sprint 3 (Planning_Scrum §6)

- [x] Page CV imprimable propre + PDF téléchargeable (3.3 / 3.4)
- [x] Contact mailto + réseaux opérationnels (3.5 / 3.6)
- [x] Recherche client en temps réel (3.7)
- [x] Sitemap + robots valides (3.9)
- [x] Sprint review dans `sprint3-cv-contact-recherche.md`

---

## 7. Préparation Sprint 4 — Admin

Sprint le plus chargé (≈26h, cf. mémoire `feedback-perimetre`). Issues à pré-créer selon `Planning_Scrum.md` §7 : Auth.js v5 (login sécurisé), CRUD projets, CRUD articles (draft), gestion tags, upload images (volume Docker), protection des routes admin, tests TF/TS associés, review + release v0.5.0.

**Prérequis Sprint 4 :** régulariser `web/.env` local (DATABASE_URL, AUTH_SECRET via `npx auth secret`, ADMIN_*), Postgres up. Recommandé : activer la branch protection avant d'attaquer (cf. §4).

---

## 8. Apprentissages pour Sprint 4

- **Strict mode Playwright** : scoper les requêtes à `getByRole("main")` quand le composant global (Header/Footer) expose des libellés identiques (Email, GitHub).
- **Pas de branch protection ⇒ `gh pr merge` force le merge même CI rouge.** Toujours vérifier explicitement la conclusion CI avant de merger (ou activer la protection).
- **userEvent v14** installe son propre presse-papier : tester le comportement observable, pas le mock `navigator.clipboard`.
- **Export PDF sans dépendance** : `window.print()` + `@media print` soigné suffit pour un CV.

---

## 9. Bilan Sprint 3

✅ **Sprint réussi** (10/10 issues + 1 régression corrigée en intra-sprint). Pages CV (timeline animée, sections, PDF imprimable A4), Contact (mailto, réseaux, copie email, QR vCard), recherche client Fuse.js, mentions légales, SEO (sitemap/robots). 89 TU (+24), 5 E2E bloquants.

**Point de vigilance** : un merge sur CI rouge a été possible (pas de branch protection) — corrigé techniquement et au niveau du process ; recommandation d'activer la protection de branche soumise à Léon.
