# 🍳 Culinary Hub

A modern, professional e-commerce platform for **kitchen utensils & cookware** built for the Kenyan market. Customers browse a product catalog, add items to a cart, check out, and **place orders via WhatsApp Business** — the way Kenyan small businesses actually sell.

## ✨ Features

### Storefront (Customer-facing)
- Modern, responsive landing page with hero, featured products, new arrivals & categories
- Full product catalog with **search**, **category filters**, and **price-range filters**
- Product detail pages with image galleries, discounts, and stock indicators
- Shopping cart (persisted in `localStorage`) with quantity management
- Checkout with **Courier Delivery** or **Free Store Pickup**
- **Order tracking** by order number with a visual status timeline
- Styled with a warm kitchen-brand color palette, fully mobile-responsive

### WhatsApp Ordering
- "Order via WhatsApp" buttons throughout the store
- Place an order → get a confirmation page → automatically opens WhatsApp with a **pre-formatted order message** (order number, items, totals, delivery info) to your WhatsApp Business number

### Admin Panel (`/admin`)
- Secure login (JWT session cookie + bcrypt passwords)
- **Dashboard** with live stats: products, categories, orders, pending orders & total revenue
- **Products**: create, edit, delete, toggle active/hidden, toggle featured, manage stock/pricing/SKU
- **Image upload** with multi-file support, drag-and-drop style picker, previews, and delete
- **Categories**: full CRUD with product counts
- **Orders**: filter by status, update order status (pending → confirmed → processing → shipped → delivered/cancelled), view full order details, and contact customers directly via WhatsApp

## 🛠 Tech Stack

| Layer        | Technology                                        |
|--------------|---------------------------------------------------|
| Framework    | Next.js 16 (App Router) + React 19                |
| Language     | TypeScript                                        |
| Styling      | Tailwind CSS v4                                   |
| Database     | SQLite + Prisma ORM                              |
| Auth         | JWT (jose) + bcryptjs, httpOnly session cookie   |
| Validation   | Zod                                               |
| Images       | Local uploads to `/public/uploads`               |

## 🚀 Getting Started

### Prerequisites
- Node.js 20.9+ and npm

### 1. Install & configure
```bash
cd culinary-hub
npm install
cp .env.example .env   # then edit values to match your store
npm run db:push         # create the database schema
npm run seed            # create admin user + sample products/categories
```

### 2. Set your store details in `.env`
```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="a-long-random-secret-string"
STORE_PHONE="254712345678"          # e.g. 2547xxxxxxxx
WHATSAPP_NUMBER="254712345678"      # where customers send orders
```

### 3. Run it
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 🔐 Admin Access
Log in at **`/admin`** (or `/admin/login`).

Default credentials after `npm run seed`:
- **Email:** `admin@culinaryhub.co.ke`
- **Password:** `admin123`

> ⚠️ Change the admin password and `SESSION_SECRET` before going live.

## 📁 Project Structure
```
src/
├── app/
│   ├── page.tsx                 # Home page (hero, featured, categories)
│   ├── shop/                    # Product catalog + filters
│   ├── category/[slug]/         # Category browsing
│   ├── product/[slug]/          # Product detail
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout (WhatsApp order flow)
│   ├── track/                   # Order tracking
│   ├── admin/                   # Login + dashboard + everything admin
│   │   ├── products/            # Product CRUD + image upload
│   │   ├── categories/          # Category CRUD
│   │   └── orders/              # Order management + status
│   └── api/
│       ├── orders/              # Create order
│       ├── orders/track/        # Track order by number
│       ├── admin/orders/status/ # Update order status
│       └── upload/              # Image upload
├── components/                  # Navbar, Footer, ProductCard, admin UI
├── context/StoreContext.tsx     # Global cart state (localStorage)
└── lib/                         # Prisma client, auth, utils, store config
```

## 📜 Scripts
| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start the development server             |
| `npm run build`  | Production build                         |
| `npm start`      | Serve the production build               |
| `npm run lint`   | Run ESLint                               |
| `npm run seed`   | Seed the database (admin + sample data)  |
| `npm run db:push`| Sync the database with the Prisma schema |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |

## 🌍 Deployment
This app is self-hosted-friendly (SQLite = no external DB server). You can deploy to **Vercel**, **Railway**, or any Node.js host. For production:

1. Set `NODE_ENV=production` and a strong `SESSION_SECRET`
2. Point `WHATSAPP_NUMBER` at your business line
3. Uploaded images to `/public/uploads` need persistent storage on your host

## 📄 License
Private — &copy; [Your Store Name]. All rights reserved.