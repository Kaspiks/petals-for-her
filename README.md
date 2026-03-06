# Petals for Her

A flowers e-commerce website featuring hyper-realistic silk bouquets with bespoke fragrances. Built with **Rails API** backend and **React + Tailwind CSS** frontend.

## Stack

- **Backend:** Ruby on Rails 8 (API mode), PostgreSQL
- **Frontend:** React 18, Vite, Tailwind CSS 4
- **Deployment:** Docker Compose for local development

## Quick Start

### Prerequisites

- Ruby 3.3+
- Node.js 20+
- PostgreSQL (or use Docker)
- Docker & Docker Compose (optional)

### Option 1: Docker (recommended)

```bash
docker compose up --build
```

- **React frontend:** http://localhost:5173
- **Rails API:** http://localhost:3000
- **PostgreSQL:** localhost:5433 (host)

Run migrations and seed:

```bash
docker compose exec web rails db:migrate db:seed
```

#### Managing frontend dependencies (Docker)

The frontend `node_modules` live inside a Docker named volume, **not** on your host machine. Always manage npm packages through the container:

```bash
# Install a new package
docker compose exec frontend npm install <package-name>

# Install all dependencies (e.g. after pulling changes to package.json)
docker compose exec frontend npm install

# If the frontend container isn't running
docker compose run --rm frontend npm install <package-name>
```

### Option 2: Local development

**Backend:**

```bash
# Install dependencies
bundle install

# Setup database (ensure PostgreSQL is running)
rails db:create db:migrate db:seed

# Start Rails server
rails server
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

- Rails API: http://localhost:3000
- React app: http://localhost:5173 (proxies `/api` to Rails)

### Option 3: Run both with Foreman

```bash
gem install foreman
foreman start -f Procfile.dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/collections` | List all collections |
| GET | `/api/v1/collections/:id` | Show collection with products |
| GET | `/api/v1/products` | List products (optional `?collection_id=`) |
| GET | `/api/v1/products/:id` | Show product |
| POST | `/api/v1/newsletter` | Subscribe to newsletter (`{ "email": "..." }`) |

## Project Structure

```
petals-for-her/
├── app/
│   ├── controllers/api/v1/   # API controllers
│   └── models/               # Collection, Product, Order, etc.
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # Header, Hero, ScentedSecret, etc.
│   │   └── App.jsx
│   └── public/
├── docker/                   # Docker configs
├── db/migrate/               # Migrations
└── config/
```

## Models

- **Collection** – Product categories (e.g. Blush Romance, Sage Garden)
- **Product** – Flower arrangements with name, price, image, fragrance
- **Order** / **OrderItem** – E-commerce orders (for future checkout)
- **OrderStatus** – Order workflow states
- **NewsletterSubscriber** – Email signups for "Join the Petals Circle"

## Adding Product Images

Use Active Storage to attach images to products. In Rails console:

```ruby
product = Product.find(1)
product.image.attach(io: File.open("path/to/image.jpg"), filename: "bouquet.jpg")
```

## License

See [LICENSE](LICENSE).
