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

Requirements: Node.js 18+, MongoDB.

```bash
# API
cd back
cp .env.example .env    # then fill in the values
npm install
npm start

# Front end
cd ../front
npm install
npm start
```

`back/.env` needs:

```
MONGODB_URI=mongodb://localhost:27017/sneakers-avenue
ACCESS_TOKEN_SECRET=change-me
PASSWORD_CONDITIONS="At least 8 characters"
PORT=8080
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
