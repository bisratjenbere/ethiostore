"use server";

import { transporter } from '../nodemailer';
import { generateOrderConfirmationEmail } from '../templates/order-confirmation';
import { generateShippingNotificationEmail } from '../templates/shipping-notification';
import { prisma } from '@/db/prisma';

/**
 * Send Order Confirmation Email
 * Called after successful payment (in Stripe webhook)
 */
export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Email not configured - skipping order confirmation email');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    // Fetch order details with user and items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          select: {
            name: true,
            qty: true,
            price: true,
            image: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Generate email content
    const { html, text } = generateOrderConfirmationEmail({
      order: {
        id: order.id,
        totalPrice: order.totalPrice.toString(),
        createdAt: order.createdAt,
        items: order.orderItems.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price.toString(),
          image: item.image,
        })),
        shippingAddress: order.shippingAddress as {
          fullName: string;
          streetAddress: string;
          city: string;
          country: string;
          postalCode: string;
        },
      },
      customerName: order.user.name,
      customerEmail: order.user.email,
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}" <${process.env.EMAIL_FROM}>`,
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
    // Check if email is configured
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Email not configured - skipping shipping notification email');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    // Fetch order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Generate email content
    const { html, text } = generateShippingNotificationEmail({
      order: {
        id: order.id,
        totalPrice: order.totalPrice.toString(),
        deliveredAt: order.deliveredAt || undefined,
      },
      customerName: order.user.name,
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}" <${process.env.EMAIL_FROM}>`,
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
    // Check if email is configured
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email service not configured. Please set EMAIL_FROM and EMAIL_PASSWORD in .env file');
    }

    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: 'Test Email from Your E-Commerce App ✅',
      text: 'If you received this email, your email integration is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ Email Integration Working!</h2>
          <p>If you received this email, your <strong>email integration is working correctly!</strong></p>
          <p style="color: #6b7280; margin-top: 20px;">
            You can now send order confirmations and shipping notifications to your customers.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">
            This is a test email from ${process.env.NEXT_PUBLIC_APP_NAME || 'ProStore'}
          </p>
        </div>
      `,
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
