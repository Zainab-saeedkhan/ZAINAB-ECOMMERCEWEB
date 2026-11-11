# ShopEase — Basic E-Commerce Platform (Buyer & Seller Dashboards)

Full-stack **MERN** project built from the SRS:

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) + Tailwind CSS + React Router + Axios |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (1 day expiry) + bcrypt (12 salt rounds) |

---

## Step-by-Step: Project kaise chalayein (How to run)

### Step 1 — Software install karein
1. **Node.js 18+** → https://nodejs.org (LTS version)
2. **MongoDB** — koi ek option:
   - MongoDB Community Server → https://www.mongodb.com/try/download/community (local), **ya**
   - MongoDB Atlas (free cloud) → connection string copy karein, **ya**
   - Docker ho to: `docker compose up -d` (project root mein)
3. **VS Code** (code editor)

Check karein: `node -v` aur `npm -v` terminal mein version dikhayen.

### Step 2 — Backend setup
```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
```
`.env` file kholein aur zarurat ho to badlein:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce   # Atlas use kar rahe hain to us ka URI
JWT_SECRET=koi_bhi_lamba_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

### Step 3 — Demo data daalein (seed)
```bash
npm run seed
```
Ye 4 categories, 8 products aur ye demo users bana deta hai (sab ka password `password123`):

| Role | Email |
|---|---|
| Admin | admin@shop.com |
| Seller | seller@shop.com |
| Seller | seller2@shop.com |
| Buyer | buyer@shop.com |

### Step 4 — Backend chalayein
```bash
npm run dev      # ya: npm start
```
Terminal mein `API running on http://localhost:5000` aana chahiye. Test: browser mein http://localhost:5000/api/health

### Step 5 — Frontend setup & run (naya terminal)
```bash
cd frontend
npm install
npm run dev
```
Browser mein kholein: **http://localhost:5173**

### Step 6 — App test karein (demo flow)
1. `buyer@shop.com` se login → product **Add to cart** → **Cart** → address likh kar **Place order**.
2. Logout → `seller@shop.com` se login → **Order Processing** tab → status dropdown se *Shipped* → *Delivered*.
3. Wapas buyer se login → product page par jaa kar **review** likhein (review sirf delivered product par allowed hai).
4. `admin@shop.com` se login → categories add/edit/delete, users activate/deactivate.

---

## Project Structure (samajhne ke liye)

```
ecommerce-platform/
├── backend/
│   └── src/
│       ├── server.js            # entry point: DB connect + server start
│       ├── app.js               # Express app, security middleware, routes
│       ├── seed.js              # demo data
│       ├── config/db.js         # MongoDB connection
│       ├── models/              # Database schemas (SRS section 5)
│       │   ├── User.js  Category.js  Product.js
│       │   ├── CartItem.js  Order.js (with OrderItem)  Review.js
│       ├── middleware/
│       │   ├── auth.js          # protect (JWT -> 401) + authorize(roles) (-> 403)
│       │   ├── validate.js      # express-validator errors -> 400
│       │   └── error.js         # central error handler
│       ├── controllers/         # business logic (CRUD)
│       └── routes/              # URL -> controller mapping + validation rules
└── frontend/
    └── src/
        ├── api/client.js        # axios + JWT header + auto logout on 401
        ├── context/             # AuthContext (login state), CartContext (cart state)
        ├── components/          # Navbar, ProtectedRoute, ProductCard, UI helpers
        └── pages/
            ├── Home.jsx         # search, category/price filter, sort, pagination
            ├── ProductDetail.jsx# details, add to cart, reviews + average rating
            ├── Login.jsx  Register.jsx  Cart.jsx (checkout)
            └── dashboard/
                ├── BuyerDashboard.jsx   # Profile, My Orders (tabs), Cart, My Reviews
                ├── SellerDashboard.jsx  # Analytics, Product catalog, Order processing
                └── AdminDashboard.jsx   # Stats, Categories CRUD, Users
```

### Request ka flow (kaise kaam karta hai)
`React page` → `axios (JWT header)` → `Express route` → `validate` → `protect` (token check) → `authorize('SELLER')` (role check) → `controller` → `Mongoose model` → `MongoDB` → JSON response wapas.

---

## API Endpoints

**Auth / Profile**
| Method | URL | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET / PUT / DELETE | /api/users/profile | Logged in (DELETE = deactivate) |
| GET | /api/users | Admin |
| PATCH | /api/users/:id/status | Admin |

**Categories**
| Method | URL | Access |
|---|---|---|
| GET | /api/categories | Public |
| POST / PUT /:id / DELETE /:id | /api/categories | Admin (delete → products become Uncategorized) |

**Products**
| Method | URL | Access |
|---|---|---|
| GET | /api/products?q=&category=&minPrice=&maxPrice=&sort=&page=&limit= | Public |
| GET | /api/products/:id | Public |
| GET | /api/products/seller/mine?q= | Seller |
| POST | /api/products | Seller (seller id comes from token) |
| PUT | /api/products/:id | Seller (owner only) |
| DELETE | /api/products/:id (`?hard=true` permanent) | Seller (owner only, default = archive) |

**Cart** (Buyer)
| Method | URL |
|---|---|
| GET | /api/cart |
| POST | /api/cart `{ productId, quantity }` |
| PUT | /api/cart/:productId `{ quantity }` |
| DELETE | /api/cart/:productId |
| DELETE | /api/cart (clear) |

**Orders**
| Method | URL | Access |
|---|---|---|
| POST | /api/orders `{ shippingAddress, paymentMethod }` | Buyer (checkout) |
| GET | /api/orders/my | Buyer |
| GET | /api/orders/:id | Owner buyer / related seller |
| PATCH | /api/orders/:id/cancel | Buyer (only Pending) |
| PATCH | /api/orders/:id/archive | Buyer (Delivered/Cancelled) |
| GET | /api/orders/seller/list | Seller |
| GET | /api/orders/seller/stats | Seller |
| PATCH | /api/orders/:orderId/items/:itemId/status `{ status }` | Seller (Pending → Processing → Shipped → Delivered) |

**Reviews**
| Method | URL | Access |
|---|---|---|
| GET | /api/reviews/product/:productId | Public (reviews + average) |
| GET | /api/reviews/my | Buyer |
| POST | /api/reviews `{ productId, rating, comment }` | Buyer (only delivered purchases) |
| PUT / DELETE | /api/reviews/:id | Buyer (own review) |

---

## SRS Requirements → Kahan implement hua

| SRS Requirement | Implementation |
|---|---|
| bcrypt password hashing | `controllers/authController.js` (12 salt rounds) |
| Email uniqueness | unique index in `models/User.js` + check in register (409) |
| JWT with expiry, 401/403 | `middleware/auth.js` (`protect`, `authorize`) |
| Role-based access | every route uses `authorize('BUYER')` / `'SELLER'` / `'ADMIN'` |
| SQL/NoSQL injection | `express-mongo-sanitize` + `express-validator` |
| XSS | React escapes all output, `helmet` security headers, input length limits |
| Search indexes | `models/Product.js` indexes on title (text), category, seller, price |
| Stock race condition | `orderController.checkout`: atomic `updateOne({stock: {$gte: qty}}, {$inc: {stock: -qty}})` + rollback |
| Cancel only if Pending | `orderController.cancel` (stock restored) |
| Review only after purchase | `reviewController.create` checks a Delivered order item |
| Category delete gracefully | `categoryController.remove` sets products to Uncategorized |

## Common problems
- **`MongoDB connection failed`** → MongoDB service chal rahi hai? `MONGO_URI` sahi hai?
- **`JWT_SECRET is missing`** → `backend/.env` file banayi? (Step 2)
- **Frontend par data nahi aa raha** → backend (port 5000) chal raha hona chahiye; Vite `/api` ko 5000 par proxy karta hai.
- **Port busy** → `.env` mein `PORT` badlein aur `frontend/vite.config.js` mein proxy bhi.
