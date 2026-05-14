# leon-portfolio

> Portfolio personnel dynamique et animé de HEU Léon.
> Stack : Next.js 15 + TypeScript + Tailwind v4 + Prisma + PostgreSQL + Expo SDK 54.

🌐 **Production** : [leonheu.fr](https://leonheu.fr) (à venir, Sprint 7)
📱 **Mobile** : APK via EAS Build (Sprint 5)
📚 **Documentation** : voir le bundle dans [`Docs/claude/leon-portfolio/`](./Docs/claude/leon-portfolio/)

---

## Structure monorepo

```
leon-portfolio/
├── web/              Next.js 15 full-stack (front public + admin + API)
├── mobile/           App Expo SDK 54 (catalogue projets en lecture)
├── infra/            docker-compose, Caddyfile, scripts ops
├── tests/            Cahier de tests, procédures, PV recette
├── Docs/             Documentation projet (technique + organisationnelle)
│   └── claude/leon-portfolio/   ← 11 documents projet
├── .github/          Workflows CI/CD + templates issues/PR
├── .vscode/          Réglages IDE + extensions recommandées
└── ...
```

---

## Installation rapide (dev local)

Pré-requis : Node 20+, Docker 24+, Git.

```bash
git clone https://github.com/LeonHEU-cesi/leon-portfolio.git
cd leon-portfolio
cp .env.example .env
# Éditer .env (AUTH_SECRET via npx auth secret, GITHUB_TOKEN, ADMIN_PASSWORD)

# Lancer Postgres en local
docker compose -f infra/docker-compose.dev.yml up -d

# Installer + migrer + seed
cd web
npm install
npx prisma migrate dev
npx prisma db seed

# Lancer le dev server
npm run dev
```

Accès :
- Site : http://localhost:3000
- Admin : http://localhost:3000/login (identifiants `.env`)
- Adminer : http://localhost:8080
- Storybook : `npm run storybook` (port 6006)

Guide détaillé : [`Docs/claude/leon-portfolio/installation.md`](./Docs/claude/leon-portfolio/installation.md)

---

## Tests

```bash
cd web
npm test              # Vitest watch
npm run test:run      # Vitest one-shot
npm run test:e2e      # Playwright
npm run lhci          # Lighthouse CI
```

Cahier complet : [`Docs/claude/leon-portfolio/Cahier_de_tests.md`](./Docs/claude/leon-portfolio/Cahier_de_tests.md)

---

## Documentation

| Document | Contenu |
|---|---|
| [`Plan_developpement.md`](./Docs/claude/leon-portfolio/Plan_developpement.md) | Périmètre, stack, monorepo, GitHub setup |
| [`Planning_Scrum.md`](./Docs/claude/leon-portfolio/Planning_Scrum.md) | 8 sprints, ~92 issues, gantt, risques |
| [`User_stories.md`](./Docs/claude/leon-portfolio/User_stories.md) | 35 US avec critères + traçabilité |
| [`Cahier_de_tests.md`](./Docs/claude/leon-portfolio/Cahier_de_tests.md) | 60+ cas TU/TF/TF-WEB/TM/TS/TE/TP |
| [`mld.md`](./Docs/claude/leon-portfolio/mld.md) | Modèle Logique de Données (DBML + Prisma + DDL) |
| [`comparatif-techniques.md`](./Docs/claude/leon-portfolio/comparatif-techniques.md) | 3 archis × 5 critères pondérés |
| [`pertinence-solution.md`](./Docs/claude/leon-portfolio/pertinence-solution.md) | Argumentation choix Next.js full-stack |
| [`installation.md`](./Docs/claude/leon-portfolio/installation.md) | Guide dev local + prod Proxmox |
| [`procedure-validation.md`](./Docs/claude/leon-portfolio/procedure-validation.md) | 6 jalons de recette |
| [`pv-recette.md`](./Docs/claude/leon-portfolio/pv-recette.md) | Modèle vierge |
| [`dossier_final.md`](./Docs/claude/leon-portfolio/dossier_final.md) | Dossier projet 12 sections |

---

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | valeur de `ADMIN_EMAIL` dans `.env` | valeur de `ADMIN_PASSWORD` |

⚠ En prod, changer `ADMIN_PASSWORD` immédiatement.

---

## Workflow Git

- **Default branch** : `develop`
- **Branches feature** : `feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`
- **Convention de commit** : [Conventional Commits](https://www.conventionalcommits.org/) avec scope explicite
  ```
  feat(web): hero animé GSAP avec ScrollTrigger
  feat(api): endpoint GET /api/projects avec filtres
  feat(mobile): écran catalogue projets virtualisé
  test(api): tests Feature route /api/projects
  docs: MAJ MLD avec DDL Postgres
  chore(ci): job lighthouse en parallèle
  ```
- **PR récap** `develop → main` à chaque fin de sprint avec changelog complet
- **Auto-delete branches** activé sur le repo

---

## CI/CD

- **CI** : GitHub Actions (3 jobs parallèles : web-tests / web-e2e-lighthouse / mobile-checks)
- **CD staging** : auto sur merge `develop` → VM staging Proxmox
- **CD prod** : auto sur merge `main` → VM prod Proxmox

---

## Licence

UNLICENSED — projet personnel non distribué.

Le code source reste consultable à des fins d'évaluation par recruteurs. Toute réutilisation requiert l'autorisation explicite de HEU Léon.
