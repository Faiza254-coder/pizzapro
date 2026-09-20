import nodemailer from 'nodemailer';

export interface OrderItem {
  menuItem?: {
    name?: string;
    price?: number;
  };
  name?: string;
  quantity: number;
  selectedSize?: string;
  totalPrice?: number;
  unitPrice?: number;
}

export interface OrderPayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentTxnId?: string;
  paymentStatus?: string;
  orderStatus?: string;
  orderType?: string;
  notes?: string;
  createdAt?: string;
  createdAtISO?: string;
  estimatedTimeMinutes?: number;
}

// Get lazy nodemailer transporter
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false, // Prevents self-signed cert issues
    },
  });
};

// Generate HTML email template for Customer Confirmation
const buildCustomerEmailHtml = (order: OrderPayload): string => {
  const items = order.items || [];
  const itemsHtml = items.map((item) => {
    const itemName = item.menuItem?.name || item.name || 'Pizza Item';
    const size = item.selectedSize ? ` (${item.selectedSize})` : '';
    const qty = item.quantity || 1;
    const itemTotal = item.totalPrice || (item.unitPrice ? item.unitPrice * qty : 0);
    return `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #18181b;">
          <strong>${qty}x</strong> ${itemName} <span style="color: #71717a; font-size: 12px;">${size}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #18181b; text-align: right; font-family: monospace; font-weight: bold;">
          Rs ${itemTotal.toLocaleString()}
        </td>
      </tr>
    `;
  }).join('');

  const formattedPayment = order.paymentMethod === 'cod'
    ? 'Cash on Delivery (COD)'
    : order.paymentMethod === 'jazzcash'
      ? `JazzCash Mobile Wallet ${order.paymentTxnId ? `(Trx ID: ${order.paymentTxnId})` : ''}`
      : order.paymentMethod === 'easypaisa'
        ? `EasyPaisa Mobile Wallet ${order.paymentTxnId ? `(Trx ID: ${order.paymentTxnId})` : ''}`
        : `${order.paymentMethod.toUpperCase()} ${order.paymentTxnId ? `(Trx ID: ${order.paymentTxnId})` : ''}`;

  const dateTime = order.createdAtISO
    ? new Date(order.createdAtISO).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
    : order.createdAt || new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pizza Pro - Order Confirmation #${order.orderId}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e4e4e7;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; font-style: italic;">PIZZA PRO</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #fecaca; letter-spacing: 1px; font-weight: 700; uppercase;">SHERGARH • PUNJAB</p>
          <div style="margin-top: 16px; display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 99px; font-size: 13px; font-weight: 800; border: 1px solid rgba(255,255,255,0.3);">
            Order Confirmed! #${order.orderId}
          </div>
        </div>

        <!-- Body Content -->
        <div style="padding: 28px 24px;">
          <p style="font-size: 16px; color: #18181b; margin-top: 0;">Hi <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 14px; color: #52525b; line-height: 1.6;">
            Thank you for ordering from <strong>Pizza Pro Shergarh</strong>! Your order has been received and sent directly to our kitchen.
          </p>

          <!-- Order Summary Card -->
          <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #3f3f46;">
              <tr>
                <td style="padding: 4px 0;"><strong>Order ID:</strong></td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: bold; color: #dc2626;">#${order.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;"><strong>Date & Time:</strong></td>
                <td style="padding: 4px 0; text-align: right;">${dateTime}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;"><strong>Payment Method:</strong></td>
                <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #18181b;">${formattedPayment}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;"><strong>Delivery Address:</strong></td>
                <td style="padding: 4px 0; text-align: right; font-weight: 500;">${order.deliveryAddress}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;"><strong>Estimated Delivery:</strong></td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #059669;">25 - 35 Minutes</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="font-size: 14px; font-weight: 800; color: #18181b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
            Your Ordered Items
          </h3>

          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f4f4f5; text-align: left; font-size: 12px; text-transform: uppercase; color: #71717a;">
                <th style="padding: 10px 16px;">Item</th>
                <th style="padding: 10px 16px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Financial Breakdown -->
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #18181b;">
              <tr>
                <td style="padding: 4px 0; color: #52525b;">Subtotal:</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace;">Rs ${(order.subtotal || 0).toLocaleString()}</td>
              </tr>
              ${order.discount ? `
              <tr>
                <td style="padding: 4px 0; color: #059669;">Discount:</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #059669;">-Rs ${order.discount.toLocaleString()}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 4px 0; color: #52525b;">Delivery Charges:</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace;">Rs ${(order.deliveryFee || 0).toLocaleString()}</td>
              </tr>
              <tr style="border-top: 2px solid #f87171;">
                <td style="padding: 10px 0 4px 0; font-size: 16px; font-weight: 900; color: #991b1b;">TOTAL BILL:</td>
                <td style="padding: 10px 0 4px 0; text-align: right; font-size: 20px; font-weight: 900; color: #dc2626; font-family: monospace;">Rs ${(order.totalAmount || 0).toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <!-- Customer Instructions / Notes -->
          ${order.notes ? `
          <div style="padding: 12px 16px; background: #fffbebfb; border: 1px solid #fef3c7; border-radius: 8px; font-size: 13px; color: #92400e; margin-bottom: 24px;">
            <strong>Special Note:</strong> ${order.notes}
          </div>
          ` : ''}

          <!-- Store Contact Box -->
          <div style="text-align: center; border-top: 1px solid #e4e4e7; pt: 20px; margin-top: 20px; font-size: 13px; color: #71717a;">
            <p style="margin: 4px 0;">Need help with your order? Call Pizza Pro Hotline:</p>
            <p style="margin: 4px 0; font-size: 16px; font-weight: 900; color: #dc2626;">
              📞 0325-1229333 / 0311-4449783
            </p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #a1a1aa;">
              Main Petroleum Hujra Road, Shergarh, Punjab • Open 12:00 PM to 2:00 AM
            </p>
          </div>
        </div>

        <div style="background-color: #18181b; padding: 16px; text-align: center; font-size: 11px; color: #a1a1aa;">
          © ${new Date().getFullYear()} Pizza Pro Shergarh. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate HTML email template for Shop Owner Alert
const buildShopOwnerEmailHtml = (order: OrderPayload): string => {
  const items = order.items || [];
  const itemsText = items.map((it) => {
    const name = it.menuItem?.name || it.name || 'Pizza Item';
    const size = it.selectedSize ? ` (${it.selectedSize})` : '';
    const qty = it.quantity || 1;
    const price = it.totalPrice || (it.unitPrice ? it.unitPrice * qty : 0);
    return `<li style="margin-bottom: 6px; font-size: 14px;"><strong>${qty}x</strong> ${name} ${size} - <span style="font-family: monospace;">Rs ${price}</span></li>`;
  }).join('');

  const dateTime = order.createdAtISO
    ? new Date(order.createdAtISO).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
    : order.createdAt || new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>NEW ORDER ALERT #${order.orderId}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
      <div style="max-width: 600px; margin: 20px auto; background: #18181b; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
        
        <!-- Header -->
        <div style="background: #dc2626; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase;">🚨 NEW ONLINE ORDER RECEIVED</h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #fecaca; font-weight: bold;">Pizza Pro Shergarh Kitchen Dispatch</p>
        </div>

        <div style="padding: 24px;">
          <!-- Order ID & Total -->
          <div style="background: #27272a; padding: 16px; border-radius: 12px; margin-bottom: 20px; text-align: center; border: 1px solid #3f3f46;">
            <div style="font-size: 12px; color: #a1a1aa; text-transform: uppercase; font-weight: 700;">ORDER NUMBER</div>
            <div style="font-size: 28px; font-weight: 900; color: #ef4444; font-family: monospace; margin: 4px 0;">#${order.orderId}</div>
            <div style="font-size: 22px; font-weight: 900; color: #22c55e; font-family: monospace;">TOTAL: Rs ${(order.totalAmount || 0).toLocaleString()}</div>
          </div>

          <!-- Customer Info -->
          <h3 style="font-size: 14px; font-weight: 800; color: #f59e0b; text-transform: uppercase; margin-bottom: 10px;">
            Customer & Delivery Info
          </h3>
          <div style="background: #09090b; padding: 16px; border-radius: 12px; font-size: 13px; line-height: 1.8; margin-bottom: 20px; border: 1px solid #27272a;">
            <div>👤 <strong>Customer Name:</strong> ${order.customerName}</div>
            <div>📞 <strong>Phone Number:</strong> <a href="tel:${order.customerPhone}" style="color: #60a5fa; font-weight: bold; font-family: monospace; font-size: 15px;">${order.customerPhone}</a></div>
            ${order.customerEmail ? `<div>✉️ <strong>Email:</strong> ${order.customerEmail}</div>` : ''}
            <div>📍 <strong>Address:</strong> ${order.deliveryAddress}</div>
            <div>💳 <strong>Payment Method:</strong> <span style="color: #facc15; font-weight: bold;">${order.paymentMethod.toUpperCase()} ${order.paymentTxnId ? `(Trx: ${order.paymentTxnId})` : ''}</span></div>
            <div>🕒 <strong>Order Time:</strong> ${dateTime}</div>
          </div>

          <!-- Ordered Items -->
          <h3 style="font-size: 14px; font-weight: 800; color: #f59e0b; text-transform: uppercase; margin-bottom: 10px;">
            Kitchen Preparation List
          </h3>
          <div style="background: #09090b; padding: 16px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #27272a;">
            <ul style="margin: 0; padding-left: 20px; color: #e4e4e7;">
              ${itemsText}
            </ul>
          </div>

          ${order.notes ? `
          <div style="padding: 12px; background: #451a03; border: 1px solid #78350f; border-radius: 8px; font-size: 13px; color: #fde68a; margin-bottom: 20px;">
            ⚠️ <strong>Special Instructions:</strong> ${order.notes}
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 24px;">
            <p style="font-size: 12px; color: #a1a1aa;">Open the Pizza Pro Admin Dashboard to update order status to Preparing or Out for Delivery.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Main function to dispatch emails to both Customer and Shop Owner
export const sendOrderNotificationEmails = async (order: OrderPayload) => {
  const fromName = process.env.SMTP_FROM_NAME || 'Pizza Pro Shergarh';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'fakharyasin9@gmail.com';
  const ownerEmail = process.env.SHOP_OWNER_EMAIL || process.env.SMTP_USER || 'fakharyasin9@gmail.com';

  const customerEmail = order.customerEmail ? order.customerEmail.trim() : '';

  const transporter = getTransporter();

  // If no SMTP transporter, log simulated email to server console
  if (!transporter) {
    console.log('\n=============================================================');
    console.log(`[Email Notification Notice] SMTP configuration not detected in environment variables.`);
    console.log(`[Email Simulation] Processing Order #${order.orderId}:`);
    if (customerEmail) {
      console.log(`  -> Customer Confirmation Email queued for: ${customerEmail}`);
    } else {
      console.log(`  -> No customer email provided for Order #${order.orderId}`);
    }
    console.log(`  -> Shop Owner Alert Email queued for: ${ownerEmail}`);
    console.log(`  -> Order Amount: Rs ${order.totalAmount}`);
    console.log(`  -> Customer: ${order.customerName} (${order.customerPhone})`);
    console.log('=============================================================\n');

    return {
      success: true,
      delivered: false,
      reason: 'SMTP configuration missing in environment variables. Order details logged to server console.',
      customerEmail: { sent: false, recipient: customerEmail, status: 'Simulated (No SMTP Configured)' },
      ownerEmail: { sent: false, recipient: ownerEmail, status: 'Simulated (No SMTP Configured)' },
    };
  }

  const results = {
    customerEmail: { sent: false, recipient: customerEmail, error: null as any },
    ownerEmail: { sent: false, recipient: ownerEmail, error: null as any },
  };

  // 1. Send Customer Confirmation Email (if customer provided email)
  if (customerEmail) {
    try {
      const customerHtml = buildCustomerEmailHtml(order);
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: customerEmail,
        subject: `🍕 Order Confirmed! Pizza Pro Shergarh #${order.orderId}`,
        html: customerHtml,
      });
      console.log(`[Email Success] Sent order confirmation email to customer: ${customerEmail} (Order #${order.orderId})`);
      results.customerEmail.sent = true;
    } catch (err: any) {
      console.error(`[Email Error] Failed to send customer confirmation email to ${customerEmail}:`, err?.message || err);
      results.customerEmail.error = err?.message || 'SMTP delivery failure';
    }
  }

  // 2. Send Shop Owner Alert Email
  try {
    const ownerHtml = buildShopOwnerEmailHtml(order);
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: ownerEmail,
      subject: `🚨 NEW ORDER RECEIVED: #${order.orderId} - Rs ${order.totalAmount} (${order.customerName})`,
      html: ownerHtml,
    });
    console.log(`[Email Success] Sent new order alert email to shop owner: ${ownerEmail} (Order #${order.orderId})`);
    results.ownerEmail.sent = true;
  } catch (err: any) {
    console.error(`[Email Error] Failed to send shop owner alert email to ${ownerEmail}:`, err?.message || err);
    results.ownerEmail.error = err?.message || 'SMTP delivery failure';
  }

  return {
    success: results.customerEmail.sent || results.ownerEmail.sent,
    delivered: true,
    results,
  };
};
