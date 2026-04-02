import React, { createContext, useCallback, useState } from 'react';

/**
 * Toast Notification System
 *
 * Provides global toast notifications accessible from anywhere in the app via useToast().
 * Toasts auto-dismiss after 3 seconds or can be manually dismissed via close button.
 *
 * Types: 'success' (green), 'error' (red), 'info' (blue)
 *
 * Example:
 *  const { showToast } = useToast();
 *  showToast('Item added!', 'success');
 *  showToast('Something went wrong', 'error');
 */
export const ToastContext = createContext(null);

// Auto-incrementing ID for unique toast identification
let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Fire a new toast notification.
   * @param {string} message — Notification text
   * @param {string} type — 'success' | 'error' | 'info' (default: 'success')
   */
  const showToast = useCallback((message, type = 'success') => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  /**
   * Manually dismiss a toast by ID (triggered by close button).
   */
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container rendered directly inside provider (portal-like) */}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} role="alert">
            <span className="toast__icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast__message">{t.message}</span>
            <button
              className="toast__close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
