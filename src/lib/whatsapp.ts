import { Order } from '../types';

/**
 * Formats any raw phone number string into strict international format without +, spaces, or leading 0s.
 * E.g., '03251229333' -> '923251229333', '+92 300 1234567' -> '923001234567'
 */
export function formatPhoneNumberForWhatsApp(rawNumber?: string): string {
  if (!rawNumber) return '923251229333';
  let clean = String(rawNumber).replace(/\D/g, '');

  if (clean.startsWith('0')) {
    clean = '92' + clean.substring(1);
  } else if (clean.length === 10 && clean.startsWith('3')) {
    clean = '92' + clean;
  }

  if (!clean || clean.length < 10) {
    clean = '923251229333';
  }

  return clean;
}

/**
 * Generates clean, professional markdown formatted text for a WhatsApp order.
 */
export function buildWhatsAppOrderText(order: Order): string {
  const items = order.items || [];
  const itemsList = items.map((item) => {
    const name = item.menuItem?.name || 'Pizza Item';
    const size = item.selectedSize ? ` (${item.selectedSize})` : '';
    const qty = item.quantity || 1;
    const price = item.totalPrice || (item.unitPrice ? item.unitPrice * qty : 0);
    return `• ${qty}x ${name}${size} - Rs ${price.toLocaleString()}`;
  }).join('\n');

  let paymentText = 'Cash on Delivery (COD)';
  if (order.paymentMethod === 'jazzcash') {
    paymentText = `JazzCash Mobile Transfer${order.paymentTxnId ? ` (Trx ID: ${order.paymentTxnId})` : ''}`;
  } else if (order.paymentMethod === 'easypaisa') {
    paymentText = `EasyPaisa Mobile Transfer${order.paymentTxnId ? ` (Trx ID: ${order.paymentTxnId})` : ''}`;
  } else if (order.paymentMethod === 'jazzcash_easypaisa' || order.paymentMethod === 'JazzCash' || order.paymentMethod === 'EasyPaisa') {
    paymentText = `Online Wallet (${order.paymentStatus || 'Verified'})`;
  }

  const orderTypeStr = (order.orderType || 'delivery').toUpperCase();

  return `🍕 *NEW ORDER - PIZZA PRO SHERGARH*

🆔 *Order ID:* ${order.orderId}
👤 *Customer Name:* ${order.customerName}
📞 *Phone Number:* ${order.customerPhone}
📍 *Delivery Address:* ${order.deliveryAddress || 'Takeaway Pickup'}
🚚 *Order Type:* ${orderTypeStr}
💳 *Payment Method:* ${paymentText}
🕒 *Order Time:* ${order.createdAt || new Date().toLocaleTimeString()}

📦 *ORDERED ITEMS:*
${itemsList || '• Standard Pizza Item'}

💰 *Subtotal:* Rs ${(order.subtotal || 0).toLocaleString()}
${order.deliveryFee ? `🚚 *Delivery Fee:* Rs ${order.deliveryFee.toLocaleString()}\n` : ''}${order.discount ? `🏷️ *Discount:* -Rs ${order.discount.toLocaleString()}\n` : ''}💵 *TOTAL AMOUNT:* Rs ${(order.totalAmount || 0).toLocaleString()}${order.notes ? `\n\n📝 *Special Instructions:* ${order.notes}` : ''}

Thank you!`;
}

/**
 * Constructs official wa.me direct chat redirect link with prefilled order details.
 * Uses exact format: https://wa.me/<phone_number>?text=<encoded_message>
 */
export function getWhatsAppOrderUrl(order: Order, rawNumber?: string): string {
  const cleanNumber = formatPhoneNumberForWhatsApp(rawNumber);
  const text = buildWhatsAppOrderText(order);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Sends an automated WhatsApp order notification to the shop owner via the backend server route.
 * This runs completely asynchronously and will NEVER throw or interrupt the customer's checkout flow.
 */
export async function sendWhatsAppOrderNotification(order: Order): Promise<{ success: boolean; delivered?: boolean; reason?: string }> {
  try {
    console.log('[WhatsApp Notification] Triggering automated WhatsApp notification for Order:', order.orderId);
    
    const response = await fetch('/api/send-whatsapp-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      console.warn(`[WhatsApp Notification] Backend returned status ${response.status}`);
      return { success: false, reason: `Server status ${response.status}` };
    }

    const data = await response.json();
    console.log('[WhatsApp Notification Result]:', data);
    return data;
  } catch (err: any) {
    console.error('[WhatsApp Notification Exception] Non-blocking error while notifying owner:', err);
    return { success: false, reason: err?.message || 'Network error' };
  }
}

/**
 * Utility function to check if WhatsApp Business Cloud API credentials are configured on the backend.
 */
export async function checkWhatsAppApiStatus(): Promise<{ configured: boolean; hasToken: boolean; hasPhoneNumberId: boolean; recipientNumber: string }> {
  try {
    const res = await fetch('/api/whatsapp-status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error('Failed to query WhatsApp API status:', e);
  }
  return { configured: false, hasToken: false, hasPhoneNumberId: false, recipientNumber: 'Unknown' };
}

