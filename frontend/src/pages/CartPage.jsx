import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaShoppingCart, FaLock } from 'react-icons/fa';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, removeFromCart, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveItem = (courseId) => {
    removeFromCart(courseId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the entire cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  // Filter out invalid/malformed cart items (missing title or price)
  const validCartItems = cartItems.filter(item => item.title && item.title.trim() && (item.price || item.price === 0));

  if (validCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/courses')}
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-12 font-semibold"
          >
            <FaArrowLeft /> Back to Courses
          </motion.button>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white rounded-2xl p-12 shadow-lg"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-purple-100 rounded-full p-8">
                <FaShoppingCart className="text-5xl text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Add some courses to get started on your learning journey!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/courses')}
              className="inline-block bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-lg transition-all"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                  Shopping Cart ({validCartItems.length} {validCartItems.length === 1 ? 'item' : 'items'})
                </h1>
                {validCartItems.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                  >
                    <FaTrash /> Clear Cart
                  </motion.button>
                )}
              </div>

              {/* Cart Items List */}
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {validCartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      {/* Course Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-400 to-blue-500">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <FaShoppingCart className="text-3xl" />
                          </div>
                        )}
                      </div>

                      {/* Course Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description || item.short_description || 'Professional course'}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            Duration: <strong>{item.duration_weeks} weeks</strong>
                          </span>
                          {item.level && (
                            <span className="text-gray-600">
                              Level: <strong className="capitalize">{item.level}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">₹{item.price}</p>
                          {item.original_price && item.original_price > item.price && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{item.original_price}
                            </p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Summary Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Number of Courses</span>
                  <span className="font-semibold">{cartItems.length}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-8 p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                  <span className="text-3xl font-bold text-purple-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 mb-4"
              >
                <FaLock className="text-sm" />
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </motion.button>

              <button
                onClick={() => navigate('/courses')}
                className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>

              {/* Benefits */}
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Secure checkout with Razorpay</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Lifetime course access</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>24/7 support included</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Certificate of completion</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
