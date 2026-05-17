#!/usr/bin/env bash
# Restauration Postgres (prod) depuis un dump gzip produit par pg_backup.sh.
# ATTENTION : écrase les données de la base cible. Tester sur staging d'abord.
#
# Usage : bash infra/scripts/pg_restore.sh infra/backups/leonportfolio-AAAAMMJJ-HHMMSS.sql.gz
set -euo pipefail

DUMP="${1:?usage: pg_restore.sh <dump.sql.gz>}"
[ -s "$DUMP" ] || { echo "[pg_restore] dump introuvable/vide : $DUMP" >&2; exit 1; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/infra/docker-compose.prod.yml}"
PG_USER="${POSTGRES_USER:-postgres}"
PG_DB="${POSTGRES_DB:-leonportfolio}"

echo "[pg_restore] restauration de $DUMP dans $PG_DB"
gunzip -c "$DUMP" | docker compose -f "$COMPOSE_FILE" exec -T postgres \
  psql -U "$PG_USER" -d "$PG_DB"

echo "[pg_restore] OK."
