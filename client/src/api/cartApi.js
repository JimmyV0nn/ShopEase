import axios from 'axios';

// Create axios instance with default timeout of 10 seconds
const axiosInstance = axios.create({
  timeout: 10000,
});

const BASE = '/api/cart';

/**
 * Fetch cart by session ID. Returns an empty cart object if none exists.
 * @param {string} sessionId
 */
export const fetchCart = (sessionId) =>
  axiosInstance.get(`${BASE}/${sessionId}`).then((r) => r.data.data);

/**
 * Add an item to the cart (upserts quantity if product already in cart).
 * @param {string} sessionId
 * @param {string} productId
 * @param {number} quantity
 */
export const addItemToCart = (sessionId, productId, quantity = 1) =>
  axiosInstance
    .post(`${BASE}/${sessionId}/items`, { productId, quantity })
    .then((r) => r.data.data);

/**
 * Update the quantity of an item already in the cart.
 * @param {string} sessionId
 * @param {string} productId
 * @param {number} quantity
 */
export const updateCartItem = (sessionId, productId, quantity) =>
  axiosInstance
    .put(`${BASE}/${sessionId}/items/${productId}`, { quantity })
    .then((r) => r.data.data);

/**
 * Remove a single item from the cart.
 * @param {string} sessionId
 * @param {string} productId
 */
export const removeCartItem = (sessionId, productId) =>
  axiosInstance.delete(`${BASE}/${sessionId}/items/${productId}`).then((r) => r.data.data);

/**
 * Clear all items from the cart (without deducting stock).
 * @param {string} sessionId
 */
export const clearCart = (sessionId) =>
  axiosInstance.delete(`${BASE}/${sessionId}`).then((r) => r.data.data);

/**
 * Complete purchase: deduct stock from all items and clear cart.
 * This is the proper checkout that updates product inventory.
 * @param {string} sessionId
 */
export const checkout = (sessionId) =>
  axiosInstance.post(`${BASE}/${sessionId}/checkout`).then((r) => r.data.data);
