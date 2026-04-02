import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useToast from '../hooks/useToast';
import CartItem from './CartItem';
import ConfirmModal from './ConfirmModal';

/**
 * Slide-in Shopping Cart Sidebar
 *
 * Features:
 *  - Triggered by Navbar cart icon; opens as overlay panel
 *  - Quick cart overview: items, subtotal, shipping, total
 *  - Adjust quantities and remove items on-the-fly
 *  - "Clear All" button empties cart with confirmation
 *  - Link to full /cart page for detailed order review
 *
 * Interactions:
 *  - Closes on Escape key (keyboard accessibility)
 *  - Closes on backdrop click (standard UX)
 *  - Prevents body scroll when open (modal-like behavior)
 *  - Confirmation dialog for destructive actions (remove, clear)
 *
 * Props:
 *  - isOpen: boolean, controls visibility
 *  - onClose: callback to hide sidebar
 */
export default function CartSidebar({ isOpen, onClose }) {
  const { items, subtotal, itemCount, loading, error, removeItem, clearAll } = useCart();
  const { showToast } = useToast();
  const [confirm, setConfirm] = useState(null); // { productId, name }

  // Show error toast when cart loading fails
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  // Close on Escape key (keyboard shortcut)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open (modal-like)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleRemoveConfirm = (productId, name) => {
    setConfirm({ productId, name });
  };

  const handleRemove = async () => {
    try {
      await removeItem(confirm.productId);
      showToast(`"${confirm.name}" removed`, 'info');
    } catch {
      showToast('Failed to remove item', 'error');
    }
    setConfirm(null);
  };

  const handleClearAll = async () => {
    try {
      await clearAll();
      showToast('Cart cleared', 'info');
    } catch {
      showToast('Failed to clear cart', 'error');
    }
  };

  const SHIPPING_THRESHOLD = 50;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sidebar-backdrop${isOpen ? ' sidebar-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`cart-sidebar${isOpen ? ' cart-sidebar--open' : ''}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="cart-sidebar__header">
          <h2 className="cart-sidebar__title">
            Cart {itemCount > 0 && <span className="cart-sidebar__count">({itemCount})</span>}
          </h2>
          <button className="cart-sidebar__close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-sidebar__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <p className="cart-empty__text">Your cart is empty</p>
              <button className="btn btn--primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-sidebar__items">
                {items.map((item) => (
                  <CartItem
                    key={item.product?._id}
                    item={item}
                    onConfirmRemove={handleRemoveConfirm}
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="cart-sidebar__summary">
                {shipping > 0 && (
                  <p className="cart-sidebar__shipping-note">
                    Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="cart-sidebar__row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-sidebar__row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="cart-sidebar__row cart-sidebar__row--total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="cart-sidebar__actions">
                <Link
                  to="/cart"
                  className="btn btn--primary btn--full"
                  onClick={onClose}
                >
                  View Full Cart
                </Link>
                <button
                  className="btn btn--ghost btn--full"
                  onClick={handleClearAll}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Confirm remove modal */}
      {confirm && (
        <ConfirmModal
          message={`Remove "${confirm.name}" from your cart?`}
          onConfirm={handleRemove}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
