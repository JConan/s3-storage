# Webapp Deployment Guide

## Development Mode Setup

For development, we'll run both the QR code app's Vite dev server and the storage backend, with the backend proxying requests to Vite.

### Development Setup

1. Start the QR code app's dev server:
```bash
cd qr-code-app
pnpm run dev
```

2. Update the storage app's Express server (storage/src/index.ts) to proxy requests to Vite:
```typescript
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Proxy requests to Vite dev server in development
if (process.env.NODE_ENV === 'development') {
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      ws: true, // For WebSocket support
    })
  );
}

// Existing routes and middleware
// ...
```

3. Install the proxy middleware in the storage app:
```bash
cd storage
pnpm add http-proxy-middleware
```

4. Start the storage backend in development mode:
```bash
NODE_ENV=development pnpm start
```

The web application will be available at:
http://localhost:3000

## Production Mode Setup

[Previous production setup content remains unchanged...]

### Running the Application

1. For development:
```bash
# In one terminal
cd qr-code-app && pnpm run dev

# In another terminal
cd storage && NODE_ENV=development pnpm start
```

2. For production:
[Previous production instructions remain unchanged...]

### Environment Configuration

[Previous environment configuration remains unchanged...]

### Deployment Considerations

[Previous deployment considerations remain unchanged...]