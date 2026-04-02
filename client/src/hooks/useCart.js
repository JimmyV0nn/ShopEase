import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook that provides access to the global cart state and CRUD actions.
 * Must be used within a <CartProvider> tree.
 *
 * Returns:
 *  - items: Array of { product, quantity } cart items
 *  - loading: boolean, true while fetching/mutating
 *  - error: string or null, last error message
 *  - addItem(productId, quantity): Promise — add/increment product in cart
 *  - updateItem(productId, quantity): Promise — update quantity
 *  - removeItem(productId): Promise — remove single item
 *  - clearAll(): Promise — empty entire cart
 *  - itemCount: Computed property, total number of items
 *  - subtotal: Computed property, sum of (price × quantity)
 *
 * @throws {Error} if used outside <CartProvider>
 */
const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

export default useCart;
