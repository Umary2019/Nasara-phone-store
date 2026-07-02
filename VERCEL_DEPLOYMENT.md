# Vercel Deployment Guide

## Important: Environment Variables Setup

Your `.env` file contains secrets and is **not** pushed to GitHub. On Vercel, you must manually configure environment variables in your project settings.

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select **Settings** > **Environment Variables**
3. Add each variable from your root `.env` file:

```
MONGO_URI=mongodb+srv://departmentalVoting_db:Umary2019@cluster0.5fpwh3g.mongodb.net/?appName=Cluster0
JWT_ACCESS_SECRET=1158d810cc8331e1765f26502a311322f0a3eefc1d5be5e11a6641f9664d9fb9
JWT_REFRESH_SECRET=96bf16b2a647f5104e4c298f79987e1fcd46a0b1452fd0e305dd96bfc61be5b8
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=https://your-domain.vercel.app
VITE_API_BASE_URL=/api
UPLOAD_DIR=uploads
BUSINESS_NAME=Nasara Phone Accessories
BUSINESS_PHONE=+0000000000
BUSINESS_EMAIL=support@example.com
BUSINESS_ADDRESS=Your shop address
CURRENCY=NGN
TAX_RATE=0.075
LOW_STOCK_THRESHOLD=10
```

**Important:** For `CLIENT_URL` on production, update it to your actual deployed domain (e.g., `https://your-app.vercel.app`).

### Step 2: Set Environment Scope

When adding each variable, set it to:
- **Environment Scope**: `Production, Preview, Development`

This ensures the variables are available in all deployment environments.

### Step 3: Redeploy

After setting environment variables:
1. Go back to **Deployments**
2. Click the three-dots menu on the latest deployment
3. Select **Redeploy**

Or push a new commit to trigger an automatic redeploy.

### Step 4: Verify Deployment

1. Visit your deployed app URL
2. Check the browser console for any errors
3. Test registration: Try creating a new staff account
4. Test login: Log in with an existing account
5. Check backend health: Visit `https://your-app.vercel.app/api/health`

## Troubleshooting

### Error: "MONGO_URI environment variable is required"
- **Cause**: Environment variable not set in Vercel
- **Solution**: Add `MONGO_URI` to Vercel project settings (see Step 1)

### Error: "Connection timeout" or "Cannot connect to MongoDB Atlas"
- **Cause**: Your IP address is not whitelisted in MongoDB Atlas
- **Solution**: 
  1. Go to MongoDB Atlas: https://cloud.mongodb.com
  2. Navigate to **Security** > **Network Access**
  3. Click **Add IP Address**
  4. Select **Allow Access from Anywhere** (CIDR: `0.0.0.0/0`)
  5. Note: This is less secure but required for serverless platforms like Vercel

### Error: "Frontend not loading" or "/vite.svg 404"
- **Cause**: Frontend static files not deployed correctly
- **Solution**: Rebuild frontend in local environment and commit `frontend/dist/`

```bash
cd frontend
npm run build
git add dist/
git commit -m "rebuild frontend dist for vercel"
git push
```

## Architecture

- **Frontend**: Deployed to Vercel (React + Vite)
- **Backend**: Deployed to Vercel Functions (Node.js Express)
- **Database**: MongoDB Atlas (Cloud)
- **Routing**: `/api/*` routes to backend service, all other routes to frontend

## Environment Variables Reference

| Variable | Purpose | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@host/db` |
| `JWT_ACCESS_SECRET` | JWT signing key | Secure random string |
| `JWT_REFRESH_SECRET` | Refresh token key | Secure random string |
| `CLIENT_URL` | Frontend URL (CORS) | `https://app.example.com` |
| `VITE_API_BASE_URL` | API base URL for frontend | `/api` (relative) |
| `BUSINESS_NAME` | Shop name | Nasara Phone Accessories |
| `UPLOAD_DIR` | File upload directory | `uploads` |

## After Deployment

- Test all authentication flows
- Verify admin/cashier role separation
- Check protected routes return 403 for unauthorized users
- Monitor backend logs in Vercel dashboard under **Functions**
