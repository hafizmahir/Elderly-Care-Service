import { Router } from 'express';
import { db } from '../db.js';

export const serviceRouter = Router();

// GET /api/services
serviceRouter.get('/', (req, res) => {
  const services = db.getServices();
  res.json({ services });
});

// GET /api/services/:id
serviceRouter.get('/:id', (req, res) => {
  const service = db.getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Care service not found.' });
  }
  res.json({ service });
});
