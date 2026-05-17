#!/usr/bin/env bash
# Sauvegarde quotidienne Postgres (prod). Dump gzip horodaté + rétention.
# Cron : voir Docs/claude/leon-portfolio/deploiement-prod.md
#
# Usage : bash infra/scripts/pg_backup.sh
# Variables (défauts adaptés à docker-compose.prod.yml) :
#   COMPOSE_FILE   infra/docker-compose.prod.yml
#   BACKUP_DIR     infra/backups
#   RETENTION_DAYS 14
#   POSTGRES_USER  postgres   POSTGRES_DB leonportfolio
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/infra/docker-compose.prod.yml}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/infra/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
PG_USER="${POSTGRES_USER:-postgres}"
PG_DB="${POSTGRES_DB:-leonportfolio}"

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/leonportfolio-$STAMP.sql.gz"

echo "[pg_backup] dump $PG_DB -> $OUT"
docker compose -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$PG_USER" "$PG_DB" | gzip > "$OUT"

# Échec silencieux d'un pipe masqué -> on vérifie la taille du dump.
if [ ! -s "$OUT" ]; then
  echo "[pg_backup] ERREUR : dump vide, suppression" >&2
  rm -f "$OUT"
  exit 1
fi

echo "[pg_backup] OK ($(du -h "$OUT" | cut -f1)). Rétention ${RETENTION_DAYS}j."
find "$BACKUP_DIR" -name 'leonportfolio-*.sql.gz' -type f \
  -mtime "+$RETENTION_DAYS" -print -delete
