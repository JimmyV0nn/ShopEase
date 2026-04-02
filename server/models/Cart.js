import mongoose from 'mongoose';

/**
 * Cart Schema
 *
 * Represents a shopping cart identified by a unique sessionId (UUID from client localStorage).
 * Session-based carts allow guest users to maintain cart state across page reloads
 * without requiring authentication.
 *
 * Design:
 *  - One cart document per sessionId (unique, indexed)
 *  - items[] embeds quantity + reference to Product
 *  - Server always returns full cart after mutations for client-side sync
 *
 * Usage:
 *  - Created automatically on first POST /api/cart/:sessionId/items
 *  - Queried with .populate('items.product') to hydrate product details
 *  - Deleted when user clears cart or during admin cleanup
 *
 * Constraints:
 *  - Within items[], quantity >= 1 (no zero-quantity items stored)
 *  - No duplicate products in items[] (enforced by addItem logic)
 *  - sessionId is required and unique
 */
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,  // Index for fast lookups by sessionId
    },
    items: [cartItemSchema],  // Array of cart items (product + quantity)
  },
  { timestamps: true }  // Auto-managed createdAt, updatedAt
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
