import React, { createContext, useCallback, useEffect, useReducer, useRef } from 'react';
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  checkout as checkoutApi,
} from '../api/cartApi';

// ─── Session ID ───────────────────────────────────────────────────────────────
// Generate a UUID-style ID on first visit and persist it in localStorage.
const getSessionId = () => {
  try {
    let id = localStorage.getItem('shopease_session');
    if (!id) {
      // Use crypto.randomUUID if available, otherwise fallback to simple UUID generation
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else {
        // Fallback UUID v4 generator for older browsers
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      localStorage.setItem('shopease_session', id);
    }
    return id;
  } catch (e) {
    // Fallback if localStorage is unavailable (e.g., private browsing mode)
    console.warn('localStorage not available, using ephemeral session ID');
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
export const CartContext = createContext(null);

// ─── Reducer ──────────────────────────────────────────────────────────────────
/**
 * Cart state reducer handles three state transitions:
 *  - SET_LOADING: Toggle loading flag during async operations
 *  - SET_CART: Update items from server response, clear errors
 *  - SET_ERROR: Store error message from failed operations
 *
 * The server always returns the full, authoritative cart object on mutations.
 * This ensures client state stays in sync even under concurrent updates.
 */
const initialState = {
  items: [],       // Array of { product, quantity } objects
  loading: false,  // True while fetching/mutating
  error: null,     // Error message from last failed operation
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      // Toggle loading state during async operations (fetch, add, update, remove)
      return { ...state, loading: action.payload };
    
    case 'SET_CART':
      // Update entire items array from server response and clear any previous errors
      // Server always returns the authoritative cart state after mutations
      return { ...state, items: action.payload?.items ?? [], loading: false, error: null };
    
    case 'SET_ERROR':
      // Store error message for UI display (e.g., in a toast notification)
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const sessionId = useRef(getSessionId()).current;

  // Load cart on mount
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    fetchCart(sessionId)
      .then((cart) => dispatch({ type: 'SET_CART', payload: cart }))
      .catch((err) =>
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to load cart' })
      );
  }, [sessionId]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      try {
        const cart = await addItemToCart(sessionId, productId, quantity);
        dispatch({ type: 'SET_CART', payload: cart });
        return cart;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to add item' });
        throw error;
      }
    },
    [sessionId]
  );

  const updateItem = useCallback(
    async (productId, quantity) => {
      try {
        const cart = await updateCartItem(sessionId, productId, quantity);
        dispatch({ type: 'SET_CART', payload: cart });
        return cart;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update item' });
        throw error;
      }
    },
    [sessionId]
  );

  const removeItem = useCallback(
    async (productId) => {
      try {
        const cart = await removeCartItem(sessionId, productId);
        dispatch({ type: 'SET_CART', payload: cart });
        return cart;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to remove item' });
        throw error;
      }
    },
    [sessionId]
  );

  const clearAll = useCallback(async () => {
    try {
      const cart = await clearCartApi(sessionId);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to clear cart' });
      throw error;
    }
  }, [sessionId]);

  const checkout = useCallback(async () => {
    try {
      const cart = await checkoutApi(sessionId);
      dispatch({ type: 'SET_CART', payload: cart });
      return cart;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Checkout failed' });
      throw error;
    }
  }, [sessionId]);

  // Derived values (use Math.round to avoid floating-point precision issues with currency)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = Math.round(
    state.items.reduce(
      (sum, i) => sum + (i.product?.price ?? 0) * i.quantity * 100,
      0
    )
  ) / 100;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        loading: state.loading,
        error: state.error,
        itemCount,
        subtotal,
        sessionId,
        addItem,
        updateItem,
        removeItem,
        clearAll,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
