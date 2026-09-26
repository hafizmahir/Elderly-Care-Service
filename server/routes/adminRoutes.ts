import { Router } from 'express';
import { db } from '../db.js';
import { mongoService } from '../mongo.js';

export const adminRouter = Router();

// GET /api/admin/db-status
adminRouter.get('/db-status', (_req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoService.status,
    timestamp: new Date().toISOString()
  });
});

function checkAdmin(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const match = token.match(/^token_(usr_[^_]+(?:_[^_]+)?)_/);
  const userId = match ? match[1] : null;
  if (!userId) return null;
  const user = db.getUserById(userId);
  return user?.role === 'admin' ? user : null;
}

// GET /api/admin/stats
adminRouter.get('/stats', (_req, res) => {
  const allBookings = db.getAllBookings();
  let totalRevenue = 0;
  let pendingCount = 0;
  let completedCount = 0;
  let confirmedCount = 0;
  let cancelledCount = 0;

  allBookings.forEach(b => {
    totalRevenue += b.totalCost;
    if (b.status === 'Pending') pendingCount++;
    else if (b.status === 'Completed') completedCount++;
    else if (b.status === 'Confirmed') confirmedCount++;
    else if (b.status === 'Cancelled') cancelledCount++;
  });

  res.json({
    stats: {
      totalBookings: allBookings.length,
      totalRevenue: totalRevenue.toLocaleString(),
      totalRevenueRaw: totalRevenue,
      pendingCount,
      completedCount,
      confirmedCount,
      cancelledCount
    }
  });
});

// USERS CRUD
adminRouter.get('/users', (_req, res) => {
  const users = db.getAllUsers();
  res.json({ users });
});

adminRouter.post('/users', (req, res) => {
  const { nid, name, email, contact, password = 'CareUser2026!', role = 'user' } = req.body;
  if (!nid || !name || !email) {
    return res.status(400).json({ error: 'NID, Name, and Email are required.' });
  }
  const user = db.createUser({ nid, name, email, contact: contact || '+8801700000000', password });
  if (role === 'admin') {
    db.updateUserRole(user.id, 'admin');
  }
  res.status(201).json({ user, message: 'User created successfully.' });
});

adminRouter.patch('/users/:id/role', (req, res) => {
  const { role } = req.body;
  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ error: 'Invalid role.' });
  }
  const updated = db.updateUserRole(req.params.id, role);
  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user: updated, message: `Role updated to ${role}.` });
});

adminRouter.delete('/users/:id', (req, res) => {
  const ok = db.deleteUser(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ message: 'User deleted successfully.' });
});

// BOOKINGS CRUD
adminRouter.get('/bookings', (_req, res) => {
  const allBookings = db.getAllBookings();
  res.json({ bookings: allBookings });
});

adminRouter.patch('/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  const updated = db.updateBookingStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  res.json({ booking: updated, message: `Booking status changed to ${status}.` });
});

adminRouter.delete('/bookings/:id', (req, res) => {
  const ok = db.deleteBooking(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  res.json({ message: 'Booking removed successfully.' });
});

// PAYMENTS
adminRouter.get('/payments', (_req, res) => {
  const allBookings = db.getAllBookings();
  const payments = allBookings.map(b => ({
    id: b.id,
    bookingId: b.id,
    user: b.userName,
    userEmail: b.userEmail,
    service: b.serviceName,
    amount: `৳${b.totalCost.toLocaleString()}`,
    amountRaw: b.totalCost,
    status: b.paymentStatus === 'paid' ? 'Paid' : (b.paymentStatus === 'refunded' ? 'Refunded' : 'Pending'),
    method: b.paymentMethod || 'cash_on_delivery',
    date: b.createdAt.split('T')[0]
  }));
  res.json({ payments });
});

// CAREGIVERS CRUD
adminRouter.get('/caregivers', (_req, res) => {
  const caregivers = db.getAllCaregivers();
  res.json({ caregivers });
});

adminRouter.post('/caregivers', (req, res) => {
  const { name, phone, email, role, badge, experience, services = ['Baby Care'] } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }
  const cg = db.addCaregiver({
    name,
    phone,
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@care.xyz`,
    role: role || 'Certified Caregiver',
    badge: badge || 'Verified Caregiver',
    experience: experience || '3 Years Experience',
    rating: 4.9,
    completedJobs: 0,
    verified: true,
    status: 'active',
    services: Array.isArray(services) ? services : [services]
  });
  res.status(201).json({ caregiver: cg, message: 'Caregiver added successfully.' });
});

adminRouter.patch('/caregivers/:id', (req, res) => {
  const updated = db.updateCaregiver(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Caregiver not found.' });
  }
  res.json({ caregiver: updated, message: 'Caregiver updated.' });
});

adminRouter.delete('/caregivers/:id', (req, res) => {
  const ok = db.deleteCaregiver(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Caregiver not found.' });
  }
  res.json({ message: 'Caregiver removed.' });
});

// SERVICES
adminRouter.get('/services', (_req, res) => {
  const services = db.getServices();
  res.json({ services });
});

adminRouter.patch('/services/:id', (req, res) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Service not found.' });
  }
  res.json({ service: updated, message: 'Service updated successfully.' });
});

// REPORTS
adminRouter.get('/reports', (_req, res) => {
  const reports = db.getReports();
  res.json({ reports });
});

// SETTINGS
adminRouter.get('/settings', (_req, res) => {
  res.json({ settings: db.getSettings() });
});

adminRouter.post('/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ settings: updated, message: 'Settings updated successfully.' });
});

