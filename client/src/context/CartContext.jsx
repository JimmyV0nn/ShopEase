import React, { createContext, useCallback, useEffect, useReducer, useRef } from 'react';
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  checkout as checkoutApi,
} from '../api/cartApi';

// Get or create a session ID so the cart persists across page refreshes
const getSessionId = () => {
  try {
    let id = localStorage.getItem('shopease_session');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
          });
      localStorage.setItem('shopease_session', id);
    }
    return id;
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
};

export const CartContext = createContext(null);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { ...state, items: action.payload?.items ?? [], loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

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
