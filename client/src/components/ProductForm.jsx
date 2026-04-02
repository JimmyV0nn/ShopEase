import React, { useEffect, useState } from 'react';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  category: 'Electronics',
  stock: '',
};

/**
 * Modal form for creating or editing a product (Admin).
 * Handles both create and edit modes based on whether `initial` prop is provided.
 */
export default function ProductForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? '',
        description: initial.description ?? '',
        price: initial.price?.toString() ?? '',
        imageUrl: initial.imageUrl ?? '',
        category: initial.category ?? 'Electronics',
        stock: initial.stock?.toString() ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial]);

  /**
   * Client-side validation before form submission.
   * Validates required fields, formats (URL, numeric), and data constraints.
   * Note: Server-side validation also occurs on all API endpoints for security.
   */
  const validate = () => {
    const e = {};
    
    // Required field checks
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    
    // Price validation: must be a non-negative number with max 2 decimal places
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      e.price = 'Valid price required';
    const priceNum = Number(form.price);
    if (!isNaN(priceNum) && Math.round(priceNum * 100) !== priceNum * 100)
      e.price = 'Price cannot have more than 2 decimal places';
    
    // Stock validation: must be a non-negative integer (quantity for sale)
    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0)
      e.stock = 'Valid stock required';
    const stockNum = Number(form.stock);
    if (!Number.isInteger(stockNum) && form.stock !== '')
      e.stock = 'Stock must be a whole number';
    
    // Image URL validation: if provided, must be an absolute URL or a relative path
    if (form.imageUrl.trim()) {
      try {
        new URL(form.imageUrl);
      } catch {
        if (!form.imageUrl.startsWith('/')) {
          e.imageUrl = 'Must be a valid URL or a path starting with /';
        }
      }
    }
    
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      imageUrl: form.imageUrl.trim(),
      category: form.category,
      stock: parseInt(form.stock, 10),
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={initial ? 'Edit product' : 'Add product'}>
      <div className="modal modal--large">
        <div className="modal__header">
          <h2>{initial ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal__close" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <form className="product-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pf-name">Product Name *</label>
              <input
                id="pf-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Headphones"
                maxLength={100}
                aria-describedby={errors.name ? 'pf-name-err' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span id="pf-name-err" className="form-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="pf-category">Category *</label>
              <select id="pf-category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="pf-desc">Description *</label>
            <textarea
              id="pf-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Brief product description"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'pf-desc-err' : undefined}
            />
            {errors.description && (
              <span id="pf-desc-err" className="form-error">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pf-price">Price (USD) *</label>
              <input
                id="pf-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? 'pf-price-err' : undefined}
              />
              {errors.price && <span id="pf-price-err" className="form-error">{errors.price}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="pf-stock">Stock *</label>
              <input
                id="pf-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                aria-invalid={!!errors.stock}
                aria-describedby={errors.stock ? 'pf-stock-err' : undefined}
              />
              {errors.stock && <span id="pf-stock-err" className="form-error">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="pf-image">Image URL (optional)</label>
            <input
              id="pf-image"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Saving…' : initial ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
