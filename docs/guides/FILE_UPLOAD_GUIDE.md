# File Upload Guide

## Overview

The MASTMO Club application includes a file upload API for uploading photos for members, events, and teams. Files are stored locally in the `/public/uploads` directory and accessible as static assets.

## Upload API

### POST /api/upload

Upload a file to the server.

**Request:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@photo.jpg" \
  -F "type=member"
```

**Parameters:**
- `file` (required) - The file to upload
- `type` (required) - File category: `member`, `event`, or `team`

**File Constraints:**
- Maximum size: 5MB
- Allowed formats: JPEG, PNG, WebP, GIF

**Response (Success):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "filename": "member-1702756800000-abc123.jpg",
  "url": "/uploads/member-1702756800000-abc123.jpg",
  "size": 245000,
  "type": "image/jpeg"
}
```

**Response (Error):**
```json
{
  "error": "File size exceeds 5MB limit"
}
```

### GET /api/upload/list

List uploaded files (admin only - requires authentication cookie).

**Request:**
```bash
curl http://localhost:3000/api/upload/list \
  -H "Cookie: admin_token=authenticated"
```

**Response:**
```json
{
  "success": true,
  "message": "Upload directory created. Files are saved to /public/uploads",
  "uploadDir": "/uploads"
}
```

## Storage Location

Files are saved to:
```
/public/uploads/
  ├── member-{timestamp}-{random}.jpg
  ├── event-{timestamp}-{random}.jpg
  └── team-{timestamp}-{random}.jpg
```

**Access:**
- Files are accessible at: `http://localhost:3000/uploads/{filename}`
- In production: `https://yourdomain.com/uploads/{filename}`

## Using the FileUpload Component

### In Your Form

```tsx
import { FileUpload } from "@/components/FileUpload";
import { useState } from "react";

export function MemberForm() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <form>
      <FileUpload 
        fileType="member"
        onFileSelected={(url, filename) => {
          setImageUrl(url);
          // Save url to database
        }}
      />
      
      {/* Display preview */}
      {imageUrl && (
        <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
      )}
    </form>
  );
}
```

### Component Props

```typescript
interface FileUploadProps {
  onFileSelected: (url: string, filename: string) => void;
  fileType: "member" | "event" | "team";
  existingImage?: string;  // Show existing image
}
```

## Saving Upload URL to Database

After uploading, save the returned `url` to your database:

```typescript
// In your server action
import { Member } from "@/models/Member";

export async function updateMemberPhoto(memberId: string, photoUrl: string) {
  const member = await Member.findByIdAndUpdate(
    memberId,
    { photo: photoUrl },
    { new: true }
  );
  return member;
}
```

## Database Schema Update

Add photo field to your schemas:

```typescript
// models/Member.ts
const memberSchema = new Schema({
  name: String,
  email: String,
  photo: String,  // Add this field
  // ... other fields
});

// models/Event.ts
const eventSchema = new Schema({
  name: String,
  description: String,
  coverImage: String,  // Add this field
  // ... other fields
});
```

## Display Uploaded Images

```tsx
import Image from "next/image";

export function MemberCard({ member }) {
  return (
    <div>
      {member.photo ? (
        <Image 
          src={member.photo} 
          alt={member.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
      ) : (
        <div className="w-200 h-200 bg-gray-300 rounded-lg flex items-center justify-center">
          No photo
        </div>
      )}
      <h2>{member.name}</h2>
    </div>
  );
}
```

## Deployment Considerations

### On Render.com
- Uploaded files are **NOT** persisted between deploys (ephemeral filesystem)
- Solution: Use cloud storage (AWS S3, Cloudinary, or similar)

### On Vercel
- Use external storage service (S3, Cloudinary)
- Next.js Edge Functions don't support file writes

### Self-hosted
- Files persist in `/public/uploads`
- Enable regular backups of the uploads folder
- Consider using a CDN to serve uploads

## Switching to Cloud Storage (S3/Cloudinary)

If you need persistent storage, update the upload route:

```typescript
// Option 1: AWS S3
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Option 2: Cloudinary
import { v2 as cloudinary } from 'cloudinary';

// Option 3: Supabase Storage
import { createClient } from "@supabase/supabase-js";
```

## Security Notes

✅ **What's protected:**
- File type validation (only images allowed)
- File size limits (5MB max)
- Unique filenames (no overwrites)
- Stored outside version control

⚠️ **Not implemented:**
- Admin-only upload restriction (consider adding this)
- Virus/malware scanning
- Rate limiting

To add admin protection:

```typescript
// In /api/upload route
const adminToken = request.cookies.get("admin_token")?.value;
if (!adminToken || adminToken !== "authenticated") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Troubleshooting

**"Upload failed" error:**
- Check file size (max 5MB)
- Verify file format is image
- Check browser console for details

**Image not showing:**
- Verify URL returned from upload is correct
- Check if file exists in `/public/uploads`
- Ensure Image component has proper dimensions

**Files lost after deploy:**
- This is normal for ephemeral storage (Render, Vercel)
- Migrate to cloud storage for persistent uploads

---

For production deployment, consider using:
- **Cloudinary** (easy setup, free tier available)
- **AWS S3** (more control, pay-per-use)
- **Supabase Storage** (PostgreSQL alternative)
