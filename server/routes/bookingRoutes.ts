import { Router } from 'express';
import { db } from '../db.js';

export const bookingRouter = Router();

function getAuthenticatedUser(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const match = token.match(/^token_(usr_[^_]+(?:_[^_]+)?)_/);
  const userId = match ? match[1] : null;
  if (!userId) return null;
  return db.getUserById(userId);
}

// POST /api/bookings
bookingRouter.post('/', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Please login to book a care service.' });
  }

  const {
    serviceId,
    durationUnit = 'hours',
    durationValue = 4,
    shiftType = 'day',
    startDate,
    endDate,
    location,
    recipient,
    paymentMethod = 'cash_on_delivery',
    stripePaymentId
  } = req.body;

  if (!serviceId) {
    return res.status(400).json({ error: 'Service ID is required.' });
  }

  const service = db.getServiceById(serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Selected care service does not exist.' });
  }

  const durVal = Number(durationValue) || 1;
  const isHourly = durationUnit === 'hours';
  const unitRate = isHourly ? service.hourlyRate : service.dailyRate;
  const baseCalculated = durVal * unitRate;
  const totalCost = baseCalculated;

  const paymentStatus = stripePaymentId ? 'paid' : (paymentMethod === 'stripe' ? 'paid' : 'pending');

  const { booking, invoice } = db.createBooking({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userContact: user.contact,
    userNid: user.nid,
    serviceId: service.id,
    serviceName: service.name,
    serviceCategory: service.category,
    durationUnit: isHourly ? 'hours' : 'days',
    durationValue: durVal,
    shiftType: shiftType || 'day',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate,
    unitRate,
    subtotal: baseCalculated,
    addOnsTotal: 0,
    totalCost,
    paymentStatus,
    paymentMethod,
    stripePaymentId,
    status: paymentStatus === 'paid' ? 'Confirmed' : 'Pending',
    location: {
      division: location?.division || 'Dhaka',
      district: location?.district || 'Dhaka',
      city: location?.city || 'Dhaka',
      area: location?.area || 'Dhanmondi',
      fullAddress: location?.fullAddress || 'House 12, Road 5, Dhanmondi, Dhaka'
    },
    recipient: {
      name: recipient?.name || user.name,
      age: recipient?.age || 'Not specified',
      gender: recipient?.gender || 'other',
      specialRequirements: recipient?.specialRequirements || 'Standard care requested',
      emergencyContact: recipient?.emergencyContact || user.contact
    }
  });

  return res.status(201).json({
    message: 'Booking created successfully! Status is set to ' + booking.status + '.',
    booking,
    invoice
  });
});

// GET /api/bookings/my
bookingRouter.get('/my', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please login to view bookings.' });
  }

  const bookings = db.getBookingsByUser(user.id);
  return res.json({ bookings });
});

// GET /api/bookings/:id
bookingRouter.get('/:id', (req, res) => {
  const user = getAuthenticatedUser(req);
  const booking = db.getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const invoice = db.getInvoiceByBookingId(booking.id);
  return res.json({ booking, invoice });
});

// PATCH /api/bookings/:id/cancel
bookingRouter.patch('/:id/cancel', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please login.' });
  }

  const booking = db.getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const { reason = 'Cancelled by user' } = req.body;
  const updated = db.cancelBooking(booking.id, reason);

  return res.json({
    message: 'Booking has been cancelled.',
    booking: updated
  });
});

// PATCH /api/bookings/:id/status
bookingRouter.patch('/:id/status', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin permission required to update status.' });
  }

  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status.` });
  }

  const updated = db.updateBookingStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  return res.json({
    message: `Booking status changed to ${status}`,
    booking: updated
  });
});
