import { Router } from 'express';
import { db } from '../db.js';

export const locationRouter = Router();

// GET /api/locations (ZapShift location resources)
locationRouter.get('/', (_req, res) => {
  const locations = db.getLocations();
  res.json({ locations });
});
