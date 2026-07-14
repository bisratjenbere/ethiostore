# Image Upload - User Guide

## For Admin Users

This guide shows you how to use the new image upload feature when creating or editing products.

## 📸 Uploading Product Images

### Step 1: Navigate to Product Form

**For New Products:**
1. Click "Admin" in the navigation menu
2. Click "Products" in the sidebar
3. Click "Add Product" button

**For Existing Products:**
1. Go to Products page in admin panel
2. Click "Edit" button on any product

### Step 2: Upload Images

1. **Scroll to "Product Images" section**
   - You'll see an "Upload Images" button
   - Counter shows: 0 / 5 images

2. **Click "Upload Images" button**
   - A file picker dialog will open
   - You can select multiple images at once

3. **Select your images**
   - Choose 1-5 images from your computer
   - Supported formats: JPG, PNG, WebP, GIF
   - Max size: 5MB per image

4. **Wait for upload**
   - You'll see "Uploading..." message
   - Progress indicator shows upload status
   - Takes a few seconds depending on image size

5. **View uploaded images**
   - Images appear in a grid layout
   - First image is marked as "Main"
   - Hover over any image to see delete option

### Step 3: Manage Images

**To Remove an Image:**
1. Hover your mouse over the image
2. Click the red "X" button that appears
3. Image is deleted from Cloudinary
4. Grid updates automatically

**To Add More Images:**
1. Click "Upload Images" again
2. Select additional images
3. Maximum 5 images total per product

**Main Image:**
- First image is automatically the main product image
- This image shows on product cards
- Appears first in product detail page

### Step 4: Upload Banner (Optional)

1. **Scroll to "Banner Image" section**
   - This is separate from product images
   - Optional field for featured products

2. **Click "Upload Banner"**
   - Select a wide/horizontal image
   - Banner displays on product detail page header

3. **Preview your banner**
   - Image appears after upload
   - Hover and click "Remove" if needed

### Step 5: Save Product

1. Fill in all required product details
2. Scroll to bottom of form
3. Click "Create Product" or "Update Product"
4. Product saves with all uploaded images

## 💡 Tips & Best Practices

### Image Quality
- **Use high-resolution images** (they'll be automatically optimized)
- **Good lighting** makes products look professional
- **White background** often works best for product photos
- **Multiple angles** help customers see the product better

### Image Selection
- **First image matters** - Choose the best one (it's the main image)
- **Show details** - Include close-up shots
- **Show scale** - Include images showing product size
- **Show variations** - If product has colors/options, show them

### File Sizes
- Don't worry about file size too much (automatic optimization)
- Under 5MB per image is the only limit
- Cloudinary makes images web-friendly automatically

### Number of Images
- **Minimum:** 1 image (required)
- **Recommended:** 3-5 images
- **Maximum:** 5 images per product

## ⚠️ Common Issues

### "Maximum 5 images allowed"
- You've already uploaded 5 images
- Remove an existing image first
- Then upload a new one

### "Image is too large (max 5MB)"
- Your image file is over 5MB
- Use an image editor to reduce file size
- Or choose a different image

### "Please select an image file"
- You selected a non-image file (like PDF or video)
- Only image files are allowed
- Try selecting a .jpg, .png, or .webp file

### "Upload failed"
- Check your internet connection
- Try uploading again
- If problem persists, contact administrator

### Upload button disabled
- You're not logged in as admin
- Your account doesn't have admin role
- Contact site administrator for access

## 📱 Image Display

After uploading, your images will appear:

1. **Product Listing Page**
   - Main image (first image) shows on product card
   - Optimized for fast loading
   - Responsive on mobile devices

2. **Product Detail Page**
   - All images display in gallery
   - Users can click to view larger
   - Banner (if added) shows at top

3. **Shopping Cart**
   - Main image shows with cart items
   - Small thumbnail size

4. **Order Confirmation**
   - Product images in order summary
   - Helps customers verify their order

## ✨ Benefits

**For You (Admin):**
- ✅ No need to find image hosting
- ✅ No need to copy/paste URLs
- ✅ See images immediately
- ✅ Easy to manage
- ✅ Fast uploads

**For Customers:**
- ✅ Fast loading images
- ✅ High quality photos
- ✅ Works on all devices
- ✅ Better shopping experience

## 🔒 Security & Privacy

- Only admin users can upload images
- Images are stored securely on Cloudinary
- Images are publicly viewable (this is intentional)
- Deleted images are permanently removed
- Your Cloudinary account credentials are private

## 📊 Image Optimization

Automatic optimizations applied to every image:

1. **Size:** Resized to 1000x1000px maximum
2. **Quality:** Optimized for web (smaller file size)
3. **Format:** Converted to WebP for modern browsers
4. **Loading:** Delivered via fast CDN
5. **Caching:** Cached for faster repeat visits

You don't need to do anything - it happens automatically!

## 🎯 Quick Reference

| Task | Steps |
|------|-------|
| **Upload images** | Click "Upload Images" → Select files → Wait for upload |
| **Remove image** | Hover over image → Click X button |
| **Add banner** | Click "Upload Banner" → Select image |
| **Change main image** | Delete all images → Re-upload in preferred order |
| **Maximum images** | 5 images per product |
| **Maximum file size** | 5MB per image |
| **Supported formats** | JPG, PNG, WebP, GIF |

## 🆘 Need Help?

**Can't upload images?**
1. Check you're logged in as admin
2. Try refreshing the page
3. Check your internet connection
4. Try a different image

**Images not appearing?**
1. Wait a few seconds for upload to complete
2. Check browser console for errors
3. Ensure Cloudinary is configured correctly
4. Contact administrator

**Other questions?**
Contact your site administrator or development team.

---

Happy uploading! 📸✨
