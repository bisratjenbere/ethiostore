# Implementation Plan: Admin Panel

## Overview

This implementation plan breaks down the admin panel feature into actionable coding tasks following the 6-phase implementation plan outlined in the design document. Each task is designed to be incremental, building upon previous work, and ending with a fully integrated admin panel for managing orders, products, users, and viewing analytics.

**Technology Stack**: Next.js 16 (App Router), TypeScript, React 19, Prisma, PostgreSQL, shadcn/ui, Tailwind CSS

**Implementation Approach**: Follow existing project patterns, use server actions for all mutations, implement proper error handling with toast notifications, and maintain TypeScript type safety throughout.

---

## Tasks

### Phase 1: Foundation & Infrastructure

- [ ] 1. Database schema updates and middleware setup
  - Update Prisma schema: Make `Order.deliveredAt` optional (`DateTime?`)
  - Add optional fields to Product model: `isActive` (Boolean, default true), `updatedAt` (DateTime)
  - Add indexes for performance: Order (userId, isPaid, isDelivered, createdAt), Product (category, brand, stock)
  - Run migration: `npx prisma migrate dev --name admin_panel_enhancements`
  - Generate Prisma client: `npx prisma generate`
  - Update middleware.ts to protect `/admin/*` routes (check auth and role === 'admin')
  - Update `lib/constants/index.ts` to include `/admin` in protected routes array
  - Test middleware protection by attempting to access /admin as non-admin user
  - _Requirements: US-1.1, FR-1.1, FR-1.2, NFR-2.1, NFR-2.2_

- [ ] 2. Create admin layout and navigation structure
  - Create `app/admin/layout.tsx` with sidebar and main content area
  - Create `components/admin/layout/admin-sidebar.tsx` with navigation links (Dashboard, Orders, Products, Users)
  - Create `components/admin/layout/admin-header.tsx` with breadcrumb and user menu
  - Implement responsive layout (collapsible sidebar on tablet/mobile)
  - Style using Tailwind CSS following existing design patterns
  - Add lucide-react icons for navigation items (LayoutDashboard, ShoppingCart, Package, Users)
  - _Requirements: US-1.2, UIR-1_

- [ ] 3. Create admin redirect and dashboard skeleton
  - Create `app/admin/page.tsx` that redirects to `/admin/dashboard`
  - Create `app/admin/dashboard/page.tsx` as server component with metadata
  - Add page title and basic layout structure
  - Create `components/admin/dashboard/metric-card.tsx` for displaying key metrics
  - Set up grid layout for metric cards (4 columns on desktop, 2 on tablet, 1 on mobile)
  - _Requirements: US-5.1, UIR-5_

- [ ] 4. Update user header to show admin link
  - Update `components/shared/header/user-button.tsx` to conditionally show "Admin" menu item
  - Check `session?.user?.role === 'admin'` before displaying admin link
  - Link to `/admin/dashboard` with appropriate icon
  - Test visibility: admin users see link, regular users don't
  - _Requirements: US-1.2_

- [ ] 5. Checkpoint - Verify foundation
  - Test admin route protection (non-admin redirected, admin can access)
  - Test admin navigation (all links render, sidebar responsive)
  - Test dashboard skeleton loads without errors
  - Test admin link appears only for admin users
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 2: Order Management

- [ ] 6. Create admin server actions for orders
  - Create `lib/actions/admin.actions.ts` file with "use server" directive
  - Implement `getAllOrders()` with pagination, filtering (isPaid, isDelivered), and search (order ID, user email)
  - Add role verification: check `session?.user?.role === 'admin'` at start of each function
  - Include user data and order items in query using Prisma `include`
  - Return paginated response: `{ orders, total, pages }`
  - Use proper TypeScript types for function parameters and return values
  - Handle errors with try/catch and return formatted error messages
  - _Requirements: US-2.1, FR-2.1, NFR-2.2_

- [ ] 7. Implement order status update actions
  - [ ] 7.1 Add `updateOrderPaymentStatus(orderId: string, isPaid: boolean)` function
    - Verify admin role
    - Update order: set `isPaid` and `paidAt` (current date if paid, null if unpaid)
    - Call `revalidatePath('/admin/orders')` after update
    - Return success/error response
    - _Requirements: US-2.3, FR-2.2_
  
  - [ ] 7.2 Add `updateOrderDeliveryStatus(orderId: string, isDelivered: boolean)` function
    - Verify admin role
    - Fetch order to check if paid
    - Validate: Cannot mark unpaid order as delivered (throw error)
    - Update order: set `isDelivered` and `deliveredAt` (current date if delivered)
    - Call `revalidatePath('/admin/orders')` after update
    - Return success/error response
    - _Requirements: US-2.4, FR-2.3, FR-2.4_

- [ ] 8. Create orders list page with filtering
  - Create `app/admin/orders/page.tsx` as async server component
  - Add metadata: `title: "Order Management"`
  - Parse searchParams for: page, isPaid, isDelivered, search query
  - Call `getAllOrders()` with filters
  - Create `components/admin/orders/admin-orders-table.tsx` (client component)
  - Display orders in table with columns: Order ID (truncated), Customer, Date, Total, Payment Status, Delivery Status, Actions
  - Add search input for order ID/customer email
  - Add filter dropdowns for payment status and delivery status
  - Implement pagination controls (Previous/Next, page numbers)
  - Show total orders count
  - Handle empty state: "No orders found"
  - _Requirements: US-2.1, FR-2.1, UIR-2_

- [ ] 9. Add order status update buttons
  - Create `components/admin/orders/order-actions.tsx` (client component)
  - Add "Mark as Paid" button (show only if `isPaid === false`)
  - Add "Mark as Delivered" button (show only if `isDelivered === false`)
  - Use `useTransition` for loading states during updates
  - Show confirmation dialog before status changes (use shadcn/ui AlertDialog)
  - Call respective server actions (`updateOrderPaymentStatus`, `updateOrderDeliveryStatus`)
  - Display toast notifications for success/error feedback
  - Disable buttons during pending state
  - _Requirements: US-2.3, US-2.4, UIR-4, NFR-3.2_

- [ ] 10. Create order details page (admin view)
  - Create `app/admin/orders/[id]/page.tsx` as async server component
  - Fetch order with all relations (user, orderItems with product)
  - Display order information in cards: Customer Info, Shipping Address, Order Items, Payment Info, Delivery Info
  - Show order timeline: Created date, Paid date (if paid), Delivered date (if delivered)
  - Display price breakdown: Items Price, Shipping, Tax, Total
  - Reuse existing components where possible: `OrderItems`, `OrderPrice`
  - Include status update buttons at top of page
  - Add "Back to Orders" navigation link
  - _Requirements: US-2.2, FR-2.1_

- [ ] 11. Checkpoint - Verify order management
  - Test viewing all orders with different filters
  - Test search functionality
  - Test pagination
  - Test marking order as paid (verify database update and UI refresh)
  - Test marking order as delivered (verify validation: cannot deliver unpaid order)
  - Test order details page displays correctly
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 3: Product Management

- [ ] 12. Create product management server actions
  - [ ] 12.1 Add `getAllProducts()` to `admin.actions.ts`
    - Implement pagination, filtering (category, brand, inStock), and search (name, slug)
    - Verify admin role
    - Return paginated response: `{ products, total, pages }`
    - _Requirements: US-3.1, FR-3.1_
  
  - [ ] 12.2 Add `createProduct()` to `lib/actions/product.actions.ts`
    - Verify admin role
    - Validate input using Zod schema from `lib/validators.ts`
    - Create product in database
    - Revalidate `/admin/products` and `/` paths
    - Return success response with product ID
    - _Requirements: US-3.2, FR-3.2_
  
  - [ ] 12.3 Add `updateProduct()` to `product.actions.ts`
    - Verify admin role
    - Validate input with Zod
    - Update product in database
    - Revalidate `/admin/products` and product detail page
    - Return success response
    - _Requirements: US-3.3, FR-3.2_
  
  - [ ] 12.4 Add `deleteProduct()` to `product.actions.ts`
    - Verify admin role
    - Check if product exists in any orders (count OrderItems)
    - If in orders, throw error: "Cannot delete product with existing orders"
    - Delete product if safe
    - Revalidate paths
    - Return success response
    - _Requirements: US-3.4, FR-3.5_

- [ ] 13. Create products list page
  - Create `app/admin/products/page.tsx` as async server component
  - Add metadata: `title: "Product Management"`
  - Parse searchParams for filters and pagination
  - Call `getAllProducts()` with filters
  - Create `components/admin/products/admin-products-table.tsx` (client component)
  - Display products in table: Image (thumbnail), Name, Category, Brand, Price, Stock, Actions
  - Add "Add Product" button at top (links to `/admin/products/new`)
  - Add search input for product name/slug
  - Add filter dropdowns for category, brand, stock status
  - Show low stock indicator (stock < 10) with warning badge
  - Show out of stock badge (stock === 0)
  - Implement pagination
  - _Requirements: US-3.1, FR-3.1, UIR-2_

- [ ] 14. Create product form component (create/edit)
  - Create `components/admin/products/product-form.tsx` (client component)
  - Use React Hook Form with Zod validation
  - Add form fields: Name, Slug (auto-generate from name, editable), Category, Brand, Description (textarea), Price (number), Stock (number), isFeatured (checkbox)
  - Add images field (text array input for now - multiple image URLs separated by newlines)
  - Add optional banner field (text input)
  - Implement auto-slug generation: convert name to lowercase, replace spaces with hyphens
  - Use `useTransition` for submit loading state
  - Handle form submission with appropriate server action (create or update)
  - Display validation errors using FormMessage
  - Show success toast and redirect on successful submission
  - _Requirements: US-3.2, US-3.3, FR-3.2, UIR-3_

- [ ] 15. Create new product page
  - Create `app/admin/products/new/page.tsx` (client component)
  - Add metadata: `title: "Add New Product"`
  - Render `ProductForm` component without default values
  - Set form action to `createProduct`
  - Add "Cancel" button that navigates back to products list
  - _Requirements: US-3.2_

- [ ] 16. Create edit product pages
  - Create `app/admin/products/[id]/page.tsx` as async server component (product details view for admin)
  - Fetch product by ID
  - Display product information in card layout
  - Add "Edit" and "Delete" action buttons
  - Create `app/admin/products/[id]/edit/page.tsx` (client component)
  - Add metadata: `title: "Edit Product"`
  - Fetch product data and pass as defaultValues to ProductForm
  - Set form action to `updateProduct`
  - _Requirements: US-3.3_

- [ ] 17. Add product delete functionality
  - Create `components/admin/products/product-actions.tsx` (client component)
  - Add "Delete" button with destructive variant
  - Show confirmation dialog: "Are you sure? This cannot be undone. Products in orders cannot be deleted."
  - Use `useTransition` for loading state
  - Call `deleteProduct()` server action
  - Handle error if product is in orders (show error toast)
  - Redirect to products list on success
  - _Requirements: US-3.4, FR-3.5, UIR-4_

- [ ] 18. Checkpoint - Verify product management
  - Test viewing all products with filters
  - Test creating new product (verify database entry and storefront visibility)
  - Test editing product (verify updates appear immediately)
  - Test deleting product (verify validation prevents deletion of products in orders)
  - Test slug auto-generation
  - Test form validation (all required fields)
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 4: User Management

- [ ] 19. Create user management server actions
  - [ ] 19.1 Add `getAllUsers()` to `admin.actions.ts`
    - Implement pagination, filtering (role), and search (name, email)
    - Verify admin role
    - Use Prisma `select` to exclude password field
    - Include order count: `_count: { select: { orders: true } }`
    - Return paginated response: `{ users, total, pages }`
    - _Requirements: US-4.1, FR-4.1_
  
  - [ ] 19.2 Add `getUserDetails(userId: string)` to `admin.actions.ts`
    - Verify admin role
    - Fetch user with order history (include orders with orderItems)
    - Calculate total spent (sum of all paid orders)
    - Exclude password from response
    - Return user details with orders and totalSpent
    - _Requirements: US-4.2, FR-4.2_
  
  - [ ] 19.3 Add `updateUserRole(userId: string, role: 'user' | 'admin')` to `admin.actions.ts`
    - Verify admin role
    - Check if userId === current user's ID and role === 'user' (prevent self-demotion)
    - If self-demotion, throw error: "Cannot demote yourself"
    - Update user role in database
    - Revalidate `/admin/users` path
    - Return success response
    - _Requirements: US-4.3, FR-4.3, FR-4.4_

- [ ] 20. Create users list page
  - Create `app/admin/users/page.tsx` as async server component
  - Add metadata: `title: "User Management"`
  - Parse searchParams for filters and pagination
  - Call `getAllUsers()` with filters
  - Create `components/admin/users/admin-users-table.tsx` (client component)
  - Display users in table: Name, Email, Role (badge), Registration Date, Order Count, Actions
  - Add search input for name/email
  - Add filter dropdown for role (All, User, Admin)
  - Show total users count
  - Implement pagination
  - Add "View Details" action button for each user
  - _Requirements: US-4.1, FR-4.1, UIR-2_

- [ ] 21. Create user details page
  - Create `app/admin/users/[id]/page.tsx` as async server component
  - Add metadata: `title: "User Details"`
  - Call `getUserDetails()` with user ID
  - Display user profile in cards: Profile Info (name, email, role), Address, Payment Method
  - Show account statistics: Total Spent, Total Orders, Registration Date
  - Display order history table (reuse OrdersTable component or create simplified version)
  - Add role selector component for changing user role
  - Add "Back to Users" navigation link
  - _Requirements: US-4.2, FR-4.2_

- [ ] 22. Add role update functionality
  - Create `components/admin/users/role-selector.tsx` (client component)
  - Display current role with badge
  - Add dropdown/select for role change (User, Admin options)
  - Show confirmation dialog when role changes: "Are you sure you want to change this user's role?"
  - Use `useTransition` for loading state
  - Call `updateUserRole()` server action
  - Handle self-demotion error gracefully (show error toast)
  - Show success toast and refresh page data
  - _Requirements: US-4.3, FR-4.3, FR-4.4, UIR-4_

- [ ] 23. Checkpoint - Verify user management
  - Test viewing all users with filters
  - Test search functionality
  - Test viewing user details with order history
  - Test updating user role (verify database update)
  - Test self-demotion prevention (verify error message)
  - Test order count calculation accuracy
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 5: Dashboard & Analytics

- [ ] 24. Implement dashboard metrics calculation
  - Add `getDashboardMetrics()` to `admin.actions.ts`
  - Verify admin role
  - Use Promise.all for parallel queries:
    - Total revenue: Aggregate sum of totalPrice for paid orders
    - Total orders: Count all orders
    - Total products: Count all products
    - Total users: Count all users
    - Orders today: Count orders created today
    - Revenue today: Sum of totalPrice for paid orders created today
    - Recent orders: Fetch last 5 orders with user data
  - Convert Decimal values to strings for client
  - Return all metrics in single response object
  - _Requirements: US-5.1, FR-5.1_

- [ ] 25. Build dashboard metric cards
  - Update `app/admin/dashboard/page.tsx` to call `getDashboardMetrics()`
  - Pass metrics to MetricCard components
  - Update `components/admin/dashboard/metric-card.tsx` to accept: title, value, icon, change (optional)
  - Create 4 primary metric cards: Total Revenue, Total Orders, Products, Customers
  - Create 3 secondary metric cards: Orders Today, Revenue Today, Pending Orders
  - Style with appropriate icons (DollarSign, ShoppingCart, Package, Users)
  - Format currency values using `FormatCurrency()` utility
  - Display in responsive grid layout
  - _Requirements: US-5.1, UIR-5_

- [ ] 26. Create recent orders widget
  - Update `components/admin/dashboard/recent-orders.tsx` (server component or receives data as props)
  - Display last 5 orders in compact table format
  - Show: Order ID (truncated), Customer Name, Total, Status badges
  - Add "View All Orders" link to `/admin/orders`
  - Handle empty state: "No recent orders"
  - _Requirements: US-5.1_

- [ ] 27. Add revenue and orders trend charts (optional enhancement)
  - Install recharts: `npm install recharts` (if implementing charts)
  - Create `components/admin/dashboard/revenue-chart.tsx` (client component)
  - Fetch last 30 days revenue data (group by date)
  - Render line chart showing revenue trend
  - Create `components/admin/dashboard/orders-chart.tsx` (client component)
  - Fetch last 30 days orders count (group by date)
  - Render line chart showing orders trend
  - Add charts to dashboard below metric cards
  - Note: This task is optional for MVP, can be deferred
  - _Requirements: US-5.1, US-5.2 (optional)_

- [ ] 28. Checkpoint - Verify dashboard analytics
  - Test all metrics calculate correctly
  - Test metric cards display formatted values
  - Test recent orders widget shows latest orders
  - Verify dashboard loads quickly (check query performance)
  - Test responsive layout on different screen sizes
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 6: Polish & Quality Assurance

- [ ] 29. Implement responsive design improvements
  - Test admin layout on tablet (768px) and desktop (1024px+)
  - Ensure sidebar collapses to hamburger menu on tablet
  - Verify all tables are scrollable horizontally on small screens
  - Test forms are usable on tablet screens
  - Ensure metric cards stack properly on mobile (if accessed)
  - Fix any layout issues or overlapping elements
  - _Requirements: NFR-3.5, UIR-1_

- [ ] 30. Enhance error handling and user feedback
  - Review all server actions for consistent error handling
  - Ensure all errors return user-friendly messages (no raw database errors)
  - Verify all mutations show loading states (buttons disabled, spinners visible)
  - Confirm all success/error operations display toast notifications
  - Test error scenarios: network failures, validation errors, permission errors
  - Add error boundaries where appropriate
  - _Requirements: NFR-3.2, NFR-3.3, UIR-3_

- [ ] 31. Optimize performance and database queries
  - Review all Prisma queries for proper use of `select` and `include`
  - Ensure indexes are created for frequently queried fields
  - Test pagination performance with large datasets (seed more data if needed)
  - Verify dashboard metrics calculation is efficient
  - Add database query optimization where needed
  - Test page load times meet < 2 second requirement
  - _Requirements: NFR-1.1, NFR-1.2, NFR-5.2_

- [ ] 32. Add confirmation dialogs for critical actions
  - Ensure all destructive actions have confirmation dialogs:
    - Delete product
    - Update order payment status
    - Update order delivery status
    - Change user role
  - Use shadcn/ui AlertDialog component
  - Style dangerous actions with red/destructive variant
  - Test confirmation dialogs work correctly (Cancel and Confirm buttons)
  - _Requirements: UIR-4, NFR-3.4_

- [ ] 33. Create status badge components
  - Create `components/admin/orders/order-status-badge.tsx`
  - Implement badges for: Paid/Unpaid, Delivered/Pending
  - Use appropriate colors: green for positive, red for negative, yellow for pending
  - Ensure badges are consistent across order list and details pages
  - Create similar badge component for product stock status (In Stock, Low Stock, Out of Stock)
  - _Requirements: UIR-2_

- [ ] 34. Add breadcrumb navigation
  - Update `components/admin/layout/admin-header.tsx` to include breadcrumbs
  - Show current page path: Dashboard / Orders / Order Details
  - Make breadcrumb items clickable (link to parent pages)
  - Test breadcrumbs update correctly on navigation
  - _Requirements: UIR-1_

- [ ] 35. Implement search and filter persistence
  - Update order, product, and user list pages to use URL search params
  - Ensure filters persist on page refresh
  - Test: Apply filters → Navigate away → Back button → Filters still applied
  - Update pagination to work with filters (maintain filter state across pages)
  - _Requirements: NFR-3.1_

- [ ] 36. Add loading skeletons for better UX
  - Create skeleton components for: tables, metric cards, forms
  - Use shadcn/ui Skeleton component
  - Add loading states to pages that fetch data
  - Test loading states appear during data fetching
  - _Requirements: NFR-3.2_

- [ ] 37. Final testing and validation
  - Test complete order management workflow (view, filter, update status)
  - Test complete product management workflow (create, edit, delete)
  - Test complete user management workflow (view, update role)
  - Verify admin middleware protection (test as non-admin user)
  - Test all form validations work correctly
  - Verify all server actions have proper error handling
  - Test responsive design on different screen sizes
  - Run TypeScript type checking: `npx tsc --noEmit`
  - Run linter: `npm run lint`
  - _Requirements: All functional and non-functional requirements_

- [ ] 38. Documentation and cleanup
  - Remove any console.log statements
  - Add JSDoc comments to complex functions
  - Update .env.example if new environment variables added (none expected)
  - Clean up any unused imports or files
  - Verify all components follow existing project patterns
  - _Requirements: NFR-4.2, NFR-4.3, NFR-4.4_

- [ ] 39. Final checkpoint - Complete verification
  - Run full test suite (if tests exist)
  - Build production bundle: `npm run build`
  - Fix any build errors or warnings
  - Test built application: `npm run start`
  - Verify all features work in production build
  - Confirm admin panel meets all success criteria
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- **Task Dependencies**: Tasks within each phase should generally be completed in order, as later tasks build on earlier ones
- **Optional Tasks**: Task 27 (charts) is marked as optional and can be deferred for future enhancement
- **Checkpoints**: Checkpoint tasks (5, 11, 18, 23, 28, 39) are opportunities to pause, verify work, and consult with the user
- **Code Patterns**: All tasks should follow the established patterns in the codebase (server components by default, server actions for mutations, React Hook Form for forms, Zod for validation)
- **Testing**: Manual testing is expected throughout. Run the development server frequently to verify changes
- **Revalidation**: Remember to call `revalidatePath()` after any mutations that affect displayed data
- **Security**: All admin server actions must verify `session?.user?.role === 'admin'` before proceeding
- **Error Handling**: All server actions must use try/catch and return consistent `{ success, message }` format
- **TypeScript**: Maintain strict type safety throughout - no `any` types unless absolutely necessary

---

## Success Criteria

✅ Admin can view and manage all orders (view, filter, update payment/delivery status)  
✅ Admin can create, edit, and delete products  
✅ Admin can view users and update roles  
✅ Admin dashboard displays accurate business metrics  
✅ All admin routes protected by middleware (role verification)  
✅ All mutations include proper error handling and user feedback  
✅ All forms include validation  
✅ Critical actions require confirmation  
✅ Responsive design works on desktop and tablet  
✅ Page load times meet performance requirements  
✅ Code follows existing project patterns and standards  
✅ TypeScript compilation succeeds without errors  
✅ Production build completes successfully

---

**Document Version**: 1.0  
**Status**: Ready for Implementation  
**Estimated Effort**: 39 tasks across 6 phases  
**Next Step**: Begin Phase 1 - Foundation & Infrastructure
