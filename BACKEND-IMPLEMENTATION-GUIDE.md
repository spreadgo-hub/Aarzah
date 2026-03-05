# Aarzah Backend API - Complete Implementation Guide

## Overview
This guide will help you implement the WhatsApp notification system for Aarzah e-commerce site. The system consists of:
- **Frontend**: Already complete and ready to make API calls
- **Backend API**: Template provided (backend-api-template.js)
- **WhatsApp Provider**: You choose (Twilio, Gupshup, or Meta)

---

## Table of Contents
1. [Quick Start (15 minutes)](#quick-start)
2. [Provider Setup](#provider-setup)
3. [Backend Installation](#backend-installation)
4. [Frontend Integration](#frontend-integration)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js 14+ installed
- npm or yarn
- One of: Twilio, Gupshup, or Meta WhatsApp Business Account
- Business phone number: `+918700060182`

### Step 1: Set Up Backend (5 min)
```bash
# Create backend project
mkdir aarzah-backend
cd aarzah-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express axios dotenv

# Copy the template
cp backend-api-template.js app.js

# Copy environment template
cp backend-env-template.txt .env-example
cp .env-example .env  # Edit with your values
```

### Step 2: Choose & Configure WhatsApp Provider (5 min)

Pick ONE option below:

#### Option A: Gupshup (EASIEST - ⭐ Recommended)
- Cost: ~₹0.25 per message
- Setup time: 5 minutes
- Integration: Easiest

1. Sign up: https://www.gupshup.io/developer/dashboard
2. Create account and go to "API Keys"
3. Copy your API Key
4. Update `.env`:
```
WHATSAPP_PROVIDER=gupshup
GUPSHUP_API_KEY=your-api-key-here
```

#### Option B: Twilio
- Cost: ~₹0.35 per message
- Setup time: 10 minutes
- Integration: Medium

1. Sign up: https://www.twilio.com/console
2. Get Account SID and Auth Token
3. Purchase WhatsApp-enabled number
4. Update `.env`:
```
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=AC123...
TWILIO_AUTH_TOKEN=your-token
TWILIO_WHATSAPP_NUMBER=+1234567890
```

#### Option C: Meta Official API (COMPLEX)
- Cost: Variable (starts free)
- Setup time: 1+ hours
- Integration: Most complex

1. Set up WhatsApp Business Account
2. Apply for official API access
3. Complete business verification
4. Follow Meta's official documentation

**Recommendation**: Use **Gupshup** for fastest setup and lowest cost.

### Step 3: Start Backend (5 min)
```bash
# Add security token to .env
API_VERIFICATION_TOKEN=sk_8700060182_super_secret_32_char_min

# Start server
node app.js

# You should see:
# Aarzah WhatsApp API running on http://localhost:3000
```

---

## Provider Setup Details

### Gupshup Setup (Recommended)

#### 1. Create Account
- Go to https://www.gupshup.io/developer/dashboard
- Sign up with your email
- Verify email

#### 2. Get API Credentials
```
Dashboard → API Keys → Copy Your API Key
```

#### 3. Configure Phone Number
- The system will use your existing phone number (8700060182)
- Phone needs to be verified in Gupshup dashboard
- Verification via OTP to the phone number

#### 4. Test API
```bash
# In your terminal, test the API directly:
curl -X POST http://localhost:3000/health

# Should return:
# {
#   "status": "ok",
#   "service": "Aarzah WhatsApp API",
#   "provider": "gupshup"
# }
```

#### 5. Send Test Message
```javascript
// In Node.js console:
const axios = require('axios');

axios.post('https://api.gupshup.io/sm/api/v1/msg/send/whatapp', {
  apikey: 'YOUR_API_KEY',
  to: '918700060182',     // Your business phone
  message: 'Test message',
  messageType: 'TEXT',
  format: 'json'
}).then(res => console.log(res.data));
```

---

## Backend Installation

### Complete Setup (All Options)

```bash
# 1. Create project directory
mkdir -p /var/www/aarzah-backend
cd /var/www/aarzah-backend

# 2. Initialize Node project
npm init -y

# 3. Install dependencies
npm install express axios dotenv

# 4. Copy template and environment files
cp path/to/backend-api-template.js app.js
cp path/to/backend-env-template.txt .env

# 5. Edit .env with your values
# Recommended values:
# WHATSAPP_PROVIDER=gupshup
# GUPSHUP_API_KEY=your-api-key
# API_VERIFICATION_TOKEN=sk_8700060182_your_secret_token
# BUSINESS_PHONE=8700060182
# NODE_ENV=development

# 6. (Optional) Set up MongoDB for message tracking
npm install mongoose

# 7. Start and test
node app.js
```

### File Structure
```
aarzah-backend/
├── app.js                    # Main API server
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example             # Template (commit this)
├── .gitignore               # Should include: .env, node_modules/
├── package.json
├── package-lock.json
├── logs/
│   └── errors.log           # Error logs
└── database/
    └── models/              # Database models (optional)
```

### package.json
```json
{
  "name": "aarzah-whatsapp-api",
  "version": "1.0.0",
  "description": "WhatsApp notification API for Aarzah e-commerce",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "axios": "^1.3.0",
    "dotenv": "^16.0.3",
    "twilio": "^3.86.0",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## Frontend Integration

### Step 1: Update Frontend API Configuration

In your HTML files, find where WhatsApp integration is loaded:

```html
<!-- Replace old whatsapp-integration.js with new version -->

<!-- OLD (remove this) -->
<!-- <script src="whatsapp-integration.js"></script> -->

<!-- NEW (add this) -->
<script src="whatsapp-integration-with-backend.js"></script>

<!-- Configure API endpoint -->
<script>
  // Set to your backend URL
  WHATSAPP_API_CONFIG.baseUrl = 'https://api.aarzah.com'; // Update for production
  WHATSAPP_API_CONFIG.verificationToken = 'sk_8700060182_your_secret_token'; // From .env
</script>
```

### Step 2: Update Login Page OTP Function

In `login.html`, update the `sendOTP()` function:

```javascript
// OLD: Sends OTP and shows in alert
async function sendOTP() {
  const phone = document.getElementById('loginPhone').value;
  // ... existing validation ...
  
  const otp = generateOTP();
  // OLD: Just shows alert
  alert(`OTP: ${otp}`);
}

// NEW: Sends to backend, which sends via WhatsApp
async function sendOTP() {
  try {
    const phone = document.getElementById('loginPhone').value;
    
    // Validate phone
    if (!/^\d{10}$/.test(phone)) {
      alert('❌ Please enter a valid 10-digit phone number');
      return;
    }

    // Show loading state
    const sendBtn = document.querySelector('button[onclick="sendOTP()"]');
    const originalText = sendBtn.textContent;
    sendBtn.textContent = '📱 Sending OTP...';
    sendBtn.disabled = true;

    // Generate OTP locally
    const otp = generateOTP();

    // Send to backend which will deliver via WhatsApp
    const result = await WhatsAppAPI.sendOTPViaWhatsApp(phone, otp);

    if (result.success) {
      // Store OTP locally for verification
      const otpData = {
        code: otp,
        phone: phone,
        createdAt: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
        attempts: 0
      };
      localStorage.setItem(`aarzah_otp_${phone}`, JSON.stringify(otpData));

      // Show success
      alert('✅ OTP sent to WhatsApp at +91' + phone + '\n\nValid for 10 minutes');
      
      // Show OTP input (already on page)
      document.getElementById('otpInputDiv').style.display = 'block';
    }

    // Restore button
    sendBtn.textContent = originalText;
    sendBtn.disabled = false;

  } catch (error) {
    alert('❌ Failed to send OTP: ' + error.message);
    sendBtn.disabled = false;
  }
}
```

### Step 3: Update Checkout Page

After payment success, send order confirmation:

```javascript
// In your Razorpay success handler

async function handlePaymentSuccess(response) {
  try {
    // Get order data
    const orderId = 'ORD' + Date.now();
    const cartItems = getCartItems();
    const total = calculateTotal();
    const customerPhone = document.getElementById('customerPhone').value;

    const orderData = {
      orderId: orderId,
      amount: total,
      items: cartItems,
      transactionId: response.razorpay_payment_id,
      timestamp: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('aarzah_orders')) || [];
    orders.push(orderData);
    localStorage.setItem('aarzah_orders', JSON.stringify(orders));

    // Send WhatsApp notifications
    console.log('📱 Sending order confirmations...');
    
    await Promise.all([
      WhatsAppAPI.sendPaymentConfirmation(customerPhone, orderData),
      WhatsAppAPI.sendOrderConfirmation(customerPhone, orderData)
    ]);

    console.log('✅ Notifications sent successfully');

    // Redirect to confirmation page
    setTimeout(() => {
      window.location.href = 'order-confirmation.html?id=' + orderId;
    }, 2000);

  } catch (error) {
    console.error('Warning: Notifications failed, but order was created:', error);
    // Don't block order creation if notifications fail
    window.location.href = 'order-confirmation.html?id=' + orderId;
  }
}
```

---

## Testing

### 1. Local Testing

```bash
# Terminal 1: Start backend
cd aarzah-backend
npm install
node app.js

# Terminal 2: Test API health
curl http://localhost:3000/health

# Should return:
# {"status":"ok","service":"Aarzah WhatsApp API","timestamp":"...","provider":"gupshup"}
```

### 2. Test OTP Sending

```bash
# Send test OTP
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "phone": "9876543210",
    "otp": "123456"
  }'

# Expected response:
# {
#   "success": true,
#   "phone": "+919876543210",
#   "messageId": "msg123456",
#   "timestamp": "2024-01-15T..."
# }
```

### 3. Test from Frontend

1. Open `login.html` in browser (or your local version)
2. Enter phone number: `9876543210`
3. Click "Send OTP"
4. Check:
   - ✅ Response shows success message
   - ✅ Phone receives WhatsApp message with OTP
   - ✅ OTP input field becomes visible

### 4. Full Order Flow Test

1. Add items to cart (index.html)
2. Go to checkout
3. Enter phone number: `9876543210`
4. Make payment (use Razorpay test card: 4111 1111 1111 1111)
5. Check:
   - ✅ Payment success page appears
   - ✅ Phone receives multiple WhatsApp messages:
     - Payment confirmation
     - Order confirmation with items
   - ✅ Order created in localStorage

---

## Deployment

### For AWS/Heroku/DigitalOcean

#### 1. Prepare for Production

```bash
# Update .env for production
API_VERIFICATION_TOKEN=sk_8700060182_use_strong_random_token_64_chars
NODE_ENV=production
BUSINESS_PHONE=8700060182
WHATSAPP_PROVIDER=gupshup
GUPSHUP_API_KEY=your_production_key

# Add to .gitignore
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
echo "logs/" >> .gitignore
```

#### 2. Create Procfile (for Heroku)
```bash
web: node app.js
```

#### 3. Deploy

**Heroku Example:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create aarzah-api

# Set environment variables
heroku config:set API_VERIFICATION_TOKEN=sk_8700060182_xxx
heroku config:set WHATSAPP_PROVIDER=gupshup
heroku config:set GUPSHUP_API_KEY=your-key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**DigitalOcean Example:**
```bash
# On your DigitalOcean droplet
cd /var/www/aarzah-backend

# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start app.js --name "aarzah-api"
pm2 save
pm2 startup

# Check status
pm2 status
```

#### 4. Update Frontend API URL

In your frontend files, update:
```javascript
WHATSAPP_API_CONFIG.baseUrl = 'https://api.aarzah.com'; // Your production domain
```

#### 5. Set Up SSL Certificate

```bash
# If using Let's Encrypt (recommended)
certbot certonly --standalone -d api.aarzah.com
```

---

## Monitoring & Logs

### View Application Logs
```bash
# All logs
pm2 logs aarzah-api

# Last 100 lines
pm2 logs aarzah-api --lines 100

# Real-time monitoring
pm2 monit
```

### Track OTP Sending
```javascript
// Add to app.js for detailed logging
app.post('/api/send-otp', async (req, res) => {
  const timestamp = new Date().toISOString();
  const { phone, otp } = req.body;
  
  console.log(`[${timestamp}] [OTP] Send request to +91${phone}`);
  
  try {
    // ... send logic ...
    console.log(`[${timestamp}] [OTP] Successfully sent to +91${phone}`);
  } catch (error) {
    console.error(`[${timestamp}] [OTP] FAILED for +91${phone}: ${error.message}`);
  }
});
```

### Database Schema (Optional - MongoDB)
```javascript
const messageSchema = new mongoose.Schema({
  messageId: String,
  phone: String,
  type: String,  // 'otp', 'order', 'payment', 'shipping', 'return'
  status: String, // 'sent', 'delivered', 'failed'
  provider: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  deliveredAt: Date,
  failureReason: String
});
```

---

## Troubleshooting

### Issue: "API not responding"
**Solution:**
1. Check server is running: `node app.js`
2. Check port (default: 3000): `netstat -an | grep 3000`
3. Check firewall allows port 3000

### Issue: "Authentication failed"
**Solution:**
1. Verify API token matches in .env and frontend
2. Check Authorization header format: `Bearer sk_8700060182_xxx`
3. Regenerate token if unsure

### Issue: "WhatsApp message not received"
**Solution:**
1. Verify phone number format: Should be 10 digits (no +91)
2. Check Gupshup API key is valid
3. Verify phone is registered with Gupshup
4. Check rate limits (5 OTPs per hour per phone)
5. View logs: `pm2 logs aarzah-api`

### Issue: "CORS error from frontend"
**Solution:**
Add CORS headers to backend:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://aarzah.com',
  credentials: true
}));
```

### Issue: "Rate limit exceeded"
**Solution:**
Rate limiting is built-in (5 OTPs per hour per phone). 
If user keeps getting rejected:
1. Wait 60 minutes before new attempt
2. Clean old rates: Can add "clear old entries" function
3. Implement admin override if needed

---

## Performance Tips

### Caching
```javascript
// Cache API responses for 5 minutes
const cache = new Map();

function getFromCache(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < 5 * 60 * 1000) {
    return item.data;
  }
  return null;
}
```

### Batch Messages
```javascript
// Send multiple messages in one request instead of separate calls
async function sendBatchMessages(messages) {
  return Promise.all(
    messages.map(msg => sendWhatsAppMessage(msg.phone, msg.text))
  );
}
```

### Connection Pooling
```javascript
// Use connection pools for database
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 5
};
mongoose.connect(mongoURI, mongooseOptions);
```

---

## Security Best Practices

✅ **DO:**
- Store API keys in .env (not in code)
- Use HTTPS for all API calls
- Implement rate limiting (already included)
- Validate all inputs (already included)
- Log all API calls for audit trail
- Use strong verification tokens (64+ characters)

❌ **DON'T:**
- Commit .env files to git
- Use API keys in frontend
- Allow unlimited message sending
- Log sensitive data (OTP codes, phone numbers)
- Expose API at public endpoint without authentication

---

## Cost Estimation

### Per 1000 OTPs Sent

| Provider | Cost |
|----------|------|
| **Gupshup** | ₹250 - ₹500 |
| Twilio | ₹350 - ₹700 |
| Meta | Variable |

### Monthly Estimates (Conservative)
- 100 OTPs/day: ₹300-600/month
- 1000 OTPs/day: ₹3000-6000/month
- Order confirmations + OTPs: ₹5000-10000/month

**Cost optimization**: Batch similar messages, cache where possible.

---

## Next Steps

1. ✅ Choose provider (recommend: Gupshup)
2. ✅ Set up provider account and get API key
3. ✅ Create backend with provided template
4. ✅ Update .env with credentials
5. ✅ Start backend and test
6. ✅ Update frontend to use backend API
7. ✅ Test end-to-end OTP flow
8. ✅ Deploy to production (AWS/Heroku/DigitalOcean)
9. ✅ Monitor logs and performance
10. ✅ Scale as needed

---

## Support & Resources

### Official Documentation
- **Gupshup**: https://docs.gupshup.io/docs/botplatform/whatsapp/quick-start
- **Twilio**: https://www.twilio.com/docs/whatsapp
- **Meta**: https://developers.facebook.com/docs/whatsapp/

### API References
- File: `backend-api-template.js` (Complete implementation)
- All endpoints documented with examples
- Message templates pre-configured

### Questions?
1. Check logs: `pm2 logs aarzah-api`
2. Test individual endpoints
3. Verify .env variables
4. Check provider account status
5. Review error messages carefully

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2024 | Initial template and guide |
| 1.1 | Pending | Add database tracking |
| 1.2 | Pending | Add webhook verification |
| 1.3 | Pending | Add analytics dashboard |

---

**Last Updated**: January 2024
**Status**: Production Ready ✅
