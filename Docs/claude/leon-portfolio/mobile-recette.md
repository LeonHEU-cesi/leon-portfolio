# Recette manuelle mobile — TM-01 à TM-07

> À dérouler par Léon sur device physique après build APK preview (#5.11).
> Prérequis : APK installé (`eas build -p android --profile preview`), API web
> accessible (prod `leonheu.fr` ou `EXPO_PUBLIC_API_URL`).

| ID | Cas | Étapes | Résultat attendu | OK |
|---|---|---|---|---|
| TM-01 | Démarrage app | Lancer l'APK | L'app ouvre l'onglet Accueil sans crash | ☐ |
| TM-02 | Navigation tabs | Toucher chaque onglet (Accueil/Projets/À propos/Contact) | Chaque écran s'affiche, libellés FR, icônes | ☐ |
| TM-03 | Catalogue projets | Onglet Projets | Liste des projets publiés (API), états chargement puis cartes | ☐ |
| TM-04 | Pull-to-refresh | Tirer la liste vers le bas | Indicateur de rafraîchissement, liste rechargée | ☐ |
| TM-05 | Détail + partage | Toucher une carte → écran détail → bouton Partager | Détail correct, feuille de partage native avec le lien web | ☐ |
| TM-06 | Contact | Onglet Contact → Email / GitHub / Partager | Ouvre le client mail / le navigateur / la feuille de partage | ☐ |
| TM-07 | Hors-ligne / API KO | Couper le réseau, ouvrir Projets | Message d'erreur propre (pas de crash), reprise au refresh | ☐ |
| TM-08 | Reduce Motion | Activer "Réduire les animations" système, ouvrir Projets | Pas d'animation d'apparition des cartes | ☐ |

## Proxies automatisés (CI `mobile-checks`, jest-expo)

Couverts sans device :
- `lib/api` (mapping liste/détail, 404, erreur réseau)
- `lib/share` (message de partage), `lib/contact` (mailto encodé)
- Rendu des écrans statiques About / Contact (smoke)

La recette device ci-dessus complète ces proxies pour les comportements
natifs (partage, deep-link mailto, gestures, perf).
