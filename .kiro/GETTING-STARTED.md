# Getting Started - E-Commerce Project

## 🎯 Current Mission: Complete Order Management

Your e-commerce platform is **80% complete**. The final critical piece needed is **order management functionality** so users can actually complete purchases.

## ⚡ Quick Start (For AI)

```
1. I need to implement order management
   → Read: .kiro/specs/order-management.md
   
2. What patterns should I follow?
   → Read: .kiro/steering/ files (auto-loaded)
   
3. What's the current status?
   → Read: .kiro/PROJECT-STATUS.md
```

## 📋 What You Need to Build

### Priority 1: Order Creation (CRITICAL)
**File**: `lib/actions/order.actions.ts`
**Function**: `createOrder()`

**What it does**:
- Takes user's cart and creates an order
- Uses database transaction for atomicity
- Decrements product stock
- Clears the cart
- Returns order ID

**Pattern to follow**: See `steering/database-patterns.md` → Transaction Pattern

---

### Priority 2: Place Order Button
**File**: `components/shared/order/place-order-button.tsx`
**Type**: Client Component

**What it does**:
- Button that calls `createOrder()` 
- Shows loading state
- Displays success/error toasts
- Redirects to order details on success

**Pattern to follow**: See `steering/component-patterns.md` → Interactive Button Pattern

---

### Priority 3: Orders History Page
**File**: `app/user/orders/page.tsx`
**Type**: Server Component

**What it does**:
- Displays all user's orders in a table
- Shows order ID, date, total, status
- Links to order details

**Pattern to follow**: See `steering/component-patterns.md` → Table Pattern

---

### Priority 4: Order Details Page
**File**: `app/user/order/[id]/page.tsx`
**Type**: Server Component

**What it does**:
- Shows complete order information
- Displays order items, shipping, payment
- Shows status badges

**Pattern to follow**: See existing pages like `app/(root)/product/[slug]/page.tsx`

---

## 🎓 Understanding the Project

### Tech Stack
- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5 (JWT)

### Key Patterns

#### Server Actions Must Return:
```typescript
{
  success: boolean;
  message: string;
  data?: any;
}
```

#### Client Components for Interactivity:
```tsx
"use client";

import { useTransition } from "react";

const Component = () => {
  const [isPending, startTransition] = useTransition();
  
  const handleAction = () => {
    startTransition(async () => {
      const res = await serverAction();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };
  
  return <Button onClick={handleAction} disabled={isPending}>...</Button>;
};
```

#### Database Transactions:
```typescript
await prisma.$transaction(async (tx) => {
  // Multiple operations here
  // All succeed or all fail together
});
```

---

## 🗺️ Project Structure

```
app/
├── (auth)/                    # Sign in, sign up
├── (root)/                    # Main shop
│   ├── cart/                 ✅ Working
│   ├── product/[slug]/       ✅ Working
│   ├── shipping-address/     ✅ Working
│   ├── payment-method/       ✅ Working
│   └── place-order/          ⚠️  Needs button
└── user/
    └── orders/               ❌ Needs implementation

lib/actions/
├── cart.actions.ts           ✅ Working
├── product.actions.ts        ✅ Working
├── user.actions.ts           ✅ Working
└── order.actions.ts          ❌ TO BE CREATED

components/shared/
├── product/                  ✅ Working
├── order/                    ⚠️  Partially complete
└── user/                     ✅ Working
```

---

## ✅ Implementation Checklist

Follow this exact order:

### Step 1: Server Actions
- [ ] Create `lib/actions/order.actions.ts`
- [ ] Implement `createOrder()` function
- [ ] Implement `getUserOrders()` function
- [ ] Implement `getOrderById()` function
- [ ] Test each function independently

### Step 2: Place Order Button
- [ ] Create `components/shared/order/place-order-button.tsx`
- [ ] Import and use in `app/(root)/place-order/page.tsx`
- [ ] Test order creation flow
- [ ] Verify cart is cleared
- [ ] Verify stock is updated

### Step 3: Orders List
- [ ] Create `components/shared/order/orders-table.tsx`
- [ ] Update `app/user/orders/page.tsx`
- [ ] Test with multiple orders
- [ ] Test empty state

### Step 4: Order Details
- [ ] Create `app/user/order/[id]/page.tsx`
- [ ] Create supporting components (status card, etc.)
- [ ] Test viewing order details
- [ ] Test security (can't view other's orders)

### Step 5: Navigation
- [ ] Add "My Orders" link to user menu
- [ ] Test navigation flow

---

## 🧪 Testing After Implementation

### Happy Path Test
1. Add products to cart
2. Go to cart page
3. Proceed to checkout
4. Enter shipping address
5. Select payment method
6. Click "Place Order"
7. Verify redirected to order details
8. Check order shows in history
9. Verify cart is empty
10. Verify product stock decreased

### Error Handling Test
1. Try ordering with insufficient stock
2. Try ordering without address
3. Try ordering without payment method
4. Try viewing another user's order
5. Try viewing non-existent order

---

## 📚 Documentation Files

### Must Read
1. **`.kiro/PROJECT-STATUS.md`** - Current status & overview
2. **`.kiro/specs/order-management.md`** - Detailed requirements

### Reference As Needed
3. **`.kiro/steering/coding-standards.md`** - Code patterns
4. **`.kiro/steering/database-patterns.md`** - Prisma usage
5. **`.kiro/steering/component-patterns.md`** - React patterns
6. **`.kiro/steering/project-overview.md`** - Architecture

---

## 🎯 Success Criteria

You're done when:
- ✅ Users can place orders successfully
- ✅ Orders save to database correctly
- ✅ Cart clears after order
- ✅ Stock decrements properly
- ✅ Users can view order history
- ✅ Users can view order details
- ✅ All error cases handled
- ✅ Loading states work
- ✅ Security checks pass

---

## 🚀 After Order Management is Complete

The project will be **90% complete**! Next priorities:

1. **Admin Panel** - Manage products and orders
2. **Payment Integration** - Actual payment processing
3. **Product Search** - Search and filter products
4. **Reviews System** - User product reviews

---

## 💡 Pro Tips

1. **Copy existing patterns** - Look at `cart.actions.ts` for similar server action structure
2. **Use transactions** - Order creation involves multiple DB operations
3. **Convert Decimals** - Prisma Decimals must be converted to strings: `.toString()`
4. **Revalidate paths** - After mutations: `revalidatePath('/path')`
5. **Handle all states** - Loading, error, empty, success
6. **Check security** - Verify user owns the order they're viewing
7. **Test incrementally** - Test each function as you build it
8. **Follow TypeScript** - Type everything properly, no `any`

---

## 🆘 Common Issues

### "Cannot find Prisma client"
**Solution**: Run `npx prisma generate`

### "Type error with Decimal"
**Solution**: Convert to string: `cart.totalPrice.toString()`

### "Cart not clearing"
**Solution**: Ensure cart delete is inside the transaction

### "Order not showing in history"
**Solution**: Check revalidatePath is called, check user ID matches

### "Stock not updating"
**Solution**: Use `stock: { decrement: item.qty }` in transaction

---

## 📞 Quick Commands

```bash
# Start development
npm run dev

# Generate Prisma client (after schema changes)
npx prisma generate

# View database
npx prisma studio

# Run migrations
npx prisma migrate dev
```

---

## 🎉 You're Ready!

You have everything you need:
- ✅ Complete documentation
- ✅ Detailed specifications
- ✅ Code patterns to follow
- ✅ Existing code as reference
- ✅ Testing checklist

**Start with**: `.kiro/specs/order-management.md`

**Good luck! 🚀**

---

*Remember: When in doubt, check the steering files for patterns or look at existing similar code!*
