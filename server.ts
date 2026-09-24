app.use((req, res) => {
  res.status(503).send("<h1>Service Temporarily Unavailable</h1><p>Account suspended pending payment.</p>");
});
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { sendOrderNotificationEmails } from './server/emailService';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for Pizza Pro AI Customer Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "Welcome to Pizza Pro! 🍕 We're open 12 PM - 2 AM in Shergarh. Try our Zinger Burger for Rs 350, Regular Pizzas starting at Rs 450, or Crazy Deal for Rs 850! You can place an order directly or via WhatsApp at 0325-1229333.",
      });
    }

    const systemInstruction = `You are "Pizza Pro AI Assistant", the friendly, witty food concierge for "Pizza Pro" fast food in Shergarh, Punjab.
Restaurant Details:
- Address: Main Petroleum Hujra Road, Shergarh, Punjab
- Delivery Phone Numbers: 03251229333, 03114449783
- Payment Options: Cash on Delivery, JazzCash & EasyPaisa (Account: 03222229333)
- Timings: 12:00 PM to 2:00 AM (Open All Week)
- Everyday Offer (12 PM to 6 PM): 20% OFF on all Pizzas!

Menu Highlights:
- Regular Flavour Pizza (Chicken Fajita, Italian, Supreme, Tikka, Bon Fire, Special, Euro, Peri Peri, Napoleon): Small Rs 450, Medium Rs 900, Large Rs 1350
- Special Flavour Pizza (Malai Boti: 550/1100/1650; Behari, Kabab Stuffer, Chicken Cheese Stuffer, Crown Crust, Penny, Lazania): Small Rs 600, Medium Rs 1200, Large Rs 1800
- Extra Large Pizza: Regular Rs 2000, Special Rs 2500
- Fillet Burger: Rs 350 (First time in Shergarh, crispy & juicy)
- Zinger Burger: Rs 350, Tower Burger: Rs 549, Chicken Burger: Rs 250
- Shawarmas & Rolls: Zinger Shawarma Rs 330, Chicken Shawarma Rs 200, Spin/Chili Mili/Behari Roll Rs 700, Paratha Roll Rs 250
- Cheesy Mayo Fries / BBQ Fries: Small Rs 350, Large Rs 650
- Cheese Stick: Rs 700
- Tortilla Wrap with free dip sauce: Rs 480
- DEALS:
  * Deal 1: 1 Zinger Burger + Fries + 350ml Drink = Rs 500
  * Top Famous Deal #1: Zinger Burger + French Fries 100g + 300ml Drink = Rs 499
  * Deal 2: 1 Small Pizza + 5 Hot Wings & Fries + Drink = Rs 1000
  * Deal 3: 2 Large Pizza (Regular Flavour) = Rs 2500
  * Deal 4 / Super Duper Deal: 1 Large Pizza + 10 Hot Wings + 1.5L Next Cola = Rs 2000
  * Crazy Deal: 1 Small Regular Pizza + Mighty Zinger Burger + French Fries + 300ml Cola Next = Rs 850
  * Family Deal: 2 Large Pizza (Special Flavour) + Large Fries + 2 Drinks = Rs 5000

Be enthusiastic, helpful, recommend deals based on group size, assist with tracking orders, and keep replies mouth-watering and concise!`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || "I'm ready to help you order the tastiest pizzas and burgers at Pizza Pro Shergarh!" });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.json({
      reply: "Welcome to Pizza Pro! 🍕 We're serving hot & fresh pizzas, burgers & deals right now. You can also call us at 03251229333 for instant delivery!",
    });
  }
});

// WhatsApp Cloud API Order Notification Helper & Endpoint
const formatWhatsAppOrderMessage = (order: any) => {
  const items = order.items || order.orderedItems || [];
  const itemsText = items.map((item: any) => {
    const name = item.menuItem?.name || item.name || 'Pizza Item';
    const size = item.selectedSize ? ` (${item.selectedSize})` : '';
    const qty = item.quantity || 1;
    const price = item.totalPrice || (item.unitPrice ? item.unitPrice * qty : 0);
    return `• ${qty}x ${name}${size} - Rs ${price}`;
  }).join('\n');

  const dateTime = order.createdAtISO 
    ? new Date(order.createdAtISO).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
    : order.createdAt || new Date().toLocaleString();

  let formattedPayment = 'Cash on Delivery (COD)';
  if (order.paymentMethod === 'jazzcash') {
    formattedPayment = `JazzCash Mobile Transfer ${order.paymentTxnId ? `(Trx: ${order.paymentTxnId})` : ''}`;
  } else if (order.paymentMethod === 'easypaisa') {
    formattedPayment = `EasyPaisa Mobile Transfer ${order.paymentTxnId ? `(Trx: ${order.paymentTxnId})` : ''}`;
  } else if (order.paymentMethod !== 'cod' && order.paymentMethod) {
    formattedPayment = `Online Payment / Wallet (${order.paymentStatus || 'Verified'})`;
  }

  return `🍕 *NEW ORDER RECEIVED - PIZZA PRO SHERGARH*

🆔 *Order ID:* ${order.orderId || 'N/A'}
👤 *Customer Name:* ${order.customerName || 'Valued Customer'}
📞 *Phone Number:* ${order.customerPhone || order.phoneNumber || 'N/A'}
📍 *Delivery Address:* ${order.deliveryAddress || 'Takeaway Counter Pickup'}
🚚 *Order Type:* ${(order.orderType || 'delivery').toUpperCase()}
💳 *Payment Method:* ${formattedPayment}
🕒 *Order Date & Time:* ${dateTime}

📦 *ORDERED ITEMS:*
${itemsText || '• Standard Pizza Order'}

💰 *TOTAL AMOUNT:* Rs ${order.totalAmount || 0}

---
_Automated message from Pizza Pro Cloud System_`;
};

// API Endpoint: Send Order Notification to Shop Owner via WhatsApp Cloud API
app.post('/api/send-whatsapp-order', async (req, res) => {
  const order = req.body || {};
  console.log(`[WhatsApp API] Processing automatic notification request for Order ID: ${order.orderId || 'Unknown'}`);

  const token = process.env.WHATSAPP_CLOUD_API_TOKEN || process.env.WHATSAPP_TOKEN || '';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const rawRecipient = process.env.WHATSAPP_RECIPIENT_NUMBER || '923251229333';
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || '';

  let recipient = rawRecipient.replace(/\D/g, '');
  if (recipient.startsWith('0')) {
    recipient = '92' + recipient.substring(1);
  }

  const messageText = formatWhatsAppOrderMessage(order);

  if (!token || !phoneNumberId) {
    console.warn('[WhatsApp API Warning] Missing WHATSAPP_CLOUD_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID in environment variables.');
    console.log('[WhatsApp API Simulated Log Output]:');
    console.log(`To Recipient: +${recipient}`);
    console.log(`Message Content:\n${messageText}`);

    return res.json({
      success: true,
      delivered: false,
      reason: 'WhatsApp API credentials not configured in environment variables. Order details logged to server console.',
      simulatedRecipient: `+${recipient}`,
      orderId: order.orderId,
    });
  }

  try {
    const metaApiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    let payload: any;
    if (templateName) {
      payload = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: order.orderId || 'N/A' },
                { type: 'text', text: order.customerName || 'Customer' },
                { type: 'text', text: order.customerPhone || 'N/A' },
                { type: 'text', text: `Rs ${order.totalAmount || 0}` },
              ],
            },
          ],
        },
      };
    } else {
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      };
    }

    console.log(`[WhatsApp API Request] Dispatching HTTP POST to Meta Graph API (${metaApiUrl}) for recipient +${recipient}...`);

    const response = await fetch(metaApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log(`[WhatsApp API Success] Message sent successfully for Order ${order.orderId}! Meta Response:`, responseData);
      return res.json({
        success: true,
        delivered: true,
        metaResponse: responseData,
        orderId: order.orderId,
      });
    } else {
      console.error(`[WhatsApp API HTTP Error ${response.status}] Meta API returned error for Order ${order.orderId}:`, responseData);
      return res.json({
        success: false,
        delivered: false,
        error: responseData,
        orderId: order.orderId,
      });
    }
  } catch (error: any) {
    console.error(`[WhatsApp API Exception] Network/Server exception while sending WhatsApp message for Order ${order.orderId}:`, error);
    return res.json({
      success: false,
      delivered: false,
      error: error?.message || 'Network error sending WhatsApp notification',
      orderId: order.orderId,
    });
  }
});

// WhatsApp API Configuration Status Route
app.get('/api/whatsapp-status', (req, res) => {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN || process.env.WHATSAPP_TOKEN || '';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const recipient = process.env.WHATSAPP_RECIPIENT_NUMBER || '923251229333';
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || '';

  res.json({
    configured: Boolean(token && phoneNumberId),
    hasToken: Boolean(token),
    hasPhoneNumberId: Boolean(phoneNumberId),
    recipientNumber: recipient ? `+${recipient.replace(/\D/g, '')}` : 'Not set',
    templateName: templateName || 'None (Using rich text format)',
  });
});

// API Endpoint: Send Order Emails to Customer and Shop Owner
app.post('/api/send-order-emails', async (req, res) => {
  try {
    const order = req.body || {};
    console.log(`[Email API] Processing email notification dispatch for Order ID: ${order.orderId || 'Unknown'}`);
    
    const emailResult = await sendOrderNotificationEmails(order);
    return res.json(emailResult);
  } catch (error: any) {
    console.error('[Email API Error] Exception during email notification execution:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to dispatch order notification emails',
    });
  }
});

// Email API Configuration Status Route
app.get('/api/email-status', (req, res) => {
  const host = process.env.SMTP_HOST || '';
  const user = process.env.SMTP_USER || '';
  const ownerEmail = process.env.SHOP_OWNER_EMAIL || process.env.SMTP_USER || 'fakharyasin9@gmail.com';

  res.json({
    configured: Boolean(host && user && process.env.SMTP_PASS),
    smtpHost: host || 'Not configured',
    smtpUser: user ? `${user.substring(0, 3)}***@***` : 'Not configured',
    ownerEmail: ownerEmail,
  });
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://pizzapro.pk/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://pizzapro.pk/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&amp;fit=crop&amp;w=1200&amp;q=80</image:loc>
      <image:title>Pizza Pro Shergarh Hot &amp; Fresh Pizza Delivery</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://pizzapro.pk/#deals</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pizzapro.pk/#menu</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pizzapro.pk/#pizzas</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://pizzapro.pk/#burgers-shawarma</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://pizzapro.pk/#sides-drinks</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Pizza Pro Shergarh' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pizza Pro Server running on port ${PORT}`);
  });
}

startServer();
