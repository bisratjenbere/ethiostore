# Gmail Email Integration - Quick Start

**Goal:** Send real emails from your Gmail in 30 minutes  
**Cost:** FREE

---

## 🚀 Quick Setup (30 Minutes)

### Step 1: Get Gmail App Password (5 min)

1. **Enable 2FA on your Gmail:**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → Follow setup

2. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - App: "Mail" | Device: "Other" → Name: "E-commerce App"
   - Click "Generate"
   - **Copy the 16-character password**

3. **Add to `.env`:**
   ```env
   EMAIL_FROM=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

---

### Step 2: Install Nodemailer (1 min)

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

### Step 3: Create Files (20 min)

Run these commands to create the file structure:

```bash
mkdir -p lib/email/templates lib/email/actions
touch lib/email/nodemailer.ts
touch lib/email/templates/order-confirmation.tsx
touch lib/email/templates/shipping-notification.tsx
touch lib/email/actions/email.actions.ts
```

Then copy the code from **IMPLEMENTATION-PLAN.md** into each file.

---

### Step 4: Update Webhook (5 min)

In `lib/actions/stripe.actions.ts`, add after marking order as paid:

```typescript
import { sendOrderConfirmationEmail } from '@/lib/email/actions/email.actions';

// In markOrderAsPaid function:
await sendOrderConfirmationEmail(orderId);
```

---

### Step 5: Test (5 min)

```bash
npm run dev
```

1. Place test order with Stripe
2. Check your email inbox
3. ✅ You should receive order confirmation!

---

## 📧 What You Get

After setup, your app will automatically send:

1. **Order Confirmation Email** - When customer pays
   - Order details
   - Items purchased
   - Shipping address
   - Link to view order

2. **Shipping Notification Email** - When admin marks as delivered
   - Shipment confirmation
   - Link to track order

---

## 🔍 Quick Test

Create `app/admin/test-email/page.tsx`:

```typescript
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendTestEmail } from "@/lib/email/actions/email.actions";

export default function TestEmail() {
  const [email, setEmail] = useState("");
  
  return (
    <div className="p-8">
      <Input 
        placeholder="Enter email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={() => sendTestEmail(email)}>
        Send Test
      </Button>
    </div>
  );
}
```

Visit `/admin/test-email` to test!

---

## 🚨 Troubleshooting

**"Username and Password not accepted"**
→ Make sure 2FA is enabled, regenerate App Password

**Emails in spam**
→ Normal for first few emails, they'll improve over time

**Not receiving emails**
→ Check console for errors, verify EMAIL_FROM and EMAIL_PASSWORD in `.env`

---

## 📊 Limits

**Gmail Free:** 500 emails/day  
**Google Workspace:** 2000 emails/day

For higher volume, upgrade to Resend.com or SendGrid later.

---

## ✅ Success!

After setup:
- ✅ Real emails from your Gmail
- ✅ Order confirmations automatic
- ✅ Professional HTML templates
- ✅ FREE to use

**Total time:** 30 minutes  
**Cost:** $0

See **IMPLEMENTATION-PLAN.md** for detailed instructions.
