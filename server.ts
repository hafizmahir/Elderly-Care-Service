import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { authRouter } from './server/routes/authRoutes.js';
import { serviceRouter } from './server/routes/serviceRoutes.js';
import { locationRouter } from './server/routes/locationRoutes.js';
import { bookingRouter } from './server/routes/bookingRoutes.js';
import { invoiceRouter } from './server/routes/invoiceRoutes.js';
import { paymentRouter } from './server/routes/paymentRoutes.js';
import { adminRouter } from './server/routes/adminRoutes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount API endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/services', serviceRouter);
  app.use('/api/locations', locationRouter);
  app.use('/api/bookings', bookingRouter);
  app.use('/api/invoices', invoiceRouter);
  app.use('/api/payments', paymentRouter);
  app.use('/api/admin', adminRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Care.xyz Backend API', timestamp: new Date().toISOString() });
  });

  if (!isProd) {
    // Vite dev middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Care.xyz server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Care.xyz server:', err);
  process.exit(1);
});
