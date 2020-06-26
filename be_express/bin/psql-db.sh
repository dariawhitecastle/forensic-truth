#!/bin/sh

export $(egrep -v '^#' .env | xargs) >/dev/null

psql $EXPRESS_TYPEORM_PGDATABASE
