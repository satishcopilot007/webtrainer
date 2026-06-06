import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import useCartStore from '../store/useCartStore';
import { createPaymentOrder, initiateRazorpayPayment } from '../services/paymentService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, removeFromCart, clearCart } = useCartStore();

  // Filter out invalid/malformed cart items (missing title or price)
  const validCartItems = cartItems.filter(item => item.title && item.title.trim() && (item.price || item.price === 0));

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const isAuthenticated = !!localStorage.getItem('access_token');
  const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Validate form
  const validateForm = () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!userPhone.trim() || userPhone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (validCartItems.length === 0) {
      setError('Your cart is empty');
      return false;
    }
    return true;
  };

  // Handle payment initiation
  const handlePayment = async () => {
    try {
      setError('');
      setPaymentMessage('');

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setPaymentMessage('Creating payment order...');

      // Create order on backend
      const orderResponse = await createPaymentOrder(validCartItems, userEmail, userName, userPhone);

      if (!orderResponse.success) {
        const errorMsg = orderResponse.message || 'Failed to create order';
        console.error('Order creation failed:', orderResponse);
        throw new Error(errorMsg);
      }

      console.log('Order created successfully:', orderResponse);
      setPaymentMessage('Initializing payment gateway...');

      // Initiate Razorpay payment with tax included
      const finalAmount = totalPrice * 1.18; // Include 18% GST
      console.log('Payment details:', {
        orderId: orderResponse.data.order_id,
        amount: finalAmount,
        email: userEmail,
        name: userName,
        phone: userPhone
      });

      await initiateRazorpayPayment(
        orderResponse.data.order_id,
        finalAmount,
        userEmail,
        userName,
        userPhone,
        (paymentResponse, verifyResponse) => {
          // Payment success
          console.log('Payment successful:', paymentResponse);
          setPaymentData({
            orderId: orderResponse.data.order_id,
            paymentId: paymentResponse.razorpay_payment_id,
            courses: validCartItems.map((c) => c.title).join(', '),
          });
          setShowSuccessModal(true);
          clearCart();
          setLoading(false);
        },
        (errorMsg) => {
          // Payment error
          console.error('Payment error:', errorMsg);
          setError(errorMsg);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Payment error details:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle remove item
  const handleRemoveItem = (courseId) => {
    removeFromCart(courseId);
  };

  if (showSuccessModal && paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your enrollment has been confirmed.</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Order ID:</strong> {paymentData.orderId}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Payment ID:</strong> {paymentData.paymentId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Courses:</strong> {paymentData.courses}
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.button
          onClick={() => navigate('/courses')}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-semibold"
        >
          <FaArrowLeft /> Back to Courses
        </motion.button>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            {validCartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add courses to your cart to get started</p>
                <button
                  onClick={() => navigate('/courses')}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Browse Courses
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items ({validCartItems.length})</h2>

                <div className="space-y-4">
                  {validCartItems.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Duration: {course.duration_weeks} weeks</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-purple-600">₹{course.price}</p>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveItem(course.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <FaTrash size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* User Details Form */}
            {validCartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                    >
                      <FaTimes /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment Message */}
                <AnimatePresence>
                  {paymentMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg"
                    >
                      ℹ️ {paymentMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Price Summary */}
          {validCartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-fit bg-white rounded-2xl shadow-lg p-8 sticky top-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18% GST):</span>
                  <span className="font-semibold">₹{(totalPrice * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
                  <span className="text-purple-600">₹{(totalPrice * 1.18).toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                💳 Secured by Razorpay Payment Gateway
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
