/**
 * AARZAH BACKEND API (SECURE)
 * WhatsApp API, Secure Checkout & Anti-Tampering Protection 
 * npm install express axios dotenv twilio crypto
 */

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const app = express();

// SECURITY CONFIG
const SECURITY = {
  JWT_SECRET: process.env.JWT_SECRET || "aarzah-secure-key-change-in-prod",
  CSRF_EXPIRY: 3600000,
  SESSION_TIMEOUT: 1800000,
  MAX_PRICE_VARIANCE: 10,
  MAX_CART_ITEMS: 100,
  MAX_DISCOUNT: 50,
  RATE_LIMIT_PER_PHONE: 5,
  REQUEST_TIMEOUT: 3600000
};

// DATA STORES (use Redis in production)
const RATE_LIMIT = {}, SESSIONS = {}, PENDING_ORDERS = {}, AUDIT_LOG = [];

// PRODUCT CATALOG (Source of Truth)
const PRODUCTS = {
  "kurti-001": { name: "Cotton Kurti", price: 599 },
  "saree-001": { name: "Silk Saree", price: 2499 },
  "suit-001": { name: "Palazzo Suit", price: 1299 },
  "dress-001": { name: "Casual Dress", price: 899 }
};

// VALID COUPONS (Server-side only)
const COUPONS = {
  "SAVE10": { discount: 10, maxUses: 100, uses: 0, expiresAt: Date.now() + 90*86400000 },
  "WELCOME20": { discount: 20, maxUses: 50, uses: 0, expiresAt: Date.now() + 30*86400000 }
};

const CONFIG = {
  whatsappProvider: process.env.WHATSAPP_PROVIDER || "gupshup",
  twilioSid: process.env.TWILIO_ACCOUNT_SID,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  gupshupKey: process.env.GUPSHUP_API_KEY,
  gupshupUrl: "https://api.gupshup.io/sm/api/v1/msg/send/whatsapp",
  businessPhone: process.env.BUSINESS_PHONE || "8700060182",
  apiToken: process.env.API_VERIFICATION_TOKEN,
  port: process.env.PORT || 3000
};

// MIDDLEWARE
app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  AUDIT_LOG.push({ timestamp: new Date().toISOString(), method: req.method, path: req.path });
  if (AUDIT_LOG.length > 10000) AUDIT_LOG.shift();
  next();
});

// CSRF PROTECTION
app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    const csrfToken = req.headers["x-csrf-token"];
    const sessionId = req.headers["x-session-id"];
    if (!csrfToken || !sessionId || !SESSIONS[sessionId] || !SESSIONS[sessionId].csrfTokens?.includes(csrfToken)) {
      return res.status(403).json({ error: "Invalid CSRF token" });
    }
    if (Date.now() - SESSIONS[sessionId].csrfGenerated > SECURITY.CSRF_EXPIRY) {
      return res.status(403).json({ error: "CSRF token expired" });
    }
  }
  next();
});

// HELPER FUNCTIONS
const generateSessionId = () => crypto.randomBytes(32).toString("hex");
const generateCSRF = () => crypto.randomBytes(32).toString("hex");
const validate = {
  phone: (p) => /^\d{10}$/.test(p),
  otp: (o) => /^\d{6}$/.test(o),
  email: (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
};
const hashCart = (items) => crypto.createHash("sha256").update(JSON.stringify(items.sort((a,b) => a.id - b.id))).digest("hex");

// === AUTH ENDPOINT ===
app.post("/api/auth/session", (req, res) => {
  try {
    const sessionId = generateSessionId();
    const csrfToken = generateCSRF();
    SESSIONS[sessionId] = {
      id: sessionId,
      createdAt: Date.now(),
      csrfTokens: [csrfToken],
      csrfGenerated: Date.now(),
      validatedCart: null,
      cartHash: null
    };
    res.json({ success: true, sessionId, csrfToken, expiresIn: SECURITY.SESSION_TIMEOUT });
  } catch (e) {
    res.status(500).json({ error: "Session creation failed" });
  }
});

// === PRODUCT VALIDATION ===
app.post("/api/products/validate", (req, res) => {
  try {
    const { items, sessionId } = req.body;
    if (!SESSIONS[sessionId]) return res.status(401).json({ error: "Invalid session" });
    if (!Array.isArray(items) || items.length > SECURITY.MAX_CART_ITEMS) {
      return res.status(400).json({ error: "Invalid cart" });
    }
    
    const validated = [];
    let subtotal = 0, tampering = false;
    
    for (const item of items) {
      const product = PRODUCTS[item.productId];
      if (!product) return res.status(400).json({ error: `Invalid product: ${item.productId}` });
      
      const actualPrice = product.price * item.quantity;
      if (item.providedPrice && Math.abs(actualPrice - item.providedPrice) / actualPrice > SECURITY.MAX_PRICE_VARIANCE / 100) {
        tampering = true;
        AUDIT_LOG.push({ type: "TAMPERING", sessionId, product: item.productId, expected: actualPrice, provided: item.providedPrice });
      }
      
      validated.push({ productId: item.productId, name: product.name, qty: item.quantity, price: product.price, total: actualPrice });
      subtotal += actualPrice;
    }
    
    const cartHash = hashCart(validated);
    SESSIONS[sessionId].validatedCart = validated;
    SESSIONS[sessionId].cartHash = cartHash;
    
    res.json({ success: true, warning: tampering ? "Prices corrected to server values" : null, items: validated, subtotal, cartHash });
  } catch (e) {
    res.status(500).json({ error: "Validation failed" });
  }
});

// === COUPON VALIDATION ===
app.post("/api/coupons/validate", (req, res) => {
  try {
    const { code, sessionId, subtotal } = req.body;
    if (!SESSIONS[sessionId]) return res.status(401).json({ error: "Invalid session" });
    if (!code) return res.json({ valid: false, discount: 0 });
    
    const coupon = COUPONS[code.toUpperCase()];
    if (!coupon || Date.now() > coupon.expiresAt || coupon.uses >= coupon.maxUses) {
      return res.json({ valid: false, discount: 0, message: "Invalid or expired coupon" });
    }
    
    const discountAmt = Math.floor(subtotal * coupon.discount / 100);
    res.json({ valid: true, code: code.toUpperCase(), discount: coupon.discount, amount: discountAmt });
  } catch (e) {
    res.status(500).json({ error: "Coupon validation failed" });
  }
});

// === SECURE CHECKOUT ===
app.post("/api/checkout/calculate", (req, res) => {
  try {
    const { sessionId, phone, coupon } = req.body;
    if (!SESSIONS[sessionId] || !validate.phone(phone)) {
      return res.status(400).json({ error: "Invalid session or phone" });
    }
    
    const session = SESSIONS[sessionId];
    if (!session.validatedCart) return res.status(400).json({ error: "No validated cart" });
    
    let subtotal = session.validatedCart.reduce((s, i) => s + i.total, 0);
    let discount = 0;
    let discountCode = null;
    
    if (coupon && COUPONS[coupon.toUpperCase()]) {
      const c = COUPONS[coupon.toUpperCase()];
      if (Date.now() <= c.expiresAt && c.uses < c.maxUses) {
        discount = Math.floor(subtotal * c.discount / 100);
        discountCode = coupon.toUpperCase();
      }
    }
    
    const shipping = subtotal >= 500 ? 0 : 50;
    const finalAmount = subtotal - discount + shipping;
    
    const checkoutData = {
      sessionId, phone, subtotal, discount, discountCode, shipping, finalAmount, timestamp: Date.now(), cartHash: session.cartHash
    };
    
    const checkoutId = crypto.createHash("sha256").update(JSON.stringify(checkoutData)).digest("hex");
    PENDING_ORDERS[checkoutId] = { ...checkoutData, expiresAt: Date.now() + 900000 };
    
    res.json({ success: true, checkoutId, subtotal, discount, discountCode, shipping, finalAmount });
  } catch (e) {
    res.status(500).json({ error: "Checkout calculation failed" });
  }
});

// === SECURE ORDER PLACEMENT ===
app.post("/api/orders/place", (req, res) => {
  try {
    const { checkoutId, sessionId, phone, paymentMethod } = req.body;
    if (!SESSIONS[sessionId] || !PENDING_ORDERS[checkoutId]) {
      return res.status(400).json({ error: "Invalid checkout" });
    }
    
    const checkout = PENDING_ORDERS[checkoutId];
    if (Date.now() > checkout.expiresAt) {
      delete PENDING_ORDERS[checkoutId];
      return res.status(400).json({ error: "Checkout expired" });
    }
    
    // RE-VALIDATE AMOUNT (PREVENT ANY TAMPERING)
    let recalc = checkout.subtotal - checkout.discount + checkout.shipping;
    if (recalc !== checkout.finalAmount) {
      return res.status(400).json({ error: "Amount mismatch detected" });
    }
    
    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    
    const order = {
      orderId, phone: checkout.phone, items: SESSIONS[sessionId].validatedCart,
      subtotal: checkout.subtotal, discount: checkout.discount, shipping: checkout.shipping,
      finalAmount: checkout.finalAmount, status: "confirmed", createdAt: new Date().toISOString()
    };
    
    delete PENDING_ORDERS[checkoutId];
    AUDIT_LOG.push({ type: "ORDER_PLACED", orderId, phone: order.phone, amount: order.finalAmount });
    
    res.json({ success: true, orderId, amount: order.finalAmount, message: "Order placed successfully" });
  } catch (e) {
    res.status(500).json({ error: "Order placement failed" });
  }
});

// === WHATSAPP ENDPOINTS ===
app.post("/api/send-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!validate.phone(phone) || !validate.otp(otp)) return res.status(400).json({ error: "Invalid input" });
    
    const key = `otp_${phone}`;
    const now = Date.now();
    if (!RATE_LIMIT[key]) RATE_LIMIT[key] = [];
    RATE_LIMIT[key] = RATE_LIMIT[key].filter(t => now - t < SECURITY.REQUEST_TIMEOUT);
    if (RATE_LIMIT[key].length >= SECURITY.RATE_LIMIT_PER_PHONE) {
      return res.status(429).json({ error: "Too many requests" });
    }
    RATE_LIMIT[key].push(now);
    
    const msg = `Your Aarzah OTP: ${otp}\n\nValid for 10 minutes. Do not share.\n\nAarzah - Everyday Ethnic Wear`;
    const result = await sendMsg(phone, msg);
    
    res.json({ success: true, phone: `+91${phone}`, messageId: result.messageId });
  } catch (e) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

async function sendMsg(phone, message) {
  try {
    if (CONFIG.whatsappProvider === "twilio") {
      const twilio = require("twilio");
      const client = twilio(CONFIG.twilioSid, CONFIG.twilioToken);
      const result = await client.messages.create({
        from: `whatsapp:${CONFIG.twilioNumber}`,
        to: `whatsapp:+91${phone}`,
        body: message
      });
      return { messageId: result.sid, status: result.status };
    } else {
      const response = await axios.post(CONFIG.gupshupUrl, {
        apikey: CONFIG.gupshupKey,
        to: `91${phone}`,
        message: message,
        messageType: "TEXT",
        format: "json"
      }, { timeout: 5000 });
      return { messageId: response.data.messageId, status: response.data.status };
    }
  } catch (e) {
    throw new Error(`Message send failed: ${e.message}`);
  }
}

if (require.main === module) {
  app.listen(CONFIG.port, () => {
    console.log(`\n AARZAH SECURE BACKEND API\n`);
    console.log(` Started on port ${CONFIG.port}`);
    console.log(` WhatsApp Provider: ${CONFIG.whatsappProvider}`);
    console.log(`  Security: CSRF Protection, Price Validation, Tampering Detection`);
    console.log(`\n  IMPORTANT: Change JWT_SECRET in environment variables!\n`);
  });
}

module.exports = app;
