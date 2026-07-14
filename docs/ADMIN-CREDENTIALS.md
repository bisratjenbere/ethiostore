# Admin Panel - Test Credentials

## Admin User

**Email:** `admin@example.com`  
**Password:** `123456`  
**Role:** Admin

## Regular Test Users

### User 1
**Email:** `john@example.com`  
**Password:** `123456`  
**Role:** User

### User 2
**Email:** `jane@example.com`  
**Password:** `123456`  
**Role:** User

---

## How to Access Admin Panel

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to: `http://localhost:3000`

3. Click "Sign In" in the top right

4. Enter the admin credentials:
   - Email: `admin@example.com`
   - Password: `123456`

5. After signing in, click on your profile dropdown in the top right

6. Click "Admin Panel" to access the admin dashboard

---

## Admin Panel Features

### Dashboard (`/admin/dashboard`)
- Total revenue, orders, products, users metrics
- Today's statistics
- Recent orders list
- Pending orders count

### Order Management (`/admin/orders`)
- View all orders with filtering (paid/unpaid, delivered/pending)
- Search orders by ID, customer name, or email
- Mark orders as paid
- Mark orders as delivered
- View detailed order information

### Product Management (`/admin/products`)
- View all products
- Create new products
- Edit existing products
- Delete products (with validation)
- Filter by category, brand, stock status
- Search products by name

### User Management (`/admin/users`)
- View all users
- Filter by role (admin/user)
- Search by name or email
- View user details and order history
- Change user roles (admin/user)
- Cannot demote yourself

---

## Sample Data Included

- **6 Products**: Men's dress shirts and sweatshirts from brands like Polo, Brooks Brothers, Tommy Hilfiger, Calvin Klein
- **3 Users**: 1 admin and 2 regular users
- **No Orders**: You'll need to create test orders by:
  1. Sign in as a regular user
  2. Add products to cart
  3. Complete checkout process
  4. Then view/manage in admin panel

---

## Security Notes

⚠️ **These are TEST credentials only!**

Before deploying to production:
1. Change all passwords
2. Remove or update sample data
3. Use environment variables for sensitive data
4. Enable proper authentication (OAuth, 2FA, etc.)
5. Review and update admin role assignment logic
