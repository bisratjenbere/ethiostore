# Admin Panel - Requirements Document

## Feature Overview

Build a comprehensive admin panel that allows administrators to manage the e-commerce platform including orders, products, and users. The admin panel provides essential store management capabilities through a secure, role-based interface.

---

## User Stories

### Epic 1: Admin Authentication & Access Control

**US-1.1: Admin Role Verification**
- **As an** admin user
- **I want to** access admin-only pages
- **So that** I can manage the store

**Acceptance Criteria:**
- Only users with `role: admin` can access `/admin/*` routes
- Non-admin users are redirected to homepage with error message
- Admin routes are protected by middleware
- Unauthorized access attempts are logged

**US-1.2: Admin Navigation**
- **As an** admin user
- **I want to** see an "Admin" link in my user menu
- **So that** I can quickly access the admin panel

**Acceptance Criteria:**
- Admin link visible only to users with admin role
- Link navigates to `/admin/dashboard`
- Link has distinct visual indicator (icon)

---

### Epic 2: Order Management

**US-2.1: View All Orders**
- **As an** admin
- **I want to** see a list of all orders in the system
- **So that** I can monitor sales and order status

**Acceptance Criteria:**
- Display all orders in paginated table
- Show: Order ID, Customer Name, Date, Total, Payment Status, Delivery Status
- Default sort: Newest first
- Filter by: Payment status (All/Paid/Unpaid)
- Filter by: Delivery status (All/Delivered/Pending)
- Search by: Order ID or customer email
- Show total orders count
- Pagination: 20 orders per page

**US-2.2: View Order Details**
- **As an** admin
- **I want to** view complete details of any order
- **So that** I can verify order information and resolve issues

**Acceptance Criteria:**
- Click order to view full details
- Display: Customer info, shipping address, payment method, all items
- Show order timeline (created, paid, delivered dates)
- Display payment status and delivery status
- Show order total breakdown

**US-2.3: Update Order Payment Status**
- **As an** admin
- **I want to** mark orders as paid
- **So that** I can manually confirm payments

**Acceptance Criteria:**
- "Mark as Paid" button visible on unpaid orders
- Clicking button updates `isPaid: true` and sets `paidAt` date
- Action requires confirmation dialog
- Success toast notification shown
- Order list refreshes after update
- Audit log entry created

**US-2.4: Update Order Delivery Status**
- **As an** admin
- **I want to** mark orders as delivered
- **So that** I can track order fulfillment

**Acceptance Criteria:**
- "Mark as Delivered" button visible on undelivered orders
- Clicking button updates `isDelivered: true` and sets `deliveredAt` date
- Action requires confirmation dialog
- Success toast notification shown
- Order list refreshes after update
- Cannot mark as delivered if not paid (validation)

**US-2.5: Order Statistics Dashboard**
- **As an** admin
- **I want to** see order statistics
- **So that** I can track business performance

**Acceptance Criteria:**
- Display total orders count
- Display total revenue (sum of all paid orders)
- Display pending orders count
- Display orders today count
- Show revenue trend (last 7 days chart)
- Display recent orders (last 5)

---

### Epic 3: Product Management

**US-3.1: View All Products**
- **As an** admin
- **I want to** see a list of all products
- **So that** I can manage product inventory

**Acceptance Criteria:**
- Display all products in table/grid
- Show: Image, Name, Category, Brand, Price, Stock, Actions
- Paginated: 20 products per page
- Search by: Product name or slug
- Filter by: Category, Brand, Stock status (In Stock/Out of Stock)
- Sort by: Name, Price, Stock, Created date
- Show total products count
- Show low stock indicator (stock < 10)

**US-3.2: Create New Product**
- **As an** admin
- **I want to** add new products to the store
- **So that** I can expand product offerings

**Acceptance Criteria:**
- "Add Product" button opens create form
- Required fields: Name, Slug, Category, Brand, Description, Price, Stock, Images
- Optional fields: Banner, isFeatured
- Auto-generate slug from name (editable)
- Image upload support (multiple images)
- Validate all fields before submission
- Success toast on creation
- Redirect to product list after creation
- New product visible in store immediately

**US-3.3: Edit Product**
- **As an** admin
- **I want to** update existing product information
- **So that** I can keep product data accurate

**Acceptance Criteria:**
- "Edit" button on each product
- Pre-populate form with current values
- All fields editable
- Validate changes before submission
- Success toast on update
- Product updates visible in store immediately
- Track last updated timestamp

**US-3.4: Delete Product**
- **As an** admin
- **I want to** remove products from the store
- **So that** I can discontinue items

**Acceptance Criteria:**
- "Delete" button on each product
- Confirmation dialog: "Are you sure? This cannot be undone."
- Cannot delete product if it's in active orders
- Success toast on deletion
- Product removed from store immediately
- Soft delete option (mark as inactive instead of hard delete)

**US-3.5: Update Product Stock**
- **As an** admin
- **I want to** quickly update product stock levels
- **So that** I can maintain accurate inventory

**Acceptance Criteria:**
- Inline stock editor on product list
- Enter new stock value and save
- Validation: Stock must be non-negative integer
- Success feedback on update
- Low stock warning if stock < 10
- Out of stock badge if stock = 0

**US-3.6: Bulk Product Actions**
- **As an** admin
- **I want to** perform actions on multiple products
- **So that** I can work efficiently

**Acceptance Criteria:**
- Checkbox selection for multiple products
- "Select All" checkbox
- Bulk actions: Delete, Update Category, Update Featured Status
- Confirmation for bulk delete
- Success message shows count of affected products

---

### Epic 4: User Management

**US-4.1: View All Users**
- **As an** admin
- **I want to** see a list of all registered users
- **So that** I can manage customer accounts

**Acceptance Criteria:**
- Display all users in table
- Show: Name, Email, Role, Registration Date, Order Count
- Paginated: 50 users per page
- Search by: Name or email
- Filter by: Role (All/User/Admin)
- Sort by: Name, Registration date, Order count
- Show total users count

**US-4.2: View User Details**
- **As an** admin
- **I want to** view user profile and order history
- **So that** I can assist customers

**Acceptance Criteria:**
- Click user to view details
- Display: Profile info, shipping address, payment method
- Show user's order history
- Display total spent by user
- Show account creation date
- Cannot view user passwords

**US-4.3: Update User Role**
- **As an** admin
- **I want to** promote users to admin or demote admins
- **So that** I can manage admin access

**Acceptance Criteria:**
- Role dropdown on user details page
- Options: User, Admin
- Confirmation dialog for role changes
- Cannot demote self (prevent lockout)
- Success toast on role update
- Audit log entry created

**US-4.4: Deactivate User Account**
- **As an** admin
- **I want to** deactivate problematic user accounts
- **So that** I can prevent abuse

**Acceptance Criteria:**
- "Deactivate Account" button on user profile
- Confirmation dialog required
- Deactivated users cannot sign in
- Deactivated users' orders remain visible
- Can reactivate account later
- Audit log entry created

---

### Epic 5: Dashboard & Analytics

**US-5.1: Admin Dashboard Overview**
- **As an** admin
- **I want to** see key metrics at a glance
- **So that** I can monitor business health

**Acceptance Criteria:**
- Display summary cards:
  - Total Revenue (all time)
  - Total Orders (all time)
  - Total Products (active)
  - Total Users (registered)
- Show today's metrics:
  - Orders today
  - Revenue today
  - New users today
- Display charts:
  - Revenue trend (last 30 days)
  - Orders trend (last 30 days)
  - Top selling products (last 30 days)
- Show recent activity:
  - Latest 5 orders
  - Recently added products
  - New user registrations

**US-5.2: Sales Reports**
- **As an** admin
- **I want to** generate sales reports
- **So that** I can analyze business performance

**Acceptance Criteria:**
- Date range selector (from/to)
- Report metrics:
  - Total sales
  - Order count
  - Average order value
  - Revenue by category
  - Revenue by payment method
- Export report as CSV
- Print-friendly view

---

## Functional Requirements

### FR-1: Authentication & Authorization
- **FR-1.1**: System must verify user role before granting admin access
- **FR-1.2**: Admin routes must be protected by middleware
- **FR-1.3**: System must redirect unauthorized users
- **FR-1.4**: System must maintain audit log of admin actions

### FR-2: Order Management
- **FR-2.1**: System must display all orders with filtering and search
- **FR-2.2**: System must allow updating order payment status
- **FR-2.3**: System must allow updating order delivery status
- **FR-2.4**: System must validate status changes (e.g., can't deliver unpaid orders)
- **FR-2.5**: System must update timestamps when status changes

### FR-3: Product Management
- **FR-3.1**: System must support CRUD operations for products
- **FR-3.2**: System must validate product data before saving
- **FR-3.3**: System must handle multiple product images
- **FR-3.4**: System must auto-generate slugs from product names
- **FR-3.5**: System must prevent deletion of products in active orders
- **FR-3.6**: System must support bulk product operations

### FR-4: User Management
- **FR-4.1**: System must display all users with search and filter
- **FR-4.2**: System must allow viewing user profiles and order history
- **FR-4.3**: System must allow updating user roles
- **FR-4.4**: System must prevent self-demotion (admin removing own admin role)
- **FR-4.5**: System must support account deactivation

### FR-5: Dashboard & Analytics
- **FR-5.1**: System must calculate and display real-time metrics
- **FR-5.2**: System must generate revenue and order trends
- **FR-5.3**: System must identify top-selling products
- **FR-5.4**: System must support date range filtering for reports

---

## Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1**: Admin pages must load in < 2 seconds
- **NFR-1.2**: Product list with 1000+ products must render efficiently
- **NFR-1.3**: Search and filter operations must complete in < 500ms
- **NFR-1.4**: Dashboard metrics must be cached and refresh every 5 minutes

### NFR-2: Security
- **NFR-2.1**: All admin routes must require authentication
- **NFR-2.2**: Role verification must happen on server-side
- **NFR-2.3**: Sensitive operations must require confirmation
- **NFR-2.4**: Admin actions must be logged for audit trail
- **NFR-2.5**: SQL injection must be prevented (use Prisma parameterization)

### NFR-3: Usability
- **NFR-3.1**: Admin interface must be intuitive and consistent
- **NFR-3.2**: Actions must provide immediate feedback (toasts)
- **NFR-3.3**: Forms must have proper validation and error messages
- **NFR-3.4**: Critical actions must require confirmation
- **NFR-3.5**: Interface must be responsive for tablet/desktop

### NFR-4: Maintainability
- **NFR-4.1**: Code must follow existing project patterns
- **NFR-4.2**: Components must be reusable and modular
- **NFR-4.3**: Server actions must follow standard response format
- **NFR-4.4**: Admin code must be well-documented

### NFR-5: Scalability
- **NFR-5.1**: Pagination must be implemented for large datasets
- **NFR-5.2**: Database queries must be optimized with proper indexes
- **NFR-5.3**: Image uploads must handle multiple files efficiently
- **NFR-5.4**: Reports must handle large date ranges without timeout

---

## Data Requirements

### DR-1: User Role Enhancement
- Add `isActive` field to User model (for account deactivation)
- Existing `role` field (user/admin) is sufficient

### DR-2: Product Data
- All fields already exist in Product model
- Consider adding `isActive` field for soft delete
- Consider adding `updatedAt` timestamp

### DR-3: Order Data
- Fix `deliveredAt` to be optional (`DateTime?`)
- All other fields already exist

### DR-4: Audit Log (Optional but Recommended)
```prisma
model AuditLog {
  id        String   @id @default(dbgenerated("gen_random_uuid()"))
  userId    String
  action    String   // "ORDER_PAID", "PRODUCT_CREATED", etc.
  entityType String  // "Order", "Product", "User"
  entityId  String
  changes   Json?    // What changed
  createdAt DateTime @default(now())
  
  user User @relation(...)
}
```

---

## User Interface Requirements

### UIR-1: Admin Layout
- Sidebar navigation with sections:
  - Dashboard
  - Orders
  - Products
  - Users
  - Reports (optional)
- Top bar with: Logo, Search, User menu
- Breadcrumb navigation
- Responsive for desktop and tablet (mobile optional)

### UIR-2: Tables
- Sortable columns (click header to sort)
- Filterable columns (dropdown filters)
- Search bar (global search)
- Pagination controls
- Row actions (edit, delete, view)
- Bulk selection checkboxes

### UIR-3: Forms
- Clear field labels
- Validation with error messages
- Required field indicators
- Cancel and Save buttons
- Loading states during submission
- Success/error feedback

### UIR-4: Confirmation Dialogs
- Title explaining the action
- Description of consequences
- Cancel and Confirm buttons
- Dangerous actions use red color
- Close on cancel or after confirmation

### UIR-5: Dashboard Cards
- Metric value (large text)
- Metric label
- Trend indicator (up/down arrow with percentage)
- Comparison text ("vs last month")
- Icon representing the metric

---

## Integration Requirements

### IR-1: Existing Features
- Use existing auth system (NextAuth)
- Use existing Prisma models
- Follow existing component patterns
- Use existing UI components (shadcn/ui)

### IR-2: External Services (Future)
- Image upload service (Cloudinary/Uploadcare)
- Email service (for notifications)
- Analytics service (optional)

---

## Constraints

### C-1: Technical Constraints
- Must use Next.js 16 App Router
- Must use Prisma for database operations
- Must use shadcn/ui components
- Must follow existing code patterns
- Must maintain TypeScript type safety

### C-2: Business Constraints
- Admin features are internal tools (not customer-facing)
- Must not break existing user features
- Must maintain data integrity
- Performance should not impact storefront

### C-3: Security Constraints
- Admin access is privilege-based
- Cannot bypass authentication
- Must validate all inputs
- Must prevent unauthorized data access

---

## Success Criteria

### SC-1: Functional Completeness
✅ Admin can view and manage all orders
✅ Admin can create, edit, and delete products
✅ Admin can view and manage users
✅ Admin can see business metrics and analytics
✅ All actions provide appropriate feedback
✅ Security measures are in place

### SC-2: Quality Standards
✅ Code passes all linting checks
✅ TypeScript compilation succeeds
✅ All server actions include error handling
✅ All forms include validation
✅ All critical actions require confirmation
✅ Responsive design for desktop/tablet

### SC-3: Performance Standards
✅ Page load times < 2 seconds
✅ Search/filter operations < 500ms
✅ Large datasets handled with pagination
✅ No impact on storefront performance

---

## Out of Scope (Future Enhancements)

- Advanced analytics and reporting
- Product import/export (CSV/Excel)
- Bulk image upload
- Product variants (sizes, colors)
- Inventory tracking (purchase orders)
- Customer segmentation
- Marketing campaigns
- Email templates
- Discount/coupon management
- Shipping provider integration
- Tax calculation automation
- Multi-language support
- Multi-currency support

---

## Assumptions

1. Admin users are trusted store operators
2. Admin panel accessed on desktop/tablet (not mobile)
3. Product images stored in public directory or CDN
4. Database can handle expected data volume
5. One admin can manage entire store
6. No need for role hierarchy (just user/admin)

---

## Dependencies

### D-1: Completed Features
- ✅ User authentication system
- ✅ Order management (user side)
- ✅ Product display system
- ✅ Database schema

### D-2: Required Libraries
- All dependencies already installed
- May need: react-dropzone (for image upload)
- May need: recharts (for dashboard charts)

---

## Risk Assessment

### R-1: High Risk
- **Risk**: Accidental product deletion affecting active orders
- **Mitigation**: Validate before delete, use soft delete, confirmation dialog

### R-2: Medium Risk
- **Risk**: Admin accidentally demoting themselves
- **Mitigation**: Prevent self-demotion, require super admin for role changes

### R-3: Medium Risk
- **Risk**: Large datasets causing performance issues
- **Mitigation**: Implement pagination, optimize queries, add indexes

### R-4: Low Risk
- **Risk**: Unauthorized access to admin panel
- **Mitigation**: Server-side role verification, protected routes, middleware

---

## Testing Requirements

### TR-1: Manual Testing
- Test all CRUD operations for products
- Test order status updates
- Test role-based access control
- Test pagination and filtering
- Test validation on all forms

### TR-2: Security Testing
- Attempt admin access as non-admin user
- Attempt to update another admin's role
- Test SQL injection prevention
- Test XSS prevention in forms

### TR-3: Performance Testing
- Test with 100+ products
- Test with 500+ orders
- Test dashboard load time
- Test search performance

---

## Implementation Priority

### Phase 1: Foundation (Must Have)
1. Admin middleware and route protection
2. Admin layout and navigation
3. Basic dashboard with metrics

### Phase 2: Order Management (Must Have)
4. View all orders (with filtering)
5. Order details page
6. Update order status (paid/delivered)

### Phase 3: Product Management (Must Have)
7. View all products (with filtering)
8. Create new product
9. Edit product
10. Delete product

### Phase 4: User Management (Should Have)
11. View all users
12. User details page
13. Update user role

### Phase 5: Analytics (Nice to Have)
14. Dashboard charts
15. Sales reports
16. Top products report

---

## Approval Checklist

Before proceeding to design:
- [ ] All user stories reviewed and approved
- [ ] Functional requirements clear and complete
- [ ] Non-functional requirements feasible
- [ ] Data requirements identified
- [ ] UI requirements understood
- [ ] Success criteria agreed upon
- [ ] Out of scope items confirmed
- [ ] Implementation priority set

---

**Document Version**: 1.0  
**Status**: Draft - Ready for Review  
**Next Step**: Review requirements → Create design document
