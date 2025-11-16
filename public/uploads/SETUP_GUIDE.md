# Quick Setup Guide - Local File Server

## Step 1: Add Your File

Copy your file (e.g., `performance-nov-2025.xlsx`) to this folder:
```
brand-watch/public/uploads/performance-nov-2025.xlsx
```

## Step 2: Test the URL

Open this URL in your browser to verify the file is accessible:
```
http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx
```

If the file downloads or opens, the URL is working correctly!

## Step 3: Use in Postman

Use this JSON in Postman (replace with your actual file name):

```json
{
  "title": "Monthly Performance Report - November 2025",
  "description": "Monthly metrics and KPIs including mentions, sentiment, engagement, and response times.",
  "content": "November 2025 Performance Report. Total Mentions: 1,234. Sentiment: Positive 65%, Neutral 20%, Negative 15%...",
  "fileType": "xlsx",
  "fileUrl": "http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx",
  "fileSize": 345678,
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "author": "Analytics Team",
  "team": "Analytics",
  "project": "Monthly Reports",
  "tags": ["report", "performance", "metrics", "november"]
}
```

## Important Notes

- **File name must match exactly** (case-sensitive)
- **No spaces in file names** (use hyphens or underscores)
- **File must be in this folder** (`brand-watch/public/uploads/`)
- **Server must be running** (`npm run dev`)

## Common File Types

- PDF: `http://192.168.195.1:3000/uploads/document.pdf`
- Excel: `http://192.168.195.1:3000/uploads/spreadsheet.xlsx`
- Word: `http://192.168.195.1:3000/uploads/document.docx`
- Text: `http://192.168.195.1:3000/uploads/notes.txt`

## Troubleshooting

- **404 Error?** Check that the file name matches exactly (including extension)
- **File not found?** Make sure the file is in `brand-watch/public/uploads/`
- **Server not running?** Start it with `npm run dev` in the brand-watch directory

