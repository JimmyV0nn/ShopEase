# ShopEase — E-Commerce Shopping Cart

A single-page e-commerce application where users can browse products, manage a persistent shopping cart, and administrators can manage the product catalogue — all without a page reload.

---

## Problem Statement

Traditional multi-page shopping experiences break user flow with full page refreshes. ShopEase solves this by providing a seamless, single-page interface where the cart, product grid, and admin panel coexist in one HTML document — all state transitions happen in-place via React's virtual DOM and a REST API backed by MongoDB.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18 (Vite), React Router v6  |
| Styling     | Custom CSS (CSS custom properties, no frameworks) |
| Routing     | React Router v6 (client-side SPA) |
| State       | React Context API + `useReducer`  |
| HTTP Client | Axios                             |
| Backend     | Node.js + Express 4               |
| Database    | MongoDB Atlas (Mongoose ODM)      |
| Deployment  | Express serves the React `dist/` build on one port |

---

## Features

- **Single-Page Application** — React Router v6; no full-page reloads ever
- **Persistent Guest Cart** — cart stored in MongoDB against a `sessionId` (UUID in `localStorage`), survives page refresh
- **Full CRUD on Products** — Admin page: create, read, update, delete products with a modal form
- **Full CRUD on Cart Items** — add items, update quantities, remove individual items, clear all
- **Real-time Cart Badge** — animated count badge on the Navbar updates instantly
- **Slide-in Cart Sidebar** — opens without navigating away from the store page
- **Search & Category Filter** — debounced search (300 ms) + category pills filter products
- **Stock Enforcement** — "Add to Cart" disabled when out of stock; qty stepper capped at available stock
- **Shipping Threshold** — free shipping over $50, progress hint shows remaining amount
- **Skeleton Loading Cards** — shimmer placeholders while products fetch
- **Toast Notifications** — success/error/info feedback slides in from top-right
- **Confirm Modals** — deletion actions require explicit confirmation
- **Responsive Design** — fluid CSS Grid collapses from 4 columns → 1 on mobile
- **Accessible UI** — `aria-label` on icon buttons, `role="dialog"` on modals, `aria-live` on results count, visible focus rings
- **Mock Checkout** — "Proceed to Checkout" clears the cart and shows an order-placed success screen

---

## Folder Structure

```
assignment1/
│
├── server/                  Express + Mongoose backend
│   ├── config/
│   │   └── db.js            MongoDB connection helper
│   ├── controllers/
│   │   ├── productController.js   CRUD for products
│   │   └── cartController.js      CRUD for cart items
│   ├── middleware/
│   │   └── errorHandler.js  Global async error handler
│   ├── models/
│   │   ├── Product.js       Mongoose product schema
│   │   └── Cart.js          Mongoose cart schema (sessionId + items[])
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── cartRoutes.js
│   ├── seed/
│   │   └── seedProducts.js  One-time seed script (12 demo products)
│   ├── .env.example         Environment variable template
│   └── server.js            Express entry point
│
├── client/                  React SPA (Vite)
│   ├── src/
│   │   ├── api/             Axios wrapper functions
│   │   │   ├── productApi.js
│   │   │   └── cartApi.js
│   │   ├── context/         React Context providers
│   │   │   ├── CartContext.jsx   Cart state + actions
│   │   │   └── ToastContext.jsx  Toast notification state
│   │   ├── hooks/           Custom React hooks
│   │   │   ├── useCart.js
│   │   │   └── useToast.js
│   │   ├── components/      Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── SkeletonCard.jsx
│   │   ├── pages/           Route-level page components
│   │   │   ├── StorePage.jsx   / — product grid
│   │   │   ├── CartPage.jsx    /cart — full cart view
│   │   │   └── AdminPage.jsx   /admin — product management
│   │   ├── styles/
│   │   │   └── index.css    All styles (design tokens, layout, components)
│   │   ├── App.jsx          Router shell + context providers
│   │   └── main.jsx         React DOM entry point
│   ├── index.html
│   └── vite.config.js       Dev proxy → Express
│
├── .gitignore
└── README.md
```

---

## Database Export

A seed script is provided at `server/seed/seedProducts.js` to populate MongoDB with 12 sample products across 5 categories. This acts as the database export / initial data for the project.

To run it: `cd server && node seed/seedProducts.js`

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd assignment1
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
# Edit .env and paste your MongoDB Atlas connection string
npm install
```

**Environment variables (`server/.env`):**

| Variable    | Description                             |
|-------------|-----------------------------------------|
| `MONGO_URI` | MongoDB Atlas connection string         |
| `PORT`      | Server port (default: `5000`)           |

### 3. Seed the database

```bash
npm run seed
```

### 4. Install frontend dependencies

```bash
cd ../client
npm install
```

### 5. Run in development (two terminals)

**Terminal 1 — Backend:**
```bash
cd server
npm run dev    # nodemon auto-restarts on changes
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev    # Vite dev server on http://localhost:5173
```

Vite proxies all `/api` requests to `localhost:5000`, so no CORS configuration needed.

### 6. Production build (single port)

```bash
cd client && npm run build
cd ../server && node server.js
# Visit http://localhost:5000
```

---

## API Reference

### Products

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/api/products`     | List all (supports `?search=&category=`) |
| GET    | `/api/products/:id` | Get single product                 |
| POST   | `/api/products`     | Create product                     |
| PUT    | `/api/products/:id` | Update product                     |
| DELETE | `/api/products/:id` | Delete product                     |

### Cart

| Method | Endpoint                                  | Description              |
|--------|-------------------------------------------|--------------------------|
| GET    | `/api/cart/:sessionId`                    | Get cart (populated)     |
| POST   | `/api/cart/:sessionId/items`              | Add / increment item     |
| PUT    | `/api/cart/:sessionId/items/:productId`   | Update item quantity     |
| DELETE | `/api/cart/:sessionId/items/:productId`   | Remove single item       |
| DELETE | `/api/cart/:sessionId`                    | Clear entire cart        |

---

## Challenges Overcome

**1. Cart persistence without authentication.** Rather than requiring login, the cart is identified by a UUID (`sessionId`) generated client-side and stored in `localStorage`. This is persisted to MongoDB so the cart survives page refreshes and can be fetched on app start, giving a seamless user experience without any login friction.

**2. Race conditions on rapid quantity changes.** Clicking `+` or `-` rapidly could fire multiple concurrent PUT requests with stale quantities. This was resolved by disabling the quantity buttons while an update is in-flight (`updating` state on `CartItem`), and by returning the full updated cart document from every mutation endpoint so client state always reflects the authoritative server state.

**3. Serving both API and SPA from one Express server.** In production, React's `BrowserRouter` requires the server to return `index.html` for every non-API route (so client-side navigation doesn't 404 on refresh). This was solved by placing the static file middleware and SPA catch-all route after all `/api` route registrations in `server.js`.

**4. Responsive cart item layout.** The cart item component uses a CSS Grid layout that works across both the sidebar (narrow) and full cart page (wide). A mobile breakpoint rearranges the grid columns so the image, quantity controls, line total, and remove button all reflow correctly without any JavaScript.

**5. Accessible modals and focus management.** Confirmation and product-form modals needed to be keyboard-navigable and properly announced to screen readers. This required `role="dialog"`, `aria-modal="true"`, `aria-label`, and `autoFocus` on the primary action button, plus a keydown listener to close on `Escape`.

---

## Author

Student Assignment — 31748/32516 Web Systems
Submitted: April 2026
# ShopEase
