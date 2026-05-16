# Déploiement staging — staging.leonheu.fr

> #6.11 / #6.12 — config livrée par Claude ; **provisioning VM + secrets +
> DNS = étapes Léon** (credentials/infra non automatisables).

## Architecture
VM Proxmox `portfolio-staging` (Debian 12) → Docker Compose
(`infra/docker-compose.staging.yml`) : `web` (image Next standalone) +
`postgres` + `caddy` (TLS auto Let's Encrypt). Reverse proxy
`staging.leonheu.fr`.

## 1. Provisionner la VM (Léon)
- VM Debian 12, Docker + Docker Compose installés
- `git clone` du repo dans `/opt/leon-portfolio`
- Créer `/opt/leon-portfolio/.env` (lu par compose) :
  ```
  POSTGRES_PASSWORD=...            # fort
  DATABASE_URL=postgresql://postgres:...@postgres:5432/leonportfolio
  AUTH_SECRET=...                  # npx auth secret
  GITHUB_TOKEN=...                 # PAT public_repo
  ADMIN_EMAIL=...  ADMIN_PASSWORD=...
  ```

## 2. DNS + TLS (#6.12, Léon, registrar OVH)
- Enregistrement DNS : `staging.leonheu.fr` → IP publique de la VM
  (A) ou CNAME selon l'infra
- Caddy obtient/renouvelle le certificat automatiquement (Let's Encrypt)
  au premier accès — rien à faire manuellement

## 3. Secrets GitHub (Léon, pour le CD auto)
Repo → Settings → Secrets → Actions :
- `STAGING_SSH_HOST`, `STAGING_SSH_USER`, `STAGING_SSH_KEY` (clé privée
  ed25519 dont la publique est `authorized_keys` sur la VM)

Tant que `STAGING_SSH_HOST` est absent, le workflow
`deploy-staging.yml` **no-op proprement** (pas d'échec CI).

## 4. Déploiement
- **Auto** : à chaque push `develop`, `deploy-staging.yml` se connecte en
  SSH, `git pull`, `docker compose ... up -d --build`, `prisma migrate deploy`
- **Manuel** (sur la VM) :
  ```bash
  cd /opt/leon-portfolio
  docker compose -f infra/docker-compose.staging.yml up -d --build
  docker compose -f infra/docker-compose.staging.yml exec web npx prisma migrate deploy
  docker compose -f infra/docker-compose.staging.yml exec web npx prisma db seed   # 1re fois
  ```

## 5. Vérification
- `https://staging.leonheu.fr` répond en HTTPS (cert valide)
- `/projets` liste les projets seedés ; `/admin` redirige vers `/login`
- En-têtes sécurité présents (cf. #6.1 / pentest #6.4)

## Statut
- #6.11 config (compose/Caddyfile/Dockerfile/workflow/doc) : ✅ livrée
- #6.12 DNS + provisioning VM + secrets : ⏳ **étape Léon** (issue ouverte)
