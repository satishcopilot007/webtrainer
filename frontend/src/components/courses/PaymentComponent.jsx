import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const PaymentComponent = ({ course }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCartStore();
  const [isAdded, setIsAdded] = React.useState(isInCart(course?.id));

  const handleAddToCart = () => {
    if (course) {
      addToCart(course);
      setIsAdded(true);
      // Show success message briefly
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleCheckout = () => {
    if (course) {
      addToCart(course);
      navigate('/checkout');
    }
  };

  if (!course) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-purple-200"
    >
      <div className="space-y-6">
        {/* Price Display */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Course Fee</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-purple-600">₹{course.price}</span>
            {course.original_price && course.original_price > course.price && (
              <span className="text-lg text-gray-500 line-through">₹{course.original_price}</span>
            )}
          </div>
          {course.original_price && course.original_price > course.price && (
            <p className="text-green-600 font-semibold mt-2">
              Save ₹{(course.original_price - course.price).toFixed(2)}
            </p>
          )}
        </div>

        {/* Course Details */}
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Duration:</span>
            <span className="font-semibold text-gray-800">{course.duration_weeks} weeks</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Level:</span>
            <span className="font-semibold text-gray-800 capitalize">{course.level}</span>
          </div>
          {course.rating && (
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Rating:</span>
              <span className="font-semibold text-yellow-500">
                ⭐ {course.rating} ({course.total_reviews} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className={`w-full font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              isAdded
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <FaCheck /> Added to Cart!
              </>
            ) : (
              <>
                <FaShoppingCart /> Add to Cart
              </>
            )}
          </motion.button>

          {/* Checkout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            Buy Now
          </motion.button>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-4 space-y-2">
          <p className="font-semibold text-gray-800 text-sm mb-3">What's Included:</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700">Lifetime access to course materials</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700">Expert-led training sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700">Certificate of completion</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700">24/7 support & doubt clarification</span>
            </div>
            {course.placement_support && (
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">Placement assistance</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center text-xs text-green-700">
          🔒 Secure payment powered by Razorpay
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentComponent;
