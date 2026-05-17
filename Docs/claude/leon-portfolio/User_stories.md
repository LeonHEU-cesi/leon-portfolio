# User Stories — leon-portfolio

**Projet :** leon-portfolio — Portfolio personnel Web + Mobile
**Auteur :** HEU Léon
**Version :** 1.0 — Backlog V1 validé le 2026-05-14

---

## 1. Conventions

### 1.1 Plateformes

- **[W-Pub]** : Web public (Next.js 15, visiteurs anonymes)
- **[W-Adm]** : Web administrateur (Next.js, routes `/admin/*`, login requis)
- **[Mob]** : Application mobile Expo (SDK 54)
- **[API]** : API REST commune

### 1.2 Priorités MoSCoW

- **P1 — Must have** : indispensable pour la release V1
- **P2 — Should have** : important, attendu pour un portfolio crédible
- **P3 — Could have** : utile, à couper en premier si retard
- **P4 — Won't have V1** : reporté V2 (mais documenté)

### 1.3 Stratégie de répartition

| Module | Web public | Web admin | Mobile |
|---|---|---|---|
| Vitrine (Accueil, About) | ✅ | — | ✅ (simplifié) |
| Projets (catalogue, détail) | ✅ | ✅ CRUD | ✅ (lecture) |
| CV / Parcours | ✅ | — | ❌ (lien externe) |
| Contact | ✅ mailto | — | ✅ mailto + share |
| Articles (blog) | V2 | ✅ CRUD draft | ❌ |
| GitHub Hub | ✅ | — | ❌ |
| Admin | ❌ | ✅ | ❌ |

---

## 2. Vue d'ensemble du backlog

| ID | Titre | Plateformes | Priorité |
|---|---|---|---|
| US-VI-01 | Accueil avec hero animé scroll-driven | W-Pub | P1 |
| US-VI-02 | Section "Projets phares" sur l'accueil | W-Pub | P2 |
| US-VI-03 | Navigation principale + footer | W-Pub | P1 |
| US-VI-04 | Toggle dark mode persistant | W-Pub + Mob | P2 |
| US-VI-05 | Page About avec bio narrative | W-Pub | P2 |
| US-VI-06 | Animation au scroll respectant prefers-reduced-motion | W-Pub | P2 |
| US-PJ-01 | Catalogue des projets filtrable | W-Pub + Mob | P1 |
| US-PJ-02 | Détail d'un projet | W-Pub + Mob | P1 |
| US-PJ-03 | Recherche client-side sur projets | W-Pub | P2 |
| US-PJ-04 | Hub GitHub (repos publics agrégés) | W-Pub | P2 |
| US-PJ-05 | Filtres par tags / stack technique | W-Pub | P2 |
| US-CV-01 | Page CV avec timeline expériences | W-Pub | P1 |
| US-CV-02 | Téléchargement du CV au format PDF | W-Pub | P2 |
| US-CT-01 | Page contact avec lien mailto | W-Pub + Mob | P1 |
| US-CT-02 | Liens réseaux sociaux + QR vCard | W-Pub | P3 |
| US-AD-01 | Se connecter au back-office | W-Adm | P1 |
| US-AD-02 | Se déconnecter du back-office | W-Adm | P1 |
| US-AD-03 | Dashboard admin | W-Adm | P3 |
| US-AD-04 | Lister, créer, modifier, supprimer un projet | W-Adm | P1 |
| US-AD-05 | Gérer les tags / catégories | W-Adm | P2 |
| US-AD-06 | Upload d'images projet | W-Adm | P2 |
| US-AD-07 | Lister, créer, modifier, supprimer un article (draft) | W-Adm | P2 |
| US-BL-01 | Consulter la liste des articles publiés | W-Pub | P4 (V2) |
| US-BL-02 | Consulter un article | W-Pub | P4 (V2) |
| US-MOB-01 | Installer l'app via Expo Go | Mob | P1 |
| US-MOB-02 | Navigation par onglets | Mob | P1 |
| US-MOB-03 | Catalogue projets virtualisé | Mob | P1 |
| US-MOB-04 | Détail projet avec partage | Mob | P2 |
| US-MOB-05 | Pull-to-refresh sur catalogue | Mob | P3 |
| US-TR-01 | HTTPS + HSTS sur tout le site | Toutes | P1 |
| US-TR-02 | Hash bcrypt des mots de passe admin | API | P1 |
| US-TR-03 | Rate limiting login et API contact | API | P1 |
| US-TR-04 | Page mentions légales | W-Pub | P2 |
| US-TR-05 | Sitemap.xml + robots.txt | W-Pub | P2 |
| US-TR-06 | OG images dynamiques + JSON-LD | W-Pub | P2 |
| US-TR-07 | Documentation OpenAPI exposée | API | P3 |
| US-TR-08 | Accessibilité WCAG AA validée | Toutes | P2 |

---

## 3. Module Vitrine publique

### US-VI-01 — Accueil avec hero animé scroll-driven

**Priorité :** P1 — Indispensable    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que visiteur, je veux découvrir une page d'accueil avec un hero animé immersif afin d'être marqué par l'identité visuelle dès l'arrivée.

**Critères d'acceptation**

- Hero plein écran avec titre + sous-titre + CTA
- Animation d'entrée échelonnée (stagger) GSAP au load
- Animations déclenchées au scroll (ScrollTrigger) sur les sections suivantes
- Curseur custom (variante)
- Honor `prefers-reduced-motion` : animations désactivées si demandé
- LCP < 2.5s sur fibre, FID < 100ms

**Notes techniques**

- GSAP 3.x + ScrollTrigger plugin
- `useGSAP` hook officiel React
- Fallback statique si JS désactivé

---

### US-VI-02 — Section "Projets phares" sur l'accueil

**Priorité :** P2 — Important    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que visiteur, je veux voir 3 projets phares sur l'accueil afin d'avoir un aperçu rapide du travail sans naviguer.

**Critères d'acceptation**

- 3 cartes projet récentes ou marquées `is_featured = true`
- CTA "Voir tous les projets" → `/projets`
- Cartes animées au hover (Framer Motion tilt + scale)

**Notes techniques**

- Server Component fetch via Prisma direct
- ISR `revalidate: 3600` (1h)

---

### US-VI-03 — Navigation principale + footer

**Priorité :** P1 — Indispensable    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que visiteur, je veux une navigation cohérente sur toutes les pages afin de me repérer facilement.

**Critères d'acceptation**

- Header sticky avec logo + nav (Accueil, Projets, CV, About, Contact)
- Menu burger mobile < 768px avec animation slide
- Footer avec mentions légales + liens réseaux sociaux + copyright
- Indicateur de page courante (underline animé)

---

### US-VI-04 — Toggle dark mode persistant

**Priorité :** P2 — Important    **Plateformes :** Web public + Mobile    **Acteur :** visiteur

> En tant que visiteur, je veux pouvoir basculer en dark mode et que mon choix soit conservé entre les visites.

**Critères d'acceptation**

- Toggle visible dans le header
- Détection initiale via `prefers-color-scheme`
- Persistance via cookie (web) et SecureStore (mobile)
- Transition douce 200ms entre les thèmes
- Pas de FOUC (flash of unstyled content)

**Notes techniques**

- `next-themes` côté web avec `cookie` storage pour SSR-safe
- Variables CSS Tailwind v4 (`@theme`)

---

### US-VI-05 — Page About avec bio narrative

**Priorité :** P2 — Important    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que visiteur, je veux découvrir le profil personnel afin de cerner la personne derrière le code.

**Critères d'acceptation**

- Bio en 3-5 paragraphes
- 2-3 photos (compressées + responsive `<picture>`)
- Section "Valeurs / Approche" en 3 points
- Lien vers CV et Contact

---

### US-VI-06 — Animations respectant prefers-reduced-motion

**Priorité :** P2 — Important    **Plateformes :** Web public    **Acteur :** visiteur sensible aux animations

> En tant que visiteur sensible aux animations (vertige, troubles vestibulaires), je veux que mon préfère système soit respecté.

**Critères d'acceptation**

- Toutes les animations GSAP/Framer désactivées si `prefers-reduced-motion: reduce`
- Transitions de page remplacées par fade simple
- Tests : changement du paramètre OS et rechargement, animations absentes
- Documenté en TS-A11Y-01

---

## 4. Module Projets

### US-PJ-01 — Catalogue des projets filtrable

**Priorité :** P1 — Indispensable    **Plateformes :** Web public + Mobile    **Acteur :** visiteur

> En tant que visiteur, je veux parcourir le catalogue de tous les projets afin d'évaluer l'étendue du travail.

**Critères d'acceptation**

- Grille responsive (1 col mobile, 2 col tablet, 3 col desktop)
- Chaque carte : image + titre + résumé (1 ligne) + tags + liens repo/démo
- Pagination ou infinite scroll (12 par page)
- Affichage de la stack principale en badges
- Filtrage par tags/stack (cf. US-PJ-05)

**Spécificités mobile**

- FlatList virtualisée
- Carte tactile avec feedback `Pressable`
- Image lazy-loaded via `expo-image`
- Pull-to-refresh (US-MOB-05)

**Notes techniques**

- `GET /api/projects` avec query params `?tag=&stack=&search=&page=`
- Server Component + Suspense pour fallback skeleton

---

### US-PJ-02 — Détail d'un projet

**Priorité :** P1 — Indispensable    **Plateformes :** Web public + Mobile    **Acteur :** visiteur

> En tant que visiteur, je veux consulter le détail complet d'un projet afin d'en comprendre le contexte, les choix techniques et les résultats.

**Critères d'acceptation**

- URL `/projets/[slug]` (web), `/projects/[slug]` (mobile)
- Image hero + galerie (lightbox)
- Sections : Contexte / Stack / Défis / Résultats / Liens
- Lien repo GitHub + démo live (si dispo)
- README du repo rendu (optionnel V1.1)
- Boutons partage (mobile)
- 404 propre si projet inexistant ou non publié

---

### US-PJ-03 — Recherche client-side sur projets

**Priorité :** P2 — Important    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que visiteur, je veux taper du texte pour filtrer rapidement les projets.

**Critères d'acceptation**

- Barre de recherche en haut de `/projets`
- Recherche en temps réel (debounce 200ms)
- Champs fuzzy : titre, tags, stack
- Compteur de résultats
- Highlight des termes correspondants

**Notes techniques**

- `Fuse.js` côté client sur le dataset déjà chargé
- Pas de roundtrip serveur

---

### US-PJ-04 — Hub GitHub (repos publics agrégés)

**Priorité :** P2 — Important    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que visiteur, je veux voir une liste à jour des repos GitHub publics afin de juger l'activité open source.

**Critères d'acceptation**

- Section "Mes repos publics" sur `/projets` (en dessous des projets curés)
- Cartes générées depuis GitHub API : titre, description, langage principal, stars, lien
- Triées par `updated_at` décroissant
- Cache ISR 24h
- Filtrable par langage côté client

**Notes techniques**

- `web/lib/services/github.ts` avec `unstable_cache(fn, ['github-repos'], { revalidate: 86400 })`
- Token PAT lecture publique en `GITHUB_TOKEN` env
- Gestion gracieuse en cas de rate limit (affichage cache stale)

---

### US-PJ-05 — Filtres par tags / stack technique

**Priorité :** P2 — Important    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que visiteur, je veux filtrer les projets par technologie afin de cibler ceux qui correspondent à mon besoin.

**Critères d'acceptation**

- Chips tags cliquables au-dessus de la grille
- Sélection multiple (OR logique)
- Chips actifs supprimables individuellement
- URL synchronisée (`?tag=react,nextjs`)
- Bouton "Réinitialiser"

---

## 5. Module CV

### US-CV-01 — Page CV avec timeline

**Priorité :** P1 — Indispensable    **Plateformes :** Web public    **Acteur :** recruteur

> En tant que recruteur, je veux consulter le CV en ligne afin d'évaluer rapidement le profil.

**Critères d'acceptation**

- Sections : Profil / Expériences / Formations / Compétences / Langues / Centres d'intérêt
- Timeline verticale animée au scroll pour expériences
- Compétences sous forme de barres ou de chips groupés
- Compatible impression CSS (`@media print`)

**Notes techniques**

- Données dans `web/data/cv.ts` (fichier TS typé) — pas en BDD pour V1
- Pas d'édition admin V1

---

### US-CV-02 — Téléchargement du CV au format PDF

**Priorité :** P2 — Important    **Plateformes :** Web public    **Acteur :** recruteur

> En tant que recruteur, je veux télécharger le CV au format PDF afin de le partager ou l'archiver.

**Critères d'acceptation**

- Bouton "Télécharger CV (PDF)" visible
- Fichier `cv-leon-heu.pdf` dans `web/public/`
- Mise à jour manuelle (pas de génération auto V1)
- Taille < 500ko, optimisé

---

## 6. Module Contact

### US-CT-01 — Page contact avec mailto

**Priorité :** P1 — Indispensable    **Plateformes :** Web public + Mobile    **Acteur :** visiteur

> En tant que visiteur, je veux contacter facilement par email.

**Critères d'acceptation**

- Lien mailto: avec adresse pro
- Pas de formulaire (décision Bloc 5 : pas d'enjeu RGPD)
- Copie de l'adresse au clic (toast feedback)
- Affichage clair des canaux : email, LinkedIn, GitHub

**Spécificités mobile**

- `Linking.openURL('mailto:...')`
- Partage de vCard via `expo-sharing` (optionnel)

---

### US-CT-02 — Liens réseaux sociaux + QR vCard

**Priorité :** P3 — Utile    **Plateformes :** Web public    **Acteur :** visiteur

> En tant que recruteur, je veux scanner un QR code pour récupérer la vCard.

**Critères d'acceptation**

- QR code SVG généré au build avec lien vers `/vcard.vcf` ou data: URL
- Icônes LinkedIn, GitHub, Twitter/X, Mastodon (selon présence)
- Hover effects sur icônes

---

## 7. Module Back-office admin

### US-AD-01 — Se connecter au back-office

**Priorité :** P1 — Indispensable    **Plateformes :** Web admin    **Acteur :** admin (HEU Léon)

> En tant qu'admin, je veux me connecter avec email/mdp afin d'accéder au back-office.

**Critères d'acceptation**

- Page `/login` avec form email + mdp
- Validation côté client (Zod via RHF)
- Message d'erreur générique en cas d'identifiants invalides (anti-énumération)
- Rate limit 5 tentatives / 15 min
- Redirection vers `/admin` après succès
- Session cookie HTTP-only, SameSite=Lax, Secure en prod

**Notes techniques**

- Auth.js v5 credentials provider
- bcrypt cost 12 sur le hash
- Middleware Next.js sur `/admin/*` redirigeant `/login` si non auth

---

### US-AD-02 — Se déconnecter

**Priorité :** P1    **Plateformes :** Web admin    **Acteur :** admin

> En tant qu'admin, je veux me déconnecter afin de protéger ma session.

**Critères d'acceptation**

- Bouton "Déconnexion" dans le header admin
- Suppression du cookie de session
- Redirection vers `/login`

---

### US-AD-03 — Dashboard admin

**Priorité :** P3 — Utile    **Plateformes :** Web admin    **Acteur :** admin

> En tant qu'admin, je veux un tableau de bord avec des stats simples.

**Critères d'acceptation**

- Cartes : nombre de projets publiés, nombre d'articles draft, dernière connexion
- Liens rapides vers les sections CRUD
- Pas de graphique complexe V1

---

### US-AD-04 — CRUD projets

**Priorité :** P1 — Indispensable    **Plateformes :** Web admin    **Acteur :** admin

> En tant qu'admin, je veux créer/modifier/supprimer des projets afin de maintenir le portfolio à jour.

**Critères d'acceptation**

- Liste paginée `/admin/projects` avec recherche + filtres statut
- Création `/admin/projects/new` : titre, slug auto, résumé, contenu MDX, stack tags, repo URL, démo URL, image, statut (draft/published), featured (bool)
- Édition `/admin/projects/[id]` (form pré-rempli)
- Suppression avec modal de confirmation
- Toast feedback après chaque action
- Validation Zod côté serveur (Server Actions)

**Notes techniques**

- Routes : `GET /api/admin/projects`, `POST /api/admin/projects`, `PATCH /api/admin/projects/[id]`, `DELETE /api/admin/projects/[id]`
- Tous protégés par middleware auth
- Slug auto-régénéré si titre change (sauf édition manuelle)

---

### US-AD-05 — Gérer les tags

**Priorité :** P2 — Important    **Plateformes :** Web admin    **Acteur :** admin

> En tant qu'admin, je veux gérer la liste des tags afin de classifier proprement les projets.

**Critères d'acceptation**

- CRUD inline sur `/admin/tags`
- Empêcher la suppression d'un tag référencé par un projet (sauf "détacher tous d'abord")
- Tableau avec compteur de projets associés

---

### US-AD-06 — Upload d'images projet

**Priorité :** P2 — Important    **Plateformes :** Web admin    **Acteur :** admin

> En tant qu'admin, je veux uploader les images des projets directement depuis le back-office.

**Critères d'acceptation**

- Drag-and-drop ou file picker
- Validation côté serveur : extension (jpg, png, webp), poids max 5 Mo, dimensions max 2400x2400
- Compression auto à 1600px max + génération webp via `sharp`
- Stockage sur volume Docker `/app/uploads` monté
- URL retournée : `/uploads/projects/<uuid>.webp`
- Preview avant validation

**Notes techniques**

- Route `POST /api/admin/upload` multipart/form-data
- Pas de S3/Cloudinary V1 (budget 0€)

---

### US-AD-07 — CRUD articles (draft)

**Priorité :** P2 — Important    **Plateformes :** Web admin    **Acteur :** admin

> En tant qu'admin, je veux préparer des articles techniques même si la page publique n'est pas livrée V1.

**Critères d'acceptation**

- Liste `/admin/articles` avec statut (draft / published)
- Création `/admin/articles/new` : titre, slug, résumé, contenu MDX, tags, statut
- Édition avec éditeur Monaco ou textarea simple
- Preview côté admin (rendu MDX)
- Pas de page publique V1 (V2)

---

## 8. Module Blog (V2)

### US-BL-01 et US-BL-02 — Consultation publique des articles

**Priorité :** P4 — V2    **Plateformes :** Web public

Stories différées V2. La structure DB et l'admin sont livrés V1.
- `/blog` : liste paginée
- `/blog/[slug]` : détail article avec rendu MDX, tags, partage
- Sitemap inclura les articles publiés

---

## 9. Module Mobile

### US-MOB-01 — Installer via Expo Go

**Priorité :** P1 — Indispensable    **Plateformes :** Mobile    **Acteur :** visiteur / recruteur curieux

> En tant que recruteur, je veux installer l'app via QR code Expo Go afin de tester sans passer par les stores.

**Critères d'acceptation**

- `npx expo start` dans `/mobile` affiche un QR code
- Scan via Expo Go ouvre l'app
- L'app se connecte à l'API prod `https://leonheu.fr/api`
- APK release-friendly via EAS Build (téléchargement direct via `eas.build` link)

**Notes techniques**

- `app.json` : nom "Leon Portfolio", icône, splash, scheme `leonportfolio://`
- `EXPO_PUBLIC_API_URL` dans `.env`

---

### US-MOB-02 — Navigation par onglets

**Priorité :** P1    **Plateformes :** Mobile

**Critères d'acceptation**

- Bottom tab bar 4 onglets : Accueil / Projets / About / Contact
- Icônes `@expo/vector-icons` (Ionicons)
- Onglet actif mis en évidence
- Animation switch d'onglet (Reanimated)

---

### US-MOB-03 — Catalogue projets virtualisé

**Priorité :** P1    **Plateformes :** Mobile

**Critères d'acceptation**

- `FlatList` virtualisée
- Card projet : image (`expo-image`) + titre + tags
- Tap → écran détail
- Loader pendant fetch initial
- Empty state si pas de projet

**Notes techniques**

- TanStack Query `useInfiniteQuery` avec `getNextPageParam`
- Cache local 5 min

---

### US-MOB-04 — Détail projet avec partage

**Priorité :** P2    **Plateformes :** Mobile

**Critères d'acceptation**

- ScrollView avec image header
- Texte du contenu MDX rendu en RN (`react-native-markdown-display`)
- Bouton "Partager" FAB → `expo-sharing` avec URL projet
- Bouton "Voir sur GitHub" si repo URL

---

### US-MOB-05 — Pull-to-refresh

**Priorité :** P3    **Plateformes :** Mobile

**Critères d'acceptation**

- `RefreshControl` sur FlatList catalogue
- Indicateur visuel pendant refetch
- Toast feedback en cas d'erreur réseau

---

## 10. User stories transverses

### US-TR-01 — HTTPS + HSTS

**Priorité :** P1    **Plateformes :** Toutes

- Caddy en reverse proxy avec TLS auto Let's Encrypt
- Header `Strict-Transport-Security: max-age=15552000; includeSubDomains` (6 mois)
- Redirect 301 HTTP → HTTPS
- iOS bloque HTTP non sécurisé par défaut, donc prod obligatoirement HTTPS

---

### US-TR-02 — Hash bcrypt mots de passe

**Priorité :** P1    **Plateformes :** API

- bcrypt cost 12 sur tous les mots de passe admin
- Champ `password` jamais retourné par l'API (sélection explicite Prisma)
- Seed de l'admin initial via script avec mdp prompt en env `ADMIN_PASSWORD`

---

### US-TR-03 — Rate limiting

**Priorité :** P1    **Plateformes :** API

- Login : 5 tentatives / 15 min par IP+email
- API publique projects/articles : 100 req / min par IP
- Réponse 429 + header `Retry-After`

**Notes techniques**

- `@upstash/ratelimit` en mémoire (V1) ou Redis local (V2 si scaling)

---

### US-TR-04 — Page mentions légales

**Priorité :** P2    **Plateformes :** Web public

- `/mentions-legales` avec : éditeur (toi), hébergeur (auto-hébergement auto-hébergement + le registrar domaine), DPO (auto), contact
- Lien dans le footer
- Pas de politique de confidentialité étendue (pas de tracking)

---

### US-TR-05 — Sitemap.xml + robots.txt

**Priorité :** P2    **Plateformes :** Web public

- `sitemap.ts` Next.js générant XML automatique : pages publiques + projets publiés
- `robots.ts` : autoriser tout sauf `/admin/*` et `/api/*`
- Test via Google Search Console

---

### US-TR-06 — OG images dynamiques + JSON-LD

**Priorité :** P2    **Plateformes :** Web public

**Critères d'acceptation**

- Route `/api/og?title=...&type=project` génère image PNG 1200x630
- Metadata App Router avec `openGraph.images` dynamique
- JSON-LD `Person` sur Accueil, `BreadcrumbList` sur sous-pages, `CreativeWork` sur projets
- Validation via Schema.org validator + Twitter Card Validator

**Notes techniques**

- `@vercel/og` (compatible Next.js standalone)

---

### US-TR-07 — Documentation OpenAPI

**Priorité :** P3    **Plateformes :** API

- Schémas Zod source de vérité
- `zod-to-openapi` génère le doc OpenAPI 3.1
- Route `/api/docs` sert le doc via Scalar UI
- Lien depuis README

---

### US-TR-08 — Accessibilité WCAG AA

**Priorité :** P2    **Plateformes :** Toutes

**Critères d'acceptation**

- Contraste AA (4.5:1 texte normal, 3:1 grand texte) validé via axe DevTools
- Navigation clavier fonctionnelle (Tab, Enter, Esc)
- Tous les éléments interactifs ont un focus visible
- `aria-label` sur boutons icône-only
- Lecteur d'écran : test sur NVDA (Windows) ou VoiceOver
- `prefers-reduced-motion` respecté (cf. US-VI-06)
- Sous-titres sur vidéos (si présentes)

---

## 11. Matrice de traçabilité besoins ↔ user stories

| Besoin (Bloc 1-3) | User stories couvrant |
|---|---|
| Vitrine recruteurs (Bloc 1) | US-VI-01, US-VI-03, US-VI-05, US-PJ-01, US-CV-01, US-CV-02, US-CT-01 |
| Démo compétences techniques (Bloc 1) | US-VI-01, US-VI-06, US-PJ-01, US-PJ-04, US-TR-06, US-TR-07, US-TR-08, US-MOB-* |
| Hub GitHub centralisé (Bloc 1) | US-PJ-04 |
| Blog (V2 — Bloc 3) | US-AD-07 (V1 admin), US-BL-01, US-BL-02 (V2 public) |
| Visiteur + Admin (Bloc 2) | US-AD-01 à US-AD-07 |
| WCAG AA (Bloc 2) | US-VI-06, US-TR-08 |
| Animations GSAP + Framer (Bloc 3) | US-VI-01, US-VI-02, US-PJ-02 |
| Dark mode + Recherche (Bloc 3) | US-VI-04, US-PJ-03 |
| GitHub API (Bloc 3) | US-PJ-04 |
| Mobile compagnon (Bloc 4) | US-MOB-01 à US-MOB-05, US-PJ-01, US-PJ-02 |
| Pas de RGPD lourd (Bloc 5) | US-CT-01 (mailto au lieu de form), US-TR-04 (mentions seules) |
| HTTPS, bcrypt, rate limit (Bloc 5) | US-TR-01, US-TR-02, US-TR-03 |
| OpenAPI, SEO, Storybook (Bloc 4) | US-TR-07, US-TR-05, US-TR-06 |

Cette matrice démontre la **couverture exhaustive** des besoins exprimés au cadrage.
