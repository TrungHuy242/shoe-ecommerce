import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart count from API
  const fetchCartCount = async () => {
    try {
      const response = await api.get('cart-items/');
      const items = Array.isArray(response.data) ? response.data : (response.data.results || []);
      const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalQuantity);
      setCartItems(items);
      return totalQuantity;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
      setCartItems([]);
      return 0;
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      // Get or create cart
      const cartRes = await api.get('carts/');
      const carts = Array.isArray(cartRes.data) ? cartRes.data : (cartRes.data.results || []);
      let cartId;
      
      if (carts.length > 0) {
        cartId = carts[0].id;
      } else {
        // Create new cart
        const userId = getCurrentUserId();
        const newCartRes = await api.post('carts/', { user: userId });
        cartId = newCartRes.data.id;
      }

      // Add item to cart
      await api.post('cart-items/', {
        cart: cartId,
        product: productId,
        quantity: quantity
      });

      // Refresh cart count
      await fetchCartCount();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`cart-items/${cartItemId}/`);
      await fetchCartCount();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  // Update item quantity in cart
  const updateCartItemQuantity = async (cartItemId, quantity) => {
    try {
      await api.patch(`cart-items/${cartItemId}/`, { quantity });
      await fetchCartCount();
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
  };

  // Get current user ID from token
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.user_id || decoded.userId || null;
    } catch (e) {
      return null;
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchCartCount();
  }, []);

  const value = {
    cartCount,
    cartItems,
    fetchCartCount,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};