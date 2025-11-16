# Hybrid Data System - Database + JSON Fallback

## ✅ How It Works

Your application now uses a **hybrid data system** that:

1. **Tries PostgreSQL database first** - If database is available and connected
2. **Falls back to JSON** - If database is not available or connection fails

## 🎯 Benefits

✅ **New data via Postman shows up immediately** - When database is connected  
✅ **Works without database** - Falls back to JSON for demos/deployments  
✅ **Best of both worlds** - Real data when available, demo data when not  

## 📊 How Data Flows

### Adding Data (POST Routes)

```
Postman → POST /api/ingest → PostgreSQL Database ✅
```

- **Always saves to database** (if database is connected)
- **No fallback** - If database fails, you'll get an error (as expected)

### Reading Data (GET Routes)

```
Dashboard → GET /api/mentions → Try Database → Fallback to JSON
```

**Step 1: Try Database**
- Check if database connection works
- If yes → Fetch real data from PostgreSQL
- Includes all new data added via Postman ✅

**Step 2: Fallback to JSON**
- If database unavailable → Use `data/mentions-data.json`
- Shows demo/static data
- App continues to work

## 🔄 Example Scenarios

### Scenario 1: Database Connected (Production)

1. You add new mention via Postman → Saves to PostgreSQL ✅
2. Dashboard loads → Reads from PostgreSQL ✅
3. **New mention appears immediately** ✅

### Scenario 2: No Database (Demo/Deployment)

1. Dashboard loads → Tries database → Fails
2. Automatically falls back to JSON ✅
3. Shows demo data from `data/mentions-data.json` ✅
4. App works perfectly ✅

### Scenario 3: Database Connection Lost

1. Dashboard was showing real data
2. Database connection drops
3. Next request → Automatically switches to JSON ✅
4. App continues working (shows demo data) ✅

## 📝 API Endpoints

### POST Endpoints (Write to Database)

These **always** use the database:

- `POST /api/ingest` - Add new mention
- `POST /api/queries/ingest` - Add new query
- `POST /api/competitors/ingest` - Add competitor update
- `POST /api/documents/index` - Index document

**Note:** If database is not available, these will return an error (expected behavior).

### GET Endpoints (Read with Fallback)

These try database first, fallback to JSON:

- `GET /api/mentions` - Get mentions
- `GET /api/stats` - Get statistics
- `GET /api/alerts` - Get alerts
- `GET /api/sentiment-trend` - Get sentiment trends
- `GET /api/source-breakdown` - Get source breakdown

## 🚀 Deployment Options

### Option 1: With Real Database (Recommended for Production)

1. Set up PostgreSQL (Vercel Postgres, Supabase, etc.)
2. Add `DATABASE_URL` environment variable in Vercel
3. **Result:**
   - New data via Postman → Saves to database ✅
   - Dashboard → Shows real data from database ✅
   - All features work with live data ✅

### Option 2: Without Database (Demo/Static)

1. Don't set `DATABASE_URL` (or use dummy value for build)
2. **Result:**
   - Dashboard → Shows JSON demo data ✅
   - App works perfectly ✅
   - POST endpoints will fail (expected - no database)

## 🧪 Testing

### Test Database Connection

```bash
# Check if database is available
npm run db:studio
# If opens Prisma Studio → Database is connected ✅
```

### Test Adding Data via Postman

1. **Request:**
   ```
   POST http://localhost:3000/api/ingest
   Content-Type: application/json
   
   {
     "sourceName": "Twitter",
     "channel": "twitter",
     "author": "Test User",
     "body": "This is a test mention",
     "permalink": "https://twitter.com/test/123",
     "publishedAt": "2024-01-15T10:00:00Z"
   }
   ```

2. **Expected Result:**
   - If database connected → Success ✅
   - New mention appears in dashboard ✅
   - If no database → Error (expected) ❌

### Test Dashboard

1. Visit: `http://localhost:3000/dashboard`
2. **If database connected:**
   - Shows real data from PostgreSQL
   - Includes new mentions added via Postman ✅
3. **If no database:**
   - Shows demo data from JSON ✅
   - App works perfectly ✅

## 🔧 Configuration

The hybrid system is **automatic** - no configuration needed!

It checks database availability on each request:
- If available → Use database
- If not → Use JSON

## 📚 Files Involved

- `src/lib/data/hybrid-data.ts` - Hybrid data functions
- `src/lib/data/json-data.ts` - JSON fallback functions
- `src/lib/data/server.ts` - Exports hybrid functions
- `src/app/api/ingest/route.ts` - POST endpoint (database only)
- `src/app/api/mentions/route.ts` - GET endpoint (hybrid)

## ✅ Summary

**Your question:** "If I add new data via Postman, will it show up and be added to PostgreSQL?"

**Answer:** **YES!** ✅

- ✅ POST `/api/ingest` → Always saves to PostgreSQL (if connected)
- ✅ GET `/api/mentions` → Reads from PostgreSQL (if available)
- ✅ New data appears immediately in dashboard
- ✅ Falls back to JSON only if database is unavailable

The system is smart - it uses the database when available, and gracefully falls back to JSON when it's not!

