#!/usr/bin/env bash
set -euo pipefail

# Creates a timestamped PostgreSQL dump file locally.
# Uploading is handled separately by database-upload-r2.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ENV_FILE="${ENV_FILE:-"$ROOT_DIR/.env"}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

CONTAINER_NAME="${POSTGRES_CONTAINER_NAME:-elitecron_postgres_db}"
DB_NAME="${POSTGRES_DB:?POSTGRES_DB is required (set in .env)}"
DB_USER="${POSTGRES_USER:?POSTGRES_USER is required (set in .env)}"

BACKUP_DIR="${BACKUP_DIR:-"$ROOT_DIR/database-backups"}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

TIMESTAMP="$(date +%F-%H-%M-%S)"
OUT_FILE="${OUT_FILE:-"$BACKUP_DIR/backup-$DB_NAME-$TIMESTAMP.sql"}"

mkdir -p "$BACKUP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required on this machine."
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "Postgres container not running: $CONTAINER_NAME"
  echo "Tip: docker compose up -d postgres"
  exit 1
fi

echo "Creating backup: $OUT_FILE"
docker exec -i "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" >"$OUT_FILE"
echo "Backup complete."

if [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]] && [[ "$RETENTION_DAYS" -gt 0 ]]; then
  find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -name "*.sql" -delete
fi