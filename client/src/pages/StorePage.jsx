import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import useToast from '../hooks/useToast';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

/**
 * Main store page — product grid with search and category filter.
 */
export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { showToast } = useToast();
  const debounceTimer = useRef(null);

  const loadProducts = useCallback(
    async (q, cat) => {
      setLoading(true);
      try {
        const data = await fetchProducts(q, cat);
        setProducts(data);
      } catch {
        showToast('Failed to load products. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Initial load
  useEffect(() => {
    loadProducts('', 'All');
  }, [loadProducts]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  /**
   * Debounce search input changes to avoid server spam.
   * Waits 300ms after user stops typing before fetching filtered products.
   * This improves both UX (smoother) and server performance.
   */
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadProducts(val, category);
    }, 300);
  };

  /**
   * Instant filter by category.
   * No debounce needed — category selection is discrete, not continuous input.
   */
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    loadProducts(search, cat);
  };

  return (
    <div className="store-page">
      {/* Search & Filter Bar */}
      <section className="store-page__controls" aria-label="Product filters">
        <div className="search-bar">
          <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="search-bar__input"
            placeholder="Search products…"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
        </div>

        <div className="category-filters" role="group" aria-label="Category filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn${category === cat ? ' category-btn--active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results count */}
      {!loading && (
        <p className="store-page__count" aria-live="polite">
          {products.length === 0
            ? 'No products found'
            : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          {search && ` for "${search}"`}
          {category !== 'All' && ` in ${category}`}
        </p>
      )}

      {/* Product Grid */}
      <section className="product-grid" aria-label="Products">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.length === 0
          ? (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter.</p>
              <button
                className="btn btn--primary"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  loadProducts('', 'All');
                }}
              >
                Clear Filters
              </button>
            </div>
          )
          : products.map((p) => <ProductCard key={p._id} product={p} />)
        }
      </section>
    </div>
  );
}
