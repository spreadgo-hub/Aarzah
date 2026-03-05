# WhatsApp API Integration Guide - Aarzah

## Overview

The Aarzah website is configured to send OTPs and order confirmations via WhatsApp Business API. The current setup generates OTP locally for testing, but requires **WhatsApp Business API integration** for production.

## Current Status

✅ **OTP Generation**: Working (generates 6-digit code)
✅ **OTP Storage**: Working (localStorage with 10-minute expiry)
❌ **WhatsApp Sending**: Requires backend + API integration

## What You Need

### 1. WhatsApp Business Account
- Register at [WhatsApp Business API](https://www.whatsapp.com/business/api)
- Or use **CloudAPI providers** (Recommended for easy setup):
  - Twilio
  - MessageBird
  - Gupshup
  - Interakt
  - Yellow.ai

### 2. Business Phone Number
- **Your Number**: `+91 8700060182` (configured in `config.js`)
- This number will display in WhatsApp messages to customers

### 3. API Credentials
- Access Token / API Key
- Phone ID (for WhatsApp Business API)
- Account ID
- Webhook URL for delivery confirmations

## Step-by-Step Setup (Using Twilio as Example)

### Step 1: Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up and verify your account
3. Get your **Account SID** and **Auth Token**
4. Purchase WhatsApp-enabled Twilio number

### Step 2: Update Configuration
Edit `config.js` and update:
```javascript
whatsapp: {
  apiProvider: 'twilio', // or 'gupshup', 'interakt'
  accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
  authToken: 'YOUR_TWILIO_AUTH_TOKEN',
  fromNumber: '+91XXXXXXXXXX', // Your Twilio WhatsApp number
  toNumber: '+918700060182'    // Customer's number (variable)
}
```

### Step 3: Update Backend

Create a backend endpoint (Node.js example):
```javascript
// backend/routes/whatsapp.js
const twilio = require('twilio');

const client = twilio(accountSid, authToken);

app.post('/api/send-otp', async (req, res) => {
  const { phone, otp } = req.body;
  
  try {
    const message = await client.messages.create({
      from: 'whatsapp:+1234567890', // Your Twilio WhatsApp number
      to: `whatsapp:+91${phone}`,
      body: `Your Aarzah OTP is: ${otp}\n\nValid for 10 minutes.`
    });
    
    res.json({ success: true, messageId: message.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 4: Update Frontend

Modify `login.html` to call your backend:
```javascript
async function sendOTPViaWhatsApp(phone) {
  const response = await fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  
  const data = await response.json();
  if (data.success) {
    console.log('OTP sent via WhatsApp');
  }
}
```

## Alternative: Using Gupshup (Easier Setup)

### Advantages:
- No phone number purchase needed
- Uses your own number
- Simpler integration
- Better pricing for startups

### Setup:
1. Go to [gupshup.io](https://www.gupshup.io)
2. Sign up and verify
3. Get API key
4. Use their API for sending messages

```javascript
// Gupshup Integration
async function sendOTPGupshup(phone, otp) {
  const apiKey = 'YOUR_GUPSHUP_API_KEY';
  
  const response = await fetch('https://api.gupshup.io/sm/api/v1/msg/send/whatapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `apikey=${apiKey}&to=91${phone}&message=${otp}`
  });
  
  return await response.json();
}
```

## Functions to Implement

### In Frontend (`whatsapp-integration.js`):
```javascript
// Already exists - needs backend call
async function sendOTPViaWhatsApp(phone) {
  // Local OTP generation
  const otp = generateOTP();
  
  // Send to backend for WhatsApp transmission
  const result = await callBackendAPI('/api/send-otp', {
    phone: phone,
    otp: otp
  });
  
  return result;
}

// Order confirmation via WhatsApp
async function sendOrderConfirmationWhatsApp(orderData, phone) {
  // Call backend to send WhatsApp message
  return await callBackendAPI('/api/send-order-confirmation', {
    phone: phone,
    orderData: orderData
  });
}

// Payment confirmation via WhatsApp
async function sendPaymentConfirmationWhatsApp(orderData, phone) {
  return await callBackendAPI('/api/send-payment-confirmation', {
    phone: phone,
    orderData: orderData
  });
}
```

### In Backend:
```javascript
// OTP Endpoint
app.post('/api/send-otp', verifyRequest, async (req, res) => {
  const { phone, otp } = req.body;
  
  // Your WhatsApp API call here
  // Send OTP message
  
  res.json({ success: true });
});

// Order Confirmation Endpoint
app.post('/api/send-order-confirmation', verifyRequest, async (req, res) => {
  const { phone, orderData } = req.body;
  
  // Your WhatsApp API call here
  // Send order confirmation message
  
  res.json({ success: true });
});

// Payment Confirmation Endpoint
app.post('/api/send-payment-confirmation', verifyRequest, async (req, res) => {
  const { phone, orderData } = req.body;
  
  // Your WhatsApp API call here
  // Send payment confirmation message
  
  res.json({ success: true });
});
```

## Message Templates

### OTP Message
```
Your Aarzah OTP is: 123456

Valid for 10 minutes. Do not share this OTP.

Aarzah - Everyday Ethnic Wear
https://aarzah.com
```

### Order Confirmation
```
🎉 Order Confirmed!

Order ID: ORD123456789
Amount: ₹649
Items: 1

Your order will be delivered in 3-5 business days.

Track: https://aarzah.com/order-tracking.html?id=ORD123456789

Aarzah - Everyday Ethnic Wear
```

### Payment Confirmation
```
✅ Payment Received!

Order ID: ORD123456789
Amount: ₹649
Transaction ID: TXN987654321

Your order is being processed and will ship shortly.

Aarzah - Everyday Ethnic Wear
```

## Testing WhatsApp Integration

### Before Going Live:
1. Test with Twilio test numbers (free)
2. Verify message delivery
3. Check message formatting
4. Test on actual WhatsApp

### Webhook Verification:
```javascript
// Webhook to receive delivery confirmations
app.post('/webhook/whatsapp', (req, res) => {
  const { entry } = req.body;
  
  entry.forEach(item => {
    item.changes.forEach(change => {
      if (change.field === 'messages') {
        const message = change.value.messages[0];
        console.log('Message status:', message.status);
      }
    });
  });
  
  res.sendStatus(200);
});
```

## Configuration File Location

All settings are centralized in: **`config.js`**

Update these values:
```javascript
contact: {
  businessPhone: '8700060182',      // Your WhatsApp business number
  whatsappSupport: '8700060182'     // Support WhatsApp
},

whatsapp: {
  businessPhoneId: 'YOUR_PHONE_ID',
  accessToken: 'YOUR_API_TOKEN',
  apiVersion: 'v18.0'
}
```

## Testing Without Backend

For development/testing without backend:
1. Use `whatsapp-integration.js` locally
2. Check browser console for logs
3. OTP will display in alert box
4. When backend is ready, replace alert with actual API call

## Security Notes

⚠️ **IMPORTANT:**
- Never expose API keys in frontend code
- Always verify phone numbers before sending OTP
- Rate limit OTP requests (max 5 per hour per number)
- Validate OTP on backend too
- Use HTTPS for all API communications
- Implement CAPTCHA for OTP request to prevent abuse

## Troubleshooting

### OTP Not Received?
1. Check WhatsApp API credentials
2. Verify phone number format (+91XXXXXXXXXX)
3. Check API provider rate limits
4. Verify webhook is working
5. Check logs for errors

### Messages Failing to Send?
1. Verify API key/token
2. Check message format (no special characters unless allowed)
3. Confirm phone number is WhatsApp-active
4. Check API provider status page

### Cost Estimation
- Twilio: ~₹0.30-0.50 per message
- Gupshup: ~₹0.25-0.40 per message
- For 1000 OTPs: ~₹300-500 per month

## Next Steps

1. ✅ Create config.js (DONE)
2. ✅ Prepare whatsapp-integration.js (DONE)
3. 🔄 Set up backend API endpoints
4. 🔄 Get WhatsApp API credentials
5. 🔄 Update frontend to call backend
6. 🔄 Test end-to-end flow
7. 🔄 Deploy to production

## Support

For WhatsApp API support:
- Twilio: https://support.twilio.com
- Gupshup: https://docs.gupshup.io
- Meta: https://www.whatsapp.com/business/api

---

**Last Updated**: March 5, 2026
**Config File**: config.js
**Integration File**: whatsapp-integration.js
**Status**: Ready for backend integration
