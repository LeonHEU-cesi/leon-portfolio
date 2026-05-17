# Déploiement staging — staging.leonheu.fr

> Config livrée (#6.11). **Provisioning serveur + secrets + DNS = étapes
> mainteneur** (non automatisables). Document **générique** : aucune valeur
> d'infra réelle dans ce dépôt public (kit privé tenu hors dépôt).

## Architecture
Serveur Linux → Docker Compose (`infra/docker-compose.staging.yml`) :
`web` (Next standalone) + `postgres` + `caddy` (TLS auto Let's Encrypt),
reverse proxy `staging.leonheu.fr`.

## 1. Préparer le serveur
- Serveur Linux, Docker + plugin Compose
- `git clone` du repo dans `/opt/leon-portfolio`
- Créer `/opt/leon-portfolio/infra/.env` (jamais commité) :
  ```dotenv
  POSTGRES_PASSWORD=<secret>
  DATABASE_URL=postgresql://postgres:<secret>@postgres:5432/leonportfolio
  AUTH_SECRET=<openssl rand -base64 32>
  GITHUB_TOKEN=<optionnel>
  ADMIN_EMAIL=<email-admin>   ADMIN_PASSWORD=<secret>
  ACME_EMAIL=<email-let-s-encrypt>
  ```

## 2. DNS + TLS
- `staging.leonheu.fr` → adresse publique du serveur (chez votre bureau
  d'enregistrement)
- Caddy obtient/renouvelle le certificat automatiquement (Let's Encrypt)

## 3. Secrets GitHub (CD auto)
Repo → Settings → Secrets → Actions : `STAGING_SSH_HOST`,
`STAGING_SSH_USER`, `STAGING_SSH_KEY` (clé ed25519 dédiée). Tant que
`STAGING_SSH_HOST` est absent, `deploy-staging.yml` **no-op proprement**.

## 4. Déploiement
- **Auto** : push `develop` → `deploy-staging.yml` (SSH, `git pull`,
  `compose up -d --build`, `prisma migrate deploy`)
- **Manuel** :
  ```bash
  cd /opt/leon-portfolio
  docker compose -f infra/docker-compose.staging.yml up -d --build
  docker compose -f infra/docker-compose.staging.yml exec web npx prisma migrate deploy
  docker compose -f infra/docker-compose.staging.yml exec web npx prisma db seed   # 1re fois
  ```

## 5. Vérification
- `https://staging.leonheu.fr` répond en HTTPS (cert valide)
- `/projets` liste les projets seedés ; `/admin` redirige vers `/login`
- En-têtes de sécurité présents (cf. #6.1 / pentest #6.4)

## Statut
- #6.11 config (compose/Caddyfile/Dockerfile/workflow/doc) : ✅ livrée
- #6.12 DNS + provisioning serveur + secrets : ⏳ **étape mainteneur**
