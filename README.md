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

## Supported platforms

Linux, macOS and Windows: everything runs on Node.js, and MongoDB runs in Docker (or as a native install). The API tests run in CI on Ubuntu with Node.js 20. On Windows use PowerShell (`copy` instead of `cp`) or Git Bash.

## Requirements

- **Node.js 20 or later** with npm (tested with 20 and 26)
- **MongoDB 6+** on `localhost:27017`, or **Docker** to run it
- Free ports **8080** (API), **3000** (front end) and **27017** (MongoDB)
- `mongosh` to make an account admin; it is included in the `mongo:7` Docker image

## Install and run

```bash
git clone https://github.com/alir961/sneakers-avenue-ecommerce.git
cd sneakers-avenue-ecommerce

# Database (skip if MongoDB already runs on localhost:27017)
docker run -d --name sneakers-mongo -p 27017:27017 mongo:7

# API on http://localhost:8080
cd back
cp .env.example .env    # set ACCESS_TOKEN_SECRET to a long random string, e.g. openssl rand -base64 48
npm install
npm start               # compiles the TypeScript to dist/ and starts the server

# Front end on http://localhost:3000 (in a second terminal, from the repository root)
cd front
cp .env.example .env    # REACT_APP_API_URL=http://localhost:8080
npm install
npm start               # opens the browser on http://localhost:3000
```

`GET http://localhost:8080/api` answers `{"message":"Welcome to Express API"}` once the API is up. The API exits at startup if `MONGODB_URI` is not set or MongoDB is unreachable. Next time, `docker start sneakers-mongo` restarts the database with its data.

`back/.env` holds:

```
MONGODB_URI=mongodb://localhost:27017/sneakers-avenue
ACCESS_TOKEN_SECRET=change-me
PASSWORD_CONDITIONS="At least 8 characters, including one special character"
PORT=8080
```

`PASSWORD_CONDITIONS` is only the hint shown when a registration is refused. Passwords must have **at least 8 characters including a special character** (`@ ? ! . , ; : - _ ~ & = + / * % ^ $ ( ) [ ] { } < > " '`), e.g. `password123!`.

`front/.env` holds `REACT_APP_API_URL`, the API base URL. React reads it at startup, so restart `npm start` after changing it.

### Add products

The catalogue starts empty and only admins can add products. Register an account in the app, make it an admin, then log in again and add products from the product page (the add button only shows for admins):

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
cd back && npm test     # 10 tests; downloads a MongoDB binary on the first run, no database needed
npx tsc --noEmit        # type check, as in CI
npm run lint            # ESLint (front end: cd front && npm run lint)
```

## Tech stack

TypeScript · React · Express · MongoDB / Mongoose · JWT · bcrypt · Jest · Supertest · GitHub Actions · ESLint (Airbnb) · Prettier
