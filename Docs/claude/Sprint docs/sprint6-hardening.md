# Sprint 6 — Hardening

**Période :** 2026-05-17
**Milestone :** M6 - Hardening
**Statut :** ✅ Clos (timebox — #165 DNS/staging en attente externe documentée)
**Durée effective :** ≈ 1 journée (second sprint chargé)

---

## 1. Issues livrées

| # | Titre | PR |
|---|---|---|
| #154 | [6.1] Headers sécurité CSP/HSTS/X-Frame… | #170 |
| #155 | [6.2] Validation magic-bytes upload | #171 |
| #156 | [6.3] Audit XSS rendu contenu | #172 |
| #157 | [6.4] Pentest OWASP rapport + E2E headers | #173 |
| #158 | [6.5] Lighthouse CI config + budgets | #174 |
| #159 | [6.6] Perf : lazy-load fuse.js | #175 |
| #160 | [6.7] Suite E2E TE-01..05 consolidée | #176 |
| #161 | [6.8] Audit a11y axe + corrections contraste | #177 |
| #162 | [6.9] Checklist lecteur d'écran | #178 |
| #163 | [6.10] OG images dynamiques + JSON-LD | #179 |
| #164 | [6.11] deploy-staging workflow + compose | #180 |
| #165 | [6.12] DNS staging + cert | ⏳ **étape Léon (OVH/VM/secrets)** — ouverte, documentée |
| #166 | [6.13] MAJ Plan_developpement.md versions | #181 |
| #167 | [6.14] Nettoyage composants template mobile | #182 |
| #168 | [6.15] Refactor des 3 eslint-disable react-hooks | #183 |
| #169 | [6.16] Sprint 6 review + release v0.7.0 | ▶ en cours |

**Total : 14/15 issues codables livrées + review ; #165 en attente externe documentée.**

---

## 2. Stack ajoutée Sprint 6

| Outil | Version | Usage |
|---|---|---|
| @lhci/cli | ^0.15 | Lighthouse CI (budgets a11y/bp/seo error, perf warn) |
| @axe-core/playwright | ^4.11 | Audit a11y E2E bloquant |
| (config) Dockerfile Next standalone + compose/Caddyfile staging + workflow CD | — | déploiement staging (#6.11) |

---

## 3. Décisions techniques notables

### 3.1 Sécurité
- Headers CSP/HSTS/X-Frame DENY/nosniff/Referrer/Permissions (`lib/security-headers.ts` pur + `next.config.ts`). CSP V1 sans nonce (`'unsafe-inline'` toléré ; nonce → V2).
- Upload : magic-bytes (signature vs type déclaré) avant sharp.
- XSS : contenu rendu **texte échappé** React (pas de `dangerouslySetInnerHTML` sur input user) — test de non-régression.
- Rapport OWASP Top 10 (`pentest-owasp.md`) + E2E headers.

### 3.2 Perf
- `fuse.js` en **import dynamique** (hors bundle initial `/projets`) → `searchProjects` async, `ProjectsSearch` effet async + cas vide dérivé au rendu.
- Lighthouse CI : budgets informatifs (perf runner CI variable) ; le gate a11y **dur** est axe.

### 3.3 A11y
- `@axe-core/playwright` sur 5 pages publiques, **0 violation serious/critical**, bloquant.
- `emulateMedia({ reducedMotion: 'reduce' })` : supprime les faux positifs des éléments animés (`opacity:0` avant `whileInView`).
- **Corrections contraste réelles** des tokens OKLCH (4 palettes) — `--secondary`/`--muted-fg` assombris en clair / éclaircis en sombre ; `--accent` editorial-light, `--primary`/`--accent` tech-light assombris (AA 4.5:1).
- Checklist NVDA/VoiceOver (`a11y-screenreader.md`) → déroulé device = Léon.

### 3.4 SEO
- OG images dynamiques (marque + par projet, `next/og`), JSON-LD `Person`.

### 3.5 Infra (config livrée, exécution Léon)
- `web/Dockerfile` (Next standalone), `infra/docker-compose.staging.yml` + `Caddyfile.staging` (TLS auto), `.github/workflows/deploy-staging.yml` **gardé** (no-op propre sans secrets, non requis par branch protection), `deploiement-staging.md`.
- #6.12 DNS + provisioning VM + secrets = étape Léon (issue #165 ouverte).

### 3.6 Dette soldée
- `Plan_developpement.md` versions réalignées (Next 16, Prisma 6, …) + lignes non implémentées honnêtes.
- Composants template mobile inutilisés supprimés.
- **3 `eslint-disable react-hooks`** supprimés (`useSyncExternalStore` + `useHydrated` + ajustement-état-au-rendu MobileMenu).

### 3.7 Incident process (intercepté)
- Le commit #6.15 a été poussé par erreur sur `develop` (oubli `git checkout -b`) → **branch protection a refusé le push** (filet efficace). Commit déplacé proprement sur branche, develop réaligné, PR normale. Aucun impact.

---

## 4. Dette technique / recommandations restantes

| Item | Cible | Note |
|---|---|---|
| #165 DNS staging + VM + secrets | Léon | dépendance externe (config livrée) |
| #135 build APK EAS | Léon | dépendance externe (Sprint 5) |
| CSP nonce (retirer `'unsafe-inline'`) | V2 | durcissement |
| Dependabot / `npm audit` en CI | Sprint 7 | A06 OWASP |
| Storybook stories écrans (web/mobile) | V2 | couverture Design System |
| Monitoring/alerting prod | Sprint 7 | A09 OWASP |

---

## 5. Métriques

| Métrique | Valeur | Évolution |
|---|---|---|
| Issues fermées | 14/15 codables ; #165 externe ; #169 en cours | — |
| PR mergées | 14 (#170→#183) + review + release | — |
| Tests web (TU) | **139** | +9 vs Sprint 5 (130) |
| Tests web E2E | **16** (6 specs : projets, cv-contact, admin-login, security, visitor, **a11y**) | +9 |
| Tests web TF / mobile jest | 14 / 10 | inchangé |
| `eslint-disable react-hooks` | **0** | -3 (dette soldée) |
| Sécurité | headers + magic-bytes + OWASP report + axe bloquant | majeur |
| Incidents process | 1 (push develop) bloqué par branch protection, sans impact | — |

---

## 6. Definition of Done — Sprint 6 (Planning_Scrum §9)

- [x] Headers sécurité (CSP/HSTS…) — objectif Observatory B+ (mesure live post-déploiement)
- [x] Lighthouse CI configuré (budgets ; a11y/bp/seo ≥0.9, perf warn)
- [x] Playwright passe en CI (16 E2E bloquants)
- [x] axe DevTools : 0 violation contraste (bloquant CI)
- [x] Checklist NVDA livrée (déroulé = Léon)
- [ ] Staging déployé `staging.leonheu.fr` HTTPS → **#6.12, étape Léon** (config livrée)
- [x] Sprint review dans `sprint6-hardening.md`

> DoD complète **hors déploiement live** (#6.12, dépendance externe documentée).

---

## 7. Préparation Sprint 7 — Release

`Planning_Scrum.md` §10 : documentation finalisée + dossier projet + mise en
prod `leonheu.fr` + monitoring basique + **tag v1.0.0**. Inclut Dependabot/
`npm audit` CI (A06), monitoring (A09), et la concrétisation des étapes
externes Léon (#135 APK, #165 staging) avant la prod.

---

## 8. Apprentissages pour Sprint 7

- **axe + animations** : auditer en `reduced-motion` (sinon faux positifs `opacity:0`).
- **OKLCH** : ne pas se fier au L nominal pour le contraste — mesurer (axe) et corriger empiriquement.
- **Branch protection = filet réel** : a stoppé un push direct develop par erreur. Toujours `git checkout -b` avant d'éditer.
- **`useSyncExternalStore`** : pattern propre pour matchMedia / flag d'hydratation (élimine setState-in-effect).

---

## 9. Bilan Sprint 6

✅ **Hardening livré** : sécurité (headers, magic-bytes, OWASP, XSS-safe), perf (lazy fuse, Lighthouse CI), a11y (axe bloquant + corrections contraste OKLCH réelles), SEO (OG/JSON-LD), CD staging (config), et **dette soldée** (versions doc, cleanup mobile, 0 eslint-disable). 139 TU / 16 E2E / 14 TF. Seul le déploiement live (#6.12) reste côté Léon — proprement documenté, sprint clôturé en timebox. Branch protection a intercepté un faux pas de process sans impact.
