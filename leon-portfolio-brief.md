# Brief projet — leon-portfolio

> Synthèse des décisions prises lors du cadrage initial.
> Ce fichier sert de référence unique pour tous les documents générés et les sprints suivants.

---

## 🟦 1. Le projet

| Élément | Décision |
|---|---|
| Nom | `leon-portfolio` |
| Pitch | Portfolio personnel dynamique et animé regroupant les projets perso de HEU Léon |
| Contexte | Side project perso |
| Objectifs | (1) Vitrine recruteurs / freelance, (2) Démo compétences techniques (anim, perf, a11y), (3) Hub GitHub centralisé, (4) Blog technique (V2) |
| Référence externe | Carte blanche — 3 directions visuelles seront proposées au sprint Design |
| Domaine de prod | `leonheu.fr` (registrar) |

---

## 🟩 2. Les utilisateurs

| Acteur | Droits | Plateformes |
|---|---|---|
| Visiteur public | Lecture seule (pages publiques, projets, CV, About, contact mailto:) | Web + Mobile |
| Admin (HEU Léon) | Login email/mdp, CRUD projets et articles, gestion catégories/tags | Web uniquement |

- **Cible principale** : recruteurs tech francophones (RH, CTO, lead dev)
- **Langue** : Français uniquement (FR)
- **Accessibilité** : WCAG AA + respect strict de `prefers-reduced-motion`

---

## 🟨 3. Les fonctionnalités

### Pages publiques (Web)
- Accueil — Hero animé, présentation rapide, accroche
- Projets — Grille filtrable, fiches détail
- CV / Parcours — Timeline expériences, formations, compétences, CV PDF téléchargeable
- About / Persona — Bio narrative, valeurs, photos
- Contact — Lien mailto: direct + réseaux sociaux

### Features techniques (démos de compétence)
- Animations avancées (GSAP scroll-driven + Framer Motion transitions)
- Dark mode persistant (cookie + classes Tailwind)
- Recherche client-side sur projets et articles
- Intégration GitHub API (repos publics, stars, langages — cache ISR)

### Back-office admin (Web)
- Login email/mdp avec bcrypt + session HTTP-only
- CRUD projets (titre, description, stack, repo, démo, image, tags)
- CRUD articles (titre, slug, contenu MDX, tags, statut publié/brouillon) — page publique livrée en V2
- CRUD catégories / tags

### Mobile (Expo)
- Application compagnon consommant la même API Next.js
- Catalogue projets (FlatList, filtres, détail)
- Vue About / Contact
- Authentification réservée (le mobile ne sert qu'à la consultation publique pour V1)

### Hors périmètre V1
- Newsletter / mailing list
- Commentaires sur articles
- Analytics avancés (Plausible, Umami, GA)
- i18n / version anglaise
- Tracker d'événements, dashboard admin avancé
- Blog public (admin et structure en V1, publication en V2)

---

## 🟧 4. La technique

### Stack imposée

| Couche | Technologie | Version cible | Justification courte |
|---|---|---|---|
| Framework web | Next.js | 15.x (App Router) | RSC, Server Actions, ISR, SEO natif |
| Langage | TypeScript | 5.x strict | Type-safety end-to-end |
| Styling | Tailwind CSS | v4 | Mobile First, zero-runtime, JIT |
| Composants UI | shadcn/ui + Radix UI | latest | Accessibles, customisables, copy-paste |
| Animations web | GSAP + Framer Motion | latest | Scroll-driven (GSAP) + transitions de page (FM) |
| Forms | React Hook Form + Zod | latest | Validation typée client + serveur |
| ORM | Prisma | 5.x | Migrations propres, type-safe queries |
| Base de données | PostgreSQL | 16 | Standard pro, JSONB, full-text search |
| Auth | Auth.js (NextAuth v5) | 5.x beta | Credentials provider + sessions cookie + JWT mobile |
| Hash mdp | bcrypt | latest | Standard, salt par défaut |
| API mobile | Next.js Route Handlers | (cf. ci-dessus) | API REST documentée OpenAPI |
| Mobile | Expo SDK | 54+ / RN 0.81 | Build EAS, Expo Go dev, expo-router |
| Animations mobile | React Native Reanimated | 3.x | Animations 60fps natives |
| HTTP client mobile | axios + TanStack Query | latest | Cache + retry + invalidation |
| Stockage token mobile | expo-secure-store | latest | Keychain iOS / EncryptedSharedPreferences Android |
| Design System | Storybook | 8.x | Composants documentés + tests visuels |
| Documentation API | zod-to-openapi + Scalar | latest | OpenAPI 3.1 généré depuis schémas Zod |
| Tests unitaires | Vitest | latest | Rapide, compatible TS |
| Tests E2E | Playwright | latest | Browser réel, parallèle, screenshots |
| Tests perf | Lighthouse CI | latest | Budgets bloquants en CI |
| CI/CD | GitHub Actions | — | 3 jobs : api+web / mobile / docs |
| Conteneurisation | Docker Compose | latest | Prod self-hosted + dev local |
| Reverse proxy prod | Caddy | latest | TLS auto Let's Encrypt, config minimale |
| Hébergement prod | VM auto-hébergée (perso) | — | VM Debian + Docker stack |
| Build mobile | EAS Build | — | Free tier (limité) suffit pour APK demo |

### Architecture

- **Monorepo** : `web/` (Next.js full-stack) + `mobile/` (Expo) + `docs/` + `tests/`
- **API REST** documentée OpenAPI 3.1, consommée par mobile via axios + JWT
- **Mobile First CSS** (Tailwind, breakpoints `sm/md/lg/xl/2xl`)
- **SEO** : metadata App Router, sitemap.xml, robots.txt, OG images dynamiques `/api/og`, JSON-LD `Person` + `BreadcrumbList`
- **MVC** non strict (Next.js + Prisma ne suit pas MVC classique — on documentera ça dans le comparatif)

---

## 🟪 5. Les contraintes

| Contrainte | Décision |
|---|---|
| Délai | 5+ sprints d'1 semaine (≈ 5 sem mini, probablement 6-8 sem proprement vu le scope tests/CI) |
| Cadence | Sprint 1 semaine compressée |
| Budget | 0 € (hors domaine (registrar) ~10 €/an, free tiers, serveur perso) |
| RGPD | Pas d'enjeu visiteur (mailto: au lieu de form, pas de cookies, pas de tracking, page mentions légales basique éditeur+hébergeur) |
| Sécurité | HTTPS+HSTS, rate limiting (login admin + API contact), bcrypt, session sécurisée, pentest OWASP manuel avant prod |
| Accessibilité | WCAG AA + `prefers-reduced-motion` honoré |
| Compatibilité | Evergreen (Chrome/Edge/Firefox/Safari -2 ans) + iOS 16+ + Android 11+ |

---

## 🟫 6. Tests et CI

### Types de tests

| Type | ID | Outil | Périmètre |
|---|---|---|---|
| Unitaires | TU-* | Vitest | Logique métier, utils, hooks, helpers serveur |
| Fonctionnels API | TF-* | Vitest + Prisma test DB (Postgres testcontainer) | Routes API, auth, CRUD admin, GitHub API |
| Fonctionnels Web (manuel) | TF-WEB-* | Cahier de tests | Parcours visiteur, dark mode, animations, responsive |
| Mobile (manuel) | TM-* | Cahier de tests + Expo Go device | Écrans, nav, perf, OS |
| Non-régression | TNR-* | GitHub Actions | Sous-ensemble TU+TF rejoués à chaque PR |
| Sécurité | TS-* | Manuel + scripts | Auth bypass, rate limit, XSS, injection, headers |
| E2E auto | TE-* | Playwright | Parcours visiteur critiques en CI |
| Performance | TP-* | Lighthouse CI | Budgets perf bloquants en CI |

### CI/CD

- **CI** : GitHub Actions, 3 jobs parallèles (api+web / mobile / docs+lighthouse)
- **CD staging** : auto sur merge `develop` → image Docker pull sur VM staging auto-hébergée
- **CD prod** : auto sur merge `main` → image Docker pull sur VM prod auto-hébergée

---

## ⬜ 7. Évaluation

**Non applicable** — side project perso, pas de jury, pas de PV de recette client, pas de soutenance.
On garde quand même la procédure de validation interne (recette personnelle avant mise en ligne) et un modèle vierge de PV (utile si le portfolio sert un jour à un client freelance).

---

## 🔧 8. Mode de travail

| Paramètre | Décision |
|---|---|
| Niveau d'autonomie | **Auto** — review en bloc en fin d'issue |
| Langue | FR pour docs, JOURNAL, commits, commentaires. Code en EN (variables, fonctions, fichiers). |
| Récap sprint | Oui — `Docs/claude/Sprint docs/sprintN-titre.md` à chaque fin de sprint |
| Signature IA | **Aucune** dans repo, commits, PRs (pas de Co-Authored-By, pas d'emoji robot) |
| Fichiers IA dans repo | **Interdits** — pas de CLAUDE.md, AGENTS.md, .cursor*, .aiderrules. À supprimer même si générés par un scaffold. |
| JOURNAL | Sans date, format H2 Sprint / H3 Issue, séparateur `---` entre issues |
| PR récap | `develop` → `main` à chaque fin de sprint avec changelog complet |

---

## 🚀 9. GitHub et environnement

| Paramètre | Décision |
|---|---|
| Init | From scratch dans `E:\Project_dev\Projet perso\Portfolio\` |
| Setup GitHub | Full — repo + issues pré-créées + labels + milestones + Project Board v2 + workflows CI |
| Default branch | `develop` (pas `main`) |
| Auto-delete branches | Activé sur le repo |
| Compte GitHub | Personnel (username à confirmer au moment du bootstrap, supposé `leonheu` à valider) |
| IDE | VS Code — `.vscode/settings.json` + extensions recommandées |
| OS de dev | Windows 11 — PowerShell |

---

## 📌 Hypothèses faites (à valider ou contester)

1. **Stack auth** : Auth.js v5 credentials + bcrypt. Session cookie côté web + JWT secondaire (court TTL) pour mobile. Alternative : auth maison plus légère mais moins outillée.
2. **Reverse proxy** : Caddy retenu vs Traefik pour la simplicité de config TLS automatique. Traefik possible si tu veux du dashboard intégré.
3. **CMS pour articles** : Markdown/MDX stocké en BDD (champ `content` TEXT) + rendu côté serveur. Pas de CMS headless externe (Sanity, Strapi) pour rester self-hosted.
4. **Storage images** : volume Docker monté sur VM auto-hébergée, pas de S3/Cloudinary (budget 0 €). Backup via rsync sur autre disque.
5. **GitHub API** : appels côté serveur Next.js avec cache ISR (revalidate toutes les 24h) pour éviter rate limit. Token PAT lecture publique en variable env.
6. **Périmètre mobile V1** : consultation uniquement (catalogue projets + About + Contact). Pas d'auth, pas d'admin. Si tu veux l'auth mobile en V1, +1 sprint.
7. **Délai initial 2-3 jours** : abandonné. Estimation honnête revue à **6-8 sprints d'1 semaine** vu la qualité demandée (Storybook, OpenAPI, Lighthouse CI, E2E, pentest, mobile).
8. **Dossier final** : 10-15 pages (pas de jury à convaincre, juste un guide projet + manuel utilisateur + post-mortem).

---

## ✅ Validation

Brief validé le **2026-05-14** par HEU Léon.

Prochaines étapes (dans l'ordre) :
1. Génération du bundle de docs dans `Docs/claude/leon-portfolio/`
2. Proposition du plan de sprints détaillé → **attente validation explicite**
3. Bootstrap repo Git local + GitHub
4. Setup GitHub (issues, milestones, labels, Project Board)
5. Initialisation mémoire persistante
6. Démarrage Sprint 0 si feu vert
