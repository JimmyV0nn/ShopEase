import React, { useCallback, useState } from 'react';
import useCart from '../hooks/useCart';
import useToast from '../hooks/useToast';

/**
 * A single row in the cart showing product info, quantity controls, and remove.
 * Quantity changes are debounced to avoid hammering the API on rapid clicks.
 */
export default function CartItem({ item, onConfirmRemove }) {
  const { updateItem } = useCart();
  const { showToast } = useToast();
  const [updating, setUpdating] = useState(false);

  const product = item.product;
  if (!product) return null;

  const handleQuantityChange = useCallback(
    async (newQty) => {
      if (newQty < 1) {
        // Delegate to parent so it can show a confirm dialog
        onConfirmRemove(product._id, product.name);
        return;
      }
      if (newQty > product.stock) {
        showToast(`Only ${product.stock} in stock`, 'error');
        return;
      }
      setUpdating(true);
      try {
        await updateItem(product._id, newQty);
      } catch (err) {
        showToast(err.response?.data?.message || 'Update failed', 'error');
      } finally {
        setUpdating(false);
      }
    },
    [product, updateItem, onConfirmRemove, showToast]
  );

  const lineTotal = (Math.round(product.price * item.quantity * 100) / 100).toFixed(2);

  return (
    <div className={`cart-item${updating ? ' cart-item--updating' : ''}`}>
      <img
        src={product.imageUrl || `https://picsum.photos/seed/${product._id}/80/80`}
        alt={product.name}
        className="cart-item__image"
      />

      <div className="cart-item__info">
        <p className="cart-item__name">{product.name}</p>
        <p className="cart-item__price">${product.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item__qty">
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          aria-label="Decrease quantity"
          disabled={updating}
        >
          −
        </button>
        <span className="qty-value" aria-label={`Quantity: ${item.quantity}`}>
          {item.quantity}
        </span>
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Increase quantity"
          disabled={updating || item.quantity >= product.stock}
        >
          +
        </button>
      </div>

      <div className="cart-item__total">${lineTotal}</div>

      <button
        className="cart-item__remove"
        onClick={() => onConfirmRemove(product._id, product.name)}
        aria-label={`Remove ${product.name} from cart`}
        disabled={updating}
      >
        ✕
      </button>
    </div>
  );
}
