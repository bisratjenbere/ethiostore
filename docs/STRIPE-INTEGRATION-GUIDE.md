# Stripe Payment Integration - Complete Guide

## 🎯 Overview

This guide walks you through the complete Stripe payment integration in your e-commerce app, from setup to testing to production deployment.

**Key Features:**
- ✅ Hosted Stripe Checkout (no PCI compliance needed)
- ✅ Webhook-based payment verification (secure)
- ✅ Test mode with fake cards (completely free)
- ✅ Stock decrementation after successful payment
- ✅ Cart deletion after payment
- ✅ Order status tracking

---

## 📋 How It Works

### Payment Flow

```
1. User adds products to cart
   ↓
2. User goes through checkout (address, payment method)
   ↓
3. User clicks "Proceed to Payment"
   ↓
4. Order created in database (status: UNPAID)
   ├─ Order ID generated
   ├─ Order items saved
   └─ Stock NOT yet decremented
   ↓
5. Stripe Checkout Session created
   ├─ Line items from order
   ├─ Order ID stored in metadata
   └─ Redirect URLs configured
   ↓
6. User redirected to Stripe's hosted checkout page
   ├─ Secure payment form (hosted by Stripe)
   ├─ Card validation by Stripe
   └─ PCI compliance handled by Stripe
   ↓
7. User completes payment on Stripe
   ↓
8. TWO things happen simultaneously:
   
   A. CLIENT SIDE (NOT TRUSTED):
      ├─ User redirected to success page
      └─ Order details displayed
   
   B. SERVER SIDE (SOURCE OF TRUTH):
      ├─ Stripe sends webhook to /api/webhooks/stripe
      ├─ Webhook signature verified
      ├─ Order marked as PAID
      ├─ Product stock DECREMENTED
      ├─ User cart DELETED
      └─ Database updated
   ↓
9. User sees "Paid" status in order history
```

### Why Webhooks Are Critical

**❌ NEVER trust client-side success redirect alone!**

A malicious user could:
- Manually navigate to `/order-success?session_id=fake`
- Intercept and modify the redirect
- Claim they paid without actually paying

**✅ Webhooks are the source of truth** because:
- Sent directly from Stripe servers to your server
- Cryptographically signed (verified with webhook secret)
- Impossible to fake without Stripe's private key
- Guaranteed to be authentic

---

## 🚀 Setup Instructions

### Step 1: Get Stripe Test Keys

1. Create a free Stripe account at [stripe.com](https://stripe.com)
2. No business verification required for test mode
3. Go to [Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys)
4. Make sure you're in **Test Mode** (toggle in sidebar)
5. Copy your test keys:
   - **Publishable key**: Starts with `pk_test_`
   - **Secret key**: Starts with `sk_test_`

### Step 2: Add Keys to Environment

Update your `.env` file:

```env
# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_51Abc123...your_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_51Abc123...your_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_...we'll_get_this_in_step_4

# Make sure this matches your dev server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Step 3: Install Stripe CLI

The Stripe CLI forwards webhook events to your local dev server.

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows (Scoop):**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux:**
```bash
# Download from https://github.com/stripe/stripe-cli/releases
wget https://github.com/stripe/stripe-cli/releases/download/v1.21.5/stripe_1.21.5_linux_x86_64.tar.gz
tar -xvf stripe_1.21.5_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Verify installation:**
```bash
stripe --version
```

### Step 4: Connect Stripe CLI to Your Account

```bash
stripe login
```

This opens your browser to authorize the CLI with your Stripe account.

### Step 5: Start Webhook Forwarding

In a **separate terminal window** (keep this running):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Output:**
```
> Ready! You are using Stripe API Version [2024-12-18]. Your webhook signing secret is whsec_abc123xyz... (^C to quit)
```

**Copy the webhook secret** (starts with `whsec_`) and add it to your `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz...
```

### Step 6: Restart Your Dev Server

Stop your Next.js dev server and restart it to load the new environment variables:

```bash
npm run dev
```

---

## 🧪 Testing the Payment Flow

### 1. Complete Test Scenario

**Terminal 1 - Next.js Dev Server:**
```bash
npm run dev
```

**Terminal 2 - Stripe CLI:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 2. Test with Stripe Test Cards

#### ✅ Successful Payment

1. Go to [http://localhost:3000](http://localhost:3000)
2. Add products to cart
3. Click "Proceed to Checkout"
4. Sign in (or create account)
5. Enter shipping address
6. Select payment method (any)
7. Click "Place Order"
8. You'll be redirected to Stripe Checkout
9. Use this test card:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **ZIP**: Any 5 digits (e.g., `12345`)
10. Click "Pay"
11. You'll be redirected to `/order-success`
12. Check Terminal 2 - you should see:
    ```
    [200] POST /api/webhooks/stripe
    evt_abc123... checkout.session.completed
    ```
13. Check your app:
    - Go to "My Orders"
    - Order should show as "Paid" ✅
    - Cart should be empty
14. Check database (Prisma Studio):
    ```bash
    npx prisma studio
    ```
    - Open "Order" table
    - Find your order
    - `isPaid` should be `true`
    - `paidAt` should have timestamp
    - `paymentResult` should have payment info

#### ❌ Declined Card

Test what happens when payment fails:

- **Card Number**: `4000 0000 0000 0002`
- All other fields: same as above

Expected behavior:
- Payment declined by Stripe
- User stays on Stripe page with error message
- Order remains unpaid in database
- User can try again with different card

#### 🔐 3D Secure Authentication

Test Strong Customer Authentication (SCA):

- **Card Number**: `4000 0025 0000 3155`
- Complete 3D Secure challenge
- Order should complete after authentication

### 3. What to Look For

#### ✅ Success Indicators

**In Terminal 2 (Stripe CLI):**
```
[200] POST /api/webhooks/stripe
evt_1ABC... checkout.session.completed
```

**In Next.js Terminal:**
```
✅ Payment successful! {
  sessionId: 'cs_test_abc123...',
  orderId: '550e8400-e29b-41d4-a716-446655440000',
  amount: 12498
}
✅ Order 550e8400-e29b-41d4-a716-446655440000 marked as paid, stock decremented, cart deleted
```

**In Your App:**
- Success page shows payment details
- "My Orders" shows order as "Paid"
- Cart is empty
- Product stock decreased

**In Database (Prisma Studio):**
- `Order.isPaid` = `true`
- `Order.paidAt` = timestamp
- `Order.paymentResult` = payment details JSON
- `Product.stock` decreased by order quantity
- User's `Cart` deleted

#### ❌ Failure Indicators

**Webhook signature verification failed:**
```
Webhook signature verification failed
```
- **Fix**: Check `STRIPE_WEBHOOK_SECRET` in `.env`
- Restart dev server after updating `.env`
- Make sure Stripe CLI is running

**Order not found in metadata:**
```
Order ID not found in session metadata
```
- **Fix**: Check `createStripeCheckoutSession` includes orderId in metadata

**Order still showing unpaid:**
- **Fix**: Check webhook terminal for errors
- Verify webhook endpoint is reachable
- Check network tab for webhook POST request

---

## 📁 Code Structure

### Files Created/Modified

```
lib/
├── stripe.ts                        # Stripe client initialization
└── actions/
    └── stripe.actions.ts           # Stripe server actions
        ├── createStripeCheckoutSession()
        ├── markOrderAsPaid()
        ├── markOrderAsPaymentFailed()
        └── getStripeCheckoutSession()

app/
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts            # Webhook handler (POST endpoint)
├── (root)/
│   ├── order-success/
│   │   └── page.tsx                # Success page after payment
│   └── order-cancelled/
│       └── page.tsx                # Cancelled payment page

components/
└── shared/
    ├── order/
    │   └── place-order-button.tsx  # Integrates Stripe checkout
    └── payment/
        └── stripe-badge.tsx         # Security badge UI

.env                                 # Environment variables
.env.example                         # Template for new developers
README.md                            # Updated with Stripe section
```

### Key Functions

#### 1. `createStripeCheckoutSession(orderId)`
**File:** `lib/actions/stripe.actions.ts`

**Purpose:** Creates a Stripe Checkout Session for an existing order

**Flow:**
1. Verify user authentication
2. Fetch order from database
3. Check order isn't already paid
4. Prepare line items (products + shipping + tax)
5. Create Stripe session with metadata
6. Return checkout URL

**Security:**
- Verifies order belongs to user
- Stores orderId in Stripe metadata
- Sets expiration time (30 minutes)

#### 2. `markOrderAsPaid(orderId, paymentResult)`
**File:** `lib/actions/stripe.actions.ts`

**Purpose:** Mark order as paid after webhook confirmation

**Flow:**
1. Find order with items
2. Check if already paid (idempotency)
3. **Transaction:**
   - Update order status to paid
   - Decrement product stock
   - Delete user's cart
4. Revalidate pages

**Security:**
- Only called from webhook after signature verification
- Uses database transaction for atomicity
- Idempotent (safe to call multiple times)

#### 3. Webhook Handler
**File:** `app/api/webhooks/stripe/route.ts`

**Purpose:** Receive and process Stripe webhook events

**Events Handled:**
- `checkout.session.completed` → Call `markOrderAsPaid()`
- `payment_intent.payment_failed` → Call `markOrderAsPaymentFailed()`
- `checkout.session.expired` → Log expiration

**Security:**
- Verifies Stripe signature using `STRIPE_WEBHOOK_SECRET`
- Rejects requests without valid signature
- Only processes verified events

---

## 🎨 User Experience

### Checkout Button

```tsx
<Button onClick={handlePlaceOrder}>
  {isPending ? "Processing..." : "Proceed to Payment"}
</Button>
```

**Behavior:**
1. Shows loading spinner while creating order
2. Creates order in database
3. Creates Stripe session
4. Redirects to Stripe Checkout
5. User never sees their card entered on your site (PCI compliance)

### Success Page

**URL:** `/order-success?session_id=cs_test_abc123`

**Features:**
- Retrieves and verifies session from Stripe
- Shows payment confirmation
- Displays order details
- Links to order history
- Shows "What's Next" steps

### Cancelled Page

**URL:** `/order-cancelled?orderId=550e8400...`

**Features:**
- Explains what happened
- Shows order ID for reference
- Provides next steps (retry, edit cart, continue shopping)
- Links back to cart

---

## 🚨 Common Issues & Solutions

### Issue 1: "Webhook signature verification failed"

**Symptoms:**
```
Webhook Error: No signatures found matching the expected signature for payload
```

**Solution:**
1. Check `STRIPE_WEBHOOK_SECRET` in `.env` matches Stripe CLI output
2. Restart Next.js dev server after updating `.env`
3. Make sure you're using the secret from `stripe listen`, not Dashboard

### Issue 2: Order shows as unpaid after successful payment

**Symptoms:**
- Stripe shows payment succeeded
- Order still shows "Unpaid" in app

**Diagnosis:**
```bash
# Check webhook terminal for errors
# Look for POST requests to /api/webhooks/stripe
```

**Solution:**
1. Verify Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Check Next.js terminal for errors in webhook handler
3. Verify `STRIPE_WEBHOOK_SECRET` is correct
4. Test manually:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Issue 3: Redirect not working after payment

**Symptoms:**
- Payment completes on Stripe
- Browser doesn't redirect back to app

**Solution:**
1. Check `NEXT_PUBLIC_SERVER_URL` in `.env`:
   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```
2. Make sure port matches your dev server
3. Check Stripe Dashboard → Logs for redirect errors

### Issue 4: "Order not found" error in webhook

**Symptoms:**
```
Order ID not found in session metadata
```

**Solution:**
1. Check `createStripeCheckoutSession` includes metadata:
   ```ts
   metadata: {
     orderId: order.id,
     userId: userId,
   }
   ```
2. Verify order is created before creating session
3. Check order ID format (should be UUID)

### Issue 5: Cart not empty after payment

**Symptoms:**
- Payment succeeded
- Order shows as paid
- Cart still has items

**Solution:**
1. Check webhook handler calls `markOrderAsPaid()`
2. Verify `markOrderAsPaid()` deletes cart:
   ```ts
   await tx.cart.delete({ where: { id: cart.id } });
   ```
3. Check for transaction errors in logs
4. Revalidate cart page: `revalidatePath('/cart')`

---

## 🌍 Production Deployment

### Switching to Live Mode

**⚠️ Important:** Live mode processes real money with real credit cards!

#### 1. Get Live API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle to **Live Mode** (top right)
3. Complete business verification if required
4. Go to [Developers → API Keys](https://dashboard.stripe.com/apikeys)
5. Copy your live keys (start with `sk_live_` and `pk_live_`)

#### 2. Create Webhook Endpoint in Dashboard

1. Go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "+ Add endpoint"
3. Enter endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `checkout.session.expired`
5. Copy the webhook signing secret (starts with `whsec_`)

#### 3. Update Production Environment Variables

**On your hosting platform** (Vercel, Railway, etc.):

```env
# Live mode keys (NOT test keys!)
STRIPE_SECRET_KEY=sk_live_51...your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_51...your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_...from_dashboard_not_cli

# Production URL
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
```

#### 4. Test Webhook Endpoint

```bash
# Test from your local machine
curl -X POST https://yourdomain.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Should return: {"error": "Missing stripe-signature header"}
# This means endpoint is reachable
```

#### 5. Test with Real Cards (Small Amount)

1. Make a test order for $1
2. Use your real credit card
3. Verify:
   - Payment goes through
   - Order marked as paid
   - Webhook received (check Stripe Dashboard → Webhooks → Events)
   - Stock decremented
   - Cart deleted

#### 6. Monitor Stripe Dashboard

- **Payments**: See all successful payments
- **Webhooks**: Check webhook delivery status
- **Logs**: Debug any errors
- **Customers**: View customer information

### Production Checklist

- [ ] Live API keys updated in production env
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Webhook secret updated in production env
- [ ] `NEXT_PUBLIC_SERVER_URL` points to production domain
- [ ] Test order completed successfully
- [ ] Webhook events showing in Stripe Dashboard
- [ ] Error monitoring set up (Sentry, LogRocket)
- [ ] Email notifications configured (future)
- [ ] SSL certificate valid (HTTPS required)

---

## 🧪 Testing Checklist

### Before Committing Code

- [ ] Test successful payment with `4242 4242 4242 4242`
- [ ] Test declined payment with `4000 0000 0000 0002`
- [ ] Test 3D Secure with `4000 0025 0000 3155`
- [ ] Verify webhook received in Stripe CLI terminal
- [ ] Check order shows as "Paid" in app
- [ ] Verify stock decreased by correct amount
- [ ] Confirm cart is empty after payment
- [ ] Test cancelling payment (click back button on Stripe)
- [ ] Verify cancelled page shows correctly
- [ ] Test expired session (wait 30+ minutes)
- [ ] Check admin panel shows payment details
- [ ] Verify success page loads with session ID
- [ ] Test without webhook secret (should fail gracefully)

### Edge Cases to Test

- [ ] Order already paid (webhook idempotency)
- [ ] Insufficient stock (should fail before creating session)
- [ ] Invalid order ID in metadata
- [ ] Missing shipping address
- [ ] Missing payment method
- [ ] Empty cart
- [ ] Concurrent payments for same order
- [ ] Network failure during redirect
- [ ] Stripe API down (check error handling)

---

## 📚 Additional Resources

### Stripe Documentation
- [Stripe Testing](https://stripe.com/docs/testing)
- [Test Cards](https://stripe.com/docs/testing#cards)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Checkout Session API](https://stripe.com/docs/api/checkout/sessions)

### Internal Documentation
- [Project Overview](.kiro/steering/project-overview.md)
- [Order Management Spec](.kiro/specs/order-management.md)
- [Database Patterns](.kiro/steering/database-patterns.md)
- [Testing Guide](.kiro/TESTING-GUIDE.md)

### Stripe CLI Commands
```bash
# Login
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed

# View events
stripe events list --limit 10

# Get event details
stripe events retrieve evt_abc123

# Test webhook endpoint
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-json
```

---

## 🎓 Understanding the Code

### Why This Architecture?

#### 1. Hosted Checkout (Not Custom Form)
- **No PCI compliance required** - Stripe handles all card data
- **Built-in validation** - Stripe validates cards automatically
- **Mobile optimized** - Stripe checkout works on all devices
- **International cards** - Supports cards from all countries
- **3D Secure** - Built-in support for SCA regulations

#### 2. Webhook-Based Payment Verification
- **Security** - Can't be faked by malicious users
- **Reliability** - Stripe retries failed webhook deliveries
- **Asynchronous** - Handles slow payment methods (bank transfers)
- **Audit trail** - All events logged in Stripe Dashboard

#### 3. Metadata Pattern
- **Linking** - Connect Stripe sessions to your orders
- **Idempotency** - Handle duplicate webhooks safely
- **Debugging** - Trace payments to specific orders
- **Flexibility** - Store additional context if needed

#### 4. Transaction-Based Stock Decrement
- **Atomicity** - Stock update and cart deletion happen together
- **Consistency** - Never oversell products
- **Isolation** - Concurrent orders don't conflict
- **Durability** - Once committed, changes persist

### Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│  USER                                                    │
└────────┬─────────────────────────────────────────────────┘
         │
         │ 1. Click "Proceed to Payment"
         ↓
┌──────────────────────────────────────────────────────────┐
│  FRONTEND (place-order-button.tsx)                      │
│  - handlePlaceOrder()                                    │
└────────┬─────────────────────────────────────────────────┘
         │
         │ 2. Call createOrder()
         ↓
┌──────────────────────────────────────────────────────────┐
│  SERVER ACTION (order.actions.ts)                       │
│  - Validate cart, address, payment method                │
│  - Check stock availability                              │
│  - Create order (isPaid: false)                          │
│  - Create order items                                    │
│  - Return orderId                                        │
└────────┬─────────────────────────────────────────────────┘
         │
         │ 3. Call createStripeCheckoutSession(orderId)
         ↓
┌──────────────────────────────────────────────────────────┐
│  SERVER ACTION (stripe.actions.ts)                      │
│  - Fetch order from database                             │
│  - Prepare line items                                    │
│  - Create Stripe Checkout Session                        │
│  - Store orderId in metadata                             │
│  - Return checkout URL                                   │
└────────┬─────────────────────────────────────────────────┘
         │
         │ 4. Redirect to Stripe Checkout
         ↓
┌──────────────────────────────────────────────────────────┐
│  STRIPE HOSTED PAGE                                      │
│  - Secure payment form                                   │
│  - Card validation                                       │
│  - 3D Secure if needed                                   │
│  - Payment processing                                    │
└────────┬─────────────────────────────────────────────────┘
         │
         ├─────────────────┬────────────────────────────────┐
         │                 │                                │
         │ 5a. Success     │ 5b. Webhook                    │
         │ Redirect        │                                │
         ↓                 ↓                                │
┌─────────────────┐ ┌──────────────────────────────────────┐
│ /order-success  │ │ /api/webhooks/stripe                 │
│ - Show details  │ │ - Verify signature                   │
│ - Link to order │ │ - Extract orderId from metadata      │
│ (NOT trusted)   │ │ - Call markOrderAsPaid()             │
└─────────────────┘ │ - Return 200 OK                      │
                    └─────────┬────────────────────────────┘
                              │
                              │ 6. Update database
                              ↓
                    ┌──────────────────────────────────────┐
                    │ DATABASE TRANSACTION                 │
                    │ - Set order.isPaid = true            │
                    │ - Set order.paidAt = now()           │
                    │ - Store paymentResult                │
                    │ - Decrement product.stock            │
                    │ - Delete user's cart                 │
                    │ COMMIT                               │
                    └──────────────────────────────────────┘
```

---

## ✅ Summary

You now have a complete, production-ready Stripe payment integration that:

- ✅ Creates orders securely
- ✅ Processes payments via Stripe Checkout
- ✅ Verifies payments via webhooks (source of truth)
- ✅ Updates order status after payment
- ✅ Decrements stock safely
- ✅ Deletes cart after successful payment
- ✅ Handles edge cases and errors
- ✅ Works in test mode (free, no business verification)
- ✅ Ready for production with live keys

**Next Steps:**
1. Test the flow with test cards
2. Verify webhooks are working
3. Add email notifications (future)
4. Deploy to production with live keys

Happy coding! 🚀
