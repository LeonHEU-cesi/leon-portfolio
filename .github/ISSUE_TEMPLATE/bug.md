---
name: Bug
about: Anomalie ou régression à corriger
title: '[BUG] '
labels: type-fix
assignees: LeonHEU-cesi
---

## Description

<!-- Décrire l'anomalie en 2-3 lignes. -->

## Étapes pour reproduire

1.
2.
3.

## Résultat attendu

<!-- Ce qui devrait se passer. -->

## Résultat constaté

<!-- Ce qui se passe réellement. -->

## Environnement

- Branche : `develop` / `feat/...`
- Navigateur / Device : Chrome 132 / Android Expo Go / etc.
- Reproductible : ☐ oui ☐ non / intermittent
- Date constatation : (auto via création issue)

## Logs / Captures

<!-- Coller les logs Docker ou captures d'écran si pertinent. -->

## Sévérité

- [ ] P1 — Bloquant (prod down, sécurité)
- [ ] P2 — Important (feature cassée mais workaround possible)
- [ ] P3 — Mineur (UX, cosmétique)
- [ ] P4 — Nice-to-have

## Test de non-régression

<!-- Si bug en prod, prévoir un TNR-NN à ajouter au Cahier_de_tests.md -->

- [ ] TNR-NN à créer

## Définition de Done

- [ ] Cause identifiée
- [ ] Fix committé avec test de non-régression
- [ ] PR vers `develop`
- [ ] JOURNAL.md mis à jour
