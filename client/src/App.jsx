import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

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
