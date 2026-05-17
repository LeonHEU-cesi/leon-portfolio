# Guide d'installation — leon-portfolio

**Projet :** leon-portfolio
**Auteur :** HEU Léon
**Version :** 1.0 — Procédure dev local + déploiement prod (générique)

---

## 1. Pré-requis

### 1.1 Outils (toutes plateformes)

| Outil | Version mini | Vérification |
|---|---|---|
| Node.js | 20.x LTS | `node -v` |
| npm | 10.x | `npm -v` |
| Docker | 24.x | `docker --version` |
| Docker Compose | v2.x (plugin) | `docker compose version` |
| Git | 2.40+ | `git --version` |
| gh CLI (optionnel) | 2.40+ | `gh --version` |
| PowerShell (Windows) | 7.x recommandé | `pwsh --version` |

### 1.2 Comptes / accès

- Compte GitHub avec accès au repo `<username>/leon-portfolio`
- Token GitHub PAT lecture publique pour l'API GitHub (cf. `.env.example`)
- (Prod) Accès SSH au serveur cible

---

## 2. Installation dev local

### 2.1 Cloner le repo

```bash
git clone https://github.com/<username>/leon-portfolio.git
cd leon-portfolio
```

### 2.2 Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/leonportfolio"
AUTH_SECRET="<générer avec: npx auth secret>"
AUTH_TRUST_HOST="true"
GITHUB_TOKEN="ghp_..."
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="motdepasse_temporaire_a_changer"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 2.3 Lancer la stack DB

```bash
docker compose -f infra/docker-compose.dev.yml up -d
```

Vérifier que Postgres répond : `docker compose -f infra/docker-compose.dev.yml ps`

### 2.4 Installer les dépendances Web

```bash
cd web
npm install
```

### 2.5 Initialiser la base de données

```bash
# Depuis web/
npx prisma migrate dev
npx prisma db seed
```

Le seed crée :
- 1 admin avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- 8 tags
- 3 projets exemples
- 1 article draft

### 2.6 Lancer le serveur Next.js

```bash
npm run dev
```

Accéder à :
- Site : http://localhost:3000
- Back-office : http://localhost:3000/login
- API docs : http://localhost:3000/api/docs
- Adminer (Postgres GUI) : http://localhost:8080 (système `postgres`, serveur `postgres`, user `postgres`, mdp `postgres`, base `leonportfolio`)

### 2.7 Installer et lancer Storybook (optionnel)

```bash
# Depuis web/
npm run storybook
```

Accès : http://localhost:6006

### 2.8 Installer et lancer le mobile (optionnel)

```bash
cd ../mobile
npm install
cp .env.example .env
# Éditer EXPO_PUBLIC_API_URL=http://<IP-LAN-PC>:3000
npx expo start
```

Scanner le QR code avec Expo Go (Android/iOS).

**Astuce Windows** : pour obtenir l'IP LAN : `ipconfig` (carte Ethernet ou Wi-Fi, ex `192.168.1.42`).

---

## 3. Lancer les tests

### 3.1 Tests unitaires + fonctionnels API

```bash
# Depuis web/
npm test                  # Vitest watch
npm run test:run          # Vitest one-shot
```

### 3.2 Tests E2E Playwright

```bash
# Depuis web/, avec dev server lancé
npx playwright install   # 1ère fois
npm run test:e2e
```

### 3.3 Lighthouse CI

```bash
# Depuis web/, avec dev server lancé
npm run lhci
```

### 3.4 Tests mobile

```bash
# Depuis mobile/
npm test
```

---

## 4. Build de production

### 4.1 Build Next.js standalone

```bash
# Depuis web/
npm run build
```

Le build produit `web/.next/standalone/` consommable par l'image Docker.

### 4.2 Build image Docker

```bash
# Depuis racine
docker build -t ghcr.io/<username>/leon-portfolio-web:latest -f web/Dockerfile .
```

### 4.3 Build APK mobile

```bash
# Depuis mobile/
eas login                          # 1ère fois
eas build:configure                # 1ère fois
eas build -p android --profile preview
```

Le build cloud renvoie un lien de téléchargement APK.

---

## 5. Déploiement

> Procédure **générique**. Les détails opérationnels réels (serveur,
> registrar, IP, secrets) ne sont **pas** dans ce dépôt public : voir le
> kit de déploiement privé tenu hors dépôt. Référence complète :
> [`deploiement-prod.md`](./deploiement-prod.md).

### 5.1 Pré-requis serveur

- Serveur Linux : Docker + plugin Compose
- Ports 80/443 joignables depuis Internet
- DNS `leonheu.fr` / `www` (+ `staging`) → adresse publique du serveur
- Clé SSH dédiée au déploiement (secrets GitHub `PROD_SSH_*`)

### 5.2 Démarrage initial

```bash
cd /opt/leon-portfolio
set -a && . infra/.env && set +a   # infra/.env hors versionnement
docker compose -f infra/docker-compose.prod.yml up -d --build
docker compose -f infra/docker-compose.prod.yml exec -T web npx prisma migrate deploy
docker compose -f infra/docker-compose.prod.yml exec -T web npm run db:seed   # 1re fois
```

### 5.3 Vérification HTTPS

```bash
curl -I https://leonheu.fr   # 200 + strict-transport-security
cd web && SMOKE_BASE_URL=https://leonheu.fr npm run test:smoke
```

### 5.4 Backups + sauvegarde système

- `infra/scripts/pg_backup.sh` en cron quotidien (dump gzip, rétention 14 j)
- Restauration : `infra/scripts/pg_restore.sh <dump>`
- Sauvegarde système périodique du serveur selon l'hébergeur (étape mainteneur)

---

## 6. Mise à jour (CD auto)

- Push `develop` → `deploy-staging.yml` (SSH, `git pull`, `compose up -d
  --build`, `migrate deploy`) — staging
- Push `main` / tag `v*` → `deploy-prod.yml` (backup → pull → up → migrate
  → smoke) — prod

Les deux workflows sont **gardés** : no-op propre tant que les secrets
`*_SSH_*` sont absents (non requis par la branch protection).

### 6.3 Rollback manuel

```bash
ssh root@<vm-prod>
cd /opt/leon-portfolio
# Lister les versions disponibles
docker images | grep leon-portfolio-web
# Modifier docker-compose.yml ligne `image:` avec tag précédent
docker compose up -d
```

---

## 7. Troubleshooting

### Problème : `Module not found: Can't resolve 'sharp'` au build

**Cause** : Sharp est natif et nécessite des bins compilés pour la plateforme cible (Linux Alpine ≠ Windows).

**Solution** :
```bash
cd web
npm rebuild sharp
# Ou dans Dockerfile, installer avec --include=optional
```

### Problème : Postgres `password authentication failed`

**Cause** : Mismatch entre `POSTGRES_PASSWORD` du compose et `DATABASE_URL` du `.env`.

**Solution** : aligner les deux valeurs, puis `docker compose down -v` (⚠ efface le volume) + `up -d`.

### Problème : Expo ne se connecte pas à l'API depuis l'émulateur Android

**Cause** : `localhost` dans l'émulateur Android pointe sur l'émulateur lui-même, pas le host.

**Solution** :
- Emulator Android : utiliser `http://10.0.2.2:3000` (alias du host)
- Device physique : utiliser `http://<IP-LAN-PC>:3000` (et autoriser le pare-feu Windows port 3000)
- Sinon `npx expo start --tunnel`

### Problème : Caddy TLS échoue (rate limit Let's Encrypt)

**Cause** : Trop de demandes de certificat échouées.

**Solution** : attendre 1h ou utiliser le serveur staging de Let's Encrypt en attendant (`acme_ca https://acme-staging-v02.api.letsencrypt.org/directory` dans Caddyfile).

### Problème : Prisma `P1001` connection refused

**Cause** : DB pas encore prête au démarrage de la web app.

**Solution** : `depends_on` + healthcheck Postgres dans docker-compose.yml, et `wait-for-it.sh` au démarrage de l'image web.

### Problème : Hot reload Next.js bloqué sur Windows + WSL

**Cause** : événements de fichiers mal propagés entre WSL et NTFS.

**Solution** : déplacer le repo dans le filesystem WSL (`~/projects/leon-portfolio`), pas dans `/mnt/c/`.

### Problème : Lighthouse CI échoue en CI mais passe en local

**Cause** : runner GitHub plus lent → LCP > 2.5s.

**Solution** : configurer `lighthouserc.cjs` avec `chromeFlags: ['--no-sandbox']` et budgets adaptés CI (LCP < 3s par ex.).

### Problème : `Auth.js` → erreur `Configuration` (build / E2E)

**Cause** : `AUTH_SECRET` absent. Auth.js v5 exige le secret même hors
session réelle (parcours login/garde admin).

**Solution** : définir `AUTH_SECRET` (`npx auth secret`) en local ; en CI
le job E2E fournit un secret factice (`env.AUTH_SECRET`). `npm run build`
sans secret échoue de façon non déterministe — toujours l'exporter avant
`build`/`test:e2e`.

### Problème : Prisma `P1001` / migration baseline déjà appliquée

**Cause** : base existante sans table `_prisma_migrations`, ou DB injoignable.

**Solution** :
- DB déjà créée : `npx prisma migrate resolve --applied 20260516000000_init`
- Sinon : `docker compose -f infra/docker-compose.dev.yml up -d` puis
  `npx prisma migrate deploy && npx prisma db seed`
- `next build` **sans** base fonctionne (import Prisma paresseux +
  fallback mock) — c'est volontaire, pas une erreur.

### Problème : scripts `infra/scripts/*.sh` cassés sur le serveur Linux

**Cause** : conversion CRLF (Windows) → shebang `#!/usr/bin/env bash\r`.

**Solution** : `.gitattributes` force déjà `*.sh` en LF. Si un script a
été altéré : `git add --renormalize . && dos2unix infra/scripts/*.sh`.

### Problème : Sécurité — secret commit par erreur

**Cause** : `.env` commit dans un commit feature.

**Solution** :
1. Stop tout pousser
2. `git filter-repo --path .env --invert-paths` pour réécrire l'historique
3. Force-push (uniquement si pas encore mergé sur develop)
4. Rotation immédiate des secrets exposés
5. Ajouter `.env` à `.gitignore` (déjà fait, mais double-check)

---

## 8. Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@example.com` (ou `ADMIN_EMAIL`) | `ADMIN_PASSWORD` (à changer en prod) |

⚠ En prod, changer `ADMIN_PASSWORD` au premier login (V2 ajout d'une UI de changement, V1 = via script Prisma direct).

---

## 9. Liens utiles

- Production : https://leonheu.fr
- API docs (OpenAPI / Scalar) : https://leonheu.fr/api/docs
- API publique : https://leonheu.fr/api/projects
- Dépôt : https://github.com/LeonHEU-cesi/leon-portfolio
- Releases : https://github.com/LeonHEU-cesi/leon-portfolio/releases
- Déploiement (générique) : `Docs/claude/leon-portfolio/deploiement-prod.md`
