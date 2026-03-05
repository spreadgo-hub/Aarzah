// WhatsApp Integration Module for Aarzah
// Requires backend service with WhatsApp API credentials

const whatsappConfig = {
  // Business WhatsApp Number
  businessNumber: '8700060182',
  
  // API Base URL (your backend endpoint)
  apiBaseUrl: 'https://your-backend.com/api', // Replace with your backend
  
  // API Key (store securely in backend, never expose in frontend)
  // This is just a placeholder - implement proper authentication
  
  // Message Templates
  templates: {
    otpMessage: (phone, otp) => `
Hello! Your Aarzah OTP is: ${otp}

Valid for 10 minutes. Do not share this OTP.

Aarzah - Everyday Ethnic Wear
https://aarzah.com
    `.trim(),

    orderConfirmation: (orderData) => `
🎉 Order Confirmed!

Order ID: ${orderData.orderId}
Amount: ₹${orderData.totalAmount}
Items: ${orderData.itemCount}

Your order will be delivered in 3-5 business days.

Track your order: https://aarzah.com/order-tracking.html?id=${orderData.orderId}

Aarzah - Everyday Ethnic Wear
    `.trim(),

    paymentConfirmation: (orderData) => `
✅ Payment Received!

Order ID: ${orderData.orderId}
Amount: ₹${orderData.totalAmount}
Transaction ID: ${orderData.transactionId}

Your order is being processed and will ship shortly.

Aarzah - Everyday Ethnic Wear
    `.trim(),

    shippingNotification: (orderData) => `
📦 Order Shipped!

Order ID: ${orderData.orderId}
Tracking: ${orderData.trackingNumber}

Expected Delivery: ${orderData.deliveryDate}

Track: https://aarzah.com/order-tracking.html?id=${orderData.orderId}

Aarzah - Everyday Ethnic Wear
    `.trim(),

    returnInitiated: (orderData) => `
🔄 Return Initiated

Order ID: ${orderData.orderId}
Return ID: ${orderData.returnId}

Your return has been initiated. We'll arrange pickup within 2 business days.

https://aarzah.com/returns.html

Aarzah - Everyday Ethnic Wear
    `.trim()
  }
};

// Send WhatsApp Message
async function sendWhatsAppMessage(phone, message, messageType = 'general') {
  try {
    // Validate phone number
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      console.error('Invalid phone number');
      return false;
    }

    // Prepare request to backend
    const response = await fetch(`${whatsappConfig.apiBaseUrl}/send-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // Replace with actual API key
      },
      body: JSON.stringify({
        toPhone: cleanPhone.slice(-10), // Last 10 digits for Indian numbers
        message: message,
        messageType: messageType,
        fromPhone: whatsappConfig.businessNumber,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('WhatsApp message sent:', data);
    return true;

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

// Send OTP via WhatsApp
async function sendOTPViaWhatsApp(phone) {
  try {
    // Generate 6-digit OTP
    const otp = String(Math.floor(Math.random() * 900000) + 100000);
    
    // Store OTP in localStorage with expiry (10 minutes)
    const otpData = {
      otp: otp,
      phone: phone,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000),
      attempts: 0
    };
    localStorage.setItem('aarzah_otp', JSON.stringify(otpData));

    // Prepare WhatsApp message
    const message = whatsappConfig.templates.otpMessage(phone, otp);

    // Send via WhatsApp API
    const sent = await sendWhatsAppMessage(phone, message, 'otp');
    
    if (sent) {
      console.log(`OTP sent to WhatsApp: ${phone}`);
      return {
        success: true,
        phone: phone,
        message: 'OTP sent to your WhatsApp'
      };
    } else {
      throw new Error('Failed to send OTP');
    }

  } catch (error) {
    console.error('Error sending OTP via WhatsApp:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Verify OTP
function verifyOTPCode(phone, enteredOtp) {
  try {
    const otpData = JSON.parse(localStorage.getItem('aarzah_otp') || '{}');

    // Check if OTP exists
    if (!otpData.otp) {
      return { valid: false, error: 'No OTP found' };
    }

    // Check if expired
    if (Date.now() > otpData.expiresAt) {
      localStorage.removeItem('aarzah_otp');
      return { valid: false, error: 'OTP expired' };
    }

    // Check if phone matches
    if (otpData.phone !== phone) {
      return { valid: false, error: 'Phone number mismatch' };
    }

    // Check attempts (max 5)
    if (otpData.attempts >= 5) {
      localStorage.removeItem('aarzah_otp');
      return { valid: false, error: 'Too many attempts' };
    }

    // Verify OTP
    if (otpData.otp === enteredOtp) {
      localStorage.removeItem('aarzah_otp');
      return { valid: true };
    } else {
      otpData.attempts++;
      localStorage.setItem('aarzah_otp', JSON.stringify(otpData));
      return { valid: false, error: 'Invalid OTP' };
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { valid: false, error: 'Verification error' };
  }
}

// Send Order Confirmation via WhatsApp
async function sendOrderConfirmationWhatsApp(orderData, phone) {
  try {
    const message = whatsappConfig.templates.orderConfirmation(orderData);
    return await sendWhatsAppMessage(phone, message, 'order_confirmation');
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return false;
  }
}

// Send Payment Confirmation via WhatsApp
async function sendPaymentConfirmationWhatsApp(orderData, phone) {
  try {
    const message = whatsappConfig.templates.paymentConfirmation(orderData);
    return await sendWhatsAppMessage(phone, message, 'payment_confirmation');
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
    return false;
  }
}

// Send Shipping Notification via WhatsApp
async function sendShippingNotificationWhatsApp(orderData, phone) {
  try {
    const message = whatsappConfig.templates.shippingNotification(orderData);
    return await sendWhatsAppMessage(phone, message, 'shipping_notification');
  } catch (error) {
    console.error('Error sending shipping notification:', error);
    return false;
  }
}

// Send Return Initiated via WhatsApp
async function sendReturnInitiatedWhatsApp(orderData, phone) {
  try {
    const message = whatsappConfig.templates.returnInitiated(orderData);
    return await sendWhatsAppMessage(phone, message, 'return_initiated');
  } catch (error) {
    console.error('Error sending return notification:', error);
    return false;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sendWhatsAppMessage,
    sendOTPViaWhatsApp,
    verifyOTPCode,
    sendOrderConfirmationWhatsApp,
    sendPaymentConfirmationWhatsApp,
    sendShippingNotificationWhatsApp,
    sendReturnInitiatedWhatsApp,
    whatsappConfig
  };
}
