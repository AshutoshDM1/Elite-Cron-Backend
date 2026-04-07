#!/bin/bash

FILE=$1
CONTAINER=elitecron_postgres_db
DB=elite_cron
USER=elitedev

if [ -z "$FILE" ]; then
  echo "Usage: ./restore-db.sh backup.sql"
  exit 1
fi

cat $FILE | docker exec -i $CONTAINER psql -U $USER -d $DB

echo "Restore completed"