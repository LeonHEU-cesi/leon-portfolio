# Tests — leon-portfolio

Ce dossier contient les **artefacts de recette manuelle** (cahier, procédures, PV). Les tests automatisés (TU, TF, TE) vivent dans `web/tests/` et `mobile/`.

## Documents

| Fichier | Contenu |
|---|---|
| Cahier de tests | [`Docs/claude/leon-portfolio/Cahier_de_tests.md`](../Docs/claude/leon-portfolio/Cahier_de_tests.md) |
| Procédure de validation | [`Docs/claude/leon-portfolio/procedure-validation.md`](../Docs/claude/leon-portfolio/procedure-validation.md) |
| Modèle PV de recette | [`Docs/claude/leon-portfolio/pv-recette.md`](../Docs/claude/leon-portfolio/pv-recette.md) |

## Tests automatisés

- **Unitaires + Fonctionnels API** : Vitest dans `web/tests/{unit,feature}/`
- **E2E** : Playwright dans `web/tests/e2e/`
- **Performance** : Lighthouse CI configuré dans `web/lighthouserc.cjs`
- **Mobile** : Jest dans `mobile/__tests__/`

Voir [`Plan_developpement.md § 5`](../Docs/claude/leon-portfolio/Plan_developpement.md) pour la stratégie complète.
