# ⚠️ CRITICAL: Fix Vercel Deployment - Database Issue

## Problem
Your deployment is failing because `DATABASE_URL` is set to `localhost`, which Vercel cannot access.

**Error:** `Can't reach database server at 'localhost'`

## Solution: Use a Cloud Database

Vercel **CANNOT** access `localhost` databases. You need a cloud-hosted PostgreSQL database.

---

## 🚀 Quick Fix: Create Vercel Postgres (Easiest - 2 minutes)

### Step 1: Create Database in Vercel
1. Go to: https://vercel.com/dashboard
2. Click your project: **Brand-Mention18**
3. Go to **"Storage"** tab (or **"Settings"** → **"Storage"**)
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Choose a name (e.g., "brand-watch-db")
7. Select a region (closest to you)
8. Click **"Create"**

### Step 2: Get Connection String
1. After creation, you'll see your database
2. Click on it
3. Go to **"Settings"** tab
4. Find **"Connection String"** or **"Environment Variable"**
5. Copy the connection string (it will look like):
   ```
   postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb
   ```

### Step 3: Update DATABASE_URL in Vercel
1. Go to **Settings** → **Environment Variables**
2. Find `DATABASE_URL` (or add it if not exists)
3. Click to edit
4. Replace the value with the connection string from Step 2
5. Make sure all environments are selected
6. Click **"Save"**

### Step 4: Redeploy
- Vercel will automatically redeploy
- Or manually: **Deployments** → **"..."** → **"Redeploy"**

---

## Alternative: Use Supabase (Free - 5 minutes)

### Step 1: Create Supabase Project
1. Go to: https://supabase.com
2. Sign up (free)
3. Click **"New Project"**
4. Fill in:
   - Name: `brand-watch`
   - Database Password: `1826` (or your choice)
   - Region: Choose closest
5. Click **"Create new project"**
6. Wait 2 minutes for setup

### Step 2: Get Connection String
1. Go to **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string
5. It will look like:
   ```
   postgresql://postgres.xxxxx:1826@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Add `?schema=public` at the end:
   ```
   postgresql://postgres.xxxxx:1826@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public
   ```

### Step 3: Update DATABASE_URL in Vercel
1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Update `DATABASE_URL` with the Supabase connection string
3. Save

### Step 4: Run Migrations
After deployment succeeds, run migrations manually:
```bash
# In your local terminal
npx prisma migrate deploy
```
Or use Supabase SQL Editor to run migrations.

---

## Alternative: Use Neon (Free - 3 minutes)

### Step 1: Create Neon Project
1. Go to: https://neon.tech
2. Sign up (free)
3. Click **"Create Project"**
4. Name: `brand-watch`
5. Click **"Create Project"**

### Step 2: Get Connection String
1. After creation, you'll see **"Connection string"**
2. Copy it (it includes password)
3. Format: `postgresql://user:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require`

### Step 3: Update DATABASE_URL in Vercel
1. Go to Vercel → **Settings** → **Environment Variables**
2. Update `DATABASE_URL` with Neon connection string
3. Save

---

## ✅ After Setting Up Cloud Database

1. **Build will succeed** ✅
2. **Migrations will run automatically** ✅
3. **App will connect to database** ✅

---

## 🔍 Verify Your DATABASE_URL Format

**Correct format:**
```
postgresql://username:password@cloud-host.com:5432/database?schema=public
```

**Wrong (won't work in Vercel):**
```
postgresql://postgres:1826@localhost:5432/brand_watch?schema=public  ❌
```

**Correct (cloud database):**
```
postgresql://postgres:1826@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?schema=public  ✅
```

---

## 🎯 Recommended: Vercel Postgres

**Why Vercel Postgres is best:**
- ✅ Integrated with Vercel (no extra setup)
- ✅ Automatically sets DATABASE_URL
- ✅ Free tier available
- ✅ Works immediately

**Steps:**
1. Vercel Dashboard → Your Project → **Storage** → **Create Database** → **Postgres**
2. Copy connection string
3. It's automatically added to Environment Variables
4. Redeploy - Done! ✅

---

**Once you set up a cloud database and update DATABASE_URL, your deployment will succeed! 🚀**

