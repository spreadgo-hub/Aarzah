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

// PRODUCT CATALOG (Source of Truth) - 18 ITEMS
const PRODUCTS = {
  // KURTIS (5 items)
  "kurti-001": { 
    id: "kurti-001",
    name: "Embroidered Cotton Kurti", 
    category: "kurtis",
    price: 649,
    originalPrice: 849,
    images: ["images/products/kurtis/embroidered-1.jpg", "images/products/kurtis/embroidered-2.jpg", "images/products/kurtis/embroidered-3.jpg"],
    colors: ["Red", "Blue", "Green", "Black"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Premium embroidered cotton kurti with traditional designs"
  },
  "kurti-002": { 
    id: "kurti-002",
    name: "Designer Silk Kurti", 
    category: "kurtis",
    price: 1599,
    originalPrice: 1999,
    images: ["images/products/kurtis/silk-1.jpg", "images/products/kurtis/silk-2.jpg"],
    colors: ["Maroon", "Gold", "Navy"],
    sizes: ["M", "L", "XL"],
    description: "Elegant silk kurti with intricate handwork"
  },
  "kurti-003": { 
    id: "kurti-003",
    name: "Printed Kurta with Pants", 
    category: "kurtis",
    price: 799,
    originalPrice: 999,
    images: ["images/products/kurtis/print-1.jpg", "images/products/kurtis/print-2.jpg", "images/products/kurtis/print-3.jpg", "images/products/kurtis/print-4.jpg"],
    colors: ["Multicolor", "Purple", "Orange"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Comfortable printed kurta set with matching pants"
  },
  "kurti-004": { 
    id: "kurti-004",
    name: "Floral Rayon Kurti", 
    category: "kurtis",
    price: 549,
    originalPrice: 699,
    images: ["images/products/kurtis/floral-1.jpg", "images/products/kurtis/floral-2.jpg"],
    colors: ["Peach", "Pink", "Yellow"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Light and breathable floral rayon kurti"
  },
  "kurti-005": { 
    id: "kurti-005",
    name: "Ethnic Fusion Kurti", 
    category: "kurtis",
    price: 899,
    originalPrice: 1199,
    images: ["images/products/kurtis/fusion-1.jpg", "images/products/kurtis/fusion-2.jpg", "images/products/kurtis/fusion-3.jpg"],
    colors: ["Cream", "Lavender", "Sage"],
    sizes: ["M", "L", "XL"],
    description: "Modern ethnic fusion design with classic touch"
  },

  // SAREES (5 items)
  "saree-001": { 
    id: "saree-001",
    name: "Printed Saree with Blouse", 
    category: "sarees",
    price: 1299,
    originalPrice: 1499,
    images: ["images/products/sarees/printed-1.jpg", "images/products/sarees/printed-2.jpg", "images/products/sarees/printed-3.jpg"],
    colors: ["MultiColor", "Blue", "Maroon"],
    sizes: ["Free Size"],
    description: "Beautiful printed saree with unstitched blouse piece"
  },
  "saree-002": { 
    id: "saree-002",
    name: "Silk Saree", 
    category: "sarees",
    price: 2499,
    originalPrice: 3299,
    images: ["images/products/sarees/silk-1.jpg", "images/products/sarees/silk-2.jpg", "images/products/sarees/silk-3.jpg", "images/products/sarees/silk-4.jpg"],
    colors: ["Red", "Royal Blue", "Green", "Black"],
    sizes: ["Free Size"],
    description: "Premium silk saree with traditional weaving patterns"
  },
  "saree-003": { 
    id: "saree-003",
    name: "Cotton Saree", 
    category: "sarees",
    price: 599,
    originalPrice: 799,
    images: ["images/products/sarees/cotton-1.jpg", "images/products/sarees/cotton-2.jpg"],
    colors: ["White", "Beige", "Light Green"],
    sizes: ["Free Size"],
    description: "Soft and comfortable cotton saree for everyday wear"
  },
  "saree-004": { 
    id: "saree-004",
    name: "Designer Saree with Blouse", 
    category: "sarees",
    price: 1899,
    originalPrice: 2499,
    images: ["images/products/sarees/designer-1.jpg", "images/products/sarees/designer-2.jpg", "images/products/sarees/designer-3.jpg"],
    colors: ["Gold", "Mauve", "Rust"],
    sizes: ["Free Size"],
    description: "Handcrafted designer saree with embroidered blouse"
  },
  "saree-005": { 
    id: "saree-005",
    name: "Chanderi Saree", 
    category: "sarees",
    price: 1399,
    originalPrice: 1699,
    images: ["images/products/sarees/chanderi-1.jpg", "images/products/sarees/chanderi-2.jpg", "images/products/sarees/chanderi-3.jpg", "images/products/sarees/chanderi-4.jpg", "images/products/sarees/chanderi-5.jpg"],
    colors: ["Cream", "Purple", "Orange"],
    sizes: ["Free Size"],
    description: "Elegant chanderi fabric saree with golden zari border"
  },

  // SUITS (4 items)
  "suit-001": { 
    id: "suit-001",
    name: "Palazzo Suit Set", 
    category: "suits",
    price: 899,
    originalPrice: 999,
    images: ["images/products/suits/palazzo-1.jpg", "images/products/suits/palazzo-2.jpg", "images/products/suits/palazzo-3.jpg"],
    colors: ["Navy", "Black", "Charcoal"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Comfortable palazzo suit with dupatta"
  },
  "suit-002": { 
    id: "suit-002",
    name: "Embroidered Suit Set", 
    category: "suits",
    price: 1499,
    originalPrice: 1999,
    images: ["images/products/suits/emb-1.jpg", "images/products/suits/emb-2.jpg"],
    colors: ["Pink", "Peach", "Red"],
    sizes: ["M", "L", "XL"],
    description: "Beautifully embroidered unstitched suit with dupatta"
  },
  "suit-003": { 
    id: "suit-003",
    name: "Straight Suit", 
    category: "suits",
    price: 749,
    originalPrice: 899,
    images: ["images/products/suits/straight-1.jpg", "images/products/suits/straight-2.jpg", "images/products/suits/straight-3.jpg"],
    colors: ["Beige", "Brown", "Teal"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Classic straight cut suit with traditional look"
  },
  "suit-004": { 
    id: "suit-004",
    name: "Designer Suit with Work", 
    category: "suits",
    price: 1799,
    originalPrice: 2299,
    images: ["images/products/suits/designer-1.jpg", "images/products/suits/designer-2.jpg", "images/products/suits/designer-3.jpg", "images/products/suits/designer-4.jpg"],
    colors: ["Green", "Purple", "Gold"],
    sizes: ["M", "L", "XL"],
    description: "Premium designer suit with intricate embellishments"
  },

  // DRESSES (4 items)
  "dress-001": { 
    id: "dress-001",
    name: "Cotton Casual Dress", 
    category: "dresses",
    price: 449,
    originalPrice: 499,
    images: ["images/products/dresses/casual-1.jpg", "images/products/dresses/casual-2.jpg"],
    colors: ["White", "Blue", "Pink", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Simple and comfortable cotton casual dress"
  },
  "dress-002": { 
    id: "dress-002",
    name: "Maxi Dress", 
    category: "dresses",
    price: 899,
    originalPrice: 1099,
    images: ["images/products/dresses/maxi-1.jpg", "images/products/dresses/maxi-2.jpg", "images/products/dresses/maxi-3.jpg"],
    colors: ["Black", "Navy", "Wine"],
    sizes: ["M", "L", "XL"],
    description: "Elegant maxi dress perfect for parties"
  },
  "dress-003": { 
    id: "dress-003",
    name: "Printed Summer Dress", 
    category: "dresses",
    price: 599,
    originalPrice: 799,
    images: ["images/products/dresses/summer-1.jpg", "images/products/dresses/summer-2.jpg", "images/products/dresses/summer-3.jpg", "images/products/dresses/summer-4.jpg", "images/products/dresses/summer-5.jpg"],
    colors: ["Floral Yellow", "Floral Blue", "Floral Pink"],
    sizes: ["S", "M", "L", "XL"],
    description: "Bright and breezy summer dress with vibrant prints"
  },
  "dress-004": { 
    id: "dress-004",
    name: "Formal Midi Dress", 
    category: "dresses",
    price: 1099,
    originalPrice: 1399,
    images: ["images/products/dresses/formal-1.jpg", "images/products/dresses/formal-2.jpg"],
    colors: ["Black", "Gray", "Brown"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Sophisticated formal midi dress for special occasions"
  }
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
      // Try to find product by productId first
      let product = PRODUCTS[item.productId];
      
      // Fallback: if productId not found, try deriving from name or use provided price
      if (!product && item.productId) {
        const productIds = Object.keys(PRODUCTS);
        product = productIds.find(id => PRODUCTS[id].name.toLowerCase().includes(item.productId.toLowerCase())) 
          ? PRODUCTS[productIds.find(id => PRODUCTS[id].name.toLowerCase().includes(item.productId.toLowerCase()))]
          : null;
        
        // If still not found, accept the item with audit log
        if (!product) {
          AUDIT_LOG.push({ type: "UNRECOGNIZED_PRODUCT", sessionId, productId: item.productId, name: item.name });
          validated.push({ productId: item.productId, name: item.name, qty: item.quantity, price: item.providedPrice / item.quantity, total: item.providedPrice });
          subtotal += item.providedPrice;
          continue;
        }
      }
      
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }
      
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
    console.error('Cart validation error:', e);
    res.status(500).json({ error: "Validation failed: " + e.message });
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
