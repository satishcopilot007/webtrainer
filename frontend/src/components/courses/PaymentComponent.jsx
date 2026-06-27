import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const PaymentComponent = ({ course }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCartStore();
  const [isAdded, setIsAdded] = React.useState(isInCart(course?.id));
  const [selectedTier, setSelectedTier] = React.useState('basic');

  // Price tiers from Excel
  const USD_TO_INR = 83;
  const priceTiers = course?.price_tiers_usd || {};
  const durationTiers = course?.duration_tiers_hours || {};
  const hasMultipleTiers = priceTiers.basic && priceTiers.intermediate && priceTiers.advanced;

  // Get selected tier price
  const getSelectedPrice = () => {
    if (hasMultipleTiers) {
      return Math.round((priceTiers[selectedTier] || priceTiers.basic) * USD_TO_INR);
    }
    return Number(course.effective_price || course.discounted_price || course.discount_price || course.price || 0);
  };

  const handleAddToCart = () => {
    if (course) {
      const cartItem = {
        ...course,
        selected_tier: selectedTier,
        price: getSelectedPrice(),
        duration: hasMultipleTiers ? `${durationTiers[selectedTier]} hours` : course.duration
      };
      addToCart(cartItem);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleCheckout = () => {
    if (course) {
      const cartItem = {
        ...course,
        selected_tier: selectedTier,
        price: getSelectedPrice(),
        duration: hasMultipleTiers ? `${durationTiers[selectedTier]} hours` : course.duration
      };
      addToCart(cartItem);
      navigate('/checkout');
    }
  };

  if (!course) return null;

  const displayPrice = getSelectedPrice();
  const originalPrice = Number(course.original_price || course.price || 0);
  const hasValidPrice = displayPrice > 0;
  const hasSavings = !hasMultipleTiers && hasValidPrice && originalPrice > displayPrice;
  const pricingNote = course.pricing_note || 'Contact for price or drop email to contact@trainermentors.com';
  const durationLabel = hasMultipleTiers ? `${durationTiers[selectedTier]} hours` : (course.duration || (course.duration_weeks ? `${course.duration_weeks} weeks` : 'Flexible'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-purple-200"
    >
      <div className="space-y-6">
        {/* Price Display */}
        <div className="text-center">
          {hasMultipleTiers ? (
            <div className="space-y-3">
              <p className="text-gray-600 text-sm font-medium">Choose Your Level</p>
              <div className="grid grid-cols-1 gap-2">
                {/* Basic */}
                <div
                  onClick={() => setSelectedTier('basic')}
                  className={`cursor-pointer rounded-lg p-3 flex items-center justify-between transition-all ${
                    selectedTier === 'basic'
                      ? 'bg-green-50 border-2 border-green-500 ring-2 ring-green-200'
                      : 'bg-white border-2 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedTier === 'basic' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {selectedTier === 'basic' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-green-700">Basic</span>
                      <p className="text-xs text-gray-500">{durationTiers.basic || '—'} hours</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">₹{Math.round(priceTiers.basic * USD_TO_INR).toLocaleString('en-IN')}</span>
                </div>
                {/* Intermediate */}
                <div
                  onClick={() => setSelectedTier('intermediate')}
                  className={`cursor-pointer rounded-lg p-3 flex items-center justify-between relative transition-all ${
                    selectedTier === 'intermediate'
                      ? 'bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-200'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="absolute -top-2 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">POPULAR</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedTier === 'intermediate' ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedTier === 'intermediate' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-blue-700">Intermediate</span>
                      <p className="text-xs text-gray-500">{durationTiers.intermediate || '—'} hours</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">₹{Math.round(priceTiers.intermediate * USD_TO_INR).toLocaleString('en-IN')}</span>
                </div>
                {/* Advanced */}
                <div
                  onClick={() => setSelectedTier('advanced')}
                  className={`cursor-pointer rounded-lg p-3 flex items-center justify-between transition-all ${
                    selectedTier === 'advanced'
                      ? 'bg-purple-50 border-2 border-purple-500 ring-2 ring-purple-200'
                      : 'bg-white border-2 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedTier === 'advanced' ? 'border-purple-500' : 'border-gray-300'
                    }`}>
                      {selectedTier === 'advanced' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-purple-700">Advanced</span>
                      <p className="text-xs text-gray-500">{durationTiers.advanced || '—'} hours</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-purple-600">₹{Math.round(priceTiers.advanced * USD_TO_INR).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-2">Course Fee</p>
              {hasValidPrice ? (
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-purple-600">₹{displayPrice.toLocaleString('en-IN')}</span>
                  {hasSavings && (
                    <span className="text-lg text-gray-500 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              ) : (
                <div className="text-lg font-bold text-purple-600 text-center">{pricingNote}</div>
              )}
              {hasSavings && (
                <p className="text-green-600 font-semibold mt-2">
                  Save ₹{(originalPrice - displayPrice).toFixed(2)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Course Details */}
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Duration:</span>
            <span className="font-semibold text-gray-800">{durationLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Level:</span>
            <span className="font-semibold text-gray-800 capitalize">{hasMultipleTiers ? selectedTier : course.level}</span>
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
