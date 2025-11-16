# Vercel Deployment Guide - PostgreSQL Setup

## ⚠️ CRITICAL: Set DATABASE_URL in Vercel

Your deployment **WILL FAIL** without `DATABASE_URL` set in Vercel's environment variables.

---

## Step 1: Get Your PostgreSQL Connection String

### Option A: If you have a PostgreSQL database already

Your connection string format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public
```

**Examples:**
- **Local PostgreSQL:** `postgresql://postgres:1826@localhost:5432/brand_watch?schema=public`
  - Username: `postgres` (or your PostgreSQL username)
  - Password: `1826` (your password)
  - Host: `localhost` (or your database host)
  - Port: `5432` (default PostgreSQL port)
  - Database: `brand_watch` (or your database name)
- **Supabase:** `postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public`
- **Neon:** `postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
- **Railway:** `postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway?schema=public`
- **Vercel Postgres:** `postgres://default:password@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require`

### Option B: Create a new PostgreSQL database

**Recommended Free Options:**

1. **Vercel Postgres** (Easiest - integrates with Vercel)
   - Go to Vercel Dashboard → Your Project → Storage → Create Database
   - Select "Postgres"
   - Copy the connection string

2. **Supabase** (Free tier available)
   - Go to https://supabase.com
   - Create a new project
   - Go to Settings → Database
   - Copy the connection string (use "Connection Pooling" for better performance)

3. **Neon** (Free tier available)
   - Go to https://neon.tech
   - Create a new project
   - Copy the connection string from the dashboard

4. **Railway** (Free tier available)
   - Go to https://railway.app
   - Create a new PostgreSQL database
   - Copy the connection string

---

## Step 2: Set DATABASE_URL in Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project: **Brand-Mention18** (or your project name)

2. **Navigate to Settings:**
   - Click **"Settings"** tab at the top
   - Click **"Environment Variables"** in the left sidebar

3. **Add DATABASE_URL:**
   - Click **"Add New"** button
   - **Key:** `DATABASE_URL`
   - **Value:** Your PostgreSQL connection string
     - **Format:** `postgresql://username:1826@host:port/database?schema=public`
     - **Example (local):** `postgresql://postgres:1826@localhost:5432/brand_watch?schema=public`
     - **Example (cloud):** `postgresql://user:1826@your-host.com:5432/dbname?schema=public`
     - Replace `username`, `host`, `port`, and `database` with your actual values
     - Keep password as `1826` (or your actual password)
   - **Environments:** Select **ALL** (Production, Preview, Development)
   - Click **"Save"**

4. **Verify it's added:**
   - You should see `DATABASE_URL` in the list
   - Make sure it's enabled for all environments

---

## Step 3: Run Database Migrations

After setting DATABASE_URL, your build will automatically run migrations via:
```bash
prisma migrate deploy
```

This is already configured in your `package.json` build script.

---

## Step 4: Redeploy

1. **Option A: Automatic (after setting env var)**
   - Vercel will automatically trigger a new deployment
   - Wait for it to complete

2. **Option B: Manual Redeploy**
   - Go to **"Deployments"** tab
   - Click **"..."** menu on latest deployment
   - Click **"Redeploy"**

---

## Step 5: Verify Deployment

1. **Check Build Logs:**
   - Go to your deployment
   - Check "Build Logs"
   - Should see: ✅ "Build completed successfully"

2. **Test Your App:**
   - Visit your Vercel URL: `https://your-app.vercel.app`
   - Go to `/dashboard`
   - Should load without errors

---

## Troubleshooting

### Issue: "Environment variable not found: DATABASE_URL"

**Solution:** Make sure you:
- ✅ Added `DATABASE_URL` in Vercel Settings → Environment Variables
- ✅ Selected ALL environments (Production, Preview, Development)
- ✅ Saved the environment variable
- ✅ Redeployed after adding it

### Issue: "Connection refused" or database connection errors

**Solution:** 
- Check your connection string format
- Make sure your database allows connections from Vercel's IPs
- For cloud databases (Supabase, Neon), check firewall settings
- Verify username, password, host, and database name are correct

### Issue: Migrations failing

**Solution:**
- Make sure DATABASE_URL is correct
- Check database permissions
- Try running migrations manually: `npx prisma migrate deploy`

---

## Quick Checklist

- [ ] PostgreSQL database created (Vercel Postgres, Supabase, Neon, etc.)
- [ ] Connection string copied
- [ ] DATABASE_URL added in Vercel Environment Variables
- [ ] All environments selected (Production, Preview, Development)
- [ ] Environment variable saved
- [ ] Deployment triggered/redeployed
- [ ] Build logs show success
- [ ] App loads at Vercel URL

---

## Need Help?

If you're still having issues:
1. Check Vercel build logs for specific error messages
2. Verify your DATABASE_URL format is correct
3. Test your database connection locally first
4. Make sure your database is accessible from the internet (for cloud databases)

---

**Once DATABASE_URL is set, your deployment will succeed! 🚀**

