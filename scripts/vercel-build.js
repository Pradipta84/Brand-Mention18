#!/usr/bin/env node

// Vercel build script that handles DATABASE_URL for Prisma
const { execSync } = require('child_process');

// Set dummy DATABASE_URL if not already set (for prisma generate)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public';
  console.log('⚠️  DATABASE_URL not set, using dummy URL for prisma generate');
}

try {
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // For migrations, use the real DATABASE_URL from Vercel env vars
  // If DATABASE_URL is still dummy, migrations will fail (which is expected)
  console.log('🔄 Running migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  console.log('🏗️  Building Next.js...');
  execSync('npx next build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

