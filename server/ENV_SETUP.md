# Environment Configuration Setup

This project uses environment-specific configuration files for different deployment environments.

## Environment Files

1. **`.env.example`** - Template file showing all required environment variables (committed to git)
2. **`.env.development`** - Development environment configuration (not committed, use localhost MongoDB)
3. **`.env.production`** - Production environment configuration (not committed, use production MongoDB)

## Setup Instructions

### Development

1. Copy the development environment file:
   ```bash
   cp .env.development .env
   ```
   
   Or simply use `.env.development` directly (the app will auto-load it in development mode).

2. Ensure MongoDB is running locally:
   ```bash
   # If using MongoDB via Homebrew on macOS
   brew services start mongodb-community
   
   # Or start MongoDB manually
   mongod
   ```

3. The development config uses:
   - MongoDB: `mongodb://localhost:27017/resxcan`
   - CORS: `http://localhost:5173` (Vite dev server)
   - Log Level: `debug` (more verbose)
   - Rate Limit: 1000 requests per 15 minutes (more lenient)

### Production

1. Copy the production environment file:
   ```bash
   cp .env.production .env
   ```

2. **IMPORTANT**: Update the following values:
   - `MONGODB_URI` - Your production MongoDB connection string
   - `JWT_SECRET` - Generate a strong random secret (use `openssl rand -base64 32`)
   - `CORS_ORIGIN` - Your production frontend URL
   - `PORT` - Production port (usually 3000 or set by your hosting provider)

3. The production config uses:
   - Stricter rate limiting (100 requests per 15 minutes)
   - Less verbose logging (`info` level)
   - Production security settings

## How It Works

The application automatically loads the appropriate environment file based on `NODE_ENV`:

- `NODE_ENV=development` → loads `.env.development`
- `NODE_ENV=production` → loads `.env.production`
- If `.env` exists, it takes precedence (useful for local overrides)

## Environment Variables

All environment variables are documented in `.env.example`. Key variables:

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Allowed CORS origin
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

## Security Notes

- Never commit `.env`, `.env.development`, or `.env.production` files
- Always use strong, random secrets in production
- Rotate secrets regularly
- Use environment variables provided by your hosting platform when possible

