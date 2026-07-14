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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          background-color: white;
          margin: 20px auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header .icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        .status-box {
          background-color: #f0fdf4;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
          border: 2px solid #10b981;
        }
        .status-box strong {
          color: #065f46;
          font-size: 18px;
        }
        .order-info {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .order-info p {
          margin: 8px 0;
          color: #6b7280;
        }
        .order-info strong {
          color: #111827;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .footer {
          background-color: #f9fafb;
          text-align: center;
          color: #6b7280;
          font-size: 13px;
          padding: 30px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">📦</div>
          <h1>Your Order Has Shipped!</h1>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; color: #374151;">Hi ${customerName},</p>
          <p style="color: #6b7280;">Great news! Your order has been shipped and is on its way to you.</p>
          
          <div class="status-box">
            <strong>✓ Status: Shipped</strong>
          </div>

          <div class="order-info">
            <p><strong>Order Number:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Order Total:</strong> $${Number(order.totalPrice).toFixed(2)}</p>
          </div>

          <div class="button-container">
            <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}" class="button">
              Track Your Order
            </a>
          </div>

          <p style="margin-top: 30px; color: #6b7280; text-align: center;">
            Thank you for your purchase! We hope you enjoy your items.
          </p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Your Order Has Shipped!

Hi ${customerName},

Your order #${order.id.slice(0, 8).toUpperCase()} has been shipped and is on its way to you.

Status: Shipped ✓

Track your order: ${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}

Thank you for shopping with us!

---
${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}
  `;

  return { html, text };
}
