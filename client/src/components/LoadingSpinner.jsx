import React from 'react';

/**
 * Animated loading spinner component.
 *
 * Props:
 *  - size: SVG dimensions in pixels (default: 40)
 *  - message: Accessible status message (shown to screen readers, optional)
 *
 * Accessibility:
 *  - role="status" announces loading to assistive devices
 *  - aria-label communicates intent to screen readers
 *  - svg aria-hidden="true" hides decorative SVG
 *  - Message wrapped in sr-only class for screen-reader-only visibility
 *
 * Usage:
 *  - <LoadingSpinner message="Loading products…" />
 *  - <LoadingSpinner size={60} message="Submitting form…" />
 */
export default function LoadingSpinner({ size = 40, message = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-label={message}>
      <svg
        className="spinner"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
        />
      </svg>
      {message && <span className="spinner-wrap__label sr-only">{message}</span>}
    </div>
  );
}
