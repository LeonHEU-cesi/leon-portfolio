# Cahier de tests — leon-portfolio

**Projet :** leon-portfolio
**Auteur :** HEU Léon
**Version :** 1.0 — Aligné User Stories V1

---

## 1. Conventions

### 1.1 Types de tests et identifiants

| Type | Préfixe | Outil | Exécution |
|---|---|---|---|
| Unitaires | TU-XX-NN | Vitest | À chaque commit feature |
| Fonctionnels API | TF-XX-NN | Vitest + Prisma testcontainers | À chaque PR (CI) |
| Fonctionnels Web manuels | TF-WEB-NN | Recette manuelle Chrome/Firefox/Safari | Fin de sprint |
| Mobile manuels | TM-NN | Expo Go Android/iOS | Fin de sprint |
| Non-régression | TNR-NN | GitHub Actions (sous-ensemble TU+TF+TE) | À chaque PR vers develop ou main |
| Sécurité | TS-XX-NN | Manuel + scripts curl | Sprint Hardening avant prod |
| E2E auto | TE-NN | Playwright | À chaque PR (CI) |
| Performance | TP-NN | Lighthouse CI | À chaque PR (CI) |

### 1.2 Scope identifiers

- `VI` : Vitrine (Accueil, About, navigation)
- `PJ` : Projets (catalogue, détail, GitHub Hub)
- `CV` : CV
- `CT` : Contact
- `AD` : Admin (auth + CRUD)
- `MOB` : Mobile
- `AUTH` : Sécurité auth
- `INPUT` : Sécurité validation entrées
- `A11Y` : Accessibilité

### 1.3 Conventions de rédaction

- Chaque test référence sa/ses User Stories (`Couvre US-XX-NN`)
- Format : ID / Titre / Pré-requis / Étapes / Résultat attendu / Statut
- Statut : `À faire` / `Passé` / `Échec` (rempli pendant la recette)

---

## 2. Tests Unitaires (TU)

### TU-VI-01 — Composant `<HeroAnimated>` rend les éléments sans GSAP en SSR

**Couvre :** US-VI-01

| Élément | Détail |
|---|---|
| Pré-requis | Vitest + Testing Library configurés |
| Étapes | 1. `render(<HeroAnimated />)`. 2. Vérifier présence du titre et du sous-titre. |
| Résultat attendu | DOM contient les textes, pas d'erreur GSAP même sans `window` |

### TU-VI-02 — Hook `usePrefersReducedMotion` retourne `true` quand le media query l'indique

**Couvre :** US-VI-06

| Élément | Détail |
|---|---|
| Pré-requis | Mock `window.matchMedia` |
| Étapes | 1. Set matchMedia(prefers-reduced-motion: reduce) → matches=true. 2. `renderHook(() => usePrefersReducedMotion())`. 3. Vérifier la valeur. |
| Résultat attendu | Hook retourne `true` |

### TU-PJ-01 — Fonction `filterProjects(projects, { tags, search })` retourne les projets matchant

**Couvre :** US-PJ-01, US-PJ-03, US-PJ-05

| Élément | Détail |
|---|---|
| Étapes | 1. Dataset 5 projets. 2. Filtrer par `tags: ['react']` → projets contenant ce tag. 3. Filtrer par `search: 'next'` → projets dont titre/desc contient. |
| Résultat attendu | Filtres OR sur tags, AND avec search |

### TU-PJ-02 — Service `GitHubService.getPublicRepos` parse correctement la réponse API

**Couvre :** US-PJ-04

| Élément | Détail |
|---|---|
| Pré-requis | Mock `fetch` |
| Étapes | 1. Mock fetch retournant 3 repos. 2. Appeler `getPublicRepos('leonheu')`. 3. Vérifier mapping fields. |
| Résultat attendu | Tableau de 3 objets normalisés `{ name, description, language, stars, url }` |

### TU-AD-01 — Schéma Zod `LoginSchema` rejette les emails invalides

**Couvre :** US-AD-01

| Élément | Détail |
|---|---|
| Étapes | 1. `LoginSchema.safeParse({ email: 'invalid', password: 'short' })`. 2. Vérifier `success: false`. |
| Résultat attendu | Échec validation avec messages FR |

### TU-AD-02 — Helper `slugify` génère un slug propre depuis un titre

**Couvre :** US-AD-04

| Élément | Détail |
|---|---|
| Étapes | 1. `slugify('Mon Super Projet & Co!')`. 2. Vérifier sortie. |
| Résultat attendu | `'mon-super-projet-co'` |

### TU-AD-03 — Validation upload : refus si extension non autorisée

**Couvre :** US-AD-06

| Élément | Détail |
|---|---|
| Étapes | 1. `validateUpload({ name: 'malware.exe', size: 1000 })`. 2. Attendu erreur. |
| Résultat attendu | `{ ok: false, error: 'EXT_NOT_ALLOWED' }` |

### TU-AUTH-01 — Hash bcrypt produit un hash différent à chaque appel (salt)

**Couvre :** US-TR-02

| Élément | Détail |
|---|---|
| Étapes | 1. `await hash('motdepasse', 12)` ×2. 2. Comparer. |
| Résultat attendu | Deux hashes différents, mais `compare()` retourne `true` pour chaque |

---

## 3. Tests Fonctionnels API (TF)

### TF-PJ-01 — `GET /api/projects` retourne les projets publiés

**Couvre :** US-PJ-01

| Élément | Détail |
|---|---|
| Pré-requis | Postgres testcontainer + 5 projets seedés (3 published, 2 draft) |
| Étapes | 1. `GET /api/projects`. 2. Vérifier status 200 + JSON. |
| Résultat attendu | 3 projets retournés, draft filtrés |

### TF-PJ-02 — `GET /api/projects?tag=react` filtre par tag

**Couvre :** US-PJ-05

| Étapes | 1. Seed 2 projets tagués `react`. 2. `GET /api/projects?tag=react`. |
| Résultat attendu | 2 projets retournés, tous taggés `react` |

### TF-PJ-03 — `GET /api/projects/[slug]` retourne le projet ou 404

**Couvre :** US-PJ-02

| Étapes | 1. `GET /api/projects/slug-existant` → 200 + JSON. 2. `GET /api/projects/inexistant` → 404. |
| Résultat attendu | Cas 1 = 200, cas 2 = 404 avec body `{ error: 'NOT_FOUND' }` |

### TF-PJ-04 — `GET /api/github/repos` met en cache 24h

**Couvre :** US-PJ-04

| Élément | Détail |
|---|---|
| Pré-requis | Mock GitHub API |
| Étapes | 1. Premier appel → fetch GitHub. 2. Deuxième dans la même heure → réponse cache. |
| Résultat attendu | Mock fetch appelé 1 seule fois |

### TF-AD-01 — `POST /api/auth/login` retourne 200 et set cookie pour identifiants valides

**Couvre :** US-AD-01

| Étapes | 1. Seed admin avec hash bcrypt. 2. `POST { email, password }`. |
| Résultat attendu | Status 200, header `Set-Cookie` avec session HTTP-only |

### TF-AD-02 — `POST /api/auth/login` retourne 401 générique pour identifiants invalides

**Couvre :** US-AD-01

| Étapes | 1. `POST { email, password: 'wrong' }`. 2. `POST { email: 'unknown', password: 'x' }`. |
| Résultat attendu | Les deux retournent 401 + message générique `{ error: 'INVALID_CREDENTIALS' }` |

### TF-AD-03 — Routes `/api/admin/*` retournent 401 sans session

**Couvre :** US-AD-01

| Étapes | 1. `GET /api/admin/projects` sans cookie. 2. Vérifier réponse. |
| Résultat attendu | Status 401 |

### TF-AD-04 — `POST /api/admin/projects` crée un projet (admin authentifié)

**Couvre :** US-AD-04

| Étapes | 1. Login admin. 2. `POST { title, summary, slug, ... }`. 3. Vérifier en DB. |
| Résultat attendu | Status 201, projet en DB |

### TF-AD-05 — `PATCH /api/admin/projects/[id]` met à jour

**Couvre :** US-AD-04

| Étapes | 1. Seed projet. 2. Login. 3. `PATCH { title: 'Nouveau titre' }`. |
| Résultat attendu | Status 200, projet mis à jour en DB |

### TF-AD-06 — `DELETE /api/admin/projects/[id]` supprime

**Couvre :** US-AD-04

| Étapes | 1. Seed projet. 2. Login. 3. `DELETE`. 4. Vérifier absence en DB. |
| Résultat attendu | Status 204, projet supprimé |

### TF-AD-07 — Upload image refuse type MIME interdit

**Couvre :** US-AD-06

| Étapes | 1. Login. 2. `POST /api/admin/upload` avec fichier `.exe`. |
| Résultat attendu | Status 415, message `UNSUPPORTED_MEDIA_TYPE` |

### TF-AUTH-01 — Rate limit login : 6e tentative bloquée

**Couvre :** US-TR-03

| Étapes | 1. 5 tentatives login échouées rapides. 2. 6e tentative. |
| Résultat attendu | 6e = 429 + header `Retry-After` |

### TF-AUTH-02 — Session expirée déconnecte

**Couvre :** US-AD-01

| Étapes | 1. Login. 2. Avancer le temps de 30 jours (mock). 3. `GET /api/admin/projects`. |
| Résultat attendu | Status 401 |

---

## 4. Tests Fonctionnels Web (manuels TF-WEB)

À exécuter dans Chrome, Firefox, Safari, Edge — sur 375px, 768px, 1280px.

### TF-WEB-01 — Parcours visiteur Accueil → Projet → CV

**Couvre :** US-VI-01, US-PJ-01, US-PJ-02, US-CV-01

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir `https://leonheu.fr` | Page Accueil chargée, hero animé visible |
| 2 | Scroller jusqu'aux projets phares | Animation au scroll déclenchée |
| 3 | Cliquer sur un projet | Page détail chargée |
| 4 | Cliquer "CV" dans la nav | Timeline visible |
| 5 | Cliquer "Télécharger CV" | PDF téléchargé |

### TF-WEB-02 — Dark mode bascule et persiste

**Couvre :** US-VI-04

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Cliquer toggle dark mode | Thème change instantanément |
| 2 | Recharger | Thème conservé |
| 3 | Vider cookies | Détection auto via `prefers-color-scheme` |

### TF-WEB-03 — Filtrage projets par tag

**Couvre :** US-PJ-05

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Aller sur `/projets` | Tous projets visibles |
| 2 | Cliquer chip "React" | Liste filtrée, URL `?tag=react` |
| 3 | Ajouter chip "Next.js" | OR appliqué |
| 4 | Cliquer "Réinitialiser" | Tous projets revisibles |

### TF-WEB-04 — Recherche projets

**Couvre :** US-PJ-03

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Aller sur `/projets` | Liste complète |
| 2 | Taper "portfolio" dans la recherche | Résultats filtrés en temps réel |
| 3 | Effacer | Liste complète |

### TF-WEB-05 — Hub GitHub charge et affiche les repos

**Couvre :** US-PJ-04

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Aller sur `/projets` | Section "Mes repos publics" visible |
| 2 | Compter les cartes | ≥ 5 repos affichés |
| 3 | Vérifier le langage principal | Affichage cohérent avec GitHub |

### TF-WEB-06 — Responsive mobile (375px)

**Couvre :** US-VI-03

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir Chrome DevTools, set width 375px | Layout mobile |
| 2 | Vérifier menu burger | Présent en haut à droite |
| 3 | Cliquer burger | Menu slide depuis la droite |
| 4 | Vérifier toutes les pages | Pas d'overflow horizontal |

### TF-WEB-07 — Connexion admin et CRUD projet

**Couvre :** US-AD-01, US-AD-04

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Aller sur `/login` | Form visible |
| 2 | Saisir mauvais identifiants | Erreur générique |
| 3 | Saisir bons identifiants | Redirection `/admin` |
| 4 | Cliquer "Nouveau projet" | Form vierge |
| 5 | Remplir et "Enregistrer" | Toast succès, retour liste |
| 6 | Modifier le projet | Données mises à jour |
| 7 | Supprimer | Modal confirm, projet retiré |

### TF-WEB-08 — Mentions légales accessibles

**Couvre :** US-TR-04

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Cliquer lien footer | Page mentions chargée |
| 2 | Vérifier contenu | Éditeur, hébergeur, contact présents |

---

## 5. Tests Mobile manuels (TM)

À exécuter sur Pixel 7 émulé + Expo Go iOS si Mac dispo.

### TM-01 — Installation via QR Expo Go

**Couvre :** US-MOB-01

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | `cd mobile && npx expo start` | QR code dans terminal |
| 2 | Scan via Expo Go | App s'ouvre |
| 3 | Vérifier l'écran d'accueil | Affichage correct |

### TM-02 — Navigation par onglets

**Couvre :** US-MOB-02

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Tap onglet "Projets" | Catalogue chargé |
| 2 | Tap "About" | Page About |
| 3 | Tap "Contact" | Page Contact avec mailto |
| 4 | Tap "Accueil" | Retour accueil |

### TM-03 — Catalogue projets affiche et défile

**Couvre :** US-MOB-03

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Aller sur onglet Projets | Liste chargée < 2s |
| 2 | Scroller vers le bas | Pagination/infinite charge |
| 3 | Images visibles | Pas de blank prolongé |

### TM-04 — Détail projet et partage

**Couvre :** US-MOB-04

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Tap sur un projet | Page détail s'ouvre |
| 2 | Tap "Partager" | Sheet de partage native |
| 3 | Tap "Voir sur GitHub" | Browser externe ouvre l'URL |

### TM-05 — Pull-to-refresh

**Couvre :** US-MOB-05

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Sur catalogue, swipe down | Indicateur de refresh |
| 2 | Attendre | Données rechargées |

### TM-06 — Contact mailto

**Couvre :** US-CT-01

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Tap "Envoyer un mail" | App mail native s'ouvre avec destinataire pré-rempli |

### TM-07 — APK généré via EAS Build

**Couvre :** US-MOB-01

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | `eas build -p android --profile preview` | APK téléchargeable |
| 2 | Installer sur device physique | App fonctionnelle |

---

## 6. Tests Sécurité (TS)

### TS-AUTH-01 — Tentative d'accès admin sans session

**Couvre :** US-AD-01, US-TR-02

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Sans cookie, `curl https://leonheu.fr/admin` | 307 redirect vers /login |
| 2 | Sans cookie, `curl https://leonheu.fr/api/admin/projects` | 401 |

### TS-AUTH-02 — Énumération comptes via message d'erreur

**Couvre :** US-AD-01

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Login avec email existant + mauvais mdp | Message générique |
| 2 | Login avec email inexistant | Même message |
| 3 | Timing : mesurer durée des 2 réponses | Différence < 50ms |

### TS-AUTH-03 — Rate limit login

**Couvre :** US-TR-03

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Bash script 6 POST /api/auth/login rapides | 6e = 429 + Retry-After |
| 2 | Attendre 16 min | Réessai accepté |

### TS-INPUT-01 — Injection SQL via paramètre URL

**Couvre :** US-PJ-01

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | `GET /api/projects?tag=' OR 1=1--` | 400 ou résultat normal (Prisma protège) |
| 2 | Pas d'erreur DB en log | Sécurisé via prepared statements |

### TS-INPUT-02 — XSS via contenu projet

**Couvre :** US-AD-04

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Admin crée projet avec `<script>alert(1)</script>` dans description | Sauvegardé tel quel en DB |
| 2 | Affichage public | Texte échappé, pas d'exécution JS |

### TS-INPUT-03 — Upload de fichier exécutable

**Couvre :** US-AD-06

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Admin upload `payload.exe` renommé `image.png` | Rejet 415 (validation magic bytes) |
| 2 | Upload PNG > 5 Mo | Rejet 413 |

### TS-INPUT-04 — Validation slug

**Couvre :** US-AD-04

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Admin crée projet avec slug `../../etc/passwd` | Rejet, sanitization |

### TS-HEADERS-01 — Headers sécurité présents

**Couvre :** US-TR-01

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | `curl -I https://leonheu.fr` | Headers HSTS, X-Frame-Options, X-Content-Type-Options, CSP présents |
| 2 | Mozilla Observatory scan | Grade B mini |

### TS-CORS-01 — CORS API

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Requête API depuis origin inconnue | CORS rejette (sauf API publique) |
| 2 | Requête depuis leonheu.fr | OK |

---

## 7. Tests E2E auto (TE)

Exécutés via Playwright en CI à chaque PR.

### TE-01 — Parcours visiteur Accueil → Projet → CV

```ts
test('parcours visiteur principal', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await page.click('text=Voir tous les projets');
  await expect(page).toHaveURL('/projets');
  await page.click('article >> nth=0');
  await expect(page.locator('h1')).toBeVisible();
});
```

### TE-02 — Dark mode persistance

```ts
test('dark mode persistant', async ({ page, context }) => {
  await page.goto('/');
  await page.click('[aria-label="Changer de thème"]');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
```

### TE-03 — Filtrage projets

```ts
test('filtrage projets par tag', async ({ page }) => {
  await page.goto('/projets');
  await page.click('text=React');
  await expect(page).toHaveURL(/tag=react/);
});
```

### TE-04 — Login admin

```ts
test('login admin et redirection', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'admin@leonheu.fr');
  await page.fill('[name=password]', process.env.TEST_ADMIN_PASSWORD!);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/admin');
});
```

### TE-05 — Accessibilité keyboard

```ts
test('navigation clavier', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
});
```

---

## 8. Tests Performance (TP)

Lighthouse CI configuré dans `lighthouserc.cjs` avec budgets bloquants.

### TP-01 — Accueil Lighthouse score ≥ 90

| Métrique | Seuil |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| TBT | < 200ms |

### TP-02 — Projets page Lighthouse score ≥ 85

Idem mais perf ≥ 85 (grille avec images).

### TP-03 — Détail projet Lighthouse ≥ 85

Idem.

### TP-04 — Mobile throttling 4G

Lighthouse mode mobile, throttling 4G simulé. Score ≥ 80.

---

## 9. Tests Non-régression (TNR)

Sous-ensemble rejoué à chaque PR vers `develop` ou `main`. Composé de :

| ID origine | Type | Justification |
|---|---|---|
| TU-VI-02, TU-PJ-01, TU-AD-01 à 03 | TU | Logique critique |
| TF-PJ-01 à 03, TF-AD-01 à 06, TF-AUTH-01 à 02 | TF | Endpoints critiques |
| TE-01 à 05 | TE | Parcours utilisateur principaux |
| TP-01 | TP | Garde-fou perf accueil |

Si une de ces suites échoue, la PR ne peut pas être mergée.

---

## 10. Tests Accessibilité (TS-A11Y)

### TS-A11Y-01 — Respect prefers-reduced-motion

**Couvre :** US-VI-06, US-TR-08

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Activer `Reduce motion` dans OS (Windows / macOS) | — |
| 2 | Recharger leonheu.fr | Animations désactivées |
| 3 | Naviguer entre pages | Transitions remplacées par fade simple |

### TS-A11Y-02 — Navigation clavier complète

**Couvre :** US-TR-08

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Tab sur Accueil | Focus visible sur logo, puis nav, puis CTA |
| 2 | Enter sur "Projets" | Navigation OK |
| 3 | Esc sur menu burger | Fermeture |

### TS-A11Y-03 — Lecteur d'écran NVDA

**Couvre :** US-TR-08

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Activer NVDA et naviguer Accueil | Annonce structure cohérente, landmarks |
| 2 | Hero | Titre H1 annoncé |
| 3 | Projets | Liste annoncée avec compteur |

### TS-A11Y-04 — Contraste AA validé via axe DevTools

| Étape | Action | Résultat attendu |
|---|---|---|
| 1 | Sur chaque page publique, run axe DevTools | 0 violation de contraste |

---

## 11. Suivi de la recette

### 11.1 Tableau de couverture

| Module | TU | TF | TF-WEB | TM | TS | TE | TP |
|---|---|---|---|---|---|---|---|
| Vitrine | TU-VI-01, 02 | — | TF-WEB-01, 06 | — | TS-A11Y-01 à 04 | TE-01, 02, 05 | TP-01 |
| Projets | TU-PJ-01, 02 | TF-PJ-01 à 04 | TF-WEB-03, 04, 05 | TM-03, 04, 05 | TS-INPUT-01 | TE-03 | TP-02, 03 |
| CV | — | — | TF-WEB-01 | — | — | — | — |
| Contact | — | — | TF-WEB-08 | TM-06 | — | — | — |
| Admin | TU-AD-01 à 03 | TF-AD-01 à 07 | TF-WEB-07 | — | TS-AUTH-01 à 03, TS-INPUT-02 à 04 | TE-04 | — |
| Mobile | — | — | — | TM-01 à 07 | — | — | TP-04 |
| Transverse | TU-AUTH-01 | TF-AUTH-01, 02 | — | — | TS-HEADERS-01, TS-CORS-01 | — | — |

### 11.2 Modèle de PV de recette

Voir `pv-recette.md`.
