# Procédure de validation — leon-portfolio

**Projet :** leon-portfolio
**Auteur :** HEU Léon
**Version :** 1.0 — Recette en jalons V1

---

## 1. Objet et portée

Cette procédure décrit la **recette personnelle** avant chaque mise en ligne (staging puis prod). Elle est exécutée par HEU Léon en tant qu'auto-testeur, complétée par la CI automatisée.

**Périmètre** : tous les modules de la V1 — Vitrine, Projets, CV, Contact, Admin, Mobile.

---

## 2. Jalons de validation

| Jalon | Quand | Bloquant | Sortie attendue |
|---|---|---|---|
| **J1 — CI verte** | À chaque PR | ✅ Bloquant | Workflow GitHub Actions ✅ sur toutes les jobs |
| **J2 — Sprint review** | Fin de sprint | ✅ Bloquant | Fichier `sprintN-titre.md` + PR `develop → main` mergeable |
| **J3 — Recette manuelle staging** | Avant déploiement prod | ✅ Bloquant | TF-WEB + TM passés sur staging.leonheu.fr |
| **J4 — Hardening pré-prod** | Sprint 6 | ✅ Bloquant | TS pentest OK, Lighthouse > seuils, a11y validé |
| **J5 — Smoke prod** | Après chaque deploy prod | ✅ Bloquant | TF-WEB-01 + TS-HEADERS-01 sur leonheu.fr |
| **J6 — Recette V1 complète** | Avant tag v1.0.0 | ✅ Bloquant | Cahier de tests intégralement coché |

---

## 3. Procédure J1 — CI verte

### Étapes
1. Push branche `feat/*` ou `fix/*`
2. Ouvrir PR vers `develop`
3. Attendre les workflows GitHub Actions
4. Lire les logs si échec

### Critères de succès
- ✅ Job `web-tests` (Vitest TU + TF) : 100% passés
- ✅ Job `web-e2e-lighthouse` : Playwright + Lighthouse seuils respectés
- ✅ Job `mobile-checks` : expo-doctor + tsc + tests

### En cas d'échec
- Lire les logs du job échoué
- Corriger sur la branche feature
- Push à nouveau
- ⚠ Ne **pas** merger en force, sauf urgence opérationnelle documentée

---

## 4. Procédure J2 — Sprint review

### Étapes (fin de sprint, dimanche soir)

1. Vérifier que toutes les issues du sprint sont en `Done` sur le Project Board
2. Vérifier que le `JOURNAL.md` contient une entrée par issue feature
3. Rédiger `Docs/claude/Sprint docs/sprintN-titre.md` avec :
   - Liste des issues livrées + liens PRs
   - Stack en place (versions exactes)
   - Décisions techniques notables prises pendant le sprint
   - Dette technique identifiée
   - Métriques (commits, tests passants, % CI)
   - Definition of Done du sprint cochée
   - Préparation du sprint suivant (issues à pré-créer)
4. Créer la PR `release: Sprint N - <titre>` de `develop` → `main`
5. Labels : `sprint-N`, `priorite-p1`, milestone `MN - <titre>`
6. CI doit être verte sur `develop` au moment de la PR
7. Auto-review puis merge

### Critères de succès
- ✅ Toutes les issues sprint en `Done`
- ✅ JOURNAL.md à jour
- ✅ Fichier sprint review rédigé
- ✅ PR `develop→main` mergée avec succès
- ✅ Tag intermédiaire `v0.N.0` optionnel (recommandé fin Sprint 5)

---

## 5. Procédure J3 — Recette manuelle staging

### Étapes

1. Sur `staging.leonheu.fr`, exécuter les tests `TF-WEB-*` du cahier de tests
2. Sur device physique avec Expo Go pointant vers staging, exécuter les `TM-*`
3. Pour chaque test : noter `Passé` / `Échec` + capture si bug
4. En cas d'échec : ouvrir une issue bloquante, ne pas déployer prod

### Critères de succès
- ✅ Tous les TF-WEB et TM passés
- ✅ Aucun bug bloquant ouvert sur le sprint courant
- ✅ Performance staging cohérente avec local (Lighthouse > 85)

---

## 6. Procédure J4 — Hardening pré-prod

### Étapes (Sprint 6)

1. Audit OWASP Top 10 manuel — checklist :
   - [ ] A01 Broken Access Control : tester accès `/admin/*` sans session, accès cross-user (si V2 multi-user)
   - [ ] A02 Cryptographic Failures : valider bcrypt cost 12, HTTPS partout, secrets en env
   - [ ] A03 Injection : injection SQL (TS-INPUT-01), XSS (TS-INPUT-02), NoSQL n/a
   - [ ] A04 Insecure Design : revue du modèle d'auth, rate limit testé
   - [ ] A05 Security Misconfiguration : headers (CSP, HSTS, X-Frame), pas de stack trace en prod, robots.txt OK
   - [ ] A06 Vulnerable Components : `npm audit` propre, `pnpm dlx better-npm-audit`
   - [ ] A07 Identification and Authentication Failures : rate limit, MFA n/a V1, session secure cookie
   - [ ] A08 Software and Data Integrity Failures : `npm ci` en prod, lockfile commit, pas d'eval()
   - [ ] A09 Security Logging and Monitoring : logs Docker, alertes (V2)
   - [ ] A10 Server-Side Request Forgery : valider URL externe (uploads, GitHub API)
2. Lighthouse CI sur toutes pages publiques : Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95
3. Mozilla Observatory scan : grade B minimum
4. Validation axe DevTools : 0 violation contraste, 0 violation aria
5. Test NVDA / VoiceOver sur 3 pages clés (Accueil, Projets, CV)

### Critères de succès
- ✅ OWASP Top 10 audit OK ou items mitigés / acceptés avec justification
- ✅ Lighthouse seuils tenus
- ✅ Mozilla Observatory ≥ B
- ✅ Tests axe + NVDA OK

### Rapport
Fichier `Docs/claude/Sprint docs/sprint6-hardening-report.md` listant chaque item avec statut + capture.

---

## 7. Procédure J5 — Smoke prod

### Étapes (5 min après deploy prod)

1. `curl -I https://leonheu.fr` → status 200, HSTS présent
2. Ouvrir la page d'accueil → hero animé visible
3. Cliquer sur un projet → détail OK
4. Login admin → dashboard OK
5. Logout
6. Vérifier l'OG image en partageant l'URL sur LinkedIn ou via opengraph.xyz
7. Vérifier le sitemap : `https://leonheu.fr/sitemap.xml`
8. Vérifier les logs Docker : `docker compose logs --tail 100 web`

### Critères de succès
- ✅ Tous les points OK
- ✅ Aucune erreur 5xx dans les logs

### En cas d'échec critique
- Rollback immédiat (cf. `installation.md` § 6.3)
- Investigation + correctif sur branche feature → nouvelle release

---

## 8. Procédure J6 — Recette V1 complète

### Étapes (avant tag v1.0.0)

1. Exécuter intégralement le cahier de tests (`Cahier_de_tests.md`)
   - Tous les TU + TF + TF-WEB + TM + TS + TE + TP + TS-A11Y
2. Cocher chaque test dans la check-list
3. Rédiger un PV de recette interne (modèle `pv-recette.md`)
4. Mettre à jour `dossier_final.md` avec les résultats
5. Tagger `v1.0.0` sur `main`

### Critères de succès
- ✅ 100% du cahier coché
- ✅ Aucun bug P1 / P2 ouvert
- ✅ Bugs P3 / P4 documentés dans backlog V2
- ✅ Release notes publiées

---

## 9. Matrice de couverture

| Module | TU | TF | TF-WEB | TM | TS | TE | TP | Jalon |
|---|---|---|---|---|---|---|---|---|
| Vitrine | ✅ | n/a | ✅ | n/a | ✅ A11Y | ✅ | ✅ | J3, J4, J5 |
| Projets | ✅ | ✅ | ✅ | ✅ | ✅ INPUT-01 | ✅ | ✅ | J3, J5 |
| CV | n/a | n/a | ✅ | n/a | n/a | n/a | n/a | J3 |
| Contact | n/a | n/a | ✅ | ✅ | n/a | n/a | n/a | J3 |
| Admin | ✅ | ✅ | ✅ | n/a | ✅ AUTH-01-03, INPUT-02-04 | ✅ | n/a | J3, J4 |
| Mobile | n/a | n/a | n/a | ✅ | n/a | n/a | ✅ TP-04 | J3 |
| Transverse | ✅ | ✅ | n/a | n/a | ✅ HEADERS, CORS | n/a | n/a | J4, J5 |

---

## 10. Outils de la recette

| Outil | Usage | Lien |
|---|---|---|
| Cahier de tests | Référence des cas | `Cahier_de_tests.md` |
| Mozilla Observatory | Audit headers sécurité | https://observatory.mozilla.org |
| axe DevTools | Audit a11y | Extension Chrome / Firefox |
| NVDA | Lecteur d'écran Windows | https://www.nvaccess.org |
| Lighthouse CI | Audit perf en CI | https://github.com/GoogleChrome/lighthouse-ci |
| Playwright | Tests E2E | https://playwright.dev |
| Postman ou curl | Tests API manuels | — |
| Schema.org validator | Validation JSON-LD | https://validator.schema.org |
| Twitter Card Validator | Validation OG Twitter | https://cards-dev.twitter.com/validator |
