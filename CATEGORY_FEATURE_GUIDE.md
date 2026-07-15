# Category Management Feature

## Overview

Categories are now fully manageable from the admin panel. This feature allows admins to create, edit, delete, and toggle categories dynamically without code changes.

## What Was Added

### 1. Database Changes

**New Model: `Category`**
- `id` - UUID primary key
- `name` - Category name (unique)
- `slug` - URL-friendly identifier (unique)
- `description` - Optional description
- `image` - Optional category image URL
- `isActive` - Toggle visibility
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

**Product Model Updates**
- Added `categoryId` - Optional foreign key to Category
- Kept existing `category` string field for backward compatibility
- Products can now link to a Category record

### 2. Seed Data

**File**: `db/category-data.ts`

Six sample categories included:
1. Electronics
2. Clothing  
3. Books
4. Home & Kitchen
5. Sports & Outdoors
6. Toys & Games

### 3. Admin Features

#### Admin Pages Created:
- `/admin/categories` - List all categories
- `/admin/categories/new` - Create new category
- `/admin/categories/[id]/edit` - Edit existing category

#### Admin Components:
- `AdminCategoriesTable` - Display categories with actions
- `CategoryForm` - Create/edit form with validation
- Updated `AdminSidebar` - Added Categories navigation item

#### Features:
✅ **List Categories** - View all with product counts
✅ **Create Category** - Add new with auto-slug generation  
✅ **Edit Category** - Update existing
✅ **Delete Category** - Remove (if no products assigned)
✅ **Toggle Status** - Activate/deactivate visibility
✅ **Search & Filter** - Find categories quickly

### 4. Server Actions

**File**: `lib/actions/category.actions.ts`

Functions:
- `getAllCategories()` - Get all with product counts
- `getActiveCategories()` - Get only active
- `getCategoryById(id)` - Get single category
- `createCategory(data)` - Create new
- `updateCategory(id, data)` - Update existing
- `deleteCategory(id)` - Delete (with validation)
- `toggleCategoryStatus(id)` - Toggle active/inactive

## Setup Instructions

### Step 1: Run Database Migration

```bash
# Generate Prisma client with new Category model
npx prisma generate

# Create and run migration
npx prisma migrate dev --name add_categories

# Or reset database (CAUTION: Deletes all data)
npx prisma migrate reset
```

### Step 2: Seed Categories

```bash
# Seed database with sample categories
npx prisma db seed
```

This will create:
- 6 sample categories
- Sample products
- Sample users

### Step 3: Access Admin Panel

1. Sign in as admin (see `docs/ADMIN-CREDENTIALS.md`)
2. Navigate to `/admin/categories`
3. Start managing categories!

## Usage Guide

### Creating a Category

1. Go to `/admin/categories`
2. Click "Add Category"
3. Fill in the form:
   - **Name**: Display name (e.g., "Electronics")
   - **Slug**: Auto-generated from name (editable)
   - **Description**: Optional brief description
   - **Image**: Optional image URL
   - **Active**: Check to make visible
4. Click "Create Category"

### Editing a Category

1. In categories list, click Edit icon
2. Modify fields as needed
3. Click "Update Category"

### Deleting a Category

1. Click Delete icon (trash)
2. Confirm deletion
3. **Note**: Cannot delete if products are assigned

### Toggle Category Status

1. Click toggle icon to activate/deactivate
2. Inactive categories hidden from frontend

## Frontend Integration

### Get Active Categories

```typescript
import { getActiveCategories } from "@/lib/actions/category.actions";

const categories = await getActiveCategories();
```

### Use in Product Filters

```typescript
// Category filter component
const categories = await getActiveCategories();

<select>
  <option value="">All Categories</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.slug}>
      {cat.name}
    </option>
  ))}
</select>
```

### Display Category Products

```typescript
// Filter products by category
const products = await prisma.product.findMany({
  where: {
    categoryRel: {
      slug: categorySlug,
      isActive: true
    }
  }
});
```

## Backward Compatibility

The `category` string field on Product model is retained for:
- Existing products without categoryId
- Migration period
- Fallback display

Products can work with either:
- `category` (string) - Legacy
- `categoryId` (UUID) - New relationship

## Admin Permissions

All category management requires:
- Authenticated session
- Admin role (`role: "admin"`)

Non-admin users cannot:
- Create categories
- Edit categories
- Delete categories
- Toggle status

## Validation Rules

### Category Name
- Minimum 2 characters
- Must be unique

### Slug
- Minimum 2 characters  
- Must be unique
- URL-friendly (lowercase, hyphens)
- Auto-generated from name

### Deletion
- Cannot delete if products assigned
- Must reassign or delete products first

## Future Enhancements

Possible additions:
- [ ] Category hierarchy (parent/child)
- [ ] Category images upload
- [ ] Bulk product category assignment
- [ ] Category SEO metadata
- [ ] Category analytics
- [ ] Category sorting/ordering
- [ ] Category icons
- [ ] Multi-language category names

## Troubleshooting

### Migration Fails

```bash
# Reset and start fresh (WARNING: Deletes data)
npx prisma migrate reset
npx prisma generate
npx prisma db seed
```

### Categories Not Showing

1. Check category `isActive = true`
2. Verify seed ran successfully
3. Check database: `npx prisma studio`

### Cannot Delete Category

Error: "Cannot delete category with X products"

**Solution**: Reassign products or set categoryId to null:

```typescript
await prisma.product.updateMany({
  where: { categoryId: categoryIdToDelete },
  data: { categoryId: null }
});
```

## API Reference

See `lib/actions/category.actions.ts` for complete API documentation.

## Related Files

- `prisma/schema.prisma` - Database schema
- `db/category-data.ts` - Seed data
- `db/seed.ts` - Seeding script
- `lib/actions/category.actions.ts` - Server actions
- `app/admin/categories/**` - Admin pages
- `components/admin/categories/**` - Admin components
- `components/admin/layout/admin-sidebar.tsx` - Navigation

## Testing Checklist

- [ ] Create new category
- [ ] Edit existing category
- [ ] Delete category (with no products)
- [ ] Try deleting category with products (should fail)
- [ ] Toggle category status
- [ ] View category list
- [ ] Check product count accuracy
- [ ] Verify slug auto-generation
- [ ] Test form validation
- [ ] Check admin permissions

## Summary

✅ **Add-to-Cart Buttons Fixed** - Now shows spinner only on clicked button
✅ **Categories Configurable** - Full CRUD from admin panel
✅ **Seed Data Included** - 6 sample categories
✅ **Admin UI Complete** - List, create, edit, delete pages
✅ **Backward Compatible** - Works with existing products

Categories are now a first-class feature in your e-commerce platform!
