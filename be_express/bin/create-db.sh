#!/bin/sh

export $(egrep -v '^#' .env | xargs) >/dev/null

echo $EXPRESS_TYPEORM_PGDATABASE

# create database if not exists
cmd="SELECT 'CREATE DATABASE $EXPRESS_TYPEORM_PGDATABASE' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$EXPRESS_TYPEORM_PGDATABASE')\gexec"

echo $cmd
echo $cmd | psql
