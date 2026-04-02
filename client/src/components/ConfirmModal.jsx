import React, { useEffect } from 'react';

/**
 * Generic confirmation dialog (modal overlay).
 * Traps focus inside and closes on Escape.
 */
export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Remove', danger = true }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Confirmation dialog">
      <div className="modal">
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
