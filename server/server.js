import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import errorHandler from './middleware/errorHandler.js';

/**
 * ShopEase Express Server
 *
 * Handles:
 *  - RESTful API endpoints for products and shopping carts (/api/...)
 *  - Static file serving for React SPA build (/*)
 *  - Global error handling and security headers
 *  - MongoDB connection (Mongoose)
 *
 * Entry point: runs on PORT (default 5000)
 * Requires: .env file with MONGO_URI
 *
 * Middleware Order (critical):
 *  1. express-async-errors: wrap async errors
 *  2. CORS + JSON parser: enable cross-origin, parse incoming JSON
 *  3. Security headers: protect against common attacks (XSS, clickjacking, etc.)
 *  4. API routes: /api/products, /api/cart
 *  5. Static files: serve React build
 *  6. SPA fallback: return index.html for non-API routes (client-side routing)
 *  7. Global error handler: catch and format all errors
 */

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
// Enable CORS and parse JSON request bodies
app.use(cors());
app.use(express.json());

// Security headers to prevent common vulnerabilities
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');     // Prevent MIME sniffing
  res.setHeader('X-Frame-Options', 'DENY');               // Prevent clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block');     // Enable XSS filter
  next();
});

// ─── API Routes ───────────────────────────────────────────────────────────────
// Mount REST API routes (must come before static file serving)
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// ─── Serve React SPA ──────────────────────────────────────────────────────────
// In production, serve the React build (run: npm run build in client/)
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// SPA fallback: route all non-API requests to index.html
// This allows client-side routing to handle paths like /cart and /admin
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// Catch any unhandled errors from API routes (wrapped by express-async-errors)
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ShopEase server running on port ${PORT}`);
  });
});
