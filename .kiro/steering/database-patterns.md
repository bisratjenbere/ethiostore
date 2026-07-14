# Database Patterns & Prisma Usage

## Prisma Client Setup

### Client Instance
```typescript
// db/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Always Import From
```typescript
import { prisma } from "@/db/prisma";
```

## Schema Patterns

### UUID Primary Keys
All models use UUID primary keys with database-generated defaults:
```prisma
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
```

### Timestamp Fields
```prisma
createdAt DateTime @default(now()) @db.Timestamp(6)
updatedAt DateTime @updatedAt @db.Timestamp(6)
```

### Decimal Fields for Money
Always use Decimal type for monetary values:
```prisma
price Decimal @default(0) @db.Decimal(12, 2)
```

### JSON Fields
For flexible data structures (cart items, addresses):
```prisma
items Json[] @default([]) @db.Json
address Json? @db.Json
```

### Foreign Keys with Cascade
```prisma
userId String @db.Uuid
user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)
```

## Query Patterns

### Find Single Record
```typescript
// By ID
const user = await prisma.user.findFirst({
  where: { id: userId }
});

// By unique field
const product = await prisma.product.findFirst({
  where: { slug: productSlug }
});

// With null check
if (!user) throw new Error("User not found");
```

### Find with Relations
```typescript
const order = await prisma.order.findFirst({
  where: { id: orderId },
  include: {
    user: {
      select: {
        name: true,
        email: true
      }
    },
    orderItems: {
      include: {
        product: true
      }
    }
  }
});
```

### Find Many with Filtering
```typescript
// Latest products
const products = await prisma.product.findMany({
  take: LATEST_PRODUCT_LIMIT,
  orderBy: {
    createdAt: "desc"
  }
});

// With conditions
const orders = await prisma.order.findMany({
  where: {
    userId: userId,
    isPaid: true
  },
  orderBy: {
    createdAt: "desc"
  }
});
```

### Find or Create Pattern
```typescript
const cart = await prisma.cart.findFirst({
  where: userId ? { userId } : { sessionCartId }
});

if (!cart) {
  await prisma.cart.create({
    data: newCartData
  });
}
```

## Mutation Patterns

### Create
```typescript
const order = await prisma.order.create({
  data: {
    userId: userId,
    shippingAddress: addressData,
    paymentMethod: "PayPal",
    itemsPrice: "99.99",
    shippingPrice: "10.00",
    taxPrice: "14.99",
    totalPrice: "124.98"
  }
});
```

### Create with Relations
```typescript
const order = await prisma.order.create({
  data: {
    userId: userId,
    // ... order fields
    orderItems: {
      create: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price.toString(),
        image: item.image
      }))
    }
  }
});
```

### Update
```typescript
await prisma.user.update({
  where: { id: userId },
  data: {
    address: addressData,
    paymentMethod: "Stripe"
  }
});
```

### Update with JSON Arrays
```typescript
await prisma.cart.update({
  where: { id: cartId },
  data: {
    items: updatedItems as Prisma.CartUpdateitemsInput[],
    itemsPrice: newItemsPrice,
    totalPrice: newTotalPrice
  }
});
```

### Delete
```typescript
await prisma.cart.delete({
  where: { id: cartId }
});
```

### Delete Many
```typescript
await prisma.cart.deleteMany({
  where: {
    sessionCartId: sessionId,
    userId: null
  }
});
```

## Transaction Patterns

### Simple Transaction
Use transactions when you need multiple operations to succeed or fail together:
```typescript
await prisma.$transaction(async (tx) => {
  // Operation 1: Find existing cart
  const existingCart = await tx.cart.findFirst({
    where: { userId: userId }
  });
  
  // Operation 2: Delete if exists
  if (existingCart) {
    await tx.cart.delete({
      where: { id: existingCart.id }
    });
  }
  
  // Operation 3: Create new cart
  await tx.cart.create({
    data: newCartData
  });
});
```

### Order Creation Transaction Pattern
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Create order
  const order = await tx.order.create({
    data: orderData
  });
  
  // 2. Create order items
  for (const item of cartItems) {
    await tx.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.productId,
        // ... other fields
      }
    });
  }
  
  // 3. Update product stock
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
  
  // 4. Delete cart
  await tx.cart.delete({
    where: { id: cartId }
  });
  
  return order;
});
```

## Data Type Handling

### Decimal to String Conversion
Prisma Decimal types must be converted to strings for client:
```typescript
return convertToPlainObject({
  ...cart,
  itemsPrice: cart.itemsPrice.toString(),
  shippingPrice: cart.shippingPrice.toString(),
  taxPrice: cart.taxPrice.toString(),
  totalPrice: cart.totalPrice.toString()
});
```

### JSON Field Handling
Cast JSON fields to proper types:
```typescript
const cart = await prisma.cart.findFirst({
  where: { id: cartId }
});

const items = cart.items as cartItem[];
```

### Date Handling
Dates are automatically handled by Prisma, but for comparison:
```typescript
const recentOrders = await prisma.order.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  }
});
```

## Common Patterns

### Cart Operations
```typescript
// Get user or session cart
const cart = await prisma.cart.findFirst({
  where: userId ? { userId } : { sessionCartId }
});

// Update cart items (stored as JSON array)
const items = cart.items as cartItem[];
const existingItem = items.find(i => i.productId === productId);

if (existingItem) {
  existingItem.qty += 1;
} else {
  items.push(newItem);
}

await prisma.cart.update({
  where: { id: cart.id },
  data: {
    items: items as Prisma.CartUpdateitemsInput[]
  }
});
```

### User Address Update
```typescript
await prisma.user.update({
  where: { id: userId },
  data: {
    address: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      country: "USA",
      postalCode: "10001"
    }
  }
});
```

### Product Stock Check
```typescript
const product = await prisma.product.findFirst({
  where: { id: productId }
});

if (product.stock < requestedQty) {
  throw new Error("Not enough stock");
}
```

## Performance Best Practices

### Select Only Needed Fields
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
    // Exclude password, other sensitive fields
  }
});
```

### Use Include vs Select
- **Include**: Add relations to all fields
- **Select**: Choose specific fields only

```typescript
// Include (gets all user fields + orders)
const user = await prisma.user.findFirst({
  where: { id: userId },
  include: {
    orders: true
  }
});

// Select (only specified fields)
const user = await prisma.user.findFirst({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    orders: {
      select: {
        id: true,
        totalPrice: true
      }
    }
  }
});
```

### Batch Operations
Use `createMany` for bulk inserts:
```typescript
await prisma.orderItem.createMany({
  data: items.map(item => ({
    orderId: orderId,
    productId: item.productId,
    qty: item.qty,
    price: item.price
  }))
});
```

## Error Handling

### Unique Constraint Violations
```typescript
try {
  await prisma.user.create({
    data: userData
  });
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new Error('Email already exists');
    }
  }
  throw error;
}
```

### Foreign Key Violations
```typescript
// Check existence before creating relation
const product = await prisma.product.findFirst({
  where: { id: productId }
});

if (!product) {
  throw new Error("Product not found");
}

// Now safe to create order item
await prisma.orderItem.create({
  data: {
    orderId: orderId,
    productId: productId,
    // ...
  }
});
```

## Migration Best Practices

### Create Migration
```bash
npx prisma migrate dev --name descriptive_migration_name
```

### Generate Prisma Client
After schema changes:
```bash
npx prisma generate
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

## Seeding Pattern

### db/seed.ts Structure
```typescript
import { prisma } from "./prisma";

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  
  // Seed products
  await prisma.product.createMany({
    data: sampleProducts
  });
  
  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Schema Output Configuration

### Generated Client Location
```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}
```

Import from generated location:
```typescript
import { Prisma } from "@/lib/generated/prisma/client";
```

## Critical Rules

1. **Always use transactions** for multi-step operations that must be atomic
2. **Check existence** before operations on related data
3. **Validate stock** before order creation
4. **Convert Decimals** to strings when returning to client
5. **Cast JSON fields** to proper TypeScript types
6. **Use UUIDs** for all primary keys (already configured)
7. **Handle unique constraints** gracefully in try-catch
8. **Select only needed fields** for performance
9. **Use cascade deletes** appropriately (already configured)
10. **Revalidate paths** after mutations affecting displayed data
