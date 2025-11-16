# Quick File Setup Guide

## ✅ 3 Simple Steps to Get Your File Working

### Step 1: Place Your File
```
Copy your file to: brand-watch/public/uploads/
Example: performance-nov-2025.xlsx
```

### Step 2: Test the URL
Open in browser:
```
http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx
```
✅ If it downloads/opens → URL is working!

### Step 3: Use in Postman

**URL:** `http://192.168.195.1:3000/api/documents/index`  
**Method:** `POST`  
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "title": "Monthly Performance Report - November 2025",
  "fileType": "xlsx",
  "fileUrl": "http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx",
  "description": "Monthly metrics and KPIs",
  "content": "November 2025 Performance Report. Total Mentions: 1,234...",
  "author": "Analytics Team",
  "team": "Analytics",
  "project": "Monthly Reports",
  "tags": ["report", "performance", "metrics"]
}
```

## 📝 File URL Format

Replace `your-file-name.xlsx` with your actual file name:

```
http://192.168.195.1:3000/uploads/your-file-name.xlsx
```

## ⚠️ Important Notes

- ✅ File name must match **exactly** (case-sensitive)
- ✅ File must be in `brand-watch/public/uploads/` folder
- ✅ Server must be running (`npm run dev`)
- ✅ No spaces in file names (use hyphens: `my-file.pdf`)

## 🔍 Verify It Works

1. Go to: `http://192.168.195.1:3000/library`
2. Find your document
3. Click on it
4. Click "Open File" button
5. ✅ File should open/download!

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| 404 Error | Check file name matches exactly |
| File not found | Make sure file is in `public/uploads/` folder |
| URL not working | Test URL in browser first |
| Server error | Make sure `npm run dev` is running |

## 📁 Example Files

- PDF: `http://192.168.195.1:3000/uploads/document.pdf`
- Excel: `http://192.168.195.1:3000/uploads/spreadsheet.xlsx`
- Word: `http://192.168.195.1:3000/uploads/document.docx`
- Text: `http://192.168.195.1:3000/uploads/notes.txt`

---

**That's it!** Your file should now work when you click "Open File" in the document detail modal.

