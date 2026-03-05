/**
 * Backend API Template for WhatsApp OTP and Order Notifications
 * Copy this to your backend (Node.js + Express example)
 * 
 * Required npm packages:
 * npm install express axios dotenv twilio
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Middleware
app.use(express.json());

// ========== CONFIGURATION ==========
const CONFIG = {
  whatsappApiProvider: process.env.WHATSAPP_PROVIDER || 'twilio', // 'twilio', 'gupshup', 'interakt'
  
  // Twilio Config
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER // e.g., +1234567890
  },
  
  // Gupshup Config
  gupshup: {
    apiKey: process.env.GUPSHUP_API_KEY,
    apiUrl: 'https://api.gupshup.io/sm/api/v1/msg/send/whatapp'
  },
  
  // Business Phone
  businessPhone: process.env.BUSINESS_PHONE || '8700060182',
  
  // API Verification
  verificationToken: process.env.API_VERIFICATION_TOKEN
};

// ========== MIDDLEWARE: VERIFY API REQUESTS ==========
function verifyRequest(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token || token !== CONFIG.verificationToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

// ========== SEND OTP VIA WHATSAPP ==========

/**
 * Send 6-digit OTP via WhatsApp
 * POST /api/send-otp
 * Body: { phone: "9876543210", otp: "123456" }
 */
app.post('/api/send-otp', verifyRequest, async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP required' });
    }

    // Validate phone format
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const message = `Your Aarzah OTP is: ${otp}\n\nValid for 10 minutes. Do not share this OTP.\n\nAarzah - Everyday Ethnic Wear\nhttps://aarzah.com`;

    let result;

    if (CONFIG.whatsappApiProvider === 'twilio') {
      result = await sendViaTwilio(phone, message);
    } else if (CONFIG.whatsappApiProvider === 'gupshup') {
      result = await sendViaGupshup(phone, message);
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    // Log the event
    console.log(`[OTP] Sent to +91${phone}, Message ID: ${result.messageId}`);

    res.json({
      success: true,
      phone: `+91${phone}`,
      messageId: result.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[OTP Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== SEND ORDER CONFIRMATION ==========

/**
 * Send Order Confirmation via WhatsApp
 * POST /api/send-order-confirmation
 * Body: { phone: "9876543210", orderData: { orderId, amount, items, etc } }
 */
app.post('/api/send-order-confirmation', verifyRequest, async (req, res) => {
  try {
    const { phone, orderData } = req.body;

    if (!phone || !orderData) {
      return res.status(400).json({ error: 'Phone and order data required' });
    }

    const itemsList = orderData.items
      .map(item => `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`)
      .join('\n');

    const message = `🎉 *Order Confirmed!*

Order ID: ${orderData.orderId}
Amount: ₹${orderData.total}
Items: ${orderData.items.length}

${itemsList}

Your order will be delivered in 3-5 business days.

Track: https://aarzah.com/order-tracking.html?id=${orderData.orderId}

Aarzah - Everyday Ethnic Wear`;

    let result;

    if (CONFIG.whatsappApiProvider === 'twilio') {
      result = await sendViaTwilio(phone, message);
    } else if (CONFIG.whatsappApiProvider === 'gupshup') {
      result = await sendViaGupshup(phone, message);
    }

    console.log(`[ORDER] Order ${orderData.orderId} confirmation sent to +91${phone}`);

    res.json({
      success: true,
      phone: `+91${phone}`,
      orderId: orderData.orderId,
      messageId: result.messageId
    });

  } catch (error) {
    console.error('[ORDER Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== SEND PAYMENT CONFIRMATION ==========

/**
 * Send Payment Confirmation via WhatsApp
 * POST /api/send-payment-confirmation
 * Body: { phone: "9876543210", orderData: { orderId, amount, transactionId, etc } }
 */
app.post('/api/send-payment-confirmation', verifyRequest, async (req, res) => {
  try {
    const { phone, orderData } = req.body;

    const message = `✅ *Payment Received!*

Order ID: ${orderData.orderId}
Amount: ₹${orderData.total}
Transaction ID: ${orderData.transactionId}

Your order is being processed and will ship shortly.

Track: https://aarzah.com/order-tracking.html?id=${orderData.orderId}

Aarzah - Everyday Ethnic Wear`;

    let result;

    if (CONFIG.whatsappApiProvider === 'twilio') {
      result = await sendViaTwilio(phone, message);
    } else if (CONFIG.whatsappApiProvider === 'gupshup') {
      result = await sendViaGupshup(phone, message);
    }

    console.log(`[PAYMENT] Confirmation sent to +91${phone}`);

    res.json({ success: true, messageId: result.messageId });

  } catch (error) {
    console.error('[PAYMENT Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== WHATSAPP PROVIDER FUNCTIONS ==========

/**
 * Send message via Twilio
 */
async function sendViaTwilio(phone, message) {
  const twilio = require('twilio');
  const client = twilio(CONFIG.twilio.accountSid, CONFIG.twilio.authToken);

  const result = await client.messages.create({
    from: `whatsapp:${CONFIG.twilio.fromNumber}`,
    to: `whatsapp:+91${phone}`,
    body: message
  });

  return {
    messageId: result.sid,
    status: result.status,
    provider: 'twilio'
  };
}

/**
 * Send message via Gupshup
 */
async function sendViaGupshup(phone, message) {
  const response = await axios.post(CONFIG.gupshup.apiUrl, {
    apikey: CONFIG.gupshup.apiKey,
    to: `91${phone}`,
    message: message,
    messageType: 'TEXT',
    format: 'json'
  });

  return {
    messageId: response.data.messageId,
    status: response.data.status,
    provider: 'gupshup'
  };
}

// ========== WEBHOOK FOR MESSAGE STATUS UPDATES ==========

/**
 * Receive message delivery status from WhatsApp
 * POST /webhook/whatsapp
 */
app.post('/webhook/whatsapp', (req, res) => {
  try {
    const { entry } = req.body;

    if (!entry) {
      return res.sendStatus(400);
    }

    entry.forEach(item => {
      item.changes.forEach(change => {
        if (change.field === 'messages') {
          const message = change.value.messages?.[0];
          
          if (message) {
            console.log(`[WEBHOOK] Message event:`, {
              messageId: message.id,
              status: message.type,
              type: message.type,
              timestamp: message.timestamp
            });
          }
        }

        // Handle delivery status
        if (change.field === 'message_status') {
          const status = change.value.statuses?.[0];
          
          if (status) {
            console.log(`[WEBHOOK] Delivery status:`, {
              messageId: status.id,
              status: status.status,
              timestamp: status.timestamp
            });

            // Update your database with delivery status
            updateMessageStatus(status.id, status.status);
          }
        }
      });
    });

    res.sendStatus(200);

  } catch (error) {
    console.error('[WEBHOOK Error]', error);
    res.sendStatus(500);
  }
});

// ========== HELPER FUNCTIONS ==========

/**
 * Update message status in database
 */
function updateMessageStatus(messageId, status) {
  // Connect to your database and update the message status
  console.log(`Updating message ${messageId} status to ${status}`);
  
  // Example with MongoDB:
  // db.messages.updateOne(
  //   { messageId: messageId },
  //   { $set: { status: status, updatedAt: new Date() } }
  // );
}

// ========== RATE LIMITING ==========

const rateLimiter = {};

function checkRateLimit(phone, maxAttempts = 5, windowMinutes = 60) {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  if (!rateLimiter[phone]) {
    rateLimiter[phone] = [];
  }

  // Clean old entries
  rateLimiter[phone] = rateLimiter[phone].filter(time => now - time < windowMs);

  if (rateLimiter[phone].length >= maxAttempts) {
    return false;
  }

  rateLimiter[phone].push(now);
  return true;
}

// Apply rate limiting to OTP endpoint
app.post('/api/send-otp', (req, res, next) => {
  const { phone } = req.body;

  if (!checkRateLimit(phone, 5, 60)) {
    return res.status(429).json({
      error: 'Too many requests. Try again later.',
      retryAfter: 3600
    });
  }

  next();
});

// ========== HEALTH CHECK ==========

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aarzah WhatsApp API',
    timestamp: new Date().toISOString(),
    provider: CONFIG.whatsappApiProvider
  });
});

// ========== ERROR HANDLING ==========

app.use((error, req, res, next) => {
  console.error('[Server Error]', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
  });
});

// ========== START SERVER ==========

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Aarzah WhatsApp API running on http://localhost:${PORT}`);
  console.log(`Provider: ${CONFIG.whatsappApiProvider}`);
  console.log(`Business Phone: +91${CONFIG.businessPhone}`);
});

module.exports = app;
