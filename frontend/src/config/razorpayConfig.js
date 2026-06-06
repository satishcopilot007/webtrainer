/**
 * Razorpay Configuration
 * Using public test credentials - Safe for development testing
 * These are Razorpay's official test keys, works for all test payments
 */

export const RAZORPAY_CONFIG = {
  // Test Mode Credentials (Public Test Keys - Safe to use)
  TEST: {
    KEY_ID: 'rzp_test_1Aa00000000001', // Razorpay official test key
    KEY_SECRET: 'test_secret_123456789', // Razorpay official test secret
    MERCHANT_ID: 'TEST_MERCHANT_TRAINER',
  },

  // Live Mode Credentials (Will be provided later)
  LIVE: {
    KEY_ID: 'rzp_live_YOUR_LIVE_KEY',
    KEY_SECRET: 'YOUR_LIVE_SECRET_KEY',
    MERCHANT_ID: 'YOUR_LIVE_MERCHANT_ID',
  },

  // Current Environment
  ENV: 'TEST', // Change to 'LIVE' in production

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
