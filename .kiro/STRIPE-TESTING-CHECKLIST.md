# Stripe Payment Testing Checklist

## 🎯 Quick Test (5 Minutes)

### Prerequisites Setup
- [ ] Stripe account created (free at stripe.com)
- [ ] Test API keys copied to `.env`
- [ ] Stripe CLI installed
- [ ] Dev server running (`npm run dev`)
- [ ] Stripe CLI listening (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)

### Happy Path Test
- [ ] Browse shop, add product to cart
- [ ] Click "Proceed to Checkout"
- [ ] Sign in or create account
- [ ] Enter shipping address
- [ ] Select payment method
- [ ] Click "Proceed to Payment"
- [ ] Redirected to Stripe Checkout
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Expiry: `12/34`, CVC: `123`, ZIP: `12345`
- [ ] Click "Pay"
- [ ] Redirected to success page ✅
- [ ] Check Stripe CLI terminal: Shows `✅ Payment successful!`
- [ ] Go to "My Orders": Order shows "Paid" status
- [ ] Check cart: Should be empty
- [ ] Check Prisma Studio: `Order.isPaid = true`
- [ ] Check product stock: Decreased by order quantity

---

## 🧪 Comprehensive Test Suite

### Test 1: Successful Payment ✅

**Card:** `4242 4242 4242 4242`

**Steps:**
1. Complete checkout flow
2. Enter test card details
3. Complete payment

**Expected Results:**
- [ ] Redirected to `/order-success` page
- [ ] Webhook received in Stripe CLI terminal
- [ ] Order status updated to "Paid"
- [ ] `Order.paidAt` has timestamp
- [ ] `Order.paymentResult` contains payment details
- [ ] Product stock decreased
- [ ] User cart deleted
- [ ] Success page shows order details
- [ ] Can click to view order from success page

**Console Logs to Check:**
```
✅ Payment successful! {
  sessionId: 'cs_test_...',
  orderId: '...',
  amount: 12498
}
✅ Order ... marked as paid, stock decremented, cart deleted
```

---

### Test 2: Declined Card ❌

**Card:** `4000 0000 0000 0002`

**Steps:**
1. Complete checkout flow
2. Enter declined test card
3. Attempt payment

**Expected Results:**
- [ ] Stripe shows "Your card was declined"
- [ ] User remains on Stripe checkout page
- [ ] Order remains unpaid in database
- [ ] No webhook received
- [ ] User can try again with different card
- [ ] Stock not decremented
- [ ] Cart still exists

---

### Test 3: 3D Secure Authentication 🔐

**Card:** `4000 0025 0000 3155`

**Steps:**
1. Complete checkout flow
2. Enter 3D Secure test card
3. Complete 3D Secure challenge

**Expected Results:**
- [ ] 3D Secure modal appears
- [ ] Complete authentication
- [ ] Payment processes after auth
- [ ] Webhook received
- [ ] Order marked as paid
- [ ] Same results as Test 1

---

### Test 4: Payment Cancellation ⚠️

**Steps:**
1. Start checkout flow
2. Get to Stripe payment page
3. Click browser back button or close tab

**Expected Results:**
- [ ] No webhook received
- [ ] Order remains unpaid
- [ ] Stock not decremented
- [ ] Cart still exists
- [ ] User can restart checkout

---

### Test 5: Session Expiration ⏱️

**Steps:**
1. Start checkout, get to Stripe
2. Wait 30+ minutes (or use expired test)
3. Try to pay

**Expected Results:**
- [ ] Stripe shows "Session expired"
- [ ] Webhook: `checkout.session.expired`
- [ ] Order remains unpaid
- [ ] User must create new order

---

### Test 6: Insufficient Funds

**Card:** `4000 0000 0000 9995`

**Steps:**
1. Complete checkout
2. Enter insufficient funds card

**Expected Results:**
- [ ] Stripe shows "Insufficient funds" error
- [ ] Payment fails
- [ ] Order remains unpaid
- [ ] Can try different card

---

### Test 7: Webhook Signature Verification 🔒

**Steps:**
1. Make successful payment
2. Check webhook handler logs

**Expected in Logs:**
```
✅ Signature verified
✅ Event type: checkout.session.completed
✅ Order ID extracted from metadata
✅ markOrderAsPaid called
```

**Test Invalid Signature:**
1. Stop Stripe CLI
2. Make payment
3. Check that order remains unpaid

---

### Test 8: Duplicate Webhook (Idempotency)

**Steps:**
1. Complete successful payment
2. In Stripe CLI, trigger same event again:
   ```bash
   stripe trigger checkout.session.completed
   ```

**Expected Results:**
- [ ] Webhook handler returns 200
- [ ] Logs show "Order already marked as paid"
- [ ] No duplicate stock decrement
- [ ] No errors in console
- [ ] Database unchanged

---

### Test 9: Concurrent Orders

**Steps:**
1. Open two browser tabs
2. Start checkout in both
3. Complete payments simultaneously

**Expected Results:**
- [ ] Both orders created successfully
- [ ] Both webhooks processed
- [ ] Both orders marked as paid
- [ ] Stock decremented correctly for both
- [ ] No race conditions
- [ ] Transaction prevents overselling

---

### Test 10: Low Stock Scenario

**Setup:**
1. Set product stock to 1 in database

**Steps:**
1. Add 2 items to cart
2. Try to checkout

**Expected Results:**
- [ ] Error: "Insufficient stock"
- [ ] Order not created
- [ ] Checkout blocked
- [ ] User shown error message

---

## 🔍 Database Verification

After successful payment, check in Prisma Studio:

### Order Table
- [ ] `isPaid` = `true`
- [ ] `paidAt` = timestamp (not null)
- [ ] `paymentResult` = JSON with:
  ```json
  {
    "id": "pi_...",
    "status": "complete",
    "email": "user@email.com",
    "amount": 12498,
    "currency": "usd"
  }
  ```

### Product Table
- [ ] `stock` decreased by order quantity

### Cart Table
- [ ] User's cart no longer exists

### OrderItem Table
- [ ] All order items created
- [ ] Quantities match cart items
- [ ] Prices match product prices

---

## 🌐 UI/UX Verification

### Place Order Page
- [ ] Button shows "Proceed to Payment"
- [ ] Credit card icon displays
- [ ] Shows "Redirecting to Stripe" message
- [ ] Loading state during redirect
- [ ] Stripe badge shows security info

### Stripe Checkout Page
- [ ] Stripe branding visible
- [ ] Order amount correct
- [ ] Line items match cart
- [ ] Shipping cost included
- [ ] Tax calculated correctly
- [ ] Email pre-filled
- [ ] Mobile responsive

### Success Page
- [ ] Green success banner
- [ ] Order ID displayed
- [ ] Payment amount shown
- [ ] "View Order" button works
- [ ] "Continue Shopping" button works
- [ ] "What's Next" section visible

### Cancel Page
- [ ] Yellow warning banner
- [ ] Order ID shown (if available)
- [ ] "Back to Cart" button works
- [ ] "Continue Shopping" button works
- [ ] Clear explanation of what happened

### My Orders Page
- [ ] Paid orders show "Paid" badge
- [ ] Payment date shown
- [ ] Can click to view details

### Order Details Page
- [ ] Shows payment status
- [ ] Shows payment date
- [ ] Shows order items
- [ ] Shows shipping address
- [ ] Shows payment method

---

## 🚨 Error Handling Tests

### Test: Missing Stripe Keys

**Setup:**
1. Remove `STRIPE_SECRET_KEY` from `.env`
2. Restart server

**Expected:**
- [ ] Server fails to start
- [ ] Error: "STRIPE_SECRET_KEY is not set"

---

### Test: Missing Webhook Secret

**Setup:**
1. Remove `STRIPE_WEBHOOK_SECRET` from `.env`
2. Make payment

**Expected:**
- [ ] Webhook signature verification fails
- [ ] Order remains unpaid
- [ ] Error logged in console

---

### Test: Invalid Order ID

**Setup:**
1. Modify webhook to send invalid order ID

**Expected:**
- [ ] Webhook handler catches error
- [ ] Returns 500 error
- [ ] Logs "Order not found"
- [ ] Stripe retries webhook

---

### Test: Network Timeout

**Setup:**
1. Simulate slow network

**Expected:**
- [ ] Stripe handles retries
- [ ] Webhook eventually succeeds
- [ ] Order eventually marked as paid

---

## 📱 Cross-Browser Testing

Test on multiple browsers:

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile responsive design
- [ ] Touch interactions work

---

## ⚡ Performance Testing

### Metrics to Check
- [ ] Redirect to Stripe: < 1 second
- [ ] Payment processing: 2-3 seconds
- [ ] Webhook delivery: 1-5 seconds
- [ ] Order status update: < 1 second
- [ ] Success page load: < 2 seconds

### Load Testing
- [ ] 10 concurrent checkouts
- [ ] No race conditions
- [ ] All transactions succeed
- [ ] Database remains consistent

---

## 🔐 Security Verification

### Webhook Security
- [ ] Signature verification works
- [ ] Invalid signatures rejected
- [ ] Replay attacks prevented
- [ ] Only Stripe can trigger updates

### Order Security
- [ ] Users can only pay their own orders
- [ ] Cannot pay already paid orders
- [ ] Cannot manipulate order amounts
- [ ] Metadata properly validated

### Environment Security
- [ ] API keys not in client bundle
- [ ] Webhook secret not exposed
- [ ] All sensitive data server-side only

---

## 📊 Monitoring Checklist

### Stripe Dashboard
- [ ] Payments appear in Dashboard
- [ ] Amounts are correct
- [ ] Webhook events recorded
- [ ] No failed webhooks
- [ ] Customer emails captured

### Application Logs
- [ ] No errors in console
- [ ] Webhook events logged
- [ ] Order updates logged
- [ ] Stock updates logged

### Database Integrity
- [ ] No orphaned orders
- [ ] Stock levels accurate
- [ ] Cart cleanup working
- [ ] Payment results stored

---

## 🎯 Pre-Production Checklist

Before switching to live mode:

### Test Mode Verification
- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Webhooks 100% success rate
- [ ] Database updates correct
- [ ] UI/UX polished

### Production Preparation
- [ ] Live Stripe keys obtained
- [ ] Webhook endpoint created in Dashboard
- [ ] Webhook points to production URL
- [ ] Production env vars updated
- [ ] `NEXT_PUBLIC_SERVER_URL` set to production
- [ ] SSL certificate valid
- [ ] Domain configured

### Final Tests
- [ ] Test with $1 real payment
- [ ] Verify webhook received
- [ ] Check Dashboard for transaction
- [ ] Confirm order marked as paid
- [ ] Test refund process (if implemented)

---

## 🐛 Troubleshooting Tests

### Issue: "Webhook signature failed"

**Debug Steps:**
1. [ ] Check `STRIPE_WEBHOOK_SECRET` in `.env`
2. [ ] Verify Stripe CLI is running
3. [ ] Check webhook secret matches CLI output
4. [ ] Restart dev server
5. [ ] Check timestamp validation

**Expected Fix:** Update secret, restart server

---

### Issue: "Order still unpaid after payment"

**Debug Steps:**
1. [ ] Check Stripe CLI terminal for webhook
2. [ ] Check Next.js console for errors
3. [ ] Verify `markOrderAsPaid` function called
4. [ ] Check database transaction logs
5. [ ] Review webhook handler logs

**Expected Fix:** Ensure Stripe CLI is running

---

### Issue: "Redirect not working"

**Debug Steps:**
1. [ ] Check `NEXT_PUBLIC_SERVER_URL` in `.env`
2. [ ] Verify port matches dev server
3. [ ] Check Stripe session `success_url`
4. [ ] Test in different browser
5. [ ] Clear browser cache

**Expected Fix:** Update URL, restart server

---

### Issue: "Stock not decreasing"

**Debug Steps:**
1. [ ] Check webhook received
2. [ ] Verify transaction completed
3. [ ] Check `markOrderAsPaid` function
4. [ ] Review database logs
5. [ ] Check for transaction rollbacks

**Expected Fix:** Ensure transaction not failing

---

## ✅ Testing Sign-Off

### Developer Checklist
- [ ] All happy path tests pass
- [ ] All error scenarios handled
- [ ] Security verification complete
- [ ] Performance acceptable
- [ ] Documentation reviewed
- [ ] Code reviewed

### QA Checklist
- [ ] Manual testing complete
- [ ] Cross-browser testing done
- [ ] Mobile testing done
- [ ] Edge cases verified
- [ ] User acceptance testing passed

### Production Ready
- [ ] Test mode 100% working
- [ ] Documentation complete
- [ ] Team trained on testing
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Ready to switch to live keys

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

RESULTS:
✅ Successful Payment: PASS / FAIL
✅ Declined Payment: PASS / FAIL
✅ 3D Secure: PASS / FAIL
✅ Cancellation: PASS / FAIL
✅ Webhook Security: PASS / FAIL
✅ Database Updates: PASS / FAIL
✅ Stock Management: PASS / FAIL
✅ UI/UX: PASS / FAIL

ISSUES FOUND:
_________________________________
_________________________________
_________________________________

NOTES:
_________________________________
_________________________________
_________________________________
```

---

## 🎓 Testing Best Practices

1. **Test in order** - Start with happy path, then edge cases
2. **Check webhooks first** - Webhook must work for everything else to work
3. **Verify database** - Don't trust UI alone, check database state
4. **Use Prisma Studio** - Visual verification of data changes
5. **Monitor Stripe CLI** - Watch for webhook events and errors
6. **Clear browser cache** - Avoid stale state issues
7. **Test on real devices** - Emulators don't catch everything
8. **Document failures** - Record exact steps to reproduce
9. **Test concurrency** - Multiple users, multiple orders
10. **Verify cleanup** - Cart deletion, stock updates, etc.

---

**Testing Status:** Ready for comprehensive testing ✅  
**Last Updated:** July 13, 2026
