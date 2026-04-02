import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

/**
 * Root App Component
 *
 * Structure:
 *  - ToastProvider wraps CartProvider (notifications available everywhere)
 *  - CartProvider: Global cart state + API layer for all components
 *  - Navbar: Fixed header with branding and navigation
 *  - CartSidebar: Slide-out panel (controlled by state)
 *  - Routes: SPA routing (/, /cart, /admin) handled client-side
 *
 * The app requires only one HTML entry point (index.html).
 * All navigation is client-side via React Router.
 */
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <ToastProvider>
      <CartProvider>
        <div className="app">
          <Navbar onCartClick={() => setCartOpen(true)} />
          <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<StorePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
