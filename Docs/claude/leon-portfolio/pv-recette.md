# Procès-verbal de recette — leon-portfolio (modèle vierge)

**Projet :** leon-portfolio
**Version :** V1.0.0
**Date de recette :** _________________
**Lieu / Environnement :** ☐ Local dev  ☐ Staging  ☐ Production
**URL testée :** _________________

---

## 1. Parties prenantes

| Rôle | Nom | Signature |
|---|---|---|
| Maître d'œuvre / Dev | HEU Léon | ____________ |
| Recetteur | _____________ | ____________ |
| (Optionnel) Évaluateur | _____________ | ____________ |

---

## 2. Périmètre testé

Cocher les modules concernés par la recette :

- [ ] Module Vitrine publique (Accueil, About, navigation)
- [ ] Module Projets (catalogue, détail, Hub GitHub)
- [ ] Module CV (timeline, PDF)
- [ ] Module Contact (mailto, réseaux sociaux)
- [ ] Module Back-office admin (auth, CRUD projets, articles, tags)
- [ ] Module Mobile (Expo Android/iOS)
- [ ] Transverse — sécurité (HTTPS, bcrypt, rate limit)
- [ ] Transverse — performance (Lighthouse)
- [ ] Transverse — accessibilité (WCAG AA)
- [ ] Transverse — SEO (sitemap, OG, JSON-LD)

---

## 3. Résultats des tests

### 3.1 Tests fonctionnels Web (TF-WEB)

| ID | Titre | Statut | Commentaires |
|---|---|---|---|
| TF-WEB-01 | Parcours visiteur Accueil → Projet → CV | ☐ Passé ☐ Échec | |
| TF-WEB-02 | Dark mode bascule et persiste | ☐ Passé ☐ Échec | |
| TF-WEB-03 | Filtrage projets par tag | ☐ Passé ☐ Échec | |
| TF-WEB-04 | Recherche projets | ☐ Passé ☐ Échec | |
| TF-WEB-05 | Hub GitHub charge et affiche | ☐ Passé ☐ Échec | |
| TF-WEB-06 | Responsive mobile (375px) | ☐ Passé ☐ Échec | |
| TF-WEB-07 | Connexion admin + CRUD projet | ☐ Passé ☐ Échec | |
| TF-WEB-08 | Mentions légales accessibles | ☐ Passé ☐ Échec | |

### 3.2 Tests Mobile (TM)

| ID | Titre | Statut | Device | Commentaires |
|---|---|---|---|---|
| TM-01 | Installation via QR Expo Go | ☐ Passé ☐ Échec | | |
| TM-02 | Navigation par onglets | ☐ Passé ☐ Échec | | |
| TM-03 | Catalogue projets affiche et défile | ☐ Passé ☐ Échec | | |
| TM-04 | Détail projet et partage | ☐ Passé ☐ Échec | | |
| TM-05 | Pull-to-refresh | ☐ Passé ☐ Échec | | |
| TM-06 | Contact mailto | ☐ Passé ☐ Échec | | |
| TM-07 | APK généré via EAS Build | ☐ Passé ☐ Échec | | |

### 3.3 Tests sécurité (TS)

| ID | Titre | Statut | Commentaires |
|---|---|---|---|
| TS-AUTH-01 | Accès admin sans session | ☐ Passé ☐ Échec | |
| TS-AUTH-02 | Énumération comptes | ☐ Passé ☐ Échec | |
| TS-AUTH-03 | Rate limit login | ☐ Passé ☐ Échec | |
| TS-INPUT-01 | Injection SQL | ☐ Passé ☐ Échec | |
| TS-INPUT-02 | XSS contenu projet | ☐ Passé ☐ Échec | |
| TS-INPUT-03 | Upload exécutable | ☐ Passé ☐ Échec | |
| TS-INPUT-04 | Validation slug | ☐ Passé ☐ Échec | |
| TS-HEADERS-01 | Headers sécurité | ☐ Passé ☐ Échec | |
| TS-CORS-01 | CORS API | ☐ Passé ☐ Échec | |

### 3.4 Tests accessibilité (TS-A11Y)

| ID | Titre | Statut | Commentaires |
|---|---|---|---|
| TS-A11Y-01 | prefers-reduced-motion respecté | ☐ Passé ☐ Échec | |
| TS-A11Y-02 | Navigation clavier complète | ☐ Passé ☐ Échec | |
| TS-A11Y-03 | Lecteur d'écran NVDA | ☐ Passé ☐ Échec | |
| TS-A11Y-04 | Contraste AA axe DevTools | ☐ Passé ☐ Échec | |

### 3.5 Tests performance (TP)

| ID | Page | Performance | A11y | Best practices | SEO | Statut |
|---|---|---|---|---|---|---|
| TP-01 | Accueil | ___ /100 | ___ /100 | ___ /100 | ___ /100 | ☐ Passé ☐ Échec |
| TP-02 | Projets | ___ /100 | ___ /100 | ___ /100 | ___ /100 | ☐ Passé ☐ Échec |
| TP-03 | Détail projet | ___ /100 | ___ /100 | ___ /100 | ___ /100 | ☐ Passé ☐ Échec |
| TP-04 | Mobile throttling 4G | ___ /100 | ___ /100 | ___ /100 | ___ /100 | ☐ Passé ☐ Échec |

---

## 4. Anomalies relevées

| ID | Sévérité | Module | Description | Statut |
|---|---|---|---|---|
| ANO-01 | ☐ P1 ☐ P2 ☐ P3 | | | ☐ Ouvert ☐ Corrigé ☐ Accepté |
| ANO-02 | ☐ P1 ☐ P2 ☐ P3 | | | ☐ Ouvert ☐ Corrigé ☐ Accepté |
| ANO-03 | ☐ P1 ☐ P2 ☐ P3 | | | ☐ Ouvert ☐ Corrigé ☐ Accepté |

**Légende sévérité :**
- **P1** — Bloquant pour la mise en prod
- **P2** — Important, à corriger avant tag v1.0.0
- **P3** — Mineur, peut être reporté en V2

---

## 5. Décision

☐ **Recette PRONONCÉE** sans réserve — Le produit peut être mis en production.

☐ **Recette PRONONCÉE avec réserves** — Le produit peut être mis en production, les anomalies P3 sont reportées V2.

☐ **Recette REFUSÉE** — Anomalies P1 ou P2 ouvertes bloquent la mise en production.

---

## 6. Plan d'action en cas de réserves ou refus

| Anomalie | Action corrective | Responsable | Échéance |
|---|---|---|---|
| | | | |
| | | | |

---

## 7. Pièces jointes

- [ ] Captures d'écran des anomalies
- [ ] Rapports Lighthouse CI (JSON + HTML)
- [ ] Rapport axe DevTools (export)
- [ ] Logs Docker (extraits si pertinents)
- [ ] Rapport pentest OWASP (Sprint 6)

---

## 8. Signature finale

| Rôle | Nom | Date | Signature |
|---|---|---|---|
| Maître d'œuvre | HEU Léon | | |
| Recetteur | | | |

---

**Note d'usage** : Ce modèle est destiné à la recette interne ou à un client freelance fictif. Pour un side project perso, la signature est facultative — l'essentiel est de garder une trace écrite du verdict avant tag `v1.0.0`.
