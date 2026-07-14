#!/bin/bash
# ========================================
# RECOVERY SCRIPT - Run this to recover all files from stash
# ========================================

echo "🔄 Starting full recovery from stash 803e349..."
echo ""

# Step 1: Commit current recovered changes
echo "📝 Step 1: Committing currently recovered files..."
git add -A
git commit -m "feat: partial recovery - cart, checkout, prisma schema, and core files

- Enhanced cart UI with free shipping indicator
- Guest checkout support on place order page
- Added Review model to database schema
- Admin role protection in proxy
- Simplified protected paths in constants"

echo "✅ Step 1 complete!"
echo ""

# Step 2: Get list of changed code files
echo "📋 Step 2: Getting list of code files from stash..."
CHANGED_FILES=$(git diff --name-only HEAD 803e349 | grep -E '\.(ts|tsx|js|jsx|css|prisma)$')
FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l)
echo "Found $FILE_COUNT code files to recover"
echo ""

# Step 3: Checkout all code files from stash
echo "🔄 Step 3: Recovering all code files from stash..."
git checkout 803e349 -- $(git diff --name-only HEAD 803e349 | grep -E '\.(ts|tsx|js|jsx|css|prisma)$')
echo "✅ Step 3 complete!"
echo ""

# Step 4: Show what changed
echo "📊 Step 4: Files recovered:"
git status --short
echo ""

# Step 5: Commit all recovered files
echo "💾 Step 5: Committing all recovered files..."
git add -A
git commit -m "feat: complete stash recovery - all code files restored

Recovered from stash 803e349:
- Enhanced homepage with promotional banners and new sections
- Improved product detail pages with review system
- Better shipping and payment forms with guest support
- New homepage components (newsletter, trust badges, social proof)
- Review system (model, actions, and UI components)
- Admin page improvements
- Enhanced product components and cards
- Updated styles and UI components
- Product and order action improvements

Total files recovered: $FILE_COUNT"

echo "✅ Step 5 complete!"
echo ""

# Step 6: Install dependencies
echo "📦 Step 6: Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# Step 7: Generate Prisma client
echo "🗄️  Step 7: Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated!"
echo ""

# Step 8: Run migrations
echo "🔄 Step 8: Running database migrations..."
echo "⚠️  Note: This will create the Review model in your database"
read -p "Press Enter to continue with migration, or Ctrl+C to skip..."
npx prisma migrate dev --name add_review_model_and_indexes
echo "✅ Migrations complete!"
echo ""

# Summary
echo "=========================================="
echo "🎉 RECOVERY COMPLETE!"
echo "=========================================="
echo ""
echo "✅ All code files recovered from stash"
echo "✅ Dependencies installed"
echo "✅ Prisma client generated"
echo "✅ Database migrations applied"
echo ""
echo "🚀 Next steps:"
echo "1. Start the dev server: npm run dev"
echo "2. Test the app at: http://localhost:3000"
echo "3. Check these pages:"
echo "   - / (enhanced homepage)"
echo "   - /cart (modern cart UI)"
echo "   - /shop (products)"
echo "   - /product/[any] (with reviews)"
echo "   - /place-order (guest checkout)"
echo ""
echo "📚 Documentation:"
echo "- README_RECOVERY.md - Quick start"
echo "- RECOVERY_FINAL_SUMMARY.md - Complete summary"
echo "- CHANGES_APPLIED.md - Detailed changes"
echo ""
echo "Happy coding! 🎉"
