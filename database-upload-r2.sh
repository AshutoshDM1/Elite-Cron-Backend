#!/usr/bin/env bash
set -euo pipefail

# Uploads an existing DB backup file to Cloudflare R2 (S3-compatible).
# This script does NOT create a backup; use database-backup.sh for dumping.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ENV_FILE="${ENV_FILE:-"$ROOT_DIR/.env"}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

R2_BUCKET="${R2_BUCKET:?R2_BUCKET is required}"
R2_ENDPOINT="${R2_ENDPOINT:?R2_ENDPOINT is required}"
R2_PREFIX="${R2_PREFIX:-db-backups}"

BACKUP_DIR="${BACKUP_DIR:-"$ROOT_DIR/backups"}"

FILE="${1:-}"
if [[ -z "$FILE" ]]; then
  FILE="$(ls -1t "$BACKUP_DIR"/*.sql 2>/dev/null | head -n 1 || true)"
fi

if [[ -z "$FILE" || ! -f "$FILE" ]]; then
  echo "Backup file not found."
  echo "Usage: ./database-upload-r2.sh /path/to/backup.sql"
  echo "Or place dumps in: $BACKUP_DIR"
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required (for R2 upload)."
  exit 1
fi

BASENAME="$(basename "$FILE")"
DEST="s3://$R2_BUCKET/$R2_PREFIX/$BASENAME"

echo "Uploading $FILE -> $DEST"
aws s3 cp "$FILE" "$DEST" --endpoint-url="$R2_ENDPOINT"
echo "Upload complete."