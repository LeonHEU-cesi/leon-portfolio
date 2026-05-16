# Audit lecteur d'écran — checklist NVDA / VoiceOver

> #6.9 — audit manuel (non automatisable). Complète l'audit **axe**
> automatisé (#6.8, bloquant en CI). À dérouler par Léon : NVDA (Windows,
> Firefox/Chrome) et/ou VoiceOver (macOS/iOS, Safari).

## Méthode
NVDA : `Insert` = touche NVDA. Navigation : `H` (titres), `D` (landmarks),
`K` (liens), `F` (champs), `Tab` (focus). Vérifier que **tout est annoncé
correctement, dans un ordre logique, sans piège de focus**.

## Pages publiques

| Page | Vérifications | OK |
|---|---|---|
| `/` Accueil | 1 seul `h1`, hero annoncé, ordre titres cohérent, CTA « Voir tous les projets » explicite | ☐ |
| `/projets` | landmark `main`, recherche (label « Rechercher un projet »), chips tag (`aria-current` annoncé), cartes = liens explicites (titre projet), section « Mes repos publics » titrée | ☐ |
| `/projets/[slug]` | `h1` = titre projet, lien retour « Tous les projets » annoncé, liens externes annoncés (nouvel onglet) | ☐ |
| `/cv` | structure titres (h1→h2→h3), timeline lue dans l'ordre antéchronologique, bouton « Télécharger le CV en PDF » annoncé | ☐ |
| `/about` | bio lue en entier, titres de section | ☐ |
| `/contact` | liens email/réseaux explicites (`aria-label`), bouton « Copier l'email » + retour « Email copié » annoncé (aria-live), QR `role=img` + `aria-label` | ☐ |
| `/mentions-legales` | 5 sections annoncées par leurs titres | ☐ |
| `/login` | champs email/mot de passe avec labels, erreur en `role=alert` annoncée | ☐ |

## Points transverses

- [ ] Header : navigation principale en landmark `nav`, item actif annoncé (`aria-current`)
- [ ] Footer : liens explicites, pas de lien « cliquez ici »
- [ ] Menu burger mobile : `aria-expanded`, focus déplacé à l'ouverture, `Esc` ferme, focus restauré (déjà couvert TU #1.4)
- [ ] Thème : bouton clair/sombre avec `aria-label` dynamique
- [ ] Aucune information uniquement par la couleur (contraste validé axe #6.8)
- [ ] `prefers-reduced-motion` : aucune animation ne gêne la lecture

## Résultat
Consigner ici les anomalies trouvées + créer une issue `type-fix`,
`scope-web`, `regression` si bloquant. Sinon : audit **passé**.
