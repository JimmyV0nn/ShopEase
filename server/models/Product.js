import mongoose from 'mongoose';

/**
 * Product Schema
 *
 * Represents a single product in the store.
 * Used for:
 *  - Displaying products in the store grid
 *  - Admin product management (C.R.U.D)
 *  - Stock validation when adding items to cart
 *
 * Fields:
 *  - name: Product title (required, max 100 chars)
 *  - description: Detailed description (required, max 500 chars)
 *  - price: Cost in USD (required, 0–999999.99, stored as Number with 2 decimals)
 *  - imageUrl: External image URL (optional, fallback to generated image)
 *  - category: One of 5 predefined categories (required)
 *  - stock: Available quantity for purchase (required, default 100, non-negative)
 *  - createdAt / updatedAt: Timestamps (automatic)
 *
 * Indexes:
 *  - Default: _id (implicit), updatedAt for time-based queries
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      max: [999999.99, 'Price cannot exceed 999999.99'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      max: [999999, 'Stock cannot exceed 999999'],
      default: 100,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
