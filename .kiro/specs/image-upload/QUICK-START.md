# Image Upload - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Get Cloudinary Credentials (2 minutes)

1. Go to [cloudinary.com](https://cloudinary.com/) and sign up (free)
2. After login, copy these from your dashboard:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Update .env File (1 minute)

Open `.env` and replace the Cloudinary values:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
```

### Step 3: Restart Server (1 minute)

```bash
# Stop the dev server (Ctrl+C)
npm run dev
# Server restarts with new env variables
```

### Step 4: Test Upload (1 minute)

1. Login as admin user
2. Go to `/admin/products/new`
3. Click "Upload Images"
4. Select an image from your computer
5. Wait for upload confirmation
6. See preview appear ✅

## That's It! 🎉

Your image upload feature is now working.

## What You Can Do Now

- Upload up to 5 product images per product
- Upload optional banner images
- Delete images by clicking the X button
- Images are automatically optimized
- Images load fast via Cloudinary CDN

## Troubleshooting

**Upload button not working?**
- Check browser console for errors
- Verify .env variables are correct
- Ensure you're logged in as admin

**Getting "Unauthorized" error?**
- Your user role must be "admin"
- Check database: `npx prisma studio`
- Update user role to "admin"

**Need more help?**
See [CLOUDINARY-SETUP.md](../../CLOUDINARY-SETUP.md) for detailed troubleshooting.
