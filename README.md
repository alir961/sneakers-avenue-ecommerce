# Sneakers Avenue — Full-Stack E-Commerce (TypeScript)

A sneaker store with a product catalogue, user accounts, a profile and a shopping cart. Built solo with a React front end and an Express / MongoDB REST API.

## Features

- **Authentication**: registration and login, passwords hashed with bcrypt, JWT-protected routes
- **Authorization**: users can only access their own cart; only admins can add products
- **Catalogue**: product list and product detail pages
- **Cart**: add and remove products, cart stored per user
- **Profile**: view and edit account details

## Architecture

```
front/  React + TypeScript: screens (Home, Product, Cart, Profile, Auth), components, API helpers
back/   Express + TypeScript REST API
        routes/    users, products, cart, profile
        services/  authentication (JWT), user controller
        schema/    Mongoose models (User, Product, Cart)
```

## Run locally

Requirements: Node.js 20+, and MongoDB (or Docker to run it).

```bash
# Database (skip if MongoDB already runs on localhost:27017)
docker run -d --name sneakers-mongo -p 27017:27017 mongo:7

# API on http://localhost:8080
cd back
cp .env.example .env    # set ACCESS_TOKEN_SECRET to a long random string
npm install
npm start

# Front end on http://localhost:3000 (in a second terminal)
cd front
cp .env.example .env    # REACT_APP_API_URL=http://localhost:8080
npm install
npm start
```

`back/.env` holds:

```
MONGODB_URI=mongodb://localhost:27017/sneakers-avenue
ACCESS_TOKEN_SECRET=change-me
PASSWORD_CONDITIONS="At least 8 characters"
PORT=8080
```

### Add products

The catalogue starts empty and only admins can add products. Register an account in the app, make it an admin, then log in again and add products from the product page:

```bash
docker exec sneakers-mongo mongosh sneakers-avenue --eval \
  'db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })'
```

Or through the API, with the admin's token from `POST /api/auth/login`:

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"name": "Air Max 90", "description": "Classic runner", "price": 129.9, "image": "https://..."}'
```

## Security & tests

An API test suite (Jest, Supertest, in-memory MongoDB) runs in CI on every push. A security review of the API found and fixed these issues, each now covered by a test:

| Issue | Fix |
|---|---|
| **IDOR**: any logged-in user could read or modify any other user's cart by changing the id in the URL | Ownership check on every cart route |
| `POST /api/cart` had no authentication | Route now requires a valid token |
| The JWT embedded the whole user document, **including the bcrypt hash** (JWTs are only base64-encoded) | Token now carries only the user id |
| Register and `/api/me` returned the password hash | Hash excluded from all responses |
| Product creation was hidden in the UI for non-admins but open on the API | Server-side admin check |

```bash
cd back && npm test
```

## Tech stack

TypeScript · React · Express · MongoDB / Mongoose · JWT · bcrypt · Jest · Supertest · GitHub Actions · ESLint (Airbnb) · Prettier
