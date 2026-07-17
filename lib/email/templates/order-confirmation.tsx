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

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const safeName = escapeHtml(customerName);
  const safeEmail = escapeHtml(customerEmail);
  const safeOrderId = escapeHtml(order.id.slice(0, 8).toUpperCase());
  const safeTotalPrice = escapeHtml(Number(order.totalPrice).toFixed(2));
  const safeOrderDate = escapeHtml(orderDate);
  const safeFullName = escapeHtml(order.shippingAddress.fullName);
  const safeStreet = escapeHtml(order.shippingAddress.streetAddress);
  const safeCity = escapeHtml(order.shippingAddress.city);
  const safeCountry = escapeHtml(order.shippingAddress.country);
  const safePostal = escapeHtml(order.shippingAddress.postalCode);

  const safeItems = order.items.map(item => ({
    name: escapeHtml(item.name),
    qty: item.qty,
    price: escapeHtml(Number(item.price).toFixed(2)),
  }));

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .order-info {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .order-info h2 {
          margin: 0 0 15px;
          font-size: 18px;
          color: #374151;
        }
        .order-info p {
          margin: 8px 0;
          color: #6b7280;
        }
        .order-info strong {
          color: #111827;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          background-color: #f9fafb;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
          padding: 15px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .item-name {
          font-weight: 500;
          color: #111827;
        }
        .item-qty {
          color: #6b7280;
          font-size: 14px;
        }
        .item-price {
          font-weight: 600;
          color: #111827;
          text-align: right;
        }
        .total-row {
          background-color: #f9fafb;
          font-weight: 600;
        }
        .total-row td {
          padding: 15px 12px;
          font-size: 18px;
          color: #667eea;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
          text-align: center;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .address-box {
          background-color: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
          border: 1px solid #e5e7eb;
        }
        .footer {
          background-color: #f9fafb;
          text-align: center;
          color: #6b7280;
          font-size: 13px;
          padding: 30px;
          border-top: 1px solid #e5e7eb;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>Thank you for your order, ${safeName}</p>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; color: #374151;">Hi ${safeName},</p>
          <p style="color: #6b7280;">We've received your order and it's being processed. You'll receive another email when your order ships.</p>
          
          <div class="order-info">
            <h2>Order Details</h2>
          <p><strong>Order Number:</strong> #${safeOrderId}</p>
          <p><strong>Order Date:</strong> ${safeOrderDate}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          </div>

          <div class="order-info">
            <h2>Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${safeItems
                  .map(
                    (item) => `
                  <tr>
                    <td>
                      <div class="item-name">${item.name}</div>
                      <div class="item-qty">$${Number(item.price).toFixed(2)} each</div>
                    </td>
                    <td style="text-align: center;">${item.qty}</td>
                    <td class="item-price">$${(Number(item.price) * item.qty).toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join('')}
                <tr class="total-row">
                  <td colspan="2" style="text-align: right;">Total:</td>
                  <td style="text-align: right;">$${safeTotalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="order-info">
            <h2>Shipping Address</h2>
             <div class="address-box">
               <strong>${safeFullName}</strong><br>
               ${safeStreet}<br>
               ${safeCity}, ${safePostal}<br>
               ${safeCountry}
             </div>
          </div>

          <div class="button-container">
            <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}" class="button">
              View Order Details
            </a>
          </div>

          <p style="margin-top: 30px; color: #6b7280;">If you have any questions about your order, please don't hesitate to contact us.</p>
        </div>

        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version (fallback for email clients that don't support HTML)
  const text = `
Order Confirmed!

Hi ${customerName},

Thank you for your order. We've received it and it's being processed.

Order Number: #${safeOrderId}
Order Date: ${safeOrderDate}
Total: $${safeTotalPrice}

Order Items:
${safeItems
  .map((item) => `- ${item.name} x${item.qty}: $${(Number(item.price) * item.qty).toFixed(2)}`)
  .join('\n')}

Shipping Address:
${safeFullName}
${safeStreet}
${safeCity}, ${safePostal}
${safeCountry}

View your order: ${process.env.NEXT_PUBLIC_SERVER_URL}/user/order/${order.id}

Thank you for shopping with us!

---
${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}
This is an automated email. Please do not reply.
  `;

  return { html, text };
}
