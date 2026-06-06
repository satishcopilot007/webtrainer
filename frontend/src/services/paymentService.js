import RAZORPAY_CONFIG from '../config/razorpayConfig';

/**
 * Payment Service for Razorpay Integration
 */

const API_BASE_URL = 'http://localhost:8000';

// Helper function to add timeout to fetch requests
const fetchWithTimeout = (url, options = {}, timeout = 15000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout)
    )
  ]);
};

// Create order on backend
export const createPaymentOrder = async (cartItems, userEmail, userName, userPhone) => {
  try {
    const payload = {
      courses: cartItems.map((course) => ({
        id: course.id,
        title: course.title,
        price: course.price,
      })),
      amount: cartItems.reduce((sum, item) => sum + (item.price || 0), 0),
      email: userEmail,
      name: userName,
      phone: userPhone,
    };

    console.log('Sending order creation request:', payload);

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/payment/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
      15000 // 15 second timeout
    );

    console.log('Order response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Order creation error response:', errorData);
      throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Order creation successful:', data);
    return data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    // Check if it's a timeout error
    if (error.message.includes('timeout')) {
      throw new Error('Payment service is taking too long. Please check your connection and try again.');
    }
    throw new Error(`Order creation failed: ${error.message}`);
  }
};

// Initialize Razorpay Payment
export const initiateRazorpayPayment = async (
  orderId,
  amount,
  email,
  name,
  phone,
  onSuccess,
  onError
) => {
  try {
    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      throw new Error('Razorpay script not loaded');
    }

    const razorpayOptions = {
      key: RAZORPAY_CONFIG.getKeyId(),
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      order_id: orderId,
      name: 'TrainerMentors',
      description: 'Course Payment',
      image: 'https://via.placeholder.com/200x200?text=TrainerMentors',
      prefill: {
        name: name || '',
        email: email || '',
        contact: phone || '',
      },
      notes: {
        merchant_id: RAZORPAY_CONFIG.getMerchantId(),
      },
      handler: async (response) => {
        try {
          // Verify payment signature on backend
          const verifyResponse = await verifyPaymentSignature(response, orderId);
          if (verifyResponse.success) {
            onSuccess(response, verifyResponse);
          } else {
            onError('Payment verification failed');
          }
        } catch (error) {
          onError(error.message);
        }
      },
      modal: {
        ondismiss: () => {
          onError('Payment cancelled by user');
        },
      },
      theme: {
        color: '#7c3aed', // Purple color for theme
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    console.error('Error initiating Razorpay payment:', error);
    onError(error.message);
  }
};

// Verify payment signature
export const verifyPaymentSignature = async (paymentResponse, orderId) => {
  try {
    const payload = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      order_id: orderId,
    };

    console.log('Verifying payment signature:', payload);

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/payment/verify-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
      10000 // 10 second timeout
    );

    console.log('Verification response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Verification error response:', errorData);
      throw new Error(`Payment verification failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Payment verification successful:', data);
    return data;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    throw new Error(`Verification error: ${error.message}`);
  }
};

// Get payment status
export const getPaymentStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

export default {
  createPaymentOrder,
  initiateRazorpayPayment,
  verifyPaymentSignature,
  getPaymentStatus,
};
