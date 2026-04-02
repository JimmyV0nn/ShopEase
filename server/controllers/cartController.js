import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ sessionId: req.params.sessionId }).populate(
    'items.product'
  );

  if (!cart) {
    return res.json({ success: true, data: { sessionId: req.params.sessionId, items: [] } });
  }

  // Filter out items whose product has been deleted
  cart.items = cart.items.filter((item) => item.product !== null);
  res.json({ success: true, data: cart });
};

export const addItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required' });
  }

  // Validate ObjectId
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }

  // Validate quantity
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: 'quantity must be a positive integer' });
  }

  // Verify the product exists and has enough stock
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  let cart = await Cart.findOne({ sessionId: req.params.sessionId });

  if (!cart) {
    // First item — create the cart
    cart = await Cart.create({
      sessionId: req.params.sessionId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  }

  await cart.populate('items.product');
  res.status(201).json({ success: true, data: cart });
};

export const updateItem = async (req, res) => {
  const { quantity } = req.body;

  // Validate ObjectId
  if (!isValidObjectId(req.params.productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }

  // Validate quantity is a positive integer
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: 'quantity must be a positive integer' });
  }

  // Validate stock
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  if (quantity > product.stock) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  const cart = await Cart.findOne({ sessionId: req.params.sessionId });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const item = cart.items.find(
    (i) => i.product.toString() === req.params.productId
  );
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not in cart' });
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product');
  res.json({ success: true, data: cart });
};

export const removeItem = async (req, res) => {
  // Validate ObjectId
  if (!isValidObjectId(req.params.productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }

  const cart = await Cart.findOne({ sessionId: req.params.sessionId });
  if (!cart) {
    // Cart doesn't exist, so item is already removed — return success
    return res.json({ success: true, data: { sessionId: req.params.sessionId, items: [] } });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await cart.save();
  await cart.populate('items.product');
  res.json({ success: true, data: cart });
};

export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ sessionId: req.params.sessionId });
  if (!cart) {
    // Cart doesn't exist — return empty cart object (consistent response shape)
    return res.json({ success: true, data: { sessionId: req.params.sessionId, items: [] } });
  }

  cart.items = [];
  await cart.save();
  res.json({ success: true, data: cart });
};

export const checkout = async (req, res) => {
  const cart = await Cart.findOne({ sessionId: req.params.sessionId }).populate(
    'items.product'
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot checkout an empty cart',
    });
  }

  try {
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}" (available: ${product.stock}, requested: ${item.quantity})`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Checkout successful',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Checkout failed: ' + error.message,
    });
  }
};
