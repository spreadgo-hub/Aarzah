/* ================================================
   AARZAH - CENTRALIZED CONFIGURATION FILE
   All business settings in one place
   ================================================ */

const AarzahConfig = {
  // ========== BUSINESS INFO ==========
  business: {
    name: 'Aarzah',
    tagline: 'Aapki Aarzoo, hamari pehchaan',
    description: 'Everyday Ethnic Wear',
    website: 'https://aarzah.com',
    email: 'support@aarzah.com'
  },

  // ========== CONTACT INFORMATION ==========
  contact: {
    // IMPORTANT: Update this phone number everywhere
    businessPhone: '8700060182',
    businessPhoneFormatted: '+91 8700060182',
    
    // WhatsApp For Customer Support
    whatsappSupport: '8700060182',
    whatsappSupportURL: 'https://wa.me/918700060182',
    
    // Alternative contact numbers (if any)
    phoneNumbers: {
      main: '8700060182',
      support: '8700060182',
      sales: '8700060182'
    }
  },

  // ========== WHATSAPP API CONFIGURATION ==========
  whatsapp: {
    // Business Phone ID (from Meta/WhatsApp Business API)
    businessPhoneId: 'YOUR_PHONE_ID', // Replace with actual ID
    
    // WhatsApp Business API Version
    apiVersion: 'v18.0',
    
    // WhatsApp API Base URL
    apiUrl: 'https://graph.instagram.com/v18.0',
    
    // Your Business Account ID
    businessAccountId: 'YOUR_ACCOUNT_ID', // Replace with actual ID
    
    // API Access Token (KEEP SECURE - Store in backend only!)
    accessToken: 'YOUR_ACCESS_TOKEN', // Replace with actual token
    
    // Template Names (Pre-approved message templates)
    templates: {
      otp: 'aarzah_otp',
      orderConfirmation: 'aarzah_order_confirmation',
      paymentConfirmation: 'aarzah_payment_confirmation',
      shippingNotification: 'aarzah_shipping_notification',
      returnInitiated: 'aarzah_return_initiated'
    },

    // Message Status Webhook URL
    webhookUrl: 'https://your-backend.com/webhook/whatsapp'
  },

  // ========== RAZORPAY PAYMENT CONFIGURATION ==========
  razorpay: {
    // Test Keys (for development)
    testKeyId: 'rzp_test_1DP5mmOlF5G0m9',
    testKeySecret: 'YOUR_TEST_KEY_SECRET',
    
    // Production Keys (get from Razorpay Dashboard after verification)
    productionKeyId: 'YOUR_PRODUCTION_KEY',
    productionKeySecret: 'YOUR_PRODUCTION_SECRET',
    
    // Current environment
    environment: 'test', // Change to 'production' when ready
    
    // Razorpay Merchant ID
    merchantId: 'YOUR_MERCHANT_ID'
  },

  // ========== SHIPPING CONFIGURATION ==========
  shipping: {
    // Shipping Charges
    standardShipping: 50,
    freeShippingThreshold: 500,
    
    // Delivery Time (in business days)
    deliveryDays: '3-5',
    
    // Shipping Partners (if using APIs)
    partners: {
      partner1: 'Shiprocket',
      partner2: 'Delhivery'
    }
  },

  // ========== CURRENCY & LOCALIZATION ==========
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    dateFormat: 'dd/MM/yyyy HH:mm:ss'
  },

  // ========== ADMIN CREDENTIALS ==========
  admin: {
    email: 'admin@aarzah.com',
    passwordHash: 'admin123', // In production, use bcrypt
    // NOTE: Change password immediately in production!
  },

  // ========== STORAGE KEYS ==========
  storage: {
    prefix: 'aarzah_',
    keys: {
      cart: 'aarzah_cart',
      user: 'aarzah_user',
      otp: 'aarzah_otp',
      orders: 'aarzah_orders',
      coupons: 'aarzah_coupons',
      products: 'aarzah_products',
      addresses: 'aarzah_addresses',
      contactMessages: 'aarzah_contact_messages',
      returnRequests: 'aarzah_return_requests'
    }
  },

  // ========== BRAND COLORS & STYLING ==========
  branding: {
    primaryColor: '#d32f2f', // Aarzah Red
    primaryColorLight: '#f8f5f0',
    textColor: '#333',
    textSecondary: '#666',
    borderColor: '#e0e0e0',
    successColor: '#2e7d32',
    warningColor: '#f57c00',
    errorColor: '#d32f2f',
    
    fonts: {
      primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      secondary: 'Georgia, serif'
    }
  },

  // ========== OTP CONFIGURATION ==========
  otp: {
    length: 6,
    validityMinutes: 10,
    maxAttempts: 5,
    resendWaitSeconds: 60
  },

  // ========== SOCIAL MEDIA LINKS ==========
  social: {
    instagram: {
      url: 'https://www.instagram.com/aarzahofficial/',
      handle: '@aarzahofficial'
    },
    facebook: {
      url: 'https://www.facebook.com/people/Aarzah/61560892677244/',
      handle: 'Aarzah'
    },
    whatsapp: {
      url: 'https://wa.me/918700060182',
      number: '918700060182'
    },
    email: 'support@aarzah.com'
  },

  // ========== CATEGORIES ==========
  categories: [
    { id: 'kurtis', name: 'Kurtis & Kurtas', icon: '👗' },
    { id: 'suits', name: 'Suits & Sets', icon: '👔' },
    { id: 'sarees', name: 'Sarees', icon: '🎀' },
    { id: 'dresses', name: 'Dresses', icon: '👚' }
  ],

  // ========== COUPON CODES ==========
  coupons: [
    { code: 'SAVE20', discount: 20, type: 'percent', minAmount: 500 },
    { code: 'FLAT50', discount: 50, type: 'rupees', minAmount: 300 },
    { code: 'WELCOME10', discount: 10, type: 'percent', minAmount: 0 },
    { code: 'SUMMER15', discount: 15, type: 'percent', minAmount: 500 },
    { code: 'FREESHIP', discount: 50, type: 'rupees', minAmount: 500 }
  ],

  // ========== RETURN POLICY ==========
  returnPolicy: {
    returnsWithinDays: 14,
    refundProcessingDays: '5-7',
    returnShippingFree: true,
    returnReasons: [
      'Defective/Damaged',
      'Size Mismatch',
      'Color Mismatch',
      'Wrong Item Delivered',
      'Changed Mind'
    ]
  }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Get WhatsApp business number for display
 */
function getBusinessPhone() {
  return AarzahConfig.contact.businessPhone;
}

/**
 * Get WhatsApp business number formatted
 */
function getBusinessPhoneFormatted() {
  return '+91' + AarzahConfig.contact.businessPhone;
}

/**
 * Get WhatsApp support URL
 */
function getWhatsAppSupportURL() {
  return `https://wa.me/91${AarzahConfig.contact.whatsappSupport}`;
}

/**
 * Get currency format
 */
function formatCurrency(amount) {
  return AarzahConfig.currency.symbol + amount.toLocaleString('en-IN');
}

/**
 * Get storage key with prefix
 */
function getStorageKey(keyName) {
  return AarzahConfig.storage.keys[keyName] || AarzahConfig.storage.prefix + keyName;
}

/**
 * Log config for debugging (development only)
 */
function logConfig() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Aarzah Config:', AarzahConfig);
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AarzahConfig;
}
