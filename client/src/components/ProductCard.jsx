import React, { useState } from 'react';
import useCart from '../hooks/useCart';
import useToast from '../hooks/useToast';

/**
 * Product Card Component — Tile in the Store Grid
 *
 * Displays:
 *  - Product image (fallback to generated placeholder)
 *  - Category badge
 *  - Name, description
 *  - Price, stock status (in, low, out)
 *  - "Add to Cart" button (disabled if out of stock)
 *
 * Behavior:
 *  - Button shows loading state while API request is in-flight
 *  - Shows "Added!" success state for 2 seconds after successful add
 *  - Toast notification provides feedback (success or error)
 *  - Stock status color-codes: green (in), orange (low ≤10), red (out)
 */
const DEFAULT_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23e5e7eb%22/%3E%3Ctext%20x%3D%22200%22%20y%3D%22155%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%23666%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C/text%3E%3C/svg%3E';

const fallbackImages = {
  'Wireless Noise-Cancelling Headphones': '/image/headphones.jpg',
  'Smart Watch Series 5': '/image/watch.webp',
  'Portable Bluetooth Speaker': '/image/speaker.webp',
  'Classic Oxford Shirt': '/image/shirt.jpg',
  'Slim Fit Chino Trousers': '/image/trousers.jpg',
  'Lightweight Running Jacket': '/image/jacket.jpg',
  'Clean Code: A Handbook': '/image/clean-code.jpg',
  'Designing Data-Intensive Applications': '/image/data-intensive.jpeg',
  'Stainless Steel Kettle': '/image/kettle.avif',
  'Bamboo Cutting Board Set': '/image/cutting-board.webp',
  'Yoga Mat Pro': '/image/yoga-mat.webp',
  'Adjustable Dumbbell Set': '/image/dumbbell.webp',
};

const generatePlaceholderImage = (name) => {
  const shortName = name.length > 24 ? `${name.slice(0, 24)}...` : name;
  const encoded = encodeURIComponent(shortName);

  return `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%235d8df1%22/%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%2368e0ca%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22url(%23g)%22/%3E%3Ctext%20x%3D%22200%22%20y%3D%22130%22%20text-anchor%3D%22middle%22%20font-family%3D%22Segoe%20UI%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%23fff%22%20font-weight%3D%22700%22%3E${encoded}%3C/text%3E%3Ctext%20x%3D%22200%22%20y%3D%22170%22%20text-anchor%3D%22middle%22%20font-family%3D%22Segoe%20UI%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2213%22%20fill%3D%22%23fff%22%3ELocal%20fallback%3C/text%3E%3C/svg%3E`;
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'added'
  const initialImage =
    product.imageUrl || fallbackImages[product.name] || generatePlaceholderImage(product.name);
  const [imgSrc, setImgSrc] = useState(initialImage);
  const timerRef = React.useRef(null);

  // Clean up timeout on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleImageError = () => {
    // If custom URL fails, fall back to mapped local path, then generated SVG.
    const fallbackPath = fallbackImages[product.name];
    const nextSrc =
      imgSrc === fallbackPath
        ? generatePlaceholderImage(product.name)
        : fallbackPath || generatePlaceholderImage(product.name);

    if (imgSrc !== nextSrc) {
      setImgSrc(nextSrc);
    }
  };

  const handleAddToCart = async () => {
    // Prevent multiple concurrent add requests
    if (status !== 'idle') return;
    
    setStatus('loading');
    try {
      await addItem(product._id, 1);
      setStatus('added');
      showToast(`"${product.name}" added to cart`, 'success');
      
      // Reset button after 2s to allow user to see success feedback
      timerRef.current = setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item';
      showToast(msg, 'error');
      setStatus('idle');
    }
  };

  // Determine stock status for visual indicator
  const stockStatus =
    product.stock === 0
      ? 'out'
      : product.stock <= 10
      ? 'low'
      : 'in';

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={imgSrc}
          onError={handleImageError}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        <span className="product-card__category">{product.category}</span>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          <span className={`product-card__stock product-card__stock--${stockStatus}`}>
            {stockStatus === 'out'
              ? 'Out of stock'
              : stockStatus === 'low'
              ? `Only ${product.stock} left`
              : 'In stock'}
          </span>
        </div>

        <button
          className={`btn btn--primary product-card__btn product-card__btn--${status}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || status === 'loading'}
          aria-label={`Add ${product.name} to cart`}
        >
          {status === 'loading' && <span className="btn__spinner" aria-hidden="true" />}
          {status === 'added' ? '✓ Added!' : status === 'loading' ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
