import { useEffect } from 'react';
import { FaRupiah } from 'react-icons/fa';

/**
 * Razorpay Payment Integration Component
 * Handles payment processing for course enrollments
 * 
 * Usage:
 * <RazorpayPayment 
 *   courseId="course-123"
 *   courseTitle="React Mastery"
 *   amount={999}
 *   onSuccess={handlePaymentSuccess}
 *   onError={handlePaymentError}
 * />
 */

const RazorpayPayment = ({
  courseId,
  courseTitle,
  amount, // Amount in INR
  studentEmail,
  studentName,
  onSuccess,
  onError,
}) => {
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    // Razorpay configuration
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_YOUR_KEY_ID', // Replace with your Razorpay Key ID
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: 'INR',
      name: 'TrainerMentors',
      description: `Payment for ${courseTitle}`,
      image: '/logo.png', // Your logo URL

      prefill: {
        name: studentName || '',
        email: studentEmail || '',
        contact: '', // Optional: pre-fill contact number
      },

      notes: {
        courseId: courseId,
        courseTitle: courseTitle,
      },

      theme: {
        color: '#667eea', // Primary brand color
      },

      handler: function (response) {
        // Payment successful
        if (onSuccess) {
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            courseId: courseId,
            amount: amount,
            courseTitle: courseTitle,
          });
        }
      },

      modal: {
        ondismiss: function () {
          // User closed payment modal
          if (onError) {
            onError({
              message: 'Payment modal closed by user',
              code: 'USER_CANCELLED',
            });
          }
        },
      },

      retry: {
        enabled: true,
        max_retries: 3,
      },

      timeout: 900, // 15 minutes timeout
    };

    // Create Razorpay instance and open payment gateway
    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        // Payment failed
        if (onError) {
          onError({
            message: response.error.description,
            code: response.error.code,
            reason: response.error.reason,
          });
        }
      });

      rzp.open();
    } else {
      console.error('Razorpay script not loaded');
      if (onError) {
        onError({
          message: 'Payment gateway not available',
          code: 'RAZORPAY_NOT_LOADED',
        });
      }
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
      type="button"
    >
      <FaRupiah className="text-lg" />
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayPayment;
