import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/productApi';
import useToast from '../hooks/useToast';
import ProductForm from '../components/ProductForm';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await createProduct(data);
      showToast('Product created successfully', 'success');
      setFormOpen(false);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create product', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await updateProduct(editTarget._id, data);
      showToast('Product updated', 'success');
      setFormOpen(false);
      setEditTarget(null);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update product', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteTarget._id);
      showToast(`"${deleteTarget.name}" deleted`, 'info');
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditTarget(product);
    setFormOpen(true);
  };

  const stockBadgeClass = (stock) =>
    stock === 0 ? 'badge--danger' : stock <= 10 ? 'badge--warning' : 'badge--success';

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Product Management</h1>
          <p className="admin-page__subtitle">
            {loading ? '' : `${products.length} product${products.length !== 1 ? 's' : ''} in catalogue`}
          </p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="page-center">
          <LoadingSpinner message="Loading products…" />
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📦</div>
          <h3>No products yet</h3>
          <p>Click "Add Product" to create your first listing.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Products table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="admin-table__row">
                  <td className="admin-table__product-cell">
                    <img
                      src={p.imageUrl || `https://picsum.photos/seed/${p._id}/60/60`}
                      alt={p.name}
                      className="admin-table__thumb"
                    />
                    <div>
                      <p className="admin-table__name">{p.name}</p>
                      <p className="admin-table__desc">{p.description.slice(0, 60)}…</p>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge--neutral">{p.category}</span>
                  </td>
                  <td className="admin-table__price">${p.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${stockBadgeClass(p.stock)}`}>
                      {p.stock === 0 ? 'Out of stock' : p.stock}
                    </span>
                  </td>
                  <td className="admin-table__actions">
                    <button
                      className="btn btn--sm btn--ghost"
                      onClick={() => openEdit(p)}
                      aria-label={`Edit ${p.name}`}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn--sm btn--danger"
                      onClick={() => setDeleteTarget(p)}
                      aria-label={`Delete ${p.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal */}
      {formOpen && (
        <ProductForm
          initial={editTarget}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onCancel={() => {
            setFormOpen(false);
            setEditTarget(null);
          }}
          loading={formLoading}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmModal
          message={`Permanently delete "${deleteTarget.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
