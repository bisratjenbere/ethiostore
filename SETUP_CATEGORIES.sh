#!/bin/bash

echo "🚀 Setting up Category Management Feature"
echo "=========================================="
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi
echo ""

# Step 2: Create and run migration
echo "🗄️  Step 2: Creating database migration..."
npx prisma migrate dev --name add_categories
if [ $? -eq 0 ]; then
    echo "✅ Migration created and applied successfully"
else
    echo "❌ Migration failed"
    echo "💡 If you want to reset the database, run: npx prisma migrate reset"
    exit 1
fi
echo ""

# Step 3: Seed database
echo "🌱 Step 3: Seeding database with categories..."
npx prisma db seed
if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Seeding failed"
    exit 1
fi
echo ""

echo "✨ Setup Complete!"
echo "=================="
echo ""
echo "✅ Category model added to database"
echo "✅ 6 sample categories created"
echo "✅ Sample products and users seeded"
echo ""
echo "Next steps:"
echo "1. Start your dev server: npm run dev"
echo "2. Sign in as admin"
echo "3. Visit: http://localhost:3000/admin/categories"
echo ""
echo "📖 Read CATEGORY_FEATURE_GUIDE.md for more details"
