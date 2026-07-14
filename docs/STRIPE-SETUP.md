# Stripe Payment Integration - Complete Setup Guide

This guide walks you through setting up Stripe payment processing in **test mode** (completely free, no credit card or business verification required).

## 📋 Overview

The payment flow works like this:

```
User clicks "Proceed to Payment"
    ↓
Order created in database (isPaid: false)
    ↓
Stripe Checkout Session created
    ↓
User redirected to Stripe-hosted checkout page
    ↓
User enters test card: 4242 4242 4242 4242
    ↓
Stripe processes payment
    ↓
User redirected to success page
    ↓
Stripe sends webhook to your app
    ↓
Webhook verifies signature & marks order as paid
    ↓
Order appears as "Paid" in user's order history
```

**Key Point:** The webhook is the **source of truth**. Never trust client-side redirects alone for payment confirmation.

---

## 🚀 Quick Start (5 minutes)

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Sign up" (completely free)
3. You'll automatically be in **Test Mode** (see toggle in top-right)
4. No business verification or credit card needed for testing!

### Step 2: Get Your API Keys

1. In Stripe Dashboard, go to **Developers → API Keys**
2. Or directly: [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click "Reveal test key"

### Step 3: Add Keys to .env

```env
# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_51abc123...your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_51abc123...your_key_here
STRIPE_WEBHOOK_SECRET=whsec_...we'll_get_this_in_step_4
```

### Step 4: Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows (using Scoop):**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux:**
```bash
# Download binary from https://github.com/stripe/stripe-cli/releases
# Example for Linux:
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.5/stripe_1.19.5_linux_x86_64.tar.gz
tar -xvf stripe_1.19.5_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Verify installation:**
```bash
stripe --version
```

### Step 5: Login to Stripe CLI

```bash
stripe login
```

This will open your browser for authentication. Once done, you'll see:
```
✔ Done! The Stripe CLI is configured for [your-account]
```

### Step 6: Start Webhook Forwarding

In a **separate terminal window** (keep it running):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdefghijklmnop (^C to quit)
```

**Copy that `whsec_...` value** and add it to your `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnop
```

### Step 7: Restart Your Dev Server

```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing the Payment Flow

### 1. Complete a Test Purchase

1. Start dev server: `npm run dev`
2. Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Browse products at `http://localhost:3000`
4. Add items to cart
5. Click "Checkout"
6. Fill in shipping address
7. Select payment method (Stripe)
8. Click "Proceed to Payment"

### 2. You'll See Stripe Checkout Page

- Professional hosted checkout by Stripe
- SSL secured (even in test mode)
- Mobile responsive

### 3. Use Test Card

Enter these test card details:

| Field | Value |
|-------|-------|
| **Card number** | `4242 4242 4242 4242` |
| **Expiry** | Any future date (e.g., `12/34`) |
| **CVC** | Any 3 digits (e.g., `123`) |
| **ZIP** | Any 5 digits (e.g., `12345`) |
| **Name** | Any name |

### 4. Complete Payment

Click "Pay" button. You'll be redirected to:
```
http://localhost:3000/order-success?session_id=cs_test_...
```

### 5. Verify Webhook Received

Check your **Stripe CLI terminal** (the one running `stripe listen`):

```bash
2024-01-15 10:30:45   --> checkout.session.completed [evt_1abc123]
✅ Payment successful!
{
  sessionId: 'cs_test_abc123...',
  orderId: '550e8400-e29b-41d4-a716-446655440000',
  amount: 12498
}
```

### 6. Check Order Status

1. Go to "My Orders" in the app
2. Find your order
3. Status should show "Paid" ✓
4. Click to view order details

### 7. Check Admin Panel

1. Login as admin
2. Go to `/admin/orders`
3. See the order with payment status "Paid"
4. Click order to see payment details

---

## 🧪 Test Cards for Different Scenarios

### Successful Payments

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Standard success (use this most) |
| `4000 0566 5566 5556` | Success (Visa debit) |
| `5555 5555 5555 4444` | Success (Mastercard) |

### Authentication Required (3D Secure)

| Card Number | Description |
|-------------|-------------|
| `4000 0025 0000 3155` | Requires authentication |
| `4000 0027 6000 3184` | Authentication required (Visa) |

Stripe will show authentication popup - click "Complete authentication" to proceed.

### Declined Payments

| Card Number | Reason |
|-------------|--------|
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 9987` | Lost card |
| `4000 0000 0000 9979` | Stolen card |
| `4000 0000 0000 0002` | Generic decline |

Full list: [stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## 🔍 Understanding the Code

### 1. Order Creation (`lib/actions/order.actions.ts`)

```typescript
// Creates order with isPaid: false
const order = await prisma.order.create({
  data: {
    userId: userId,
    isPaid: false, // ← Unpaid initially
    // ... other fields
  }
});
```

### 2. Checkout Session Creation (`lib/actions/stripe.actions.ts`)

```typescript
const checkoutSession = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [...], // Order items as Stripe line items
  success_url: "http://localhost:3000/order-success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "http://localhost:3000/order-cancel?order_id=${orderId}",
  metadata: {
    orderId: order.id, // ← Link session to order
  }
});

// Redirect user to checkoutSession.url
```

### 3. Webhook Handler (`app/api/webhooks/stripe/route.ts`)

```typescript
// Verify signature (prevents fake webhooks)
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  STRIPE_WEBHOOK_SECRET
);

// Handle successful payment
if (event.type === "checkout.session.completed") {
  const orderId = session.metadata.orderId;
  
  // Mark order as paid
  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult: { ... }
    }
  });
}
```

---

## 🛠️ Troubleshooting

### Problem: "Webhook signature verification failed"

**Cause:** Webhook secret doesn't match

**Solution:**
1. Check output of `stripe listen` command
2. Copy the `whsec_...` value exactly
3. Update `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`
4. Restart dev server

### Problem: Order still showing "Unpaid" after checkout

**Cause:** Webhook not received

**Check:**
1. Is Stripe CLI running? (`stripe listen`)
2. Check terminal for webhook events
3. Check browser network tab for POST to `/api/webhooks/stripe`
4. Check server logs for errors

**Debug:**
```bash
# In webhook terminal, you should see:
--> checkout.session.completed [evt_...]

# If you see errors like:
--> checkout.session.completed [evt_...] [400 Bad Request]

# That means webhook hit your app but signature verification failed
```

### Problem: Can't redirect to Stripe Checkout

**Cause:** Missing environment variables

**Check:**
1. `STRIPE_SECRET_KEY` exists in `.env`
2. `NEXT_PUBLIC_SERVER_URL=http://localhost:3000` in `.env`
3. Restart dev server after changing `.env`

### Problem: "Error creating checkout session"

**Cause:** Invalid API key or order data

**Check:**
1. Key starts with `sk_test_` (not `sk_live_`)
2. Order exists in database
3. Order has items with valid prices

**Debug:**
```bash
# Check server console for error details
# Should show exact Stripe API error
```

### Problem: Success page loads but order still unpaid

**Cause:** Webhook hasn't fired yet (or failed)

**This is normal!** There's a delay between:
1. User sees success page (immediate)
2. Webhook updates order (1-3 seconds later)

**Solution:** Refresh the order page after a few seconds.

---

## 📊 Monitoring Webhooks

### In Stripe Dashboard

1. Go to **Developers → Webhooks**
2. Click your webhook endpoint
3. See recent events and their status

### In Stripe CLI

```bash
# View last 10 events
stripe events list --limit 10

# View specific event
stripe events retrieve evt_1abc123

# Resend event (for testing)
stripe events resend evt_1abc123
```

### Testing Webhooks Manually

```bash
# Trigger test checkout.session.completed event
stripe trigger checkout.session.completed

# This will send a webhook to your app
# Check your terminal for the event
```

---

## 🚀 Production Deployment

When you're ready to accept real payments:

### 1. Switch to Live Mode

In Stripe Dashboard:
- Toggle from **Test Mode** to **Live Mode** (top-right)
- Complete business verification (required for live mode)

### 2. Get Live API Keys

1. Go to **Developers → API Keys** (in live mode)
2. Copy your live keys (start with `sk_live_` and `pk_live_`)
3. Update production `.env`:

```env
STRIPE_SECRET_KEY=sk_live_...your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_...your_live_key
```

### 3. Create Production Webhook

**Do NOT use Stripe CLI in production!**

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `checkout.session.expired`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to production `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...production_secret
```

### 4. Test with Real Cards

Use real credit cards (small test amounts recommended):
- Minimum charge: $0.50 USD
- Stripe fee: 2.9% + $0.30 per transaction

---

## 💰 Pricing

### Test Mode (Development)
- **100% FREE**
- Unlimited test transactions
- No credit card required
- No business verification

### Live Mode (Production)
- **2.9% + $0.30** per successful card charge
- No monthly fees
- No setup fees
- Only pay for successful transactions

Example costs:
- $10 order → $0.59 fee → You receive $9.41
- $50 order → $1.75 fee → You receive $48.25
- $100 order → $3.20 fee → You receive $96.80

---

## 🔐 Security Best Practices

### ✅ DO

- Use environment variables for all keys
- Verify webhook signatures (already implemented)
- Use HTTPS in production
- Store only necessary payment info (session ID, status)
- Never log full card numbers

### ❌ DON'T

- Commit `.env` to git (already in `.gitignore`)
- Share your secret key publicly
- Trust client-side payment status (always verify via webhook)
- Handle raw card data (use Stripe Checkout instead)
- Use test keys in production

---

## 📚 Additional Resources

- [Stripe Testing Docs](https://stripe.com/docs/testing)
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)

---

## ✅ Checklist

Before testing:
- [ ] Stripe account created
- [ ] Test API keys copied to `.env`
- [ ] Stripe CLI installed
- [ ] `stripe login` completed
- [ ] `stripe listen` running in separate terminal
- [ ] Webhook secret added to `.env`
- [ ] Dev server restarted
- [ ] Test card numbers handy

Testing:
- [ ] Order created successfully
- [ ] Redirected to Stripe Checkout
- [ ] Test payment completed
- [ ] Redirected to success page
- [ ] Webhook received in CLI terminal
- [ ] Order shows as "Paid" in app
- [ ] Order visible in admin panel

---

**Need help?** Check the troubleshooting section or review server logs for detailed error messages.
