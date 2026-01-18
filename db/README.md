# DB Migrations

This folder contains raw SQL migrations for local/dev.

Epic 1.5 minimal schema:

- db/migrations/0001_epic_1_5_minimal.sql

Apply manually using psql (example):
psql "$DATABASE_URL" -f db/migrations/0001_epic_1_5_minimal.sql
