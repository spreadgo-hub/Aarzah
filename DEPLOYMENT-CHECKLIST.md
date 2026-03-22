# Aarzah WhatsApp Integration - Deployment Checklist

## Pre-Deployment Verification

### ✅ Frontend Ready (No Changes Needed)
- [x] All 11 HTML pages have config.js imported
- [x] Login page has OTP sending functionality
- [x] Checkout page has payment integration
- [x] whatsapp-integration-with-backend.js created and ready
- [x] Frontend can make API calls to backend

### ✅ Backend Files Provided
- [x] backend-api-template.js - Complete API implementation
- [x] backend-env-template.txt - Environment variables template
- [x] whatsapp-integration-with-backend.js - Frontend integration layer
- [x] BACKEND-IMPLEMENTATION-GUIDE.md - Full setup instructions
- [x] WHATSAPP-API-SETUP.md - Provider-specific setup guide
- [x] This checklist

---

## Backend Setup Checklist

### Phase 1: Environment Setup (30 minutes)

- [ ] **Create backend directory**
  ```bash
  mkdir aarzah-backend
  cd aarzah-backend
  ```

- [ ] **Initialize Node project**
  ```bash
  npm init -y
  ```

- [ ] **Install dependencies**
  ```bash
  npm install express axios dotenv
  ```

- [ ] **Copy template file**
  ```bash
  # Copy backend-api-template.js to app.js
  cp ../backend-api-template.js app.js
  ```

- [ ] **Create .env file**
  ```bash
  # Copy template and customize
  cp ../backend-env-template.txt .env
  ```

### Phase 2: Provider Setup (15-30 minutes)

Choose ONE provider and complete its setup:

#### Option A: Gupshup (⭐ Recommended)

- [ ] Sign up at https://www.gupshup.io/developer/dashboard
- [ ] Create account and verify email
- [ ] Navigate to "API Keys" section
- [ ] Copy API Key and paste in .env:
  ```
  WHATSAPP_PROVIDER=gupshup
  GUPSHUP_API_KEY=your-api-key-here
  ```
- [ ] Verify phone number 8700060182 is registered
- [ ] Test API key works (curl test below)

#### Option B: Twilio

- [ ] Sign up at https://www.twilio.com/console
- [ ] Create account and verify
- [ ] Get Account SID and Auth Token
- [ ] Purchase WhatsApp-enabled number
- [ ] Update .env:
  ```
  WHATSAPP_PROVIDER=twilio
  TWILIO_ACCOUNT_SID=AC123...
  TWILIO_AUTH_TOKEN=token...
  TWILIO_WHATSAPP_NUMBER=+1234567890
  ```

#### Option C: Meta Official API

- [ ] Create WhatsApp Business Account
- [ ] Submit business verification
- [ ] Apply for official API access
- [ ] Wait for Meta approval (1-7 days)
- [ ] Get API credentials

### Phase 3: Backend Configuration (15 minutes)

- [ ] **Edit .env file with your values:**
  ```
  NODE_ENV=development
  PORT=3000
  
  WHATSAPP_PROVIDER=gupshup          # Or: twilio
  GUPSHUP_API_KEY=your-key-here
  
  API_VERIFICATION_TOKEN=sk_8700060182_your_secret_token_64_chars_min
  BUSINESS_PHONE=8700060182
  BUSINESS_EMAIL=admin@aarzah.com
  
  RATE_LIMIT_MAX_OTP=5
  RATE_LIMIT_WINDOW_MINUTES=60
  ```

- [ ] **Generate secure API token** (if needed)
  ```bash
  # Generate random 64-character token
  # Use: sk_8700060182_$(openssl rand -hex 32)
  ```

- [ ] **Create .gitignore file**
  ```
  .env
  node_modules/
  logs/
  .DS_Store
  ```

- [ ] **Verify app.js has correct provider logic**
  - [ ] Gupshup: `async function sendViaGupshup(phone, message)`
  - [ ] Twilio: `async function sendViaTwilio(phone, message)`

### Phase 4: Local Testing (15 minutes)

- [ ] **Start backend server**
  ```bash
  node app.js
  # Should print: "Aarzah WhatsApp API running on http://localhost:3000"
  ```

- [ ] **Test health endpoint**
  ```bash
  curl http://localhost:3000/health
  # Should return: {"status":"ok","service":"Aarzah WhatsApp API",...}
  ```

- [ ] **Test OTP sending**
  ```bash
  curl -X POST http://localhost:3000/api/send-otp \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer sk_8700060182_your_token" \
    -d '{"phone":"9876543210","otp":"123456"}'
  # Should return: {"success":true,"phone":"+919876543210",...}
  ```

- [ ] **Check logs for errors**
  - [ ] No error messages
  - [ ] Confirm message was sent
  - [ ] Provider returns message ID

- [ ] **Test from browser**
  - [ ] Open index.html
  - [ ] Go to login page
  - [ ] Enter test phone: 9876543210
  - [ ] Click "Send OTP"
  - [ ] Verify: 
    - Backend logs show request received
    - WhatsApp message received on phone
    - OTP code displayed

---

## Frontend Integration Checklist

### Phase 5: Update Frontend (10 minutes)

- [ ] **Replace WhatsApp integration script**
  - [ ] Remove old: `<!-- <script src="whatsapp-integration.js"></script> -->`
  - [ ] Add new: `<script src="whatsapp-integration-with-backend.js"></script>`
  - In all pages: login.html, checkout.html, admin.html

- [ ] **Configure API URL in frontend**
  - [ ] For local testing: `WHATSAPP_API_CONFIG.baseUrl = 'http://localhost:3000';`
  - [ ] For production: `WHATSAPP_API_CONFIG.baseUrl = 'https://api.aarzah.com';`

- [ ] **Update API tokens**
  - [ ] Match token in frontend to .env WHATSAPP_API_CONFIG.verificationToken
  - [ ] Ensure token is 64 characters minimum

- [ ] **Test frontend OTP flow**
  - [ ] Open login.html in browser
  - [ ] Enter phone: 9876543210
  - [ ] Click "Send OTP"
  - [ ] Check:
    - [ ] No JavaScript errors in console
    - [ ] "Sending OTP..." button state shows
    - [ ] Success message appears
    - [ ] WhatsApp message received
    - [ ] OTP input field becomes visible

### Phase 6: End-to-End Testing (20 minutes)

- [ ] **Test Login Flow**
  - [ ] Click "Send OTP" on login.html
  - [ ] Receive WhatsApp message with 6-digit OTP
  - [ ] Enter OTP in verification field
  - [ ] Verify "OTP Verified!" message appears
  - [ ] Redirected to home page as logged-in user

- [ ] **Test Checkout Flow**
  - [ ] Add items to cart (index.html)
  - [ ] Go to checkout.html
  - [ ] Fill order details
  - [ ] Make test payment (Razorpay test card: 4111 1111 1111 1111)
  - [ ] Verify:
    - [ ] Payment success message
    - [ ] Receive payment confirmation WhatsApp
    - [ ] Receive order confirmation WhatsApp
    - [ ] Order appears in order tracking
    - [ ] Email confirmation sent (if configured)

- [ ] **Test Admin Features**
  - [ ] Login to admin.html
  - [ ] View orders list
  - [ ] Update order status
  - [ ] Verify status change notification sent via WhatsApp

- [ ] **Test Error Handling**
  - [ ] Invalid phone number: Should show error
  - [ ] Invalid OTP: Should show "attempts remaining"
  - [ ] Network error: Backend down should show fallback message
  - [ ] Rate limit: 6th OTP too soon should show "wait 1 hour"

---

## Deployment Checklist

### Phase 7: Pre-Production Preparation (30 minutes)

- [ ] **Security review**
  - [ ] Remove all test/debug logs from code
  - [ ] Ensure API tokens are NOT in source code
  - [ ] Check .gitignore includes .env
  - [ ] Review error messages (don't expose sensitive info)

- [ ] **Performance optimization**
  - [ ] Test with 100 concurrent requests
  - [ ] Verify response time < 2 seconds
  - [ ] Check memory usage < 500MB
  - [ ] Enable gzip compression (if applicable)

- [ ] **Update configuration for production**
  - [ ] Set NODE_ENV=production
  - [ ] Change API_VERIFICATION_TOKEN to new random value
  - [ ] Update CORS_ORIGIN to production domain
  - [ ] Increase RATE_LIMIT_WINDOW_MINUTES if needed

- [ ] **Database setup (if using MongoDB)**
  - [ ] Create MongoDB Atlas cluster
  - [ ] Set up user credentials
  - [ ] Update MONGODB_URI in .env
  - [ ] Create indices for performance

- [ ] **Monitoring setup**
  - [ ] Install PM2: `npm install -g pm2`
  - [ ] Create PM2 ecosystem.config.js
  - [ ] Set up error notifications
  - [ ] Configure log rotation

### Phase 8: Deploy to Hosting (Varies)

**Choose your platform:**

#### Option 1: Heroku (Easiest)
- [ ] Install Heroku CLI
- [ ] Create Procfile with: `web: node app.js`
- [ ] Commit all code to git
- [ ] Create Heroku app: `heroku create aarzah-api`
- [ ] Set environment variables:
  ```bash
  heroku config:set API_VERIFICATION_TOKEN=sk_...
  heroku config:set GUPSHUP_API_KEY=...
  heroku config:set NODE_ENV=production
  ```
- [ ] Deploy: `git push heroku main`
- [ ] Check logs: `heroku logs --tail`
- [ ] Test health: `curl https://aarzah-api.herokuapp.com/health`

#### Option 2: DigitalOcean App Platform
- [ ] Create DigitalOcean account
- [ ] Create new App
- [ ] Connect GitHub repository
- [ ] Set environment variables in dashboard
- [ ] Deploy automatically
- [ ] Get domain: api.aarzah.com

#### Option 3: AWS (EC2 + PM2)
- [ ] Launch EC2 instance (t3.micro for starter)
- [ ] SSH into instance
- [ ] Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
- [ ] Clone code: `git clone ...`
- [ ] Install dependencies: `npm install`
- [ ] Create PM2 start: `pm2 start app.js --name aarzah-api`
- [ ] Set up Nginx reverse proxy
- [ ] Configure SSL with Let's Encrypt

#### Option 4: DigitalOcean Droplet + PM2
- [ ] Create $5/month droplet (Ubuntu 22.04)
- [ ] SSH into droplet
- [ ] Run setup script:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  npm install -g pm2
  ```
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Create .env file
- [ ] Start with PM2
- [ ] Add to crontab for auto-restart

### Phase 9: Production Verification (15 minutes)

- [ ] **Test production endpoints**
  ```bash
  curl https://api.aarzah.com/health
  # Should respond with 200 status
  ```

- [ ] **Test OTP from production**
  - [ ] Open https://aarzah.com/login.html
  - [ ] Send OTP to test phone
  - [ ] Verify WhatsApp message received
  - [ ] Verify order confirmation flow works

- [ ] **Set up alerts**
  - [ ] Email on errors
  - [ ] Slack notification on crash
  - [ ] Uptime monitoring (Uptimemonitor.com)

- [ ] **Update frontend domain**
  - [ ] Change `WHATSAPP_API_CONFIG.baseUrl` to production
  - [ ] Update verification token to production value
  - [ ] Rebuild and deploy frontend

- [ ] **Test full production flow**
  - [ ] Complete checkout with real payment
  - [ ] Receive all notifications
  - [ ] Verify order status updates
  - [ ] Check admin panel updates

---

## Post-Deployment Checklist

### Phase 10: Monitoring & Maintenance (Ongoing)

- [ ] **Daily checks**
  - [ ] Check server is running: `pm2 status`
  - [ ] Check error logs for issues
  - [ ] Verify OTP delivery rate (should be 99%+)
  - [ ] Monitor API response times

- [ ] **Weekly checks**
  - [ ] Review log files
  - [ ] Check API quota usage with provider
  - [ ] Verify cost is within budget
  - [ ] Check for failed messages

- [ ] **Monthly checks**
  - [ ] Update dependencies (npm update)
  - [ ] Security audit
  - [ ] Cost review
  - [ ] Performance optimization

- [ ] **Set up backups**
  - [ ] Backup environment variables
  - [ ] Backup message logs (if using database)
  - [ ] Backup SSL certificates

- [ ] **Document operational procedures**
  - [ ] How to restart backend
  - [ ] How to troubleshoot issues
  - [ ] How to scale if needed
  - [ ] Escalation contacts

---

## Rollback Plan

If something goes wrong in production:

### Immediate (Stop the Bleeding)
```bash
# Stop backend to prevent more errors
pm2 stop aarzah-api

# Update frontend to disable WhatsApp temporarily
# Replace API call with alert: "Service temporarily unavailable"
```

### Short-term (Restore Service)
```bash
# Fix the issue locally
# Test thoroughly
# Redeploy

pm2 start aarzah-api
npm update  # Get latest patches
git pull origin main
pm2 restart aarzah-api
```

### Long-term (Prevention)
- Add unit tests
- Set up staging environment
- Implement blue-green deployment
- Add API versioning

---

## Success Criteria

- ✅ Backend running on production domain at port 443 (HTTPS)
- ✅ All OTPs delivered within 10 seconds
- ✅ 99%+ message delivery success rate
- ✅ Zero unhandled errors in logs
- ✅ All users receive WhatsApp notifications
- ✅ No sensitive data leaked in logs
- ✅ Cost tracking and budgeting in place
- ✅ Monitoring alerts configured
- ✅ Team trained on operations

---

## Health Check Script

Run this to verify everything is working:

```bash
#!/bin/bash

echo "Aarzah WhatsApp Integration - Health Check"
echo "=========================================="

# Check backend is running
echo "1. Backend Health..."
curl -s http://api.aarzah.com/health | grep "status" && echo "✅ Backend OK" || echo "❌ Backend FAILED"

# Check OTP API
echo "2. OTP Endpoint..."
curl -s -X POST http://api.aarzah.com/api/send-otp \
  -H "Authorization: Bearer sk_..." \
  -d '{"phone":"9876543210","otp":"123456"}' | grep "success" && echo "✅ OTP OK" || echo "❌ OTP FAILED"

# Check provider connection
echo "3. WhatsApp Provider..."
# Specific check depends on provider

# Check SSL certificate
echo "4. SSL Certificate..."
curl -I https://api.aarzah.com | grep "HTTP" && echo "✅ SSL OK" || echo "❌ SSL FAILED"

# Check response times
echo "5. Response Time..."
time curl -s http://api.aarzah.com/health > /dev/null

echo "=========================================="
echo "Health check complete!"
```

---

## Support Contacts

- **Gupshup Support**: https://www.gupshup.io/support
- **Twilio Support**: https://www.twilio.com/help
- **DigitalOcean Support**: support@digitalocean.com
- **Your Team**: [Contact info here]

---

## Documentation Links

- Backend Implementation: [BACKEND-IMPLEMENTATION-GUIDE.md](BACKEND-IMPLEMENTATION-GUIDE.md)
- Provider Setup: [WHATSAPP-API-SETUP.md](WHATSAPP-API-SETUP.md)
- Frontend Integration: [whatsapp-integration-with-backend.js](whatsapp-integration-with-backend.js)
- API Template: [backend-api-template.js](backend-api-template.js)
- Config Template: [backend-env-template.txt](backend-env-template.txt)

---

**Status**: ✅ Ready for Deployment
**Last Updated**: January 2024
**Next Step**: Start Phase 1 - Environment Setup

---

## Quick Start Command (Copy & Paste)

```bash
# Setup backend in 5 minutes
mkdir aarzah-backend && cd aarzah-backend
npm init -y
npm install express axios dotenv
cp ../backend-api-template.js app.js
cp ../backend-env-template.txt .env

# Edit .env with your provider keys
# nano .env

# Start!
node app.js

# In another terminal, test
curl http://localhost:3000/health
```

🚀 **You're ready to go!**
