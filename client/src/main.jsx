import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

/**
 * React Application Entry Point
 *
 * Initializes:
 *  - React 18 root mount (target: #root in index.html)
 *  - BrowserRouter: enables client-side routing for SPA
 *  - App: root component that sets up context providers and routes
 *  - Global stylesheet: CSS custom properties, layout, component styles
 *
 * React.StrictMode: enabled for development only
 *  - Highlights potential issues (unsafe lifecycle methods, legacy APIs)
 *  - Double-invokes effects in dev to catch side effect bugs
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
