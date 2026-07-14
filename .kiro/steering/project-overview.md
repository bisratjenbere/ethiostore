# E-Commerce Application - Project Overview

## Project Identity
- **Name**: ProStore (configurable via `NEXT_PUBLIC_APP_NAME`)
- **Type**: Full-featured E-commerce Web Application
- **Stack**: Next.js 16, Prisma, PostgreSQL, NextAuth v5, shadcn/ui, TypeScript

## Project Goal
Build a modular, testable e-commerce platform providing:
- Product catalog with detailed views
- Shopping cart (guest & authenticated)
- Complete checkout flow
- User authentication & profiles
- Order management
- Admin panel for store management

## Core Architecture

### Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5 (JWT sessions)
- **Form Management**: React Hook Form + Zod validation
- **State Management**: React Server Components + Client Components with useTransition
- **Notifications**: Sonner toast library

### Project Structure
```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes (sign-in, sign-up)
│   ├── (root)/              # Main shop routes
│   │   ├── cart/            # Shopping cart
│   │   ├── product/[slug]/  # Product details
│   │   ├── shipping-address/
│   │   ├── payment-method/
│   │   └── place-order/
│   └── user/                # User profile & orders
├── components/
│   ├── shared/              # Reusable business components
│   └── ui/                  # shadcn/ui base components
├── lib/
│   ├── actions/             # Server Actions (API layer)
│   ├── constants/           # App-wide constants
│   ├── utils.ts             # Helper functions
│   └── validators.ts        # Zod schemas
├── prisma/
│   └── schema.prisma        # Database schema
├── types/
│   └── index.ts             # TypeScript type definitions
└── db/
    ├── prisma.ts            # Prisma client instance
    └── sample-data.ts       # Seed data
```

## Database Schema

### Core Models
1. **Product**: Store products with images, pricing, stock, ratings
2. **User**: Authentication, roles (user/admin), addresses, payment methods
3. **Cart**: Session-based or user-linked shopping carts
4. **Order**: Completed orders with payment/delivery status
5. **OrderItem**: Individual items within orders
6. **Account/Session**: NextAuth authentication tables
7. **VerificationToken**: Email verification support

### Key Relationships
- User has many Carts, Orders
- Cart contains items as JSON array
- Order has many OrderItems
- OrderItem references Product

## Current Implementation Status

### ✅ Implemented Features
- User authentication (sign-in, sign-up, session management)
- Product catalog (listing, detail pages)
- Shopping cart (add, remove, update quantities)
- Guest cart with session migration on login
- Checkout flow UI (shipping address, payment method forms)
- User profile data management
- Protected routes middleware
- Role-based access control (schema level)

### ❌ Missing Features (Priority Order)
1. **CRITICAL**: Order creation/placement functionality
2. **CRITICAL**: Order history page
3. **HIGH**: Order details view
4. **HIGH**: Admin panel (products, orders, users management)
5. **MEDIUM**: Payment gateway integration
6. **MEDIUM**: Product search & filtering
7. **LOW**: Product reviews submission
8. **LOW**: Email notifications
9. **LOW**: OAuth providers (Google, GitHub)

## Key Configuration

### Environment Variables
```env
NEXT_PUBLIC_APP_NAME=prostore
NEXT_PUBLIC_APP_DESCRIPTION="A modern store built with Next.js"
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
LATEST_PRODUCT_LIMIT=4
PAYMENT_METHODS=PayPal,Stripe,CashOnDelivery
DEFAULT_PAYMENT_METHOD=PayPal
DATABASE_URL=postgresql://...
AUTH_SECRET=...
```

### Protected Routes
Defined in `lib/constants/index.ts`:
- `/shipping-address`, `/payment-method`, `/place-order`
- `/profile`, `/user/*`, `/order/*`
- `/admin` (not implemented yet)

## Checkout Flow
1. **User Login** (authentication required)
2. **Shipping Address** (form with validation)
3. **Payment Method** (selection from configured methods)
4. **Place Order** (⚠️ UI exists but order creation NOT implemented)

## Payment Methods
Configurable via environment variable:
- PayPal (default)
- Stripe
- Cash on Delivery

Payment is currently stored as preference only - no actual payment processing implemented.

## Session Cart Logic
- Guest users get session-based cart (cookie: `sessionCartId`)
- On login, guest cart automatically migrates to user account
- Cart persists in database with calculated prices (items, shipping, tax, total)

## Price Calculations
- **Items Price**: Sum of (price × quantity) for all items
- **Shipping**: Free if items price > $100, otherwise $10
- **Tax**: 15% of items price
- **Total**: items + shipping + tax

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Open Prisma Studio GUI
- `npx prisma db seed` - Seed database with sample data

## Notes for AI Implementation
- Always maintain existing patterns and conventions
- Follow the established file structure
- Use server actions for all data mutations
- Implement proper error handling with toast notifications
- Use Zod for all input validation
- Keep components modular and reusable
- Maintain TypeScript type safety
- Follow Next.js 16 App Router best practices
- Use React Server Components by default, mark client components with "use client"
