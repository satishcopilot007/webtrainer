import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaCheck, FaTimes, FaCreditCard, FaQrcode, FaCopy } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import useCartStore from '../store/useCartStore';
import { createPaymentOrder, initiateRazorpayPayment } from '../services/paymentService';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:8000';

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

  // Payment method tabs: 'razorpay' | 'upi'
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // UPI QR state
  const [upiQrData, setUpiQrData] = useState(null);
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [upiConfirmed, setUpiConfirmed] = useState(false);

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

  // Load UPI QR when switching to UPI tab
  const handleShowUpiQr = async () => {
    if (!validateForm()) return;
    setUpiLoading(true);
    setError('');
    try {
      const finalAmount = totalPrice * 1.18;
      const response = await fetch(`${API_BASE_URL}/api/payment/upi-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(finalAmount.toFixed(2)),
          name: userName,
          note: `Course Payment - ${validCartItems.map(c => c.title).join(', ').slice(0, 60)}`
        })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setUpiQrData(data.data);
    } catch (err) {
      setError(err.message || 'Could not load UPI QR. Please use Razorpay instead.');
    } finally {
      setUpiLoading(false);
    }
  };

  const handleCopyUpiId = () => {
    if (upiQrData?.upi_id) {
      navigator.clipboard.writeText(upiQrData.upi_id);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    }
  };

  const handleUpiConfirm = () => {
    setShowSuccessModal(true);
    setPaymentData({
      orderId: `UPI-${Date.now()}`,
      paymentId: 'Pending verification',
      courses: validCartItems.map(c => c.title).join(', ')
    });
    clearCart();
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

          {/* Price Summary + Payment */}
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

              {/* Payment Method Tabs */}
              <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
                <button
                  onClick={() => { setPaymentMethod('razorpay'); setUpiQrData(null); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                    paymentMethod === 'razorpay'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaCreditCard size={14} /> Card / UPI
                </button>
                <button
                  onClick={() => { setPaymentMethod('upi'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                    paymentMethod === 'upi'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaQrcode size={14} /> UPI QR
                </button>
              </div>

              {/* Razorpay Button */}
              {paymentMethod === 'razorpay' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </motion.button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    💳 Secured by Razorpay · Cards, UPI, Netbanking, Wallets
                  </p>
                </>
              )}

              {/* UPI QR Tab */}
              {paymentMethod === 'upi' && (
                <div className="text-center">
                  {!upiQrData && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShowUpiQr}
                      disabled={upiLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                    >
                      {upiLoading ? 'Generating QR...' : 'Generate UPI QR Code'}
                    </motion.button>
                  )}

                  {upiQrData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      {/* QR Code */}
                      <div className="flex justify-center">
                        <div className="p-3 bg-white border-2 border-purple-200 rounded-xl inline-block shadow-md">
                          <QRCodeSVG
                            value={upiQrData.upi_string}
                            size={180}
                            level="H"
                            includeMargin={false}
                          />
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="bg-purple-50 rounded-lg py-2 px-3">
                        <p className="text-xs text-gray-500">Scan & Pay</p>
                        <p className="text-xl font-bold text-purple-700">₹{upiQrData.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">to {upiQrData.merchant_name}</p>
                      </div>

                      {/* UPI ID with copy */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                        <span className="text-sm text-gray-700 flex-1 font-mono truncate">{upiQrData.upi_id}</span>
                        <button
                          onClick={handleCopyUpiId}
                          className="text-purple-600 hover:text-purple-800 flex-shrink-0"
                          title="Copy UPI ID"
                        >
                          {upiCopied ? <FaCheck size={14} className="text-green-500" /> : <FaCopy size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Works with GPay, PhonePe, Paytm, BHIM & all UPI apps</p>

                      {/* Confirm after payment */}
                      <div className="border-t pt-4">
                        <p className="text-xs text-gray-500 mb-3">After completing payment in your UPI app, click below:</p>
                        <button
                          onClick={handleUpiConfirm}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
                        >
                          ✅ I have completed the payment
                        </button>
                        <button
                          onClick={() => { setUpiQrData(null); setUpiConfirmed(false); }}
                          className="w-full mt-2 text-gray-500 hover:text-gray-700 text-xs py-1"
                        >
                          Regenerate QR
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
