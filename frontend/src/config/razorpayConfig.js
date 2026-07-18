/**
 * Razorpay Configuration
 * Using public test credentials - Safe for development testing
 * These are Razorpay's official test keys, works for all test payments
 */

export const RAZORPAY_CONFIG = {
  // Test Mode Credentials
  TEST: {
    KEY_ID: import.meta.env.VITE_RAZORPAY_TEST_KEY_ID || 'rzp_test_1Aa00000000001',
    MERCHANT_ID: 'TEST_MERCHANT_TRAINER',
  },

  // Live Mode Credentials — set VITE_RAZORPAY_KEY_ID in .env.local for production
  LIVE: {
    KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    MERCHANT_ID: import.meta.env.VITE_RAZORPAY_MERCHANT_ID || '',
  },

  // Auto-detect mode: if VITE_RAZORPAY_KEY_ID starts with rzp_live_, use LIVE
  get ENV() {
    const liveKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    return liveKey.startsWith('rzp_live_') ? 'LIVE' : 'TEST';
  },

  // Get active configuration
  getConfig() {
    return this.ENV === 'LIVE' ? this.LIVE : this.TEST;
  },

  // Get Key ID
  getKeyId() {
    return this.getConfig().KEY_ID;
  },

  // Get Merchant ID
  getMerchantId() {
    return this.getConfig().MERCHANT_ID;
  },

  // Update credentials (for production use)
  updateCredentials(keyId, merchantId, keySecret = null) {
    if (this.ENV === 'LIVE') {
      this.LIVE.KEY_ID = keyId;
      this.LIVE.MERCHANT_ID = merchantId;
      if (keySecret) {
        this.LIVE.KEY_SECRET = keySecret;
      }
    } else {
      this.TEST.KEY_ID = keyId;
      this.TEST.MERCHANT_ID = merchantId;
      if (keySecret) {
        this.TEST.KEY_SECRET = keySecret;
      }
    }
  },
};

export default RAZORPAY_CONFIG;
