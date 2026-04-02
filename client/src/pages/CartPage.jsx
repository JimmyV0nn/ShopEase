import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useToast from '../hooks/useToast';
import CartItem from '../components/CartItem';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Business Rule: Free shipping over $50
 * Below this threshold, a flat $9.99 shipping fee applies.
 * Shown in the order summary with hint about how much more to free shipping.
 */
const SHIPPING_THRESHOLD = 50;

/**
 * Full-page cart view with order summary and checkout flow.
 *
 * Features:
 *  - Display all items with ability to adjust quantities
 *  - Delete individual items or clear entire cart
 *  - Compute subtotal, shipping, and total
 *  - Show free shipping progress (visual hint if under threshold)
 *  - Complete checkout: deducts stock and clears cart
 */
export default function CartPage() {
  const { items, subtotal, itemCount, loading, error, removeItem, checkout } = useCart();
  const { showToast } = useToast();
  const [confirm, setConfirm] = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Show error if exists
  React.useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleRemoveConfirm = (productId, name) => setConfirm({ productId, name });

  const handleRemove = async (productId, name) => {
    try {
      await removeItem(productId);
      showToast(`"${name}" removed`, 'info');
    } catch {
      showToast('Failed to remove item', 'error');
    }
    setConfirm(null);
  };

  const handleCheckout = async () => {
    // Complete purchase: deduct stock and clear cart
    try {
      await checkout();
      setCheckoutDone(true);
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Checkout failed. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <LoadingSpinner message="Loading cart…" />
      </div>
    );
  }

  if (checkoutDone) {
    return (
      <div className="page-center checkout-success">
        <div className="checkout-success__icon">✓</div>
        <h2>Order Placed!</h2>
        <p>Thank you for your purchase. Your order has been received.</p>
        <Link to="/" className="btn btn--primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-center empty-state">
        <div className="empty-state__icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn--primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Shopping Cart ({itemCount} item{itemCount !== 1 ? 's' : ''})</h1>

      <div className="cart-page__layout">
        {/* Items list */}
        <div className="cart-page__items">
          {/* Column headers */}
          <div className="cart-table-header" aria-hidden="true">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>

          {items.map((item) => (
            <CartItem
              key={item.product?._id}
              item={item}
              onConfirmRemove={handleRemoveConfirm}
            />
          ))}

          <button
            className="btn btn--ghost cart-page__clear"
            onClick={() =>
              setConfirm({ productId: null, name: null, clearAll: true })
            }
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <aside className="cart-page__summary" aria-label="Order summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="free-badge">FREE</span> : `$${shipping.toFixed(2)}`}</span>
          </div>

          {shipping > 0 && (
            <p className="summary-shipping-note">
              Spend ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}

          <div className="summary-divider" />
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="btn btn--primary btn--full summary-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/" className="btn btn--ghost btn--full">
            Continue Shopping
          </Link>
        </aside>
      </div>

      {/* Confirm remove modal */}
      {confirm && (
        <ConfirmModal
          message={
            confirm.clearAll
              ? 'Remove all items from your cart?'
              : `Remove "${confirm.name}" from your cart?`
          }
          confirmLabel={confirm.clearAll ? 'Clear All' : 'Remove'}
          onConfirm={async () => {
            if (confirm.clearAll) {
              try {
                await clearAll();
                showToast('Cart cleared', 'info');
              } catch {
                showToast('Failed to clear cart', 'error');
              }
              setConfirm(null);
            } else {
              await handleRemove(confirm.productId, confirm.name);
            }
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
