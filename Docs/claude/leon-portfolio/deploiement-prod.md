# Déploiement production — leonheu.fr

Mise en production du portfolio via Docker Compose
(Next standalone + Postgres 16 + Caddy 2, TLS automatique).

> **Note** : ce document est **générique**. Les valeurs réelles
> (serveur, registrar, IP, e-mails, secrets) ne figurent **pas** dans ce
> dépôt public : elles vivent dans un kit de déploiement privé tenu **hors
> dépôt** par le mainteneur. Les étapes marquées 🔧 dépendent de l'hôte et
> ne sont pas automatisables depuis le repo. Le workflow `deploy-prod.yml`
> reste **gardé** (no-op propre tant que les secrets sont absents).

---

## 1. 🔧 Préparer le serveur cible

1. Un serveur Linux (VM ou machine dédiée), Docker + plugin Compose.
2. `git clone https://github.com/LeonHEU-cesi/leon-portfolio.git /opt/leon-portfolio`
3. Créer `/opt/leon-portfolio/infra/.env` (jamais commité — déjà dans
   `.gitignore`) à partir des variables ci-dessous :

   ```dotenv
   POSTGRES_USER=portfolio
   POSTGRES_PASSWORD=<secret>
   POSTGRES_DB=leonportfolio
   DATABASE_URL=postgresql://portfolio:<secret>@postgres:5432/leonportfolio
   AUTH_SECRET=<openssl rand -base64 32>
   ADMIN_EMAIL=<email-admin>
   ADMIN_PASSWORD=<secret>
   GITHUB_TOKEN=<optionnel>
   ACME_EMAIL=<email-pour-let-s-encrypt>
   ```

## 2. 🔧 DNS

Chez votre bureau d'enregistrement, faire pointer `leonheu.fr` et
`www.leonheu.fr` (enregistrements A) vers l'adresse publique du serveur.
Vérification : `dig +short leonheu.fr`.

## 3. TLS Let's Encrypt — automatique

Aucune action : **Caddy** (`infra/Caddyfile`) émet et renouvelle seul les
certificats dès que le DNS pointe sur le serveur et que les ports 80/443
sont joignables. L'e-mail ACME est lu depuis `ACME_EMAIL` (jamais en dur).

## 4. Premier déploiement

```bash
cd /opt/leon-portfolio
set -a && . infra/.env && set +a
docker compose -f infra/docker-compose.prod.yml up -d --build
docker compose -f infra/docker-compose.prod.yml exec -T web npx prisma migrate deploy
docker compose -f infra/docker-compose.prod.yml exec -T web npm run db:seed   # 1re fois
```

`https://leonheu.fr` doit répondre en HTTPS avec tous les modules.

## 5. CI/CD (#7.5)

`.github/workflows/deploy-prod.yml` se déclenche sur push `main` ou tag
`v*`. Configurer les **secrets GitHub Actions** : `PROD_SSH_HOST`,
`PROD_SSH_USER`, `PROD_SSH_KEY` (clé dédiée). Le workflow : backup → `git
pull` → `compose up --build` → `migrate deploy` → smoke. Sans ces secrets :
no-op explicite (CI non bloquée).

## 6. Backups Postgres (#7.8)

`infra/scripts/pg_backup.sh` : dump gzip horodaté, rétention 14 j. Cron
quotidien sur le serveur :

```cron
0 3 * * * cd /opt/leon-portfolio && /usr/bin/bash infra/scripts/pg_backup.sh >> /var/log/pg_backup.log 2>&1
```

Restauration (à tester avant clôture) :
`bash infra/scripts/pg_restore.sh infra/backups/leonportfolio-<horodatage>.sql.gz`

## 7. 🔧 Sauvegardes système

En complément des dumps SQL, prévoir une sauvegarde système périodique du
serveur selon les capacités de l'hébergeur (snapshots / images), pour une
restauration complète indépendante de l'application.

## 8. Rollback

```bash
cd /opt/leon-portfolio && git checkout <tag_precedent>
docker compose -f infra/docker-compose.prod.yml up -d --build
# données : bash infra/scripts/pg_restore.sh <dernier dump sain>
```

## 9. Smoke tests post-déploiement (#7.10)

```bash
cd web
SMOKE_BASE_URL=https://leonheu.fr npm run test:smoke
```
8 vérifications (TF-WEB-01..08) : pages publiques, API JSON, 404, en-têtes
de sécurité, garde `/admin`, spec OpenAPI. Exécuté aussi par `deploy-prod.yml`.

## 10. Storybook (#7.11, optionnel V1)

`cd web && npm run build-storybook` → `web/storybook-static/`. Servir via le
bloc commenté de `infra/Caddyfile` + une entrée DNS dédiée. Optionnel V1.

---

## Check-list mise en prod V1

- [ ] 🔧 Serveur prêt + `infra/.env` rempli
- [ ] 🔧 DNS `leonheu.fr` / `www` → serveur
- [ ] `compose up` + `migrate deploy` + seed initial
- [ ] HTTPS OK (cert Caddy émis), tous modules en ligne
- [ ] 🔧 Secrets `PROD_SSH_*` (CD automatique)
- [ ] Cron backup quotidien + **restauration testée**
- [ ] 🔧 Sauvegarde système périodique
- [ ] `npm run test:smoke` vert sur `https://leonheu.fr`
