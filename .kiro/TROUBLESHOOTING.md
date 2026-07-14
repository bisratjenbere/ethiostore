# Troubleshooting Guide

## Fixed Issues

### 1. File Watch Limit Error (RESOLVED)

**Problem:**
```
Error [TurbopackInternalError]: OS file watch limit reached.
```

**Root Cause:**
Linux systems have a default `inotify` watch limit (typically 65,536) that's insufficient for large Next.js projects with many files.

**Solution Applied:**
```bash
# Increase the watch limit to 524,288
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Verification:**
```bash
cat /proc/sys/fs/inotify/max_user_watches
# Should output: 524288
```

**Note:** This change persists across reboots.

---

### 2. Missing AUTH_SECRET (RESOLVED)

**Problem:**
```
[auth][error] MissingSecret: Please define a `secret`.
```

**Solution Applied:**
Added required environment variables to `.env`:
```env
AUTH_SECRET="[generated-secure-random-string]"
NEXT_PUBLIC_APP_NAME="ProStore"
NEXT_PUBLIC_APP_DESCRIPTION="A modern e-commerce store built with Next.js"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
LATEST_PRODUCT_LIMIT=4
PAYMENT_METHODS="PayPal,Stripe,CashOnDelivery"
DEFAULT_PAYMENT_METHOD="PayPal"
```

---

## Current Status

✅ Development server running on http://localhost:3000
✅ All environment variables configured
✅ File watch limit increased
✅ HTTP 200 responses confirmed

---

## Common Issues & Solutions

### Database Connection Issues
If you encounter Prisma database errors:
```bash
# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Open Prisma Studio to inspect data
npx prisma studio
```

### Port Already in Use
If port 3000 is already in use:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors
If you see import errors:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm ci

# Regenerate Prisma client
npx prisma generate
```

### TypeScript Errors
```bash
# Run type checking
npx tsc --noEmit

# Clear TypeScript cache
rm -rf node_modules/.cache
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Database operations
npx prisma migrate dev --name migration_name
npx prisma db seed
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate
```

---

## System Requirements Check

### Node.js Version
```bash
node --version  # Should be 18.x or higher
```

### PostgreSQL
```bash
psql --version  # Should be running and accessible
```

### System Limits
```bash
# Check inotify limits
cat /proc/sys/fs/inotify/max_user_watches  # Should be 524288

# Check max user instances
cat /proc/sys/fs/inotify/max_user_instances  # Should be sufficient
```

---

## Next Steps

1. ✅ Server is running successfully
2. Access the application at http://localhost:3000
3. Test authentication flow (sign-up/sign-in)
4. Test shopping cart functionality
5. Complete checkout flow
6. Check order management features

If you encounter any new issues, document them here with the solution for future reference.
