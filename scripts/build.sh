#!/bin/bash
set -e

# Set dummy DATABASE_URL for prisma generate (schema validation only)
export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

# Generate Prisma Client
npx prisma generate

# Unset dummy URL so migrations use real DATABASE_URL from Vercel env vars
unset DATABASE_URL

# Run migrations with real DATABASE_URL (from Vercel env vars)
npx prisma migrate deploy

# Build Next.js
npx next build

