# Sneakers Avenue — Full-Stack E-Commerce (TypeScript)

A sneaker store with a product catalogue, user accounts, a profile and a shopping cart. Built solo with a React front end and an Express / MongoDB REST API.

## Features

- **Authentication**: registration and login, passwords hashed with bcrypt, JWT-protected routes
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

## Tech stack

TypeScript · React · Express · MongoDB / Mongoose · JWT · bcrypt · ESLint (Airbnb) · Prettier
