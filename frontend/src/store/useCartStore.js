import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      totalPrice: 0,
      lastUpdated: null,

      // Add course to cart
      addToCart: (course) => {
        set((state) => {
          // Check if course already exists in cart
          const existingItem = state.cartItems.find((item) => item.id === course.id);
          
          if (existingItem) {
            // If exists, just return current state
            return state;
          }

          const updatedCart = [...state.cartItems, course];
          const newTotal = updatedCart.reduce((sum, item) => sum + (item.price || 0), 0);

          return {
            cartItems: updatedCart,
            totalPrice: newTotal,
            lastUpdated: new Date().toISOString(),
          };
        });
      },

      // Remove course from cart
      removeFromCart: (courseId) => {
        set((state) => {
          const updatedCart = state.cartItems.filter((item) => item.id !== courseId);
          const newTotal = updatedCart.reduce((sum, item) => sum + (item.price || 0), 0);

          return {
            cartItems: updatedCart,
            totalPrice: newTotal,
            lastUpdated: new Date().toISOString(),
          };
        });
      },

      // Update cart item quantity (for future use)
      updateCartItemQuantity: (courseId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeFromCart(courseId);
          }
          const updatedCart = state.cartItems.map((item) =>
            item.id === courseId ? { ...item, quantity } : item
          );
          const newTotal = updatedCart.reduce((sum, item) => sum + (item.price || 0), 0);
          
          return {
            cartItems: updatedCart,
            totalPrice: newTotal,
            lastUpdated: new Date().toISOString(),
          };
        });
      },

      // Clear cart
      clearCart: () => {
        set({
          cartItems: [],
          totalPrice: 0,
          lastUpdated: new Date().toISOString(),
        });
      },

      // Get cart item count
      getCartItemCount: () => {
        return get().cartItems.length;
      },

      // Get total price
      getTotalPrice: () => {
        return get().totalPrice;
      },

      // Check if course is in cart
      isInCart: (courseId) => {
        return get().cartItems.some((item) => item.id === courseId);
      },

      // Get cart state for debugging
      getCartState: () => {
        const state = get();
        return {
          itemCount: state.cartItems.length,
          totalPrice: state.totalPrice,
          lastUpdated: state.lastUpdated,
          items: state.cartItems.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
          })),
        };
      },
    }),
    {
      name: 'trainermentors-cart-store', // localStorage key with unique name
      storage: createJSONStorage(() => localStorage),
      version: 1, // For future migrations
      partialize: (state) => ({
        cartItems: state.cartItems,
        totalPrice: state.totalPrice,
        lastUpdated: state.lastUpdated,
      }), // Only persist what's necessary
    }
  )
);

export default useCartStore;
