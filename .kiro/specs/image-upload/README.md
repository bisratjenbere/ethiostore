# Product Image Upload Feature

## Overview

This feature enables admin users to upload product images directly to Cloudinary from the admin panel, replacing the previous manual URL input method.

## Features

### 1. Multi-Image Upload Component
- **Location:** `components/shared/product/image-upload.tsx`
- **Features:**
  - Upload up to 5 images per product
  - Multiple file selection support
  - Real-time image preview grid
  - Drag-to-reorder (first image = main image)
  - Individual image deletion
  - Upload progress indicator
  - File validation (type, size)

### 2. Single Image Upload Component
- **Location:** `components/shared/product/single-image-upload.tsx`
- **Features:**
  - Upload single banner image
  - Image preview with remove option
  - Same validation as multi-upload

### 3. Cloudinary API Routes
- **Upload Route:** `app/api/cloudinary/upload/route.ts`
  - Handles file upload to Cloudinary
  - Admin authentication required
  - Automatic image optimization
  - Returns secure URL
  
- **Delete Route:** `app/api/cloudinary/delete/route.ts`
  - Removes images from Cloudinary
  - Admin authentication required
  - Cleanup when products are updated

### 4. Updated Product Form
- **Location:** `components/admin/products/product-form.tsx`
- **Changes:**
  - Replaced textarea URL input with ImageUpload component
  - Added SingleImageUpload for banner
  - Better UX for image management

## Technical Implementation

### Dependencies
```json
{
  "cloudinary": "^2.x.x",
  "next-cloudinary": "^6.x.x"
}
```

### Environment Variables Required
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Cloudinary Configuration
- **Folder:** `prostore/products`
- **Transformations:**
  - Max dimensions: 1000x1000px (maintains aspect ratio)
  - Quality: Auto (Cloudinary optimization)
  - Format: Auto (WebP for modern browsers)

### Security
- All upload/delete endpoints protected with NextAuth
- Admin role verification
- File type validation (images only)
- File size limit (5MB per image)

## User Flow

### Creating a New Product
1. Admin navigates to `/admin/products/new`
2. Fills in product details (name, price, etc.)
3. Clicks "Upload Images" button
4. Selects 1-5 images from device
5. Images upload and appear in preview grid
6. First image is marked as "Main"
7. Can remove any image by hovering and clicking delete
8. Optionally uploads banner image
9. Submits form to create product

### Editing Existing Product
1. Admin navigates to product edit page
2. Existing images display in preview grid
3. Can add more images (up to 5 total)
4. Can remove existing images
5. Changes saved to database

## File Structure

```
components/
└── shared/
    └── product/
        ├── image-upload.tsx          # Multi-image upload
        └── single-image-upload.tsx   # Single image upload

app/
└── api/
    └── cloudinary/
        ├── upload/
        │   └── route.ts              # Upload handler
        └── delete/
            └── route.ts              # Delete handler

lib/
└── cloudinary.ts                     # Cloudinary config

.kiro/
├── CLOUDINARY-SETUP.md              # Setup guide
└── specs/
    └── image-upload/
        └── README.md                 # This file
```

## API Endpoints

### POST /api/cloudinary/upload
**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with "file" field

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "https://res.cloudinary.com/...",
  "publicId": "prostore/products/xyz123"
}
```

### POST /api/cloudinary/delete
**Request:**
- Method: POST
- Content-Type: application/json
- Body: `{ "publicId": "prostore/products/xyz123" }`

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Error Handling

### Client-Side Validation
- File type must be image/*
- File size must be ≤ 5MB
- Maximum 5 images per product
- Toast notifications for all errors

### Server-Side Validation
- Authentication check (401 if not logged in)
- Authorization check (403 if not admin)
- File presence validation (400 if no file)
- Cloudinary errors caught and returned

## Image Optimization

Cloudinary automatically:
1. **Resizes** images to max 1000x1000px
2. **Optimizes** quality based on content
3. **Converts** to WebP for modern browsers
4. **Delivers** via global CDN
5. **Caches** for fast loading

## Benefits

### For Admins
- ✅ No need to host images elsewhere
- ✅ Drag and drop interface
- ✅ Instant preview
- ✅ Easy image management
- ✅ No manual URL entry

### For Users
- ✅ Fast image loading (CDN)
- ✅ Optimized images (smaller file sizes)
- ✅ Responsive images
- ✅ Better page performance

### For Developers
- ✅ Automatic optimization
- ✅ No server storage needed
- ✅ Easy to maintain
- ✅ Scalable solution

## Testing Checklist

- [ ] Upload single image
- [ ] Upload multiple images (5 max)
- [ ] Upload exceeds 5MB (should fail)
- [ ] Upload non-image file (should fail)
- [ ] Remove uploaded image
- [ ] Images persist after form submission
- [ ] Images display on product page
- [ ] Banner image upload works
- [ ] Non-admin cannot access upload endpoint
- [ ] Cloudinary folder structure correct

## Future Enhancements

Potential improvements:
1. **Drag-to-reorder images** - Change main image
2. **Image cropping** - In-browser crop before upload
3. **Bulk upload** - Upload multiple products' images at once
4. **Image variations** - Auto-generate thumbnails
5. **Alt text input** - SEO and accessibility
6. **Image analytics** - Track image views/performance

## Troubleshooting

See [CLOUDINARY-SETUP.md](../../CLOUDINARY-SETUP.md) for detailed troubleshooting steps.

Common issues:
- **Upload fails:** Check Cloudinary credentials
- **401 error:** User not logged in
- **403 error:** User not admin
- **File too large:** Reduce image size
- **Slow upload:** Large file or slow connection
