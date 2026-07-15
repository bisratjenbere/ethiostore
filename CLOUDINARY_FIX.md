# Cloudinary Upload Error Fix

## Problem
The image upload is failing with "Invalid Signature" error because the Cloudinary API credentials are incorrect.

## Solution

### Step 1: Get Your Cloudinary Credentials

1. Go to https://cloudinary.com/console
2. Log in to your account (or create a free account if you don't have one)
3. On the Dashboard, you'll see:
   - **Cloud Name** (e.g., `djrylznf8`)
   - **API Key** (e.g., `788122966568612`)
   - **API Secret** (click "Reveal" to see it)

### Step 2: Update Your .env File

Replace the Cloudinary section in your `.env` file with the correct values:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
```

**IMPORTANT:** 
- The `CLOUDINARY_API_SECRET` must be the exact value from your Cloudinary dashboard
- The `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` should be your cloud name (e.g., `djrylznf8`), NOT a URL

### Step 3: Restart Your Development Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Test the Upload

1. Go to the admin product creation page
2. Try uploading an image
3. It should now work without the "Invalid Signature" error

## Current Issues in Your .env

1. ✅ `CLOUDINARY_CLOUD_NAME` - Looks correct
2. ✅ `CLOUDINARY_API_KEY` - Looks correct
3. ❌ `CLOUDINARY_API_SECRET` - This needs to be verified (might be incorrect)
4. ❌ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Was set to `http://localhost:3000` (incorrect)

## Security Note

⚠️ **NEVER commit your `.env` file to version control!**

The `.env` file contains sensitive credentials. Make sure it's listed in your `.gitignore` file.

## Troubleshooting

If you still get errors after updating:

1. **Verify credentials**: Double-check all three Cloudinary values in your dashboard
2. **Check for spaces**: Make sure there are no extra spaces in the credential values
3. **Restart server**: Always restart after changing .env
4. **Check Cloudinary console**: Visit https://cloudinary.com/console to see if your account is active
5. **Try a new upload**: Clear browser cache and try again

## Alternative: Use a Different Cloudinary Account

If you can't access the current account:

1. Create a new free Cloudinary account at https://cloudinary.com/users/register_free
2. Get the new credentials from the dashboard
3. Update your `.env` file with the new values
4. Restart your server
