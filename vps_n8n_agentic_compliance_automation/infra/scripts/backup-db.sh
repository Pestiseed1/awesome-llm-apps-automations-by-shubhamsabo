#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-/var/backups/compliance}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

docker exec compliance-postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$BACKUP_DIR/compliance_${TIMESTAMP}.sql"
find "$BACKUP_DIR" -name '*.sql' -mtime +14 -delete

echo "Backup complete: $BACKUP_DIR/compliance_${TIMESTAMP}.sql"
