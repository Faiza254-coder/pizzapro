import { Order } from '../types';

/**
 * Triggers backend email notifications for customer order confirmation and shop owner alert,
 * with optional direct EmailJS REST API fallback if EmailJS keys are configured in environment variables.
 * Asynchronous and non-blocking: execution errors are logged to console without interrupting UI checkout.
 */
export async function sendOrderEmailNotifications(order: Order): Promise<{
  success: boolean;
  delivered?: boolean;
  reason?: string;
  results?: any;
}> {
  let backendResult: any = { success: false };

  // 1. Trigger Backend Express API (Nodemailer SMTP)
  try {
    console.log('[Email Notification] Triggering backend order email dispatch for Order ID:', order.orderId);

    const response = await fetch('/api/send-order-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      backendResult = await response.json();
      console.log('[Email Notification Backend Result]:', backendResult);
    } else {
      console.warn(`[Email Notification Warning] Backend API returned HTTP ${response.status}`);
    }
  } catch (err: any) {
    console.error('[Email Notification Exception] Non-blocking backend network error:', err);
  }

  // 2. Optional EmailJS REST API Direct Dispatch (if VITE_EMAILJS keys are configured)
  const env = (import.meta as any).env || {};
  const emailJsServiceId = env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = env.VITE_EMAILJS_PUBLIC_KEY;

  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    try {
      console.log('[EmailJS] Sending direct client-side EmailJS notification for Order ID:', order.orderId);
      const itemsList = (order.items || [])
        .map((it: any) => `${it.quantity}x ${it.menuItem?.name || it.name}${it.selectedSize ? ` (${it.selectedSize})` : ''} - Rs ${it.totalPrice || 0}`)
        .join(', ');

      const emailJsPayload = {
        service_id: emailJsServiceId,
        template_id: emailJsTemplateId,
        user_id: emailJsPublicKey,
        template_params: {
          order_id: order.orderId,
          to_email: order.customerEmail || '',
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          delivery_address: order.deliveryAddress,
          total_amount: `Rs ${order.totalAmount}`,
          payment_method: order.paymentMethod,
          ordered_items: itemsList,
          estimated_time: '25-35 minutes',
          store_phone: '03251229333',
        },
      };

      const emailJsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailJsPayload),
      });

      if (emailJsRes.ok) {
        console.log('[EmailJS Success] Direct EmailJS notification delivered successfully!');
        return { success: true, delivered: true, reason: 'EmailJS Direct + Backend SMTP' };
      }
    } catch (e) {
      console.warn('[EmailJS Exception] EmailJS direct call failed:', e);
    }
  }

  return backendResult;
}

/**
 * Utility function to query backend SMTP email configuration status.
 */
export async function checkEmailApiStatus(): Promise<{
  configured: boolean;
  smtpHost: string;
  smtpUser: string;
  ownerEmail: string;
}> {
  try {
    const res = await fetch('/api/email-status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to query email status:', err);
  }
  return { configured: false, smtpHost: 'Unknown', smtpUser: 'Unknown', ownerEmail: 'Unknown' };
}

