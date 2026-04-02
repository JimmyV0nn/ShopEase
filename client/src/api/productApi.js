import axios from 'axios';

// Create axios instance with default timeout of 10 seconds
const axiosInstance = axios.create({
  timeout: 10000,
});

const BASE = '/api/products';

/**
 * Fetch all products, optionally filtered by search query and category.
 * @param {string} search - Partial product name to search
 * @param {string} category - Category to filter ('All' returns everything)
 */
export const fetchProducts = (search = '', category = 'All') => {
  const params = {};
  if (search) params.search = search;
  if (category !== 'All') params.category = category;
  return axiosInstance.get(BASE, { params }).then((r) => r.data.data);
};

/**
 * Create a new product.
 * @param {object} productData - { name, description, price, imageUrl, category, stock }
 */
export const createProduct = (productData) =>
  axiosInstance.post(BASE, productData).then((r) => r.data.data);

/**
 * Update an existing product by ID.
 * @param {string} id - Product ObjectId
 * @param {object} updates - Partial product fields to update
 */
export const updateProduct = (id, updates) =>
  axiosInstance.put(`${BASE}/${id}`, updates).then((r) => r.data.data);

/**
 * Delete a product by ID.
 * @param {string} id - Product ObjectId
 */
export const deleteProduct = (id) =>
  axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data);
