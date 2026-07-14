# Email Notifications with Gmail - Implementation Plan

**Goal:** Send real transactional emails from your Gmail account  
**Estimated Time:** 2-3 hours  
**Cost:** FREE (Gmail SMTP)

---

## 📋 Overview

We'll use **Nodemailer + Gmail SMTP** to send:
1. Order confirmation emails (after payment)
2. Shipping notification emails (when admin marks as delivered)
3. Password reset emails (future)

**Why Gmail SMTP?**
- ✅ FREE (500 emails/day limit)
- ✅ Real Gmail address (looks professional)
- ✅ No new service signup needed (use your Gmail)
- ✅ Simple setup with App Password
- ✅ Works immediately

**Limitations:**
- 500 emails/day limit (fine for starting out)
- Might go to spam initially (until domain reputation builds)

**For Production Later:**
- Upgrade to Resend.com or SendGrid for higher volume
- Custom domain email (info@yourdomain.com)

---

## 🎯 Implementation Steps

### Step 1: Setup Gmail App Password (5 minutes)

1. **Enable 2-Factor Authentication** on your Gmail
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow setup wizard

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Name it: "E-commerce App"
   - Click "Generate"
   - **Copy the 16-character password** (you won't see it again!)

3. **Add to .env**
   ```env
   EMAIL_FROM=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

---

### Step 2: Install Dependencies (1 minute)

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

### Step 3: Create Email Service (30 minutes)

**File Structure:**
```
lib/
├── email/
│   ├── nodemailer.ts           # Nodemailer configuration
│   ├── templates/
│   │   ├── order-confirmation.tsx   # Order email template
│   │   └── shipping-notification.tsx # Shipping email template
│   └── actions/
│       └── email.actions.ts    # Email sending functions
```

---

### Step 4: Configure Nodemailer (15 minutes)

**Create:** `lib/email/nodemailer.ts`

```typescript
import nodemailer from 'nodemailer';

// Validate environment variables
if (!process.env.EMAIL_FROM) {
  throw new Error('EMAIL_FROM is not set');
}
if (!process.env.EMAIL_PASSWORD) {
  throw new Error('EMAIL_PASSWORD is not set');
}

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});
```

---

### Step 5: Create Email Templates (45 minutes)

**Create:** `lib/email/templates/order-confirmation.tsx`

```typescript
import { Order } from '@/types';

interface OrderConfirmationEmailProps {
  order: {
    id: string;
    totalPrice: string;
    createdAt: Date;
    items: Array<{
      name: string;
      qty: number;
      price: string;
      image: string;
    }>;
    shippingAddress: {
      fullName: string;
      streetAddress: string;
      city: string;
      country: string;
      postalCode: string;
    };
  };
  customerName: string;
  customerEmail: string;
}

export function generateOrderConfirmationEmail({
  order,
  customerName,
  customerEmail,
}: OrderConfirmationEmailProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4F46E5;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border: 1px solid #e0e0e0;
        }
        .order-info {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .item {
          border-bottom: 1px solid #e0e0e0;
          padding: 15px 0;
          display: flex;
          justify-content: space-between;
        }
        .item:last-child {
          border-bottom: none;
        }
        .total {
          font-size: 20px;
          font-weight: bold;
          color: #4F46E5;
          text-align: right;
          padding-top: 15px;
          border-top: 2px solid #4F46E5;
          margin-top: 15px;
        }
        .button {
          display: inline-block;
          background-color: #4F46E5;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }
        .address {
          background-color: white;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Order Confirmed!</h1>
        <p>Thank you for your order, ${customerName}</p>
      </div>
      
      <div class="content">
        <p>Hi ${customerName},</p>
        <p>We've received your order and it's being processed. You'll receive another email when your order ships.</p>
        
        <div class="order-info">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>

        <div class="order-info">
          <h2 style="margin-top: 0;">Order Items</h2>
          ${order.items
            .map(
              (item) => `
            <div class="item">
              <div>
                <strong>${item.name}</strong><br>
                <span style="color: #666;">Quantity: ${item.qty}</span>
              </div>
              <div style="text-align: right;">
                <strong>$${(Number(item.price) * item.qty).toFixed(2)}</strong>
              </div>
            </div>
          `
            )
            .join('')}
          
          <div class="total">
            Total: $${Number(order.totalPrice).toFixed(2)}
          </div>
        </div>

        <div class="order-info">
          <h2 style="margin-top: 0;">Shipping Address</h2>
          <div class="address">
            <strong>${order.shippingAddress.fullName}</strong><br>
            ${order.shippingAddress.streetAddress}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}" class="button">
            View Order Details
          </a>
        </div>

        <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact us.</p>
      </div>

      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  // Plain text version (fallback)
  const text = `
Order Confirmed!

Hi ${customerName},

Thank you for your order. We've received it and it's being processed.

Order Number: #${order.id.slice(0, 8).toUpperCase()}
Order Date: ${orderDate}
Total: $${Number(order.totalPrice).toFixed(2)}

Order Items:
${order.items
  .map((item) => `- ${item.name} x${item.qty}: $${(Number(item.price) * item.qty).toFixed(2)}`)
  .join('\n')}

Shipping Address:
${order.shippingAddress.fullName}
${order.shippingAddress.streetAddress}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
${order.shippingAddress.country}

View your order: ${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}

Thank you for shopping with us!
  `;

  return { html, text };
}
```

---

**Create:** `lib/email/templates/shipping-notification.tsx`

```typescript
interface ShippingNotificationEmailProps {
  order: {
    id: string;
    totalPrice: string;
    deliveredAt?: Date;
  };
  customerName: string;
}

export function generateShippingNotificationEmail({
  order,
  customerName,
}: ShippingNotificationEmailProps) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Shipped</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #10B981;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border: 1px solid #e0e0e0;
        }
        .button {
          display: inline-block;
          background-color: #10B981;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📦 Your Order Has Shipped!</h1>
      </div>
      
      <div class="content">
        <p>Hi ${customerName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order Number:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
          <p><strong>Status:</strong> <span style="color: #10B981;">Shipped ✓</span></p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}" class="button">
            Track Your Order
          </a>
        </div>

        <p style="margin-top: 30px;">Thank you for your purchase!</p>
      </div>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Your Order Has Shipped!

Hi ${customerName},

Your order #${order.id.slice(0, 8).toUpperCase()} has been shipped and is on its way to you.

Track your order: ${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}

Thank you for shopping with us!
  `;

  return { html, text };
}
```

---

### Step 6: Create Email Sending Actions (30 minutes)

**Create:** `lib/email/actions/email.actions.ts`

```typescript
"use server";

import { transporter } from '../nodemailer';
import { generateOrderConfirmationEmail } from '../templates/order-confirmation';
import { generateShippingNotificationEmail } from '../templates/shipping-notification';

/**
 * Send Order Confirmation Email
 * Called after successful payment (in Stripe webhook)
 */
export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    // Import here to avoid circular dependencies
    const { getOrderById } = await import('@/lib/actions/order.actions');
    
    // Fetch order details
    const order = await getOrderById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Generate email content
    const { html, text } = generateOrderConfirmationEmail({
      order: {
        id: order.id,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        items: order.orderItems,
        shippingAddress: order.shippingAddress as any,
      },
      customerName: order.user.name,
      customerEmail: order.user.email,
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_FROM}>`,
      to: order.user.email,
      subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()}`,
      text: text,
      html: html,
    });

    console.log('✅ Order confirmation email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Shipping Notification Email
 * Called when admin marks order as delivered
 */
export async function sendShippingNotificationEmail(orderId: string) {
  try {
    const { getOrderById } = await import('@/lib/actions/order.actions');
    
    const order = await getOrderById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const { html, text } = generateShippingNotificationEmail({
      order: {
        id: order.id,
        totalPrice: order.totalPrice,
        deliveredAt: order.deliveredAt,
      },
      customerName: order.user.name,
    });

    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_FROM}>`,
      to: order.user.email,
      subject: `Your Order Has Shipped #${order.id.slice(0, 8).toUpperCase()}`,
      text: text,
      html: html,
    });

    console.log('✅ Shipping notification email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Failed to send shipping notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test Email Function
 * Use this to verify your email setup works
 */
export async function sendTestEmail(toEmail: string) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: 'Test Email from Your E-Commerce App',
      text: 'If you received this email, your email integration is working correctly!',
      html: '<p>If you received this email, your <strong>email integration is working correctly!</strong></p>',
    });

    console.log('✅ Test email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

---

### Step 7: Integrate with Stripe Webhook (15 minutes)

**Update:** `lib/actions/stripe.actions.ts`

Add email sending after marking order as paid:

```typescript
// Add this import at the top
import { sendOrderConfirmationEmail } from '@/lib/email/actions/email.actions';

// In markOrderAsPaid function, after transaction succeeds:
export async function markOrderAsPaid(/* ... */) {
  try {
    // ... existing transaction code ...

    // Revalidate pages
    revalidatePath(`/user/order/${orderId}`);
    revalidatePath("/user/orders");
    revalidatePath("/admin/orders");
    revalidatePath("/cart");

    // ✨ NEW: Send order confirmation email
    await sendOrderConfirmationEmail(orderId);

    console.log(`✅ Order ${orderId} marked as paid, email sent`);

    return {
      success: true,
      message: "Order marked as paid",
    };
  } catch (error) {
    // ... error handling ...
  }
}
```

---

### Step 8: Integrate with Admin Order Management (15 minutes)

**Update:** `lib/actions/admin.actions.ts`

Add email sending when marking order as delivered:

```typescript
// Add this import at the top
import { sendShippingNotificationEmail } from '@/lib/email/actions/email.actions';

// In updateOrderDeliveryStatus function:
export async function updateOrderDeliveryStatus(
  orderId: string,
  isDelivered: boolean
) {
  try {
    // ... existing validation code ...

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered,
        deliveredAt: isDelivered ? new Date() : null,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    // ✨ NEW: Send shipping notification email if delivered
    if (isDelivered) {
      await sendShippingNotificationEmail(orderId);
    }

    return {
      success: true,
      message: `Order marked as ${isDelivered ? "delivered" : "pending delivery"}`,
    };
  } catch (error) {
    // ... error handling ...
  }
}
```

---

### Step 9: Update Environment Variables (5 minutes)

**Update:** `.env`

```env
# Gmail SMTP Configuration
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-here
```

**Update:** `.env.example`

```env
# Email Configuration (Gmail SMTP)
# Get App Password from: https://myaccount.google.com/apppasswords
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here
```

---

### Step 10: Test Email Integration (15 minutes)

**Create test page:** `app/admin/test-email/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendTestEmail } from "@/lib/email/actions/email.actions";
import { toast } from "sonner";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    const result = await sendTestEmail(email);
    setLoading(false);

    if (result.success) {
      toast.success(`Test email sent to ${email}! Check your inbox.`);
    } else {
      toast.error(`Failed: ${result.error}`);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Email Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Test Email"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ Testing Checklist

### 1. Test Email Configuration (5 min)
- [ ] Navigate to `/admin/test-email`
- [ ] Enter your email
- [ ] Click "Send Test Email"
- [ ] Check inbox (might be in spam first time)
- [ ] Verify email received

### 2. Test Order Confirmation Email (10 min)
- [ ] Place a test order with Stripe
- [ ] Complete payment with test card `4242 4242 4242 4242`
- [ ] Check webhook received
- [ ] Check email inbox for order confirmation
- [ ] Verify all order details in email
- [ ] Click "View Order" button in email

### 3. Test Shipping Notification Email (5 min)
- [ ] Go to admin panel
- [ ] Find the test order
- [ ] Mark order as "Delivered"
- [ ] Check email inbox for shipping notification
- [ ] Verify email received

---

## 🚨 Troubleshooting

### "Username and Password not accepted"
**Solution:**
1. Verify 2FA is enabled on Gmail
2. Generate new App Password
3. Copy exact 16-character password (no spaces)
4. Update `.env` file
5. Restart dev server

### Emails going to spam
**Solutions:**
1. **Short-term:** Ask recipients to mark as "Not Spam"
2. **Long-term:** 
   - Use custom domain email (info@yourdomain.com)
   - Switch to Resend.com or SendGrid
   - Setup SPF, DKIM, DMARC records

### "Email service error: connect ECONNREFUSED"
**Solution:**
- Check internet connection
- Verify Gmail credentials in `.env`
- Try different Gmail account
- Check if Gmail SMTP is blocked by firewall

### Emails not sending
**Check:**
1. Console logs for errors
2. `.env` file has correct values
3. Nodemailer transporter is configured
4. Gmail App Password is valid
5. Restart server after `.env` changes

---

## 📊 Production Considerations

### Gmail Limits
- **500 emails/day** for free Gmail accounts
- **2000 emails/day** for Google Workspace
- **Good for:** Testing, low-volume stores
- **Not good for:** High-volume e-commerce

### When to Upgrade

**Move to Resend.com or SendGrid when:**
- Sending > 100 emails/day
- Need custom domain (info@yourdomain.com)
- Want better deliverability
- Need email analytics
- Want professional appearance

**Migration is easy:**
- Change transporter configuration
- Keep same email templates
- Keep same sending functions
- No other code changes needed

---

## 📁 Final File Structure

```
lib/
├── email/
│   ├── nodemailer.ts                      # ✨ NEW - SMTP config
│   ├── actions/
│   │   └── email.actions.ts               # ✨ NEW - Sending functions
│   └── templates/
│       ├── order-confirmation.tsx         # ✨ NEW - Order email
│       └── shipping-notification.tsx      # ✨ NEW - Shipping email
├── actions/
│   ├── stripe.actions.ts                  # 🔄 UPDATED - Added email
│   └── admin.actions.ts                   # 🔄 UPDATED - Added email
app/
└── admin/
    └── test-email/
        └── page.tsx                        # ✨ NEW - Test page
.env                                        # 🔄 UPDATED - Added EMAIL vars
.env.example                                # 🔄 UPDATED - Added EMAIL vars
package.json                                # 🔄 UPDATED - Added nodemailer
```

---

## 🎯 Implementation Timeline

```
Total Time: 2-3 hours

Setup Gmail (5 min)
├─ Enable 2FA
├─ Create App Password
└─ Add to .env

Install Dependencies (1 min)
└─ npm install nodemailer @types/nodemailer

Create Email Service (30 min)
└─ Configure Nodemailer

Create Templates (45 min)
├─ Order confirmation template
└─ Shipping notification template

Create Actions (30 min)
├─ sendOrderConfirmationEmail()
├─ sendShippingNotificationEmail()
└─ sendTestEmail()

Integrate (30 min)
├─ Update Stripe webhook (15 min)
├─ Update admin actions (15 min)

Test (15 min)
├─ Test email page
├─ Test order flow
└─ Test shipping notification
```

---

## ✅ Success Criteria

After implementation:
- [ ] Test email sends successfully
- [ ] Order confirmation email sends after payment
- [ ] Shipping notification sends when marked delivered
- [ ] Emails look professional (HTML formatting)
- [ ] All links in email work
- [ ] No errors in console
- [ ] Emails not going to spam (or minimal)

---

## 🚀 Next Steps After Email Integration

1. **Test thoroughly** with real orders
2. **Monitor deliverability** (check spam rates)
3. **Add more email templates:**
   - Password reset email
   - Welcome email on signup
   - Low stock alerts (admin)
4. **Switch to production:**
   - Use Google Workspace for higher limits
   - Or migrate to Resend.com/SendGrid
   - Setup custom domain email

---

**Ready to implement?** Follow the steps above and you'll have real Gmail emails working in 2-3 hours! 🚀
