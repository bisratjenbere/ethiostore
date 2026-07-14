# Order Management Feature Specification

## Overview
Implement complete order management functionality including order creation, order history, order details, and cart cleanup. This is the **CRITICAL** missing piece that completes the checkout flow.

## Priority: CRITICAL
Without this feature, users cannot complete purchases. The checkout flow UI exists but doesn't create orders in the database.

---

## Feature 1: Order Creation (Place Order)

### Current State
- `/place-order` page displays order summary
- No "Place Order" button exists
- No server action to create orders
- Cart is not cleared after order

### Requirements

#### 1.1 Create Order Server Action
**File**: `lib/actions/order.actions.ts`

**Function**: `createOrder()`

**Logic**:
1. Get authenticated user session
2. Get user's cart
3. Validate cart has items
4. Validate user has shipping address and payment method
5. Validate product stock for all cart items
6. Use Prisma transaction to:
   - Create Order record
   - Create OrderItem records for each cart item
   - Decrement product stock for each item
   - Delete user's cart
7. Revalidate relevant paths
8. Return success with order ID

**Validation**:
- User must be authenticated
- Cart must exist and have items
- User must have shipping address
- User must have payment method
- All products must have sufficient stock

**Transaction Steps**:
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Verify stock for all items
  for (const item of cartItems) {
    const product = await tx.product.findFirst({
      where: { id: item.productId }
    });
    if (!product || product.stock < item.qty) {
      throw new Error(`Insufficient stock for ${item.name}`);
    }
  }
  
  // 2. Create order
  const order = await tx.order.create({
    data: {
      userId: userId,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    }
  });
  
  // 3. Create order items (use createMany for performance)
  await tx.orderItem.createMany({
    data: cartItems.map(item => ({
      orderId: order.id,
      productId: item.productId,
      name: item.name,
      qty: item.qty,
      price: item.price.toString(),
      image: item.image
    }))
  });
  
  // 4. Update product stock
  for (const item of cartItems) {
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.qty
        }
      }
    });
  }
  
  // 5. Delete cart
  await tx.cart.delete({
    where: { id: cart.id }
  });
  
  return order;
});
```

**Return Type**:
```typescript
{
  success: boolean;
  message: string;
  orderId?: string;
}
```

#### 1.2 Update Place Order Page
**File**: `app/(root)/place-order/page.tsx`

**Changes**:
- Import `PlaceOrderButton` component (to be created)
- Pass cart and user data to button component

#### 1.3 Create Place Order Button Component
**File**: `components/shared/order/place-order-button.tsx`

**Type**: Client Component

**Props**:
```typescript
{
  cart: Cart;
  userId: string;
}
```

**Features**:
- Loading state with spinner
- Calls `createOrder()` server action
- Shows success toast with order ID
- Redirects to order details page on success
- Shows error toast on failure
- Disabled during loading

**UI**:
```tsx
<Card>
  <CardContent className="p-4">
    <Button 
      onClick={handlePlaceOrder}
      disabled={isPending}
      className="w-full"
      size="lg"
    >
      {isPending ? (
        <Loader className="animate-spin mr-2" />
      ) : null}
      Place Order
    </Button>
  </CardContent>
</Card>
```

---

## Feature 2: Order History Page

### Current State
- `/user/orders` page is a stub showing only "orders" text

### Requirements

#### 2.1 Create Get User Orders Action
**File**: `lib/actions/order.actions.ts`

**Function**: `getUserOrders()`

**Logic**:
1. Get authenticated user session
2. Query orders with user ID
3. Include order items and product details
4. Order by creation date (newest first)
5. Convert Decimals to strings
6. Return orders array

**Query Pattern**:
```typescript
const orders = await prisma.order.findMany({
  where: { userId: userId },
  include: {
    orderItems: {
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            images: true
          }
        }
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

#### 2.2 Implement Orders Page
**File**: `app/user/orders/page.tsx`

**Requirements**:
- Fetch orders using `getUserOrders()`
- Display orders in table format
- Show order ID (first 8 chars), date, total, payment status, delivery status
- Link to order details page
- Handle empty state (no orders yet)
- Add metadata

**Layout**:
```tsx
<div className="container mx-auto py-8">
  <h1 className="h2-bold mb-6">My Orders</h1>
  <OrdersTable orders={orders} />
</div>
```

#### 2.3 Create Orders Table Component
**File**: `components/shared/order/orders-table.tsx`

**Type**: Server Component

**Features**:
- Responsive table layout
- Columns: Order ID, Date, Total, Paid Status, Delivered Status, Actions
- Status badges (paid/unpaid, delivered/pending)
- "View Details" button linking to `/user/order/[id]`
- Empty state message

---

## Feature 3: Order Details Page

### Requirements

#### 3.1 Create Get Order By ID Action
**File**: `lib/actions/order.actions.ts`

**Function**: `getOrderById(orderId: string)`

**Logic**:
1. Get authenticated user session
2. Query order with relations (items, products, user info)
3. Verify order belongs to user (security check)
4. Convert Decimals to strings
5. Return order data

**Security**: 
```typescript
if (order.userId !== session.user.id && session.user.role !== 'admin') {
  throw new Error("Unauthorized");
}
```

#### 3.2 Create Order Details Page
**File**: `app/user/order/[id]/page.tsx`

**Route**: `/user/order/[id]`

**Requirements**:
- Fetch order using `getOrderById()`
- Display comprehensive order information
- Show order status
- Display all order items
- Show shipping address
- Show payment method
- Show price breakdown
- Handle not found (404)
- Add metadata with order ID

**Sections**:
1. **Order Header**: Order ID, Date, Status badges
2. **Shipping Address**: Display from order data
3. **Payment Method**: Display payment method used
4. **Order Items**: Table with product image, name, quantity, price
5. **Price Summary**: Items, Shipping, Tax, Total

**Layout**:
```tsx
<div className="container mx-auto py-8">
  <h1 className="h2-bold mb-6">Order Details</h1>
  <div className="grid md:grid-cols-3 gap-6">
    <div className="md:col-span-2 space-y-4">
      <OrderStatusCard order={order} />
      <ShippingAddressCard address={order.shippingAddress} />
      <PaymentMethodCard method={order.paymentMethod} />
      <OrderItemsTable items={order.orderItems} />
    </div>
    <div>
      <OrderPriceSummary order={order} />
    </div>
  </div>
</div>
```

#### 3.3 Create Order Status Card Component
**File**: `components/shared/order/order-status-card.tsx`

**Features**:
- Display order ID (with copy button)
- Display order date
- Show payment status badge
- Show delivery status badge
- If paid, show payment date
- If delivered, show delivery date

---

## Feature 4: Update Navigation

### Requirements

#### 4.1 Add Orders Link to User Menu
**File**: `components/shared/header/user-button.tsx`

**Changes**:
- Add "My Orders" link to dropdown menu
- Link to `/user/orders`

---

## Database Schema Verification

### Confirm Schema (Already Correct)
```prisma
model Order {
  id              String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId          String      @db.Uuid
  shippingAddress Json        @db.Json
  paymentMethod   String
  paymentResult   Json?       // For future payment integration
  itemsPrice      Decimal     @db.Decimal(12, 2)
  shippingPrice   Decimal     @db.Decimal(12, 2)
  taxPrice        Decimal     @db.Decimal(12, 2)
  totalPrice      Decimal     @db.Decimal(12, 2)
  isPaid          Boolean     @default(false)
  paidAt          DateTime?   @db.Timestamp(6)
  isDelivered     Boolean     @default(false)
  deliveredAt     DateTime    @db.Timestamp()
  createdAt       DateTime    @default(now()) @db.Timestamp(6)
  user            User        @relation(...)
  orderItems      OrderItem[]
}

model OrderItem {
  orderId   String  @db.Uuid
  name      String
  qty       Int
  price     Decimal @db.Decimal(12, 2)
  image     String
  productId String  @db.Uuid
  product   Product @relation(...)
  order     Order   @relation(...)
  
  @@id([orderId, productId])
}
```

**Note**: Schema is already correct. No migration needed.

---

## Type Definitions

### Update Types (Already Exists)
**File**: `types/index.ts`

Verify these types exist:
```typescript
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  isDelivered: boolean;
  orderItems: orderItem[];
  user: { name: string; email: string };
};

export type orderItem = z.infer<typeof insertOrderItemSchema>;
```

---

## Testing Checklist

### Manual Testing Steps
1. **Order Creation**:
   - [ ] Add items to cart
   - [ ] Complete checkout flow (address, payment)
   - [ ] Click "Place Order" button
   - [ ] Verify order created in database
   - [ ] Verify cart is deleted
   - [ ] Verify product stock decreased
   - [ ] Verify redirect to order details page

2. **Order History**:
   - [ ] Navigate to "My Orders"
   - [ ] Verify all user orders displayed
   - [ ] Verify correct order information
   - [ ] Verify status badges correct
   - [ ] Click "View Details" button

3. **Order Details**:
   - [ ] Verify all order information displayed
   - [ ] Verify order items correct
   - [ ] Verify price calculations correct
   - [ ] Verify shipping address displayed
   - [ ] Verify payment method displayed

4. **Edge Cases**:
   - [ ] Try ordering with insufficient stock (should fail gracefully)
   - [ ] Try viewing another user's order (should fail)
   - [ ] Try viewing non-existent order (should 404)
   - [ ] Test with empty cart (should redirect)

---

## Implementation Order

1. ✅ Create `lib/actions/order.actions.ts` with all server actions
2. ✅ Create `components/shared/order/place-order-button.tsx`
3. ✅ Update `app/(root)/place-order/page.tsx`
4. ✅ Create `components/shared/order/orders-table.tsx`
5. ✅ Update `app/user/orders/page.tsx`
6. ✅ Create `app/user/order/[id]/page.tsx`
7. ✅ Create supporting components (order-status-card, etc.)
8. ✅ Update navigation menu
9. ✅ Test entire flow

---

## Success Criteria

✅ Users can successfully place orders
✅ Orders are created in database with all required data
✅ Cart is cleared after order placement
✅ Product stock is decremented correctly
✅ Users can view their order history
✅ Users can view detailed order information
✅ All edge cases handled gracefully
✅ Proper error messages displayed
✅ Loading states work correctly
✅ Navigation updated with orders link

---

## Future Enhancements (Not in This Spec)
- Order cancellation
- Order status updates by admin
- Email notifications on order placement
- Order tracking numbers
- Invoice generation
- Order search and filtering
- Export order history
