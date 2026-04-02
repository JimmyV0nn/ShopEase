import React from 'react';

/**
 * Placeholder skeleton card shown while products are loading.
 * Uses a CSS shimmer animation to indicate content is incoming.
 */
export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton--image" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text skeleton--text-short" />
        <div className="skeleton skeleton--button" />
      </div>
    </div>
  );
}
