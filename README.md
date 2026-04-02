# ShopEase

A single-page e-commerce app where users can browse products, manage a shopping cart, and admins can manage the product catalogue without any page reloads.

## Tech Stack

- **Frontend:** React 18 (Vite), React Router v6, custom CSS
- **State:** React Context API + useReducer
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)

## Features

- Browse and filter products by category or search
- Persistent guest cart using a session ID stored in localStorage
- Full CRUD on products via the admin panel
- Add, update, remove cart items; checkout deducts stock
- Toast notifications, skeleton loading, confirm modals

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd ShopEase
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
# Add your MongoDB Atlas connection string to .env
npm install
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Install frontend dependencies

```bash
cd ../client
npm install
```

### 5. Run locally (two terminals)

**Terminal 1:**
```bash
cd server && npm run dev
```

**Terminal 2:**
```bash
cd client && npm run dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` requests to the Express server on port 5000.

### 6. Production build

```bash
cd client && npm run build
cd ../server && node server.js
# Visit http://localhost:5000
```

## Folder Structure

```
ShopEase/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/seedProducts.js
│   └── server.js
└── client/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── styles/
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (`?search=&category=`) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/cart/:sessionId` | Get cart |
| POST | `/api/cart/:sessionId/items` | Add item |
| PUT | `/api/cart/:sessionId/items/:productId` | Update quantity |
| DELETE | `/api/cart/:sessionId/items/:productId` | Remove item |
| DELETE | `/api/cart/:sessionId` | Clear cart |
| POST | `/api/cart/:sessionId/checkout` | Checkout |

## Author

Student Assignment — 31748/32516 Web Systems
Submitted: April 2026
