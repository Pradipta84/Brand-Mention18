# Uploads Directory

This directory is for storing files that will be accessible via the Document Library.

## How to Use

1. **Place your files here:**
   - Copy your files (PDF, DOCX, XLSX, etc.) into this `uploads` folder
   - Example: `performance-nov-2025.xlsx`

2. **Access files via URL:**
   - Files in this folder are automatically served by Next.js
   - URL format: `http://192.168.195.1:3000/uploads/your-file-name.xlsx`
   - Replace `your-file-name.xlsx` with your actual file name

3. **Use in Postman:**
   ```json
   {
     "title": "Your Document Title",
     "fileType": "xlsx",
     "fileUrl": "http://192.168.195.1:3000/uploads/your-file-name.xlsx",
     ...
   }
   ```

## Example

If you place `performance-nov-2025.xlsx` in this folder, use:
```
http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx
```

## Notes

- Files must be publicly accessible (no authentication)
- File names are case-sensitive
- Use URL-encoded file names if they contain spaces or special characters
- For production, consider using cloud storage (AWS S3, Google Cloud, etc.)

