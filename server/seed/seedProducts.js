/**
 * Seed script — run once to populate the database with sample products.
 * Usage: node seed/seedProducts.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const products = [
  // Electronics
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and foldable design.',
    price: 149.99,
    imageUrl: '/image/headphones.jpg',
    category: 'Electronics',
    stock: 45,
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Track fitness goals, receive notifications, and monitor your health with GPS and heart-rate sensor.',
    price: 249.99,
    imageUrl: '/image/watch.webp',
    category: 'Electronics',
    stock: 30,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound, 12-hour playtime, and built-in microphone for calls.',
    price: 59.99,
    imageUrl: '/image/speaker.webp',
    category: 'Electronics',
    stock: 80,
  },
  // Clothing
  {
    name: 'Classic Oxford Shirt',
    description: 'Breathable 100% cotton Oxford shirt, perfect for business casual or weekend wear.',
    price: 39.99,
    imageUrl: '/image/shirt.jpg',
    category: 'Clothing',
    stock: 120,
  },
  {
    name: 'Slim Fit Chino Trousers',
    description: 'Comfortable stretch-cotton chinos available in multiple colours. Machine washable.',
    price: 49.99,
    imageUrl: '/image/trousers.jpg',
    category: 'Clothing',
    stock: 95,
  },
  {
    name: 'Lightweight Running Jacket',
    description: 'Wind-resistant, packable jacket with reflective strips for visibility in low light.',
    price: 79.99,
    imageUrl: '/image/jacket.jpg',
    category: 'Clothing',
    stock: 60,
  },
  // Books
  {
    name: 'Clean Code: A Handbook',
    description: 'Robert C. Martin\'s guide to writing maintainable, readable software. A must-read for developers.',
    price: 34.99,
    imageUrl: '/image/clean-code.jpg',
    category: 'Books',
    stock: 200,
  },
  {
    name: 'Designing Data-Intensive Applications',
    description: 'Deep dive into the principles behind reliable, scalable, and maintainable systems.',
    price: 44.99,
    imageUrl: '/image/data-intensive.jpeg',
    category: 'Books',
    stock: 150,
  },
  // Home & Kitchen
  {
    name: 'Stainless Steel Kettle',
    description: '1.7-litre electric kettle with temperature control, keep-warm function, and 360° base.',
    price: 44.99,
    imageUrl: '/image/kettle.avif',
    category: 'Home & Kitchen',
    stock: 70,
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 eco-friendly bamboo boards in different sizes with juice grooves.',
    price: 24.99,
    imageUrl: '/image/cutting-board.webp',
    category: 'Home & Kitchen',
    stock: 110,
  },
  // Sports
  {
    name: 'Yoga Mat Pro',
    description: 'Non-slip 6mm thick TPE yoga mat with alignment lines and carrying strap.',
    price: 34.99,
    imageUrl: '/image/yoga-mat.webp',
    category: 'Sports',
    stock: 85,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving dumbbells adjustable from 5 to 52.5 lbs in seconds. Ideal for home gyms.',
    price: 299.99,
    imageUrl: '/image/dumbbell.webp',
    category: 'Sports',
    stock: 20,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
