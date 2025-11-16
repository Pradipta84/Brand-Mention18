# Environment Variables Setup

## ⚠️ IMPORTANT: .env vs Vercel Environment Variables

- **`.env` file** = For **LOCAL DEVELOPMENT ONLY** (not used in Vercel)
- **Vercel Environment Variables** = For **DEPLOYMENT** (set in Vercel dashboard)

---

## Local Development (.env file)

Create a `.env` file in the project root with:

```env
DATABASE_URL="postgresql://postgres:1826@localhost:5432/brand_watch?schema=public"
OPENAI_API_KEY="sk-..." # Optional
```

**Replace these values with your actual database:**
- `postgres` → Your PostgreSQL username (usually `postgres`)
- `1826` → Your PostgreSQL password
- `localhost:5432` → Your database host and port
- `brand_watch` → Your database name

**Note:** This `.env` file is for local development. It is NOT used in Vercel deployment.

---

## Vercel Deployment (REQUIRED for deployment)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project

### Step 2: Add Environment Variable (MUST DO THIS!)
1. Go to **Settings** → **Environment Variables**
2. Click **"Add New"** button
3. Fill in:
   - **Key:** `DATABASE_URL`
   - **Value:** Your cloud database connection string
     - **⚠️ DO NOT use `localhost`** - Must be a cloud database!
     - **Format:** `postgresql://username:1826@cloud-host.com:5432/database?schema=public`
     - **Example (Supabase):** `postgresql://postgres.xxxxx:1826@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public`
     - **Example (Vercel Postgres):** `postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb`
   - **Environments:** Select **ALL** (Production, Preview, Development)
4. Click **"Save"**

**⚠️ CRITICAL:** 
- The `.env` file is **NOT** used in Vercel
- You **MUST** set `DATABASE_URL` in Vercel's Environment Variables
- Use a **cloud database** (not localhost)

### Example Connection Strings:

**Local PostgreSQL:**
```
postgresql://postgres:1826@localhost:5432/brand_watch?schema=public
```

**Cloud Database (Supabase/Neon/etc):**
```
postgresql://postgres.xxxxx:1826@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public
```

**⚠️ CRITICAL FOR VERCEL:**
- **DO NOT use `localhost`** - Vercel cannot access local databases
- **MUST use a cloud database** (Vercel Postgres, Supabase, Neon, Railway)
- Replace `your_username`, `your_host`, `your_database` with your actual cloud database values
- Keep password as `1826` (or update if different)
- See `QUICK_VERCEL_FIX.md` for step-by-step cloud database setup

---

## After Setting DATABASE_URL

1. **Local:** Restart your dev server (`npm run dev`)
2. **Vercel:** Redeploy your project (automatic or manual)

---

## Verify It's Working

**Local:**
```bash
npm run db:generate  # Should work without errors
npm run db:migrate   # Should connect to database
```

**Vercel:**
- Check build logs - should see "Build completed successfully"
- Visit your app URL - should load without database errors

