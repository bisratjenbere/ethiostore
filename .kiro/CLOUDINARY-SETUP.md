# Cloudinary Setup Guide

This guide will help you set up Cloudinary for product image uploads in ProStore.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Complete the registration process
4. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the **Dashboard** (home page after login)
3. You'll see your account details in the **Account Details** section:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "eye" icon to reveal)

## Step 3: Configure Environment Variables

Update your `.env` file with your Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
```

**Important:** Replace the placeholder values with your actual credentials from the Cloudinary dashboard.

## Step 4: Restart Your Development Server

After updating the environment variables, restart your development server:

```bash
npm run dev
```

## Features Implemented

### 1. Multiple Image Upload
- Upload up to 5 images per product
- Drag and drop interface
- Image preview with delete functionality
- First image is automatically set as main product image
- Automatic image optimization (1000x1000px max, auto quality)

### 2. Banner Image Upload
- Single banner image for featured products
- Separate from product images
- Optional field

### 3. Image Management
- Images stored in `prostore/products` folder on Cloudinary
- Automatic deletion from Cloudinary when removed from product
- Images optimized automatically (WebP format when possible)
- Responsive image delivery

### 4. Security
- Admin-only access to upload/delete endpoints
- File type validation (images only)
- File size validation (max 5MB per image)
- Authentication required for all operations

## File Size and Format Recommendations

- **Format:** JPEG, PNG, WebP (automatically optimized by Cloudinary)
- **Size:** Maximum 5MB per image
- **Dimensions:** Will be automatically resized to max 1000x1000px while maintaining aspect ratio
- **Quality:** Automatically optimized for web delivery

## Cloudinary Transformations Applied

All uploaded images are automatically transformed with:
- **Size limit:** 1000x1000px (maintains aspect ratio)
- **Quality:** Auto (Cloudinary selects optimal quality)
- **Format:** Auto (Cloudinary delivers best format for browser)

## Folder Structure in Cloudinary

```
prostore/
└── products/
    ├── image1.jpg
    ├── image2.jpg
    └── ...
```

## Testing the Upload Feature

1. Navigate to `/admin/products/new` (admin access required)
2. Fill in product details
3. Click "Upload Images" button
4. Select one or more images (up to 5)
5. Wait for upload to complete
6. Images will appear with preview
7. Remove any image by hovering and clicking delete button
8. Save the product

## Troubleshooting

### Images Not Uploading?

1. **Check credentials:** Verify all Cloudinary credentials in `.env` are correct
2. **Check file size:** Ensure images are under 5MB
3. **Check file type:** Only image files are allowed
4. **Check authentication:** Ensure you're logged in as admin
5. **Check browser console:** Look for error messages

### "Unauthorized" Error?

- Ensure you're logged in
- Ensure your user role is set to "admin" in the database

### "Upload Failed" Error?

- Check your Cloudinary credentials
- Verify your Cloudinary account is active
- Check Cloudinary usage limits (free tier has limits)

### Images Not Deleting?

- Verify API credentials have delete permissions
- Check Cloudinary dashboard to see if images exist

## Cloudinary Free Tier Limits

- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month
- **Images/Videos:** Unlimited

For most small to medium e-commerce sites, the free tier is sufficient.

## Next Steps

After setup, you can:
1. Upload product images directly from the admin panel
2. Images are automatically optimized and delivered via Cloudinary CDN
3. Fast image loading for better user experience
4. Automatic format conversion (WebP for modern browsers)

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Cloudinary Integration](https://next.cloudinary.dev/)
- [Image Optimization Best Practices](https://cloudinary.com/documentation/image_optimization)
