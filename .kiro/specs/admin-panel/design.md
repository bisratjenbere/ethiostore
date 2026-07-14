# Admin Panel - Design Document

## Design Overview

This document outlines the technical design for the admin panel feature. The design follows existing project patterns and integrates seamlessly with the current e-commerce platform architecture.

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser/Client                        │
├─────────────────────────────────────────────────────────────┤
│  Admin Pages (Server Components)                             │
│  ├── Dashboard (/admin/dashboard)                           │
│  ├── Orders (/admin/orders)                                 │
│  ├── Products (/admin/products)                             │
│  └── Users (/admin/users)                                   │
├─────────────────────────────────────────────────────────────┤
│  Interactive Components (Client Components)                  │
│  ├── Admin Forms                                            │
│  ├── Data Tables with Actions                               │
│  └── Status Update Buttons                                  │
├─────────────────────────────────────────────────────────────┤
│  Server Actions (/lib/actions)                              │
│  ├── admin.actions.ts (admin operations)                    │
│  ├── product.actions.ts (product CRUD - enhanced)           │
│  └── order.actions.ts (order status updates - enhanced)     │
├─────────────────────────────────────────────────────────────┤
│  Middleware                                                  │
│  └── Admin Route Protection                                 │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL via Prisma)                           │
│  ├── User (role: admin)                                     │
│  ├── Product                                                │
│  ├── Order                                                  │
│  └── OrderItem                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
app/
├── admin/                              # Admin section (protected)
│   ├── layout.tsx                     # Admin layout with sidebar
│   ├── page.tsx                       # Redirect to dashboard
│   ├── dashboard/
│   │   └── page.tsx                   # Dashboard with metrics
│   ├── orders/
│   │   ├── page.tsx                   # Orders list
│   │   └── [id]/
│   │       └── page.tsx               # Order details (admin view)
│   ├── products/
│   │   ├── page.tsx                   # Products list
│   │   ├── new/
│   │   │   └── page.tsx               # Create product form
│   │   └── [id]/
│   │       ├── page.tsx               # Product details
│   │       └── edit/
│   │           └── page.tsx           # Edit product form
│   └── users/
│       ├── page.tsx                   # Users list
│       └── [id]/
│           └── page.tsx               # User details

components/
├── admin/                              # Admin-specific components
│   ├── layout/
│   │   ├── admin-sidebar.tsx          # Navigation sidebar
│   │   ├── admin-header.tsx           # Top bar
│   │   └── admin-breadcrumb.tsx       # Breadcrumb navigation
│   ├── dashboard/
│   │   ├── metric-card.tsx            # Stat cards
│   │   ├── revenue-chart.tsx          # Chart component
│   │   └── recent-orders.tsx          # Recent orders widget
│   ├── orders/
│   │   ├── admin-orders-table.tsx     # Orders table with filters
│   │   ├── order-status-badge.tsx     # Status badges
│   │   └── order-actions.tsx          # Action buttons
│   ├── products/
│   │   ├── admin-products-table.tsx   # Products table
│   │   ├── product-form.tsx           # Create/Edit form
│   │   ├── image-upload.tsx           # Image uploader
│   │   └── product-actions.tsx        # Action buttons
│   └── users/
│       ├── admin-users-table.tsx      # Users table
│       ├── user-details.tsx           # User info display
│       └── role-selector.tsx          # Role dropdown
│
└── ui/                                 # Reuse existing shadcn/ui components

lib/
├── actions/
│   ├── admin.actions.ts               # NEW: Admin-specific actions
│   ├── order.actions.ts               # Enhanced with admin functions
│   └── product.actions.ts             # Enhanced with CRUD operations
│
├── middleware/
│   └── admin-auth.ts                  # Admin route protection
│
└── utils/
    ├── admin-helpers.ts               # Admin utility functions
    └── chart-data.ts                  # Data formatting for charts
```

---

## Database Design

### Schema Changes

#### 1. Make deliveredAt Optional (Fix)
```prisma
model Order {
  // ... existing fields
  deliveredAt  DateTime?  @db.Timestamp()  // Add ? to make optional
}
```

#### 2. Add Soft Delete to Products (Optional but Recommended)
```prisma
model Product {
  // ... existing fields
  isActive     Boolean    @default(true)
  updatedAt    DateTime   @updatedAt @db.Timestamp(6)
}
```

#### 3. User Enhancements (Optional)
```prisma
model User {
  // ... existing fields
  isActive     Boolean    @default(true)
  lastLoginAt  DateTime?  @db.Timestamp(6)
}
```

### Database Queries Optimization

Add indexes for admin queries:
```prisma
model Order {
  @@index([userId])
  @@index([isPaid])
  @@index([isDelivered])
  @@index([createdAt])
}

model Product {
  @@index([category])
  @@index([brand])
  @@index([stock])
}
```

---

## Component Design

### 1. Admin Layout

**File**: `app/admin/layout.tsx`

**Purpose**: Wrapper for all admin pages with sidebar and header

**Structure**:
```tsx
<div className="flex h-screen">
  <AdminSidebar />
  <div className="flex-1 flex flex-col">
    <AdminHeader />
    <main className="flex-1 overflow-auto p-6">
      <AdminBreadcrumb />
      {children}
    </main>
  </div>
</div>
```

**Features**:
- Sidebar navigation (collapsible on tablet)
- Top header with search and user menu
- Breadcrumb navigation
- Protected with middleware
- Responsive layout

---

### 2. Admin Sidebar

**File**: `components/admin/layout/admin-sidebar.tsx`

**Purpose**: Navigation menu for admin sections

**Structure**:
```tsx
<aside className="w-64 bg-card border-r">
  <div className="p-4">
    <Link href="/admin/dashboard">
      <Logo />
    </Link>
  </div>
  
  <nav className="space-y-1 p-2">
    <NavLink href="/admin/dashboard" icon={LayoutDashboard}>
      Dashboard
    </NavLink>
    <NavLink href="/admin/orders" icon={ShoppingCart}>
      Orders
    </NavLink>
    <NavLink href="/admin/products" icon={Package}>
      Products
    </NavLink>
    <NavLink href="/admin/users" icon={Users}>
      Users
    </NavLink>
  </nav>
</aside>
```

**Features**:
- Active link highlighting
- Icon + label for each section
- Collapsible on mobile/tablet
- Sticky positioning

---

### 3. Dashboard Page

**File**: `app/admin/dashboard/page.tsx`

**Purpose**: Overview of key business metrics

**Data Fetching**:
```typescript
// Server action
async function getDashboardMetrics() {
  const [totalRevenue, totalOrders, totalProducts, totalUsers, recentOrders] = 
    await Promise.all([
      // Aggregate queries for metrics
      prisma.order.aggregate({
        where: { isPaid: true },
        _sum: { totalPrice: true }
      }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      })
    ]);
    
  return { totalRevenue, totalOrders, totalProducts, totalUsers, recentOrders };
}
```

**Layout**:
```tsx
<div className="space-y-6">
  <h1>Dashboard</h1>
  
  {/* Metrics Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard title="Total Revenue" value={revenue} icon={DollarSign} />
    <MetricCard title="Total Orders" value={orders} icon={ShoppingCart} />
    <MetricCard title="Products" value={products} icon={Package} />
    <MetricCard title="Customers" value={users} icon={Users} />
  </div>
  
  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <RevenueChart data={revenueData} />
    <OrdersChart data={ordersData} />
  </div>
  
  {/* Recent Activity */}
  <RecentOrders orders={recentOrders} />
</div>
```

---

### 4. Orders Management

**File**: `app/admin/orders/page.tsx`

**Purpose**: View and manage all orders

**Server Action** (`lib/actions/admin.actions.ts`):
```typescript
export async function getAllOrders(filters: {
  page?: number;
  limit?: number;
  isPaid?: boolean;
  isDelivered?: boolean;
  search?: string;
}) {
  const where: Prisma.OrderWhereInput = {
    ...(filters.isPaid !== undefined && { isPaid: filters.isPaid }),
    ...(filters.isDelivered !== undefined && { isDelivered: filters.isDelivered }),
    ...(filters.search && {
      OR: [
        { id: { contains: filters.search, mode: 'insensitive' } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } }
      ]
    })
  };
  
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        orderItems: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit
    }),
    prisma.order.count({ where })
  ]);
  
  return { orders, total, pages: Math.ceil(total / filters.limit) };
}
```

**Update Order Status**:
```typescript
export async function updateOrderPaymentStatus(orderId: string, isPaid: boolean) {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');
  
  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid,
      paidAt: isPaid ? new Date() : null
    }
  });
  
  revalidatePath('/admin/orders');
  return { success: true, message: 'Order payment status updated' };
}

export async function updateOrderDeliveryStatus(orderId: string, isDelivered: boolean) {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');
  
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order.isPaid && isDelivered) {
    throw new Error('Cannot mark unpaid order as delivered');
  }
  
  await prisma.order.update({
    where: { id: orderId },
    data: {
      isDelivered,
      deliveredAt: isDelivered ? new Date() : new Date('2099-12-31')
    }
  });
  
  revalidatePath('/admin/orders');
  return { success: true, message: 'Order delivery status updated' };
}
```

**UI Layout**:
```tsx
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <h1>Orders Management</h1>
    <div className="flex gap-2">
      <SearchInput />
      <FilterDropdown />
    </div>
  </div>
  
  <AdminOrdersTable 
    orders={orders} 
    onUpdatePayment={updatePayment}
    onUpdateDelivery={updateDelivery}
  />
  
  <Pagination currentPage={page} totalPages={pages} />
</div>
```

---

### 5. Products Management

**File**: `app/admin/products/page.tsx`

**Purpose**: View and manage all products

**Server Actions** (`lib/actions/product.actions.ts` - Enhanced):
```typescript
// Get all products (admin)
export async function getAllProducts(filters: {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  inStock?: boolean;
  search?: string;
}) {
  // Similar to getAllOrders with product-specific filters
}

// Create product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');
  
  const validated = insertProductSchema.parse(data);
  
  const product = await prisma.product.create({
    data: validated
  });
  
  revalidatePath('/admin/products');
  revalidatePath('/');
  
  return { success: true, message: 'Product created', productId: product.id };
}

// Update product
export async function updateProduct(id: string, data: Partial<Product>) {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');
  
  await prisma.product.update({
    where: { id },
    data
  });
  
  revalidatePath('/admin/products');
  revalidatePath(`/product/${data.slug}`);
  
  return { success: true, message: 'Product updated' };
}

// Delete product
export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');
  
  // Check if product is in active orders
  const activeOrders = await prisma.orderItem.count({
    where: { productId: id }
  });
  
  if (activeOrders > 0) {
    throw new Error('Cannot delete product with existing orders');
  }
  
  await prisma.product.delete({ where: { id } });
  
  revalidatePath('/admin/products');
  revalidatePath('/');
  
  return { success: true, message: 'Product deleted' };
}
```

**Create/Edit Form** (`app/admin/products/new/page.tsx`):
```tsx
<ProductForm 
  defaultValues={product}
  onSubmit={product ? updateProduct : createProduct}
/>

// ProductForm component
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField name="name" />
    <FormField name="slug" />
    <FormField name="category" />
    <FormField name="brand" />
    <FormField name="description" />
    <FormField name="price" />
    <FormField name="stock" />
    <ImageUpload name="images" />
    <FormField name="isFeatured" type="checkbox" />
    
    <Button type="submit">Save Product</Button>
  </form>
</Form>
```

---

### 6. Users Management

**File**: `app/admin/users/page.tsx`

**Purpose**: View and manage users

**Server Actions** (`lib/actions/admin.actions.ts`):
```typescript
export async function getAllUsers(filters: {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin';
  search?: string;
}) {
  const where: Prisma.UserWhereInput = {
    ...(filters.role && { role: filters.role }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ]
    })
  };
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit
    }),
    prisma.user.count({ where })
  ]);
  
  return { users, total, pages: Math.ceil(total / filters.limit) };
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');
  if (session?.user.id === userId && role === 'user') {
    throw new Error('Cannot demote yourself');
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  });
  
  revalidatePath('/admin/users');
  return { success: true, message: 'User role updated' };
}
```

---

## Security Design

### 1. Middleware Protection

**File**: `middleware.ts` (enhance existing)

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    if (req.auth.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', ...existingMatchers]
};
```

### 2. Server-Side Role Checks

Every admin server action must verify role:
```typescript
async function adminAction() {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  // ... proceed with action
}
```

### 3. Client-Side UI Protection

Hide admin links from non-admins:
```tsx
{session?.user?.role === 'admin' && (
  <Link href="/admin/dashboard">Admin</Link>
)}
```

---

## UI/UX Design

### Design System

**Colors**:
- Use existing theme colors
- Success: green for positive actions
- Danger: red for destructive actions
- Warning: yellow for caution
- Info: blue for informational

**Typography**:
- Headers: `h2-bold` class
- Body: Default text
- Captions: `text-sm text-muted-foreground`

**Spacing**:
- Page padding: `p-6`
- Card padding: `p-4`
- Section gaps: `space-y-6`
- Grid gaps: `gap-4`

### Component Styling

**Metric Card**:
```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </CardContent>
</Card>
```

**Data Table**:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.field1}</TableCell>
        <TableCell>{item.field2}</TableCell>
        <TableCell>
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="destructive">Delete</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## State Management

### Server State (Default)
- Use React Server Components for data fetching
- Pass data as props to client components
- Revalidate paths after mutations

### Client State
- Use `useState` for form state
- Use `useTransition` for async operations
- Use `useRouter` for navigation
- Toast notifications for feedback

### Form State
- React Hook Form for forms
- Zod for validation
- Server actions for submission

---

## Performance Optimization

### 1. Pagination
- Default: 20 items per page
- Implement cursor-based pagination for large datasets
- Load counts asynchronously

### 2. Caching
- Cache dashboard metrics for 5 minutes
- Use React Server Components caching
- Revalidate on mutations

### 3. Database Optimization
- Add indexes on frequently queried fields
- Use select to fetch only needed fields
- Use Promise.all for parallel queries

### 4. Image Optimization
- Use Next.js Image component
- Lazy load images
- Compress images on upload

---

## Error Handling

### Server Actions
```typescript
try {
  // operation
  return { success: true, message: 'Success' };
} catch (error) {
  return { success: false, message: formatError(error) };
}
```

### Client Components
```typescript
startTransition(async () => {
  const res = await serverAction();
  if (!res.success) {
    toast.error(res.message);
    return;
  }
  toast.success(res.message);
});
```

### Page Error Boundaries
```tsx
export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Testing Strategy

### Manual Testing
1. Test all CRUD operations
2. Test role-based access
3. Test validation on all forms
4. Test pagination and filtering
5. Test error scenarios

### Security Testing
1. Attempt admin access as regular user
2. Attempt to bypass middleware
3. Test SQL injection prevention
4. Test XSS prevention

### Performance Testing
1. Test with 100+ products
2. Test with 500+ orders
3. Measure page load times
4. Test dashboard metrics calculation

---

## Implementation Plan

### Phase 1: Foundation (Day 1-2)
1. Create admin layout structure
2. Implement middleware protection
3. Build admin sidebar navigation
4. Create dashboard page skeleton

### Phase 2: Orders (Day 3-4)
5. Build orders list page
6. Implement order filtering
7. Add order status update actions
8. Create order details page

### Phase 3: Products (Day 5-7)
9. Build products list page
10. Create product form (create/edit)
11. Implement image upload
12. Add product delete with validation

### Phase 4: Users (Day 8)
13. Build users list page
14. Create user details page
15. Implement role update

### Phase 5: Dashboard (Day 9-10)
16. Implement dashboard metrics
17. Add revenue/orders charts
18. Create recent activity widgets

### Phase 6: Polish (Day 11-12)
19. Responsive design testing
20. Error handling improvements
21. Performance optimization
22. Documentation

---

## Dependencies

### Existing
- All current dependencies sufficient

### New (Optional)
- **react-dropzone**: For image upload (if implementing upload)
- **recharts**: For dashboard charts
- **date-fns**: For date formatting

---

## API Design

All server actions return consistent format:
```typescript
{
  success: boolean;
  message: string;
  data?: any;
}
```

### Admin Actions API

```typescript
// admin.actions.ts
export async function getDashboardMetrics(): Promise<DashboardMetrics>
export async function getAllOrders(filters: OrderFilters): Promise<PaginatedOrders>
export async function getAllProducts(filters: ProductFilters): Promise<PaginatedProducts>
export async function getAllUsers(filters: UserFilters): Promise<PaginatedUsers>
export async function updateOrderPaymentStatus(orderId: string, isPaid: boolean): Promise<ActionResult>
export async function updateOrderDeliveryStatus(orderId: string, isDelivered: boolean): Promise<ActionResult>
export async function createProduct(data: ProductInput): Promise<ActionResult>
export async function updateProduct(id: string, data: ProductInput): Promise<ActionResult>
export async function deleteProduct(id: string): Promise<ActionResult>
export async function updateUserRole(userId: string, role: Role): Promise<ActionResult>
```

---

## Deployment Considerations

### Environment Variables
- All existing variables sufficient
- Optional: Add admin-specific configs

### Database Migrations
```bash
# After schema changes
npx prisma migrate dev --name admin_enhancements
npx prisma generate
```

### Build
- Ensure admin routes compile
- Verify middleware configuration
- Test production build

---

## Documentation Requirements

### Code Comments
- Document complex logic
- Explain security checks
- Note performance considerations

### User Guide
- How to access admin panel
- How to perform common tasks
- Troubleshooting guide

---

## Success Metrics

✅ All admin routes protected by middleware
✅ Role verification on all server actions  
✅ CRUD operations working for products
✅ Order status updates working
✅ User management working
✅ Dashboard showing accurate metrics
✅ Responsive design for desktop/tablet
✅ Page load times < 2 seconds
✅ All forms validated
✅ Error handling comprehensive

---

**Design Version**: 1.0  
**Status**: Complete - Ready for Implementation  
**Next Step**: Create tasks.md with implementation checklist
