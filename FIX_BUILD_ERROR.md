# Fix Build Error - Database Migration Required

## Error

```
The column `(not available)` does not exist in the current database.
code: 'P2022'
```

## Cause

The Prisma schema has been updated with the new `Category` model, but the database hasn't been migrated yet.

## Solution

Run these commands in order:

### Step 1: Generate Prisma Client

```bash
npx prisma generate
```

### Step 2: Create and Apply Migration

```bash
npx prisma migrate dev --name add_categories
```

### Step 3: Seed Database

```bash
npx prisma db seed
```

### Step 4: Build Again

```bash
npm run build
```

## Alternative: Use the Setup Script

```bash
chmod +x SETUP_CATEGORIES.sh
./SETUP_CATEGORIES.sh
npm run build
```

## If Migration Fails

If you get migration errors, you can reset the database (WARNING: This deletes all data):

```bash
npx prisma migrate reset
```

This will:
1. Drop all tables
2. Create new tables from schema
3. Run all migrations
4. Run seed script automatically

Then try building again:

```bash
npm run build
```

## Summary

✅ **TypeScript Errors**: All fixed!
⚠️ **Database Migration**: Run migration commands above
🚀 **After Migration**: Build will succeed

The code is correct, you just need to sync your database with the updated schema.
