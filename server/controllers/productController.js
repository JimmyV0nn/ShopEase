import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/products
 * Returns all products, with optional ?search= and ?category= filters.
 */
export const getProducts = async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (category && category !== 'All') {
    filter.category = category;
  }
  if (search) {
    // Escape special regex characters and limit search string length
    const searchStr = String(search).substring(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: searchStr, $options: 'i' };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: products });
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
};

/**
 * POST /api/products
 * Create a new product (Admin).
 */
export const createProduct = async (req, res) => {
  const { name, description, price, imageUrl, category, stock = 100 } = req.body;

  // Basic input validation
  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({
      success: false,
      message: 'name, description, price, and category are required',
    });
  }

  // Validate stock is a non-negative integer
  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({
      success: false,
      message: 'stock must be a non-negative integer',
    });
  }

  const product = await Product.create({ name, description, price, imageUrl, category, stock });
  res.status(201).json({ success: true, data: product });
};

/**
 * PUT /api/products/:id
 * Update an existing product (Admin).
 */
export const updateProduct = async (req, res) => {
  // Validate ObjectId
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }
  
  // Validate incoming data
  if (req.body.price !== undefined && (typeof req.body.price !== 'number' || req.body.price < 0)) {
    return res.status(400).json({
      success: false,
      message: 'price must be a non-negative number',
    });
  }
  if (req.body.stock !== undefined && (!Number.isInteger(req.body.stock) || req.body.stock < 0)) {
    return res.status(400).json({
      success: false,
      message: 'stock must be a non-negative integer',
    });
  }
  if (req.body.category && !['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'].includes(req.body.category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category',
    });
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
};

/**
 * DELETE /api/products/:id
 * Delete a product (Admin).
 */
export const deleteProduct = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
};
