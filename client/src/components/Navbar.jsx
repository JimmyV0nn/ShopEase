import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCart from '../hooks/useCart';

/**
 * Fixed top navigation bar with:
 *  - Brand logo / name
 *  - Nav links (Shop, Cart, Admin)
 *  - Cart icon with animated badge
 */
export default function Navbar({ onCartClick }) {
  const { itemCount } = useCart();
  const location = useLocation();
  const prevCount = useRef(itemCount);
  const [pulse, setPulse] = useState(false);

  // Trigger badge pulse animation whenever item count increases
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 400);
      return () => clearTimeout(t);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`nav__link${location.pathname === to ? ' nav__link--active' : ''}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
            <path
              d="M16 10a4 4 0 01-8 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          ShopEase
        </Link>

        {/* Navigation */}
        <nav className="nav" aria-label="Main navigation">
          {navLink('/', 'Shop')}
          {navLink('/cart', 'My Cart')}
          {navLink('/admin', 'Admin')}
        </nav>

        {/* Cart button */}
        <button
          className="cart-btn"
          onClick={onCartClick}
          aria-label={`Open cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="9" cy="21" r="1" fill="currentColor" />
            <circle cx="20" cy="21" r="1" fill="currentColor" />
            <path
              d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19.4a2 2 0 001.97-1.67L23 6H6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {itemCount > 0 && (
            <span className={`cart-btn__badge${pulse ? ' cart-btn__badge--pulse' : ''}`}>
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
