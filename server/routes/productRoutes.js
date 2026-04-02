import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

/**
 * Product Routes
 *
 * GET    /api/products              List all products (supports ?search= and ?category= queries)
 * GET    /api/products/:id          Retrieve a single product by ID
 * POST   /api/products              Create a new product (admin)
 * PUT    /api/products/:id          Update an existing product (admin)
 * DELETE /api/products/:id          Delete a product (admin)
 *
 * Query Parameters:
 *  - search: Partial product name search (case-insensitive regex)
 *  - category: Filter by category ('All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports')
 */

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
