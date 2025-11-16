# DATABASE_URL Connection String Examples

## Format
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public
```

---

## With Password 1826

### If you have your own PostgreSQL database:

**Local PostgreSQL:**
```
postgresql://postgres:1826@localhost:5432/brand_watch?schema=public
```

**Cloud PostgreSQL (Supabase/Neon/Railway/etc):**
```
postgresql://postgres:1826@your-host.com:5432/your_database?schema=public
```

**Example with actual values:**
```
postgresql://postgres:1826@db.example.com:5432/brand_watch?schema=public
```

---

## Vercel Postgres (Different - Uses Auto-Generated Password)

**⚠️ Important:** Vercel Postgres generates its own password. You cannot set it to 1826.

When you create Vercel Postgres:
1. Go to Vercel Dashboard → Your Project → Storage → Create Database → Postgres
2. Vercel will generate a connection string like:
   ```
   postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb
   ```
3. **Use this exact string** - don't change the password part
4. Vercel automatically adds it to your Environment Variables

**You don't need to manually set DATABASE_URL if using Vercel Postgres** - it's automatic!

---

## If You Want to Use Your Own Database with Password 1826

### Step 1: Make sure your database is accessible from the internet
- Not `localhost` - must be a cloud database
- Database must allow external connections
- Firewall must allow Vercel's IP addresses

### Step 2: Format your connection string
```
postgresql://username:1826@your-database-host.com:5432/database_name?schema=public
```

**Replace:**
- `username` → Your PostgreSQL username
- `1826` → Your password (keep this)
- `your-database-host.com` → Your database server hostname
- `5432` → Your database port (usually 5432)
- `database_name` → Your database name

### Step 3: Add to Vercel
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Key: `DATABASE_URL`
3. Value: Your formatted connection string
4. Environments: ALL
5. Save

---

## Quick Examples

### Supabase with password 1826:
```
postgresql://postgres.xxxxx:1826@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public
```

### Neon with password 1826:
```
postgresql://user:1826@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Railway with password 1826:
```
postgresql://postgres:1826@containers-us-west-xxx.railway.app:5432/railway?schema=public
```

### Custom Cloud PostgreSQL with password 1826:
```
postgresql://postgres:1826@your-server.com:5432/brand_watch?schema=public
```

---

## ⚠️ Important Notes

1. **Vercel Postgres:** Uses auto-generated password (not 1826)
2. **Your own database:** Can use password 1826
3. **localhost:** Will NOT work in Vercel - must be cloud database
4. **Format:** Always use `postgresql://` or `postgres://` prefix
5. **Schema:** Always include `?schema=public` at the end

---

## Test Your Connection String

Before adding to Vercel, test locally:
```bash
# In your .env file
DATABASE_URL="postgresql://postgres:1826@your-host:5432/database?schema=public"

# Test connection
npm run db:generate
npm run db:migrate
```

If it works locally, it will work in Vercel (as long as it's not localhost).

