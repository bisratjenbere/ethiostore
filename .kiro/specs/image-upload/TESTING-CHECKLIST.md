# Image Upload Feature - Testing Checklist

## Pre-Testing Setup

- [ ] Cloudinary account created
- [ ] Environment variables set in `.env`
- [ ] Development server running (`npm run dev`)
- [ ] Admin user account created
- [ ] Logged in as admin user

## 1. Multi-Image Upload Component

### Basic Upload
- [ ] Navigate to `/admin/products/new`
- [ ] "Product Images" section is visible
- [ ] "Upload Images" button is present
- [ ] Counter shows "0 / 5 images"
- [ ] Click "Upload Images" button
- [ ] File picker dialog opens
- [ ] Select 1 image file
- [ ] Upload completes successfully
- [ ] Success toast notification appears
- [ ] Image preview appears in grid
- [ ] Counter updates to "1 / 5 images"
- [ ] First image has "Main" badge

### Multiple Upload
- [ ] Click "Upload Images" again
- [ ] Select 3 images at once
- [ ] All 3 upload successfully
- [ ] Counter shows "4 / 5 images"
- [ ] All 4 images display in grid (2x2 or responsive)
- [ ] Images maintain aspect ratio

### Maximum Limit
- [ ] Upload 1 more image (total 5)
- [ ] Counter shows "5 / 5 images"
- [ ] "Upload Images" button becomes disabled
- [ ] Hovering shows it's disabled
- [ ] Cannot click to add more images

### Image Deletion
- [ ] Hover over any uploaded image
- [ ] Dark overlay appears
- [ ] Red delete button (X) appears
- [ ] Click delete button
- [ ] Confirmation (toast) appears
- [ ] Image disappears from grid
- [ ] Counter updates (e.g., "4 / 5 images")
- [ ] "Upload Images" button re-enables
- [ ] Can upload new image to replace deleted one

### Image Grid Display
- [ ] Images display in responsive grid
- [ ] Mobile view: 2 columns
- [ ] Tablet view: 3 columns
- [ ] Desktop view: 4 columns
- [ ] All images have proper aspect ratio
- [ ] Images don't appear distorted
- [ ] Grid spacing is consistent

## 2. File Validation

### File Type Validation
- [ ] Try to upload a .pdf file
- [ ] Error toast: "Please select an image file"
- [ ] Upload is rejected
- [ ] Try to upload a .txt file
- [ ] Error toast appears
- [ ] Upload is rejected
- [ ] Try to upload .jpg file
- [ ] Upload succeeds ✅
- [ ] Try to upload .png file
- [ ] Upload succeeds ✅
- [ ] Try to upload .webp file
- [ ] Upload succeeds ✅

### File Size Validation
- [ ] Prepare image >5MB
- [ ] Try to upload large image
- [ ] Error toast: "Image is too large (max 5MB)"
- [ ] Upload is rejected
- [ ] Try image <5MB
- [ ] Upload succeeds ✅

### Multiple Files Validation
- [ ] Start with 3 uploaded images
- [ ] Try to upload 5 more (would exceed limit)
- [ ] Error toast: "Maximum 5 images allowed"
- [ ] No uploads occur
- [ ] Original 3 images remain

## 3. Single Image Upload (Banner)

### Basic Banner Upload
- [ ] Scroll to "Banner Image" section
- [ ] "Upload Banner" button is visible
- [ ] Click "Upload Banner"
- [ ] File picker opens
- [ ] Select a horizontal/wide image
- [ ] Upload completes
- [ ] Banner preview appears (wide aspect ratio)
- [ ] Success toast notification

### Banner Deletion
- [ ] Hover over banner image
- [ ] Dark overlay appears
- [ ] "Remove" button appears
- [ ] Click "Remove"
- [ ] Banner disappears
- [ ] "Upload Banner" button reappears
- [ ] Can upload new banner

### Banner Validation
- [ ] Try to upload >5MB banner
- [ ] Error toast appears
- [ ] Upload rejected
- [ ] Try non-image file
- [ ] Error toast appears
- [ ] Upload rejected

## 4. Form Integration

### New Product Creation
- [ ] Fill in all product fields (name, price, etc.)
- [ ] Upload 3 product images
- [ ] Upload 1 banner image
- [ ] Click "Create Product"
- [ ] Form submits successfully
- [ ] Redirect to products list
- [ ] New product appears in list
- [ ] Product card shows first image
- [ ] Click product to view details
- [ ] All 3 images appear in product page
- [ ] Banner appears at top of page

### Existing Product Edit
- [ ] Navigate to edit existing product
- [ ] Existing images display in grid
- [ ] Can add more images (up to 5 total)
- [ ] Can delete existing images
- [ ] Can update banner
- [ ] Click "Update Product"
- [ ] Changes save successfully
- [ ] Updated images display correctly

### Form Reset on Cancel
- [ ] Start uploading images
- [ ] Upload 2 images
- [ ] Click "Cancel" button
- [ ] Confirm navigation away
- [ ] Images are not saved
- [ ] Navigate back to form
- [ ] Image fields are empty

## 5. Authentication & Authorization

### Unauthenticated User
- [ ] Log out of admin account
- [ ] Try to access `/api/cloudinary/upload` directly
- [ ] Receive 401 Unauthorized error
- [ ] Try to access `/api/cloudinary/delete` directly
- [ ] Receive 401 Unauthorized error

### Non-Admin User
- [ ] Create/login as regular user (not admin)
- [ ] Try to access `/admin/products/new`
- [ ] Redirected away or access denied
- [ ] Cannot upload images

### Admin User
- [ ] Login as admin user
- [ ] Can access all admin routes ✅
- [ ] Can upload images ✅
- [ ] Can delete images ✅

## 6. API Endpoints

### Upload Endpoint
- [ ] POST request to `/api/cloudinary/upload`
- [ ] With valid auth + admin role
- [ ] With valid image file
- [ ] Returns 200 status
- [ ] Returns JSON with `success: true`
- [ ] Returns `url` field (Cloudinary URL)
- [ ] Returns `publicId` field
- [ ] URL is accessible (opens in browser)

### Delete Endpoint
- [ ] POST request to `/api/cloudinary/delete`
- [ ] With valid auth + admin role
- [ ] With valid publicId
- [ ] Returns 200 status
- [ ] Returns JSON with `success: true`
- [ ] Image deleted from Cloudinary
- [ ] Accessing old URL shows 404

### Error Responses
- [ ] Upload without auth → 401
- [ ] Upload as non-admin → 403
- [ ] Upload without file → 400
- [ ] Delete without publicId → 400

## 7. Image Optimization

### Cloudinary Transformations
- [ ] Upload a large image (e.g., 4000x3000px)
- [ ] Open delivered image URL
- [ ] Inspect image dimensions
- [ ] Width ≤ 1000px ✅
- [ ] Height ≤ 1000px ✅
- [ ] Aspect ratio maintained ✅
- [ ] Image quality good (not blurry)

### Format Conversion
- [ ] Upload .png image
- [ ] Check delivered URL in Chrome/Firefox
- [ ] Format converted to WebP (check URL params)
- [ ] File size smaller than original
- [ ] Visual quality maintained

### CDN Delivery
- [ ] Open image URL
- [ ] Check response headers
- [ ] Cloudinary CDN headers present
- [ ] Image loads fast (<1 second)
- [ ] Image cached on repeat loads

## 8. User Experience

### Loading States
- [ ] During upload, "Uploading..." text appears
- [ ] Upload button shows loading spinner
- [ ] Upload button is disabled
- [ ] Loading indicator visible
- [ ] User cannot interact until complete

### Success Feedback
- [ ] Upload success: Green toast notification
- [ ] Delete success: Toast notification
- [ ] Clear, readable messages
- [ ] Toast auto-dismisses after 3-5 seconds

### Error Feedback
- [ ] Upload error: Red toast notification
- [ ] Delete error: Toast notification
- [ ] Error messages are clear and helpful
- [ ] User knows what went wrong
- [ ] User knows how to fix it

### Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Grid adapts to screen size
- [ ] Buttons are tappable on mobile
- [ ] Images don't overflow container
- [ ] Text is readable on all sizes

## 9. Edge Cases

### Slow Connection
- [ ] Throttle network to 3G (browser DevTools)
- [ ] Upload an image
- [ ] Loading indicator appears
- [ ] Upload completes eventually
- [ ] No timeout errors (reasonable file size)

### Large Number of Operations
- [ ] Upload 5 images quickly
- [ ] All 5 complete successfully
- [ ] No race conditions
- [ ] Final state is correct
- [ ] Delete all 5 images
- [ ] All delete successfully

### Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Upload works in all browsers
- [ ] Preview works in all browsers

### Concurrent Editing
- [ ] Open product edit in 2 tabs
- [ ] Upload image in tab 1
- [ ] Save in tab 1
- [ ] Refresh tab 2
- [ ] Tab 2 shows updated images

## 10. Data Persistence

### Database Storage
- [ ] Upload images and save product
- [ ] Open Prisma Studio: `npx prisma studio`
- [ ] Navigate to Product table
- [ ] Find created product
- [ ] `images` field contains array of URLs
- [ ] `banner` field contains URL (if uploaded)
- [ ] URLs are Cloudinary URLs

### Cloudinary Storage
- [ ] Login to Cloudinary dashboard
- [ ] Navigate to Media Library
- [ ] Open `prostore/products` folder
- [ ] Uploaded images are present
- [ ] Filenames match publicIds
- [ ] Delete product from app
- [ ] Images still exist in Cloudinary (expected)

## 11. Performance

### Upload Speed
- [ ] Upload 1 image (1MB)
- [ ] Completes in <5 seconds ✅
- [ ] Upload 5 images at once
- [ ] All complete in <15 seconds ✅

### Page Load Speed
- [ ] Product page with 5 images
- [ ] Page loads in <2 seconds ✅
- [ ] Images load progressively
- [ ] No layout shift during load

### Memory Usage
- [ ] Upload 5 large images
- [ ] Check browser memory (Task Manager)
- [ ] No memory leaks
- [ ] Memory released after navigation

## 12. Security

### XSS Prevention
- [ ] Image URLs are sanitized
- [ ] No script injection possible
- [ ] URLs from Cloudinary only

### CORS
- [ ] Images load from Cloudinary domain
- [ ] No CORS errors in console
- [ ] Cross-origin requests allowed

### File Upload Security
- [ ] Cannot upload executable files
- [ ] Cannot upload scripts
- [ ] Only image MIME types accepted
- [ ] File extensions validated

## Testing Summary

**Total Tests:** ~150 checks
**Critical Tests:** ~50
**Nice-to-Have Tests:** ~100

### Priority Levels

**P0 (Must Pass):**
- Basic upload works
- Authentication enforced
- File validation works
- Images persist after save

**P1 (Should Pass):**
- Multiple upload works
- Deletion works
- Error messages clear
- Responsive on mobile

**P2 (Nice to Have):**
- Optimal loading states
- Perfect animations
- Browser compatibility
- Performance targets

---

## Sign-Off

**Tester Name:** ________________  
**Date:** ________________  
**Environment:** ________________  
**Result:** ☐ Pass  ☐ Fail  ☐ Pass with Notes

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

**Blocker Issues:**
_____________________________________________
_____________________________________________

**Minor Issues:**
_____________________________________________
_____________________________________________
