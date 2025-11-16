# Fixing 404 Error

## Why You're Getting 404

The 404 error means the file doesn't exist at the URL you're trying to access.

## Quick Fix Checklist

### ✅ Step 1: Check if File Exists
Look in this folder: `brand-watch/public/uploads/`

**You should see your file here:**
- ❌ If you DON'T see your file → That's why you get 404!
- ✅ If you DO see your file → Check Step 2

### ✅ Step 2: Check File Name
The file name in the URL must match **exactly** (case-sensitive):

**Example:**
- File name: `Performance-Nov-2025.xlsx` (capital P, N, 2025)
- URL: `http://192.168.195.1:3000/uploads/Performance-Nov-2025.xlsx` ✅
- URL: `http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx` ❌ (404 error!)

### ✅ Step 3: Check Server is Running
Make sure your Next.js server is running:
```bash
cd brand-watch
npm run dev
```

You should see:
```
✓ Ready in X ms
○ Local: http://localhost:3000
```

### ✅ Step 4: Test with a Simple File

1. **Create a test file:**
   - Create a simple text file: `test.txt`
   - Put it in: `brand-watch/public/uploads/test.txt`
   - Add some text: "This is a test file"

2. **Test the URL:**
   ```
   http://192.168.195.1:3000/uploads/test.txt
   ```
   - If this works → Your setup is correct!
   - If this doesn't work → Server issue

## Common Issues

| Issue | Solution |
|-------|----------|
| File not in folder | Copy file to `brand-watch/public/uploads/` |
| Wrong file name | Check exact spelling (case-sensitive) |
| Server not running | Run `npm run dev` in brand-watch folder |
| Wrong URL format | Use: `http://192.168.195.1:3000/uploads/filename.ext` |
| File has spaces | Rename file (use hyphens: `my-file.pdf`) |

## How to Add Your File

### Option 1: Using File Explorer (Windows)
1. Open File Explorer
2. Navigate to: `C:\Pradipta\Full_Stack_hackathon1\brand-watch\public\uploads\`
3. Copy your file (e.g., `performance-nov-2025.xlsx`) into this folder
4. Verify it's there!

### Option 2: Using Command Line
```powershell
# Copy file to uploads folder
Copy-Item "C:\YourFiles\performance-nov-2025.xlsx" -Destination "brand-watch\public\uploads\"
```

## Verify It Works

1. **Check file exists:**
   ```
   brand-watch/public/uploads/performance-nov-2025.xlsx
   ```

2. **Test URL in browser:**
   ```
   http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx
   ```

3. **If it downloads/opens** → ✅ Success!
4. **If you get 404** → File name doesn't match or file not in folder

## Still Getting 404?

1. Double-check the file is actually in `brand-watch/public/uploads/`
2. Check the file name matches exactly (including .xlsx extension)
3. Make sure server is running (`npm run dev`)
4. Try restarting the server
5. Clear browser cache and try again

