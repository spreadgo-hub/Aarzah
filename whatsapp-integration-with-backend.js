/**
 * Frontend WhatsApp Integration
 * Updated version that calls backend API
 * 
 * This file replaces whatsapp-integration.js with backend API calls
 * Include in HTML: <script src="whatsapp-integration-with-backend.js"></script>
 */

// ========== API CONFIGURATION ==========
const WHATSAPP_API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'https://api.aarzah.com', // Update for your domain
  verificationToken: 'your-api-token-here', // Store securely
  timeout: 30000 // 30 seconds
};

// ========== WHATSAPP MESSAGE UTILS ==========

class WhatsAppAPI {
  /**
   * Make API request to backend
   */
  static async makeRequest(endpoint, data) {
    try {
      const response = await fetch(`${WHATSAPP_API_CONFIG.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_API_CONFIG.verificationToken}`
        },
        body: JSON.stringify(data),
        timeout: WHATSAPP_API_CONFIG.timeout
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API Error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Send OTP via WhatsApp
   */
  static async sendOTPViaWhatsApp(phone, otp) {
    try {
      // Validate phone
      if (!/^\d{10}$/.test(phone)) {
        throw new Error('Invalid phone number. Use 10-digit format.');
      }

      console.log(`📱 Sending OTP to WhatsApp: +91${phone}`);

      const response = await this.makeRequest('/api/send-otp', {
        phone: phone,
        otp: otp
      });

      console.log('✅ OTP sent successfully:', response);

      return {
        success: true,
        messageId: response.messageId,
        phone: response.phone,
        timestamp: response.timestamp
      };

    } catch (error) {
      console.error('❌ Failed to send OTP:', error);
      
      // Fallback: Show OTP in UI for testing
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Development Mode: OTP would be sent via WhatsApp in production');
        console.warn(`📋 Test OTP: ${otp}`);
        
        return {
          success: true,
          isDevelopment: true,
          testOtp: otp,
          phone: phone
        };
      }

      throw error;
    }
  }

  /**
   * Send Order Confirmation via WhatsApp
   */
  static async sendOrderConfirmation(phone, orderData) {
    try {
      console.log(`📦 Sending order confirmation to +91${phone}`);

      const response = await this.makeRequest('/api/send-order-confirmation', {
        phone: phone,
        orderData: orderData
      });

      console.log('✅ Order confirmation sent:', response);

      return response;

    } catch (error) {
      console.error('❌ Failed to send order confirmation:', error);
      throw error;
    }
  }

  /**
   * Send Payment Confirmation via WhatsApp
   */
  static async sendPaymentConfirmation(phone, orderData) {
    try {
      console.log(`💳 Sending payment confirmation to +91${phone}`);

      const response = await this.makeRequest('/api/send-payment-confirmation', {
        phone: phone,
        orderData: orderData
      });

      console.log('✅ Payment confirmation sent:', response);

      return response;

    } catch (error) {
      console.error('❌ Failed to send payment confirmation:', error);
      throw error;
    }
  }

  /**
   * Send Shipping Notification via WhatsApp
   */
  static async sendShippingNotification(phone, orderData) {
    try {
      console.log(`🚚 Sending shipping notification to +91${phone}`);

      const response = await this.makeRequest('/api/send-shipping-notification', {
        phone: phone,
        orderData: orderData
      });

      console.log('✅ Shipping notification sent:', response);

      return response;

    } catch (error) {
      console.error('❌ Failed to send shipping notification:', error);
      throw error;
    }
  }

  /**
   * Send Return Initiated Notification
   */
  static async sendReturnInitiated(phone, orderData) {
    try {
      console.log(`↩️ Sending return initiated notification to +91${phone}`);

      const response = await this.makeRequest('/api/send-return-initiated', {
        phone: phone,
        orderData: orderData
      });

      console.log('✅ Return notification sent:', response);

      return response;

    } catch (error) {
      console.error('❌ Failed to send return notification:', error);
      throw error;
    }
  }

  /**
   * Verify OTP Code
   */
  static verifyOTPCode(phone, enteredOtp, storedOtpData) {
    try {
      // Check if OTP has expired
      const currentTime = Date.now();
      const expiryTime = storedOtpData.expiresAt;

      if (currentTime > expiryTime) {
        throw new Error('OTP has expired. Request a new one.');
      }

      // Check attempts
      if (storedOtpData.attempts >= 5) {
        throw new Error('Maximum verification attempts exceeded. Request a new OTP.');
      }

      // Verify OTP code
      if (enteredOtp !== storedOtpData.code) {
        // Increment attempts
        storedOtpData.attempts++;
        const key = `aarzah_otp_${phone}`;
        localStorage.setItem(key, JSON.stringify(storedOtpData));

        const remaining = 5 - storedOtpData.attempts;
        throw new Error(`Invalid OTP. ${remaining} attempts remaining.`);
      }

      console.log('✅ OTP verified successfully');

      return {
        success: true,
        message: 'OTP verified successfully'
      };

    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      throw error;
    }
  }
}

// ========== USAGE EXAMPLES ==========

/**
 * Example: Login Page OTP Sending
 * 
 * Call this from your login form's sendOTP() function:
 * 
 * async function sendOTPToWhatsApp(phone) {
 *   try {
 *     const otp = generateOTP(); // Already defined
 *     const result = await WhatsAppAPI.sendOTPViaWhatsApp(phone, otp);
 *     
 *     if (result.success) {
 *       // Store OTP locally for verification
 *       const otpData = {
 *         code: otp,
 *         phone: phone,
 *         createdAt: Date.now(),
 *         expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
 *         attempts: 0
 *       };
 *       localStorage.setItem(`aarzah_otp_${phone}`, JSON.stringify(otpData));
 *       
 *       showAlert('✅ OTP sent to WhatsApp!');
 *     }
 *   } catch (error) {
 *     showAlert(`❌ Failed to send OTP: ${error.message}`);
 *   }
 * }
 */

/**
 * Example: After Payment Success
 * 
 * async function handlePaymentSuccess(response) {
 *   const orderData = {
 *     orderId: generateOrderId(),
 *     amount: cartTotal,
 *     items: getCartItems(),
 *     transactionId: response.razorpay_payment_id,
 *     timestamp: new Date().toISOString()
 *   };
 *   
 *   // Send confirmation to customer
 *   try {
 *     await WhatsAppAPI.sendPaymentConfirmation(customerPhone, orderData);
 *     await WhatsAppAPI.sendOrderConfirmation(customerPhone, orderData);
 *     showAlert('✅ Order confirmation sent to WhatsApp');
 *   } catch (error) {
 *     console.error('Failed to send notifications:', error);
 *     // Still allow order completion even if notification fails
 *   }
 * }
 */

/**
 * Example: Order Status Update
 * 
 * async function updateOrderStatus(orderId, status, customerPhone) {
 *   const orderData = getOrderData(orderId);
 *   
 *   if (status === 'shipped') {
 *     await WhatsAppAPI.sendShippingNotification(customerPhone, orderData);
 *   } else if (status === 'return_initiated') {
 *     await WhatsAppAPI.sendReturnInitiated(customerPhone, orderData);
 *   }
 * }
 */

// ========== EXPORT FOR USE ==========

// If using ES6 modules:
// export { WhatsAppAPI };

// If using vanilla JavaScript, WhatsAppAPI is global and accessible as:
// WhatsAppAPI.sendOTPViaWhatsApp(phone, otp)
// WhatsAppAPI.sendOrderConfirmation(phone, orderData)
// etc.
