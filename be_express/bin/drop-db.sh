#!/bin/sh

export $(egrep -v '^#' .env | xargs) >/dev/null

# drop database if exists
cmd="SELECT 'DROP DATABASE $EXPRESS_TYPEORM_PGDATABASE' WHERE EXISTS (SELECT FROM pg_database WHERE datname = '$EXPRESS_TYPEORM_PGDATABASE')\gexec"

echo $cmd
echo $cmd | psql
