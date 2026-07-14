# Stripe Payment Integration - Quick Start

## 🚀 5-Minute Setup

### 1. Get Stripe Test Keys (2 minutes)

1. Go to [stripe.com](https://stripe.com) → Sign up (free)
2. Dashboard → Developers → API Keys
3. Copy test keys (pk_test_... and sk_test_...)

### 2. Update .env (1 minute)

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_...get_this_next
```

### 3. Install & Run Stripe CLI (2 minutes)

```bash
# Install (macOS)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Start webhook forwarding (keep this running)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret to your `.env` file.

### 4. Start Dev Server

```bash
npm run dev
```

### 5. Test Payment (1 minute)

1. Add products to cart
2. Checkout → Enter address → Select payment
3. Click "Proceed to Payment"
4. Use test card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - ZIP: `12345`
5. Complete payment
6. ✅ Order should show as "Paid"!

## 📁 Files Created

```
lib/
├── stripe.ts                          # Stripe client
└── actions/
    └── stripe.actions.ts              # Payment logic ✨ NEW

app/
├── api/webhooks/stripe/route.ts       # Webhook handler ✨ NEW
├── (root)/
│   ├── order-success/page.tsx         # Success page ✨ NEW
│   └── order-cancelled/page.tsx       # Cancel page ✨ NEW

.kiro/
└── STRIPE-INTEGRATION-GUIDE.md        # Full docs ✨ NEW
```

## 🎯 What Happens

```
User clicks "Pay" 
→ Order created (unpaid)
→ Redirected to Stripe
→ User pays on Stripe
→ Webhook confirms payment
→ Order marked as paid ✅
→ Stock decremented
→ Cart deleted
```

## 🔍 Verify It Worked

**Terminal 2 (Stripe CLI) should show:**
```
[200] POST /api/webhooks/stripe
evt_abc... checkout.session.completed
```

**App should show:**
- My Orders → Order status: "Paid" ✅
- Cart is empty
- Product stock decreased

## 📚 Full Documentation

See [STRIPE-INTEGRATION-GUIDE.md](../../STRIPE-INTEGRATION-GUIDE.md) for:
- Detailed flow diagrams
- Troubleshooting guide
- Production deployment
- Edge case testing

## 🚨 Common Issues

**"Webhook signature failed"**
→ Copy `whsec_...` from Stripe CLI to `.env` and restart server

**"Order still unpaid"**
→ Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**"Redirect not working"**
→ Check `.env` has `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`
