/**
 * AARZAH BACKEND API (OPTIMIZED)
 * WhatsApp OTP and Order Notifications
 * npm install express axios dotenv twilio
 */

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

// Rate Limiting
const RATE_LIMIT = {};
const MAX_REQUESTS_PER_PHONE = 5;
const REQUEST_TIMEOUT = 3600000;

app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const CONFIG = {
  whatsappApiProvider: process.env.WHATSAPP_PROVIDER || "gupshup",
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER
  },
  gupshup: {
    apiKey: process.env.GUPSHUP_API_KEY,
    apiUrl: "https://api.gupshup.io/sm/api/v1/msg/send/whatsapp"
  },
  businessPhone: process.env.BUSINESS_PHONE || "8700060182",
  verificationToken: process.env.API_VERIFICATION_TOKEN,
  port: process.env.PORT || 3000
};

function verifyRequest(req, res, next) {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token || token !== CONFIG.verificationToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function checkRateLimit(phone) {
  const key = `otp_${phone}`;
  const now = Date.now();
  if (!RATE_LIMIT[key]) RATE_LIMIT[key] = [];
  RATE_LIMIT[key] = RATE_LIMIT[key].filter(ts => now - ts < REQUEST_TIMEOUT);
  if (RATE_LIMIT[key].length >= MAX_REQUESTS_PER_PHONE) return false;
  RATE_LIMIT[key].push(now);
  return true;
}

const validators = {
  phone: (ph) => /^\d{10}$/.test(ph),
  otp: (o) => /^\d{6}$/.test(o),
  orderId: (id) => /^[A-Z0-9_-]{5,20}$/.test(id)
};

app.post("/api/send-otp", verifyRequest, async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!validators.phone(phone) || !validators.otp(otp)) {
      return res.status(400).json({ error: "Invalid format" });
    }
    if (!checkRateLimit(phone)) {
      return res.status(429).json({ error: "Too many requests" });
    }
    const msg = `Your Aarzah OTP: ${otp}\n\nValid 10 min. Do not share.\n\nAarzah`;
    const result = await sendMessage(phone, msg);
    console.log(`[OTP] Sent to +91${phone}`);
    res.json({ success: true, phone: `+91${phone}`, messageId: result.messageId });
  } catch (err) {
    console.error("[OTP Error]", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/api/send-order-confirmation", verifyRequest, async (req, res) => {
  try {
    const { phone, orderData } = req.body;
    if (!validators.phone(phone) || !orderData?.orderId) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const items = (orderData.items || []).map(i => ` ${i.name} (x${i.quantity}) - ?${i.price * i.quantity}`).join("\n");
    const msg = ` Order Confirmed!\n\nID: ${orderData.orderId}\nAmount: ?${orderData.total}\n\n${items}\n\nDelivery: 3-5 days\nAarzah`;
    const result = await sendMessage(phone, msg);
    console.log(`[ORDER] ${orderData.orderId} sent to +91${phone}`);
    res.json({ success: true, orderId: orderData.orderId, messageId: result.messageId });
  } catch (err) {
    console.error("[ORDER Error]", err.message);
    res.status(500).json({ error: "Failed to send order confirmation" });
  }
});

app.post("/api/send-payment-confirmation", verifyRequest, async (req, res) => {
  try {
    const { phone, orderData } = req.body;
    if (!validators.phone(phone) || !orderData?.orderId) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const msg = ` Payment Received!\n\nOrder: ${orderData.orderId}\nAmount: ?${orderData.total}\n\nProcessing...\nAarzah`;
    const result = await sendMessage(phone, msg);
    console.log(`[PAYMENT] Confirmation sent to +91${phone}`);
    res.json({ success: true, messageId: result.messageId });
  } catch (err) {
    console.error("[PAYMENT Error]", err.message);
    res.status(500).json({ error: "Failed to send payment confirmation" });
  }
});

app.post("/webhook/whatsapp", (req, res) => {
  try {
    const { entry } = req.body;
    if (!entry) return res.sendStatus(400);
    entry.forEach(item => {
      item.changes?.forEach(change => {
        if (change.field === "message_status") {
          const status = change.value.statuses?.[0];
          if (status) console.log(`[WEBHOOK] ${status.id} -> ${status.status}`);
        }
      });
    });
    res.sendStatus(200);
  } catch (err) {
    console.error("[WEBHOOK Error]", err.message);
    res.sendStatus(500);
  }
});

async function sendMessage(phone, message) {
  if (CONFIG.whatsappApiProvider === "twilio") return await sendViaTwilio(phone, message);
  if (CONFIG.whatsappApiProvider === "gupshup") return await sendViaGupshup(phone, message);
  throw new Error("Invalid provider");
}

async function sendViaTwilio(phone, message) {
  const twilio = require("twilio");
  const client = twilio(CONFIG.twilio.accountSid, CONFIG.twilio.authToken);
  const result = await client.messages.create({
    from: `whatsapp:${CONFIG.twilio.fromNumber}`,
    to: `whatsapp:+91${phone}`,
    body: message
  });
  return { messageId: result.sid, status: result.status };
}

async function sendViaGupshup(phone, message) {
  const response = await axios.post(CONFIG.gupshup.apiUrl, {
    apikey: CONFIG.gupshup.apiKey,
    to: `91${phone}`,
    message: message,
    messageType: "TEXT",
    format: "json"
  }, { timeout: 5000 });
  return { messageId: response.data.messageId, status: response.data.status };
}

if (require.main === module) {
  app.listen(CONFIG.port, () => {
    console.log(` Aarzah API running on port ${CONFIG.port}`);
    console.log(` Provider: ${CONFIG.whatsappApiProvider}`);
  });
}

module.exports = app;
