import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  checkout,
} from '../controllers/cartController.js';

const router = express.Router();

/**
 * Shopping Cart Routes
 * Each cart is identified by a unique sessionId (UUID from client localStorage).
 * Session-based carts survive page refreshes and browser closures.
 *
 * GET    /api/cart/:sessionId                    Retrieve cart (populated with product details)
 * POST   /api/cart/:sessionId/items              Add item (or increment quantity if already present)
 * PUT    /api/cart/:sessionId/items/:productId   Update item quantity
 * DELETE /api/cart/:sessionId/items/:productId   Remove single item from cart
 * DELETE /api/cart/:sessionId                    Clear all items from cart
 * POST   /api/cart/:sessionId/checkout           Complete purchase (deduct stock + clear cart)
 *
 * Request Body Examples:
 *  POST /items:   { productId: "507f...", quantity: 2 }
 *  PUT /items:    { quantity: 3 }
 *  POST /checkout: {} (no body required)
 *
 * Rules:
 *  - Adding a product already in cart increments its quantity (no duplicates)
 *  - Quantity changes are validated against available stock
 *  - Server always returns the full authoritative cart state after mutations
 *  - Checkout validates stock and deducts quantities, then clears cart
 */

router.route('/:sessionId').get(getCart).delete(clearCart);
router.route('/:sessionId/items').post(addItem);
router.route('/:sessionId/items/:productId').put(updateItem).delete(removeItem);
router.route('/:sessionId/checkout').post(checkout);

export default router;
