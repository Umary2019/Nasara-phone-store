# Nasara Phone Accessories Sales Record System

A production-oriented full-stack sales, inventory, customer, expense, and reporting system for Nasara Phone Accessories.

## Structure

- frontend - React + Vite + Tailwind + React Query
- backend - Node.js + Express + MongoDB + Mongoose

## Features

- JWT authentication with refresh tokens
- Role-based access control
- Product, stock, sales, customer, supplier, purchase, expense, audit, and report modules
- File uploads for product images and business logo
- PDF and Excel export endpoints
- Responsive dashboard with charts
- Printable receipt preview and report pages

## Getting Started

1. Install dependencies in both folders.
2. Configure environment variables in `backend/.env` and `frontend/.env`.
3. Run the backend and frontend separately.

## Vercel Deployment

This repository is configured as a Vercel monorepo project with both the frontend and backend deployed together.

- Deploy the repository root as a Vercel project.
- Set the project root to `/`.
- Use `vercel.json` in the repo root for build routing.
- Vercel will:
  - build the frontend static site from `frontend/package.json`
  - serve the backend API from `backend/api/index.js` under `/api`
- If Vercel prompts for manual settings, use:
  - Framework Preset: `Other`
  - Build Command: `cd frontend && npm run build`
  - Output Directory: `frontend/dist`
- Set these environment variables in Vercel:
  - `MONGO_URI` — MongoDB connection string
  - `JWT_ACCESS_SECRET` — JWT access token secret
  - `JWT_REFRESH_SECRET` — JWT refresh token secret
  - `JWT_ACCESS_EXPIRES_IN` — Access token lifetime (default: `15m`)
  - `JWT_REFRESH_EXPIRES_IN` — Refresh token lifetime (default: `7d`)
  - `CLIENT_URL` — Frontend origin, e.g. `https://your-project.vercel.app`
  - `VITE_API_BASE_URL` — set to `/api`
  - `BUSINESS_NAME`, `BUSINESS_PHONE`, `BUSINESS_EMAIL`, `BUSINESS_ADDRESS`, `CURRENCY`, `TAX_RATE`, `LOW_STOCK_THRESHOLD`
- Because frontend and backend are deployed in the same project, the frontend can use `/api` as the backend prefix.
- Ensure MongoDB allows connections from Vercel and the database URI is valid.

## Backend scripts

- `npm run dev`
- `npm start`

## Frontend scripts

- `npm run dev`
- `npm run build`

