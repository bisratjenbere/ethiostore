# Order Management Testing Guide

## Quick Testing Steps

Follow these steps to verify the order management implementation works correctly.

---

## Prerequisites

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Ensure database is set up**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Seed database** (if needed):
   ```bash
   npx prisma db seed
   ```

---

## Test 1: Complete Order Flow (Happy Path) ✅

### Steps:
1. Open browser to `http://localhost:3000`
2. Browse products on homepage
3. Click on a product
4. Click "Add to Cart" button
5. Go to cart page (click cart icon)
6. Click "Proceed to Checkout"
7. Sign in or create account if not logged in
8. Fill in shipping address form
   - Full Name
   - Street Address
   - City
   - Country
   - Postal Code
9. Click "Continue" 
10. Select payment method (PayPal, Stripe, or Cash on Delivery)
11. Click "Continue"
12. Review order summary on "Place Order" page
13. **Click "Place Order" button** ← NEW!
14. Verify redirect to order details page
15. Verify success toast appears

### Expected Results:
- ✅ Order appears with order ID
- ✅ Order shows all items from cart
- ✅ Shipping address displayed correctly
- ✅ Payment method shown
- ✅ Price breakdown correct (items + shipping + tax = total)
- ✅ Status shows "Not Paid" and "Pending"

---

## Test 2: View Order History ✅

### Steps:
1. Click user avatar in top right
2. Click "My Orders" from dropdown
3. Verify order just placed appears in list

### Expected Results:
- ✅ Order appears in table
- ✅ Order ID shown (first 8 characters)
- ✅ Date shows today's date
- ✅ Total amount matches order
- ✅ "Not Paid" badge shows in red
- ✅ "Pending" badge shows
- ✅ "View Details" button visible

---

## Test 3: View Order Details ✅

### Steps:
1. On "My Orders" page, click "View Details" button
2. Review all order information

### Expected Results:
- ✅ Order ID displayed in full
- ✅ Order date and time shown
- ✅ Payment status badge displayed
- ✅ Delivery status badge displayed
- ✅ Shipping address section complete
- ✅ Payment method displayed
- ✅ All order items shown with images
- ✅ Quantities correct
- ✅ Prices correct
- ✅ Subtotals calculated correctly
- ✅ Order summary sidebar shows correct totals

---

## Test 4: Cart Cleared After Order ✅

### Steps:
1. After placing order, click cart icon
2. Verify cart is empty

### Expected Results:
- ✅ Cart shows as empty
- ✅ Message displays "Your cart is empty" or similar

---

## Test 5: Stock Decremented ✅

### Steps:
1. Note product stock before ordering
2. Place order with that product
3. Go back to product page
4. Check stock count

### Expected Results:
- ✅ Stock count decreased by ordered quantity
- ✅ If stock reaches 0, "Out of Stock" badge shown

---

## Test 6: Multiple Orders ✅

### Steps:
1. Add more items to cart
2. Complete checkout again
3. Place another order
4. View "My Orders" page

### Expected Results:
- ✅ Both orders appear in list
- ✅ Orders sorted by date (newest first)
- ✅ Each order has correct information
- ✅ Can view details of each order separately

---

## Test 7: Error Handling - Insufficient Stock ❌

### Steps:
1. Using Prisma Studio or direct DB access, set a product stock to 1
2. Add 2 of that product to cart
3. Try to place order

### Expected Results:
- ✅ Error toast appears
- ✅ Message says "Insufficient stock for [product name]"
- ✅ Order not created
- ✅ Cart not cleared
- ✅ User stays on place order page

---

## Test 8: Error Handling - Empty Cart ❌

### Steps:
1. Navigate directly to `/place-order` URL without items in cart

### Expected Results:
- ✅ Redirected to cart page
- ✅ No order created

---

## Test 9: Error Handling - Missing Address ❌

### Steps:
1. New user, add items to cart
2. Skip shipping address step
3. Try to access place order page

### Expected Results:
- ✅ Redirected to shipping address page
- ✅ Cannot place order without address

---

## Test 10: Error Handling - Missing Payment Method ❌

### Steps:
1. Complete address but skip payment method
2. Try to access place order page

### Expected Results:
- ✅ Redirected to payment method page
- ✅ Cannot place order without payment method

---

## Test 11: Security - View Another User's Order ❌

### Steps:
1. Note your order ID
2. Sign out
3. Sign in as different user
4. Try to access first user's order URL: `/user/order/[order-id]`

### Expected Results:
- ✅ Error message: "Unauthorized to view this order"
- ✅ OR redirected to 404 page
- ✅ Cannot view other users' orders

---

## Test 12: Navigation Flow ✅

### Steps:
1. From homepage → Product page → Cart → Checkout → Order placed
2. Click "My Orders" in user menu
3. Click "View Details" on an order
4. Navigate back to homepage

### Expected Results:
- ✅ All navigation works smoothly
- ✅ No broken links
- ✅ Back button works correctly

---

## Test 13: Mobile Responsiveness 📱

### Steps:
1. Open browser developer tools
2. Switch to mobile view (iPhone, Android)
3. Test order placement flow
4. View orders page
5. View order details

### Expected Results:
- ✅ All pages responsive on mobile
- ✅ Tables scroll horizontally if needed
- ✅ Buttons accessible and properly sized
- ✅ Text readable
- ✅ Images scale appropriately

---

## Test 14: Loading States ⏳

### Steps:
1. On place order page, click "Place Order"
2. Observe button during processing

### Expected Results:
- ✅ Button shows loading spinner
- ✅ Button disabled during processing
- ✅ Cannot click button twice
- ✅ Loading indicator visible

---

## Test 15: Empty Orders State 📭

### Steps:
1. Create new user account
2. Navigate to "My Orders"

### Expected Results:
- ✅ Empty state message displayed
- ✅ Message: "No orders found"
- ✅ Helpful text: "Start shopping to place your first order"

---

## Browser Testing Checklist

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (Mac/iOS)
- [ ] Edge

---

## Database Verification

### Verify Order Created:
```bash
npx prisma studio
```

Check:
- ✅ Order record exists in `Order` table
- ✅ OrderItem records exist in `OrderItem` table
- ✅ Order has correct userId
- ✅ Order has shippingAddress JSON
- ✅ Order has correct price fields
- ✅ isPaid = false
- ✅ isDelivered = false
- ✅ createdAt timestamp set

### Verify Cart Deleted:
- ✅ Cart record removed from `Cart` table for that user

### Verify Stock Updated:
- ✅ Product stock decreased in `Product` table

---

## Performance Testing

### Order Creation Speed:
- Order should be created in < 2 seconds
- Page navigation smooth
- No noticeable lag

### Orders Page Load:
- Orders list loads quickly
- Even with 10+ orders, page responsive

### Order Details Load:
- Details page loads in < 1 second
- Images load progressively

---

## Common Issues & Solutions

### Issue: "Cart Session not found"
**Solution**: Ensure sessionCartId cookie is set. Check `getMyCart()` in cart actions.

### Issue: "User not authenticated"
**Solution**: Verify user is logged in. Check `auth()` returns valid session.

### Issue: Decimal type errors
**Solution**: Ensure all Decimal values converted to strings before sending to client.

### Issue: Order not appearing in history
**Solution**: Check revalidatePath('/user/orders') is called after order creation.

### Issue: Images not loading
**Solution**: Verify image paths are correct. Check Next.js image configuration.

---

## Test Results Template

```
Date: ___________
Tester: ___________

✅ = Pass
❌ = Fail
⚠️ = Partial

[ ] Test 1: Complete Order Flow
[ ] Test 2: View Order History
[ ] Test 3: View Order Details
[ ] Test 4: Cart Cleared
[ ] Test 5: Stock Decremented
[ ] Test 6: Multiple Orders
[ ] Test 7: Insufficient Stock Error
[ ] Test 8: Empty Cart Error
[ ] Test 9: Missing Address Error
[ ] Test 10: Missing Payment Error
[ ] Test 11: Security Check
[ ] Test 12: Navigation Flow
[ ] Test 13: Mobile Responsive
[ ] Test 14: Loading States
[ ] Test 15: Empty State

Notes:
___________________________________________
___________________________________________
___________________________________________
```

---

## Success Criteria

**All tests should pass** ✅

If any test fails:
1. Check console for errors
2. Verify database state
3. Check server action responses
4. Review network tab in browser dev tools

---

**Happy Testing! 🎉**
