# Sprint 7 — Release

**Milestone :** M7 - Release
**Statut :** ✅ Clos — release **v1.0.0** (timebox ; #191 DNS / #194 sauvegarde système = étapes hôte documentées)
**Durée effective :** ≈ 1 journée (sprint final, dont consigne sécurité en cours de route)

---

## 1. Issues livrées

| # | Titre | PR |
|---|---|---|
| #189 | [7.4] OpenAPI 3.1 + UI Scalar `/api/docs` | #199 |
| #190 | [7.5] Workflow `deploy-prod.yml` + compose prod | #200 |
| #192 | [7.7] TLS Let's Encrypt prod (Caddy auto, ACME via env) | #200 |
| #193 | [7.8] Backup `pg_dump` quotidien + restore | #200 |
| #195 | [7.10] Smoke tests prod (harness configurable) | #200 |
| #196 | [7.11] Storybook déployé (config, optionnel) | #200 |
| #201 | [7.14] Neutralisation des détails d'infra (dépôt public) | #202 |
| #197 | [7.12] Dependabot + `npm audit` CI (OWASP A06) | #203 |
| #186 | [7.1] `dossier_final.md` complet | #204 |
| #187 | [7.2] `installation.md` finalisé + troubleshooting | #204 |
| #188 | [7.3] `procedure-validation.md` + check-list | #204 |
| #198 | [7.13] Sprint 7 review + release v1.0.0 | (cette PR) |
| #191 | [7.6] DNS `leonheu.fr` | ⏳ **étape hôte** — ouverte, documentée neutre |
| #194 | [7.9] Sauvegarde système périodique | ⏳ **étape hôte** — ouverte, documentée neutre |

**12/14 issues codables livrées + review ; #191/#194 = gestes hôte documentés.**

---

## 2. Stack ajoutée Sprint 7

| Élément | Détail |
|---|---|
| OpenAPI 3.1 (module **pur** `lib/openapi.ts`) | endpoints publics uniquement, testé unitairement |
| Scalar UI `/api/docs` | CDN jsDelivr, **CSP scopée** à cette seule route |
| `.github/dependabot.yml` | 3 écosystèmes (npm web/mobile + github-actions), hebdo, groupé |
| `npm audit` CI | étape non bloquante (A06) sur web-tests + mobile-checks |
| CD prod | `docker-compose.prod.yml` + `deploy-prod.yml` **gardé** + scripts backup |
| Smoke harness | `playwright.smoke.config.ts` + 8 specs TF-WEB-01..08 (`SMOKE_BASE_URL`) |

---

## 3. Décisions techniques notables

### 3.1 Documentation API
- OpenAPI 3.1 = **module TypeScript pur** (pas de génération runtime) → testable
  (8 TU), zéro dépendance lourde ; Scalar chargé via CDN.
- **CSP scopée** `/api/docs` (`buildScalarCsp`) : la CSP stricte globale
  reste inchangée (source `next.config.ts` exclut `/api/docs`).

### 3.2 Neutralité du dépôt (consigne mainteneur, en cours de sprint)
- Le dépôt public ne divulgue **aucune infra** (hôte, registrar, IP,
  e-mails de service) : templates neutres, e-mail ACME via env, secrets
  GitHub, `infra/.env` hors versionnement.
- **Kit de déploiement privé tenu hors dépôt** (répertoire frère non
  versionné) avec les valeurs réelles + runbook opérationnel.
- `.gitignore` durci, `.gitattributes` (LF obligatoire `*.sh`).
- Choix mainteneur conservés : e-mail de contact public (Footer),
  homelab en CV/projet seed (valorisation de profil).

### 3.3 CD prod
- `deploy-prod.yml` gardé (no-op propre sans secrets `PROD_SSH_*`) :
  backup → pull → `compose up --build` → `migrate deploy` → smoke.
- TLS auto Caddy (Let's Encrypt) ; aucune action au-delà du DNS (#191).

### 3.4 Dette soldée
- `dossier_final.md` réécrit au **réel** (remplace un stub bootstrap
  obsolète : Next 15/axios/placeholders → Next 16.2.6, métriques v1.0.0).
- `installation.md` : troubleshooting réels (Auth.js secret, Prisma
  baseline, CRLF `.sh`), liens neutres.

---

## 4. Incidents process (interceptés, sans impact)

- **2ᵉ push direct `develop`** (oubli `git checkout -b`, PR B) →
  refusé/rattrapé : commit déplacé sur la branche, `develop` réaligné,
  PR normale verte. La branch protection a de nouveau joué son rôle.
- **Mélange de numéros d'issue** : PR #203 indiquait `Closes #198` alors
  que #198 = issue review+release (et #197 = Dependabot). Corrigé
  explicitement : #198 rouverte, #197 fermée manuellement avec commentaire.

---

## 5. Dette technique / recommandations

| Item | Cible | Note |
|---|---|---|
| #191 DNS `leonheu.fr` | Hôte | enregistrements A → serveur (panel registrar) |
| #194 sauvegarde système | Hôte | snapshot/image périodique selon hébergeur |
| #135 APK EAS / #165 staging | Hôte | reportés (Sprints 5/6), documentés |
| CSP nonce (retirer `'unsafe-inline'`) | V2 | durcissement |
| Monitoring/alerting prod (A09) | V2 | observabilité auto-hébergée |
| Stories Storybook écrans | V2 | couverture Design System |
| Page publique blog / i18n / auth mobile | V2 | hors périmètre V1 |

---

## 6. Métriques

| Métrique | Valeur | Évolution |
|---|---|---|
| Issues fermées | 12 codables + review ; #191/#194 externes | — |
| PR mergées Sprint 7 | 6 (#199, #200, #202, #203, #204, review) | — |
| Tests web (TU) | **147** | +8 (OpenAPI) vs S6 (139) |
| Tests web E2E | **16** | inchangé |
| Tests web TF / smoke | 14 / **8** (nouveau harness) | +8 |
| Tests mobile jest | 10 | inchangé |
| `eslint-disable react-hooks` | **0** | inchangé |
| Releases GitHub | **8** (v0.1.0 → **v1.0.0**) | +1 |
| Incidents process | 2 (push develop, num. issues) — interceptés, sans impact | — |

---

## 7. Definition of Done — Sprint 7 (Planning_Scrum §10)

- [x] `dossier_final.md` complet (réel, neutre)
- [x] `installation.md` finalisé + troubleshooting
- [x] `procedure-validation.md` + check-list complète
- [x] OpenAPI exposé via Scalar `/api/docs`
- [x] Workflow `deploy-prod.yml` + compose prod (gardé)
- [x] Backup `pg_dump` + restore (script + cron documenté)
- [x] Smoke tests (harness configurable)
- [x] Dependabot + `npm audit` CI
- [x] Tag `v1.0.0` + GitHub release ; M7 fermée
- [ ] `leonheu.fr` live HTTPS → **#191 DNS + go-live = étape hôte** (config livrée, kit privé)
- [ ] Sauvegarde système → **#194, étape hôte**
- [x] Sprint review dans `sprint7-release.md`

> DoD complète **hors mise en ligne live** (#191/#194, dépendances hôte
> documentées neutralement). Toute la chaîne codable + CD est livrée et
> testée ; la bascule prod est le dernier handoff manuel du mainteneur.

---

## 8. Bilan Sprint 7 — clôture V1

✅ **Release v1.0.0 livrée.** Documentation API (OpenAPI/Scalar), CD prod
gardé + backups + smoke harness, veille dépendances (Dependabot/audit),
dépôt **neutralisé** (aucune infra divulguée + kit privé hors dépôt),
dossier projet finalisé au réel. 147 TU / 14 TF / 16 E2E / 8 smoke (web)
· 10 jest (mobile) · 0 eslint-disable. La V1 est complète et taguée ;
seule la mise en ligne live (DNS + provisioning + sauvegarde système)
reste côté hôte, proprement documentée. Branch protection a intercepté
2 faux pas de process sans impact.

**Bilan global (Sprints 0→7)** : CI réparée puis 8 releases livrées en
autonomie (v0.1.0 → **v1.0.0**), ~100 PRs CI-gated, branch protection
active — aucun rouge n'a atteint `develop`/`main`.
