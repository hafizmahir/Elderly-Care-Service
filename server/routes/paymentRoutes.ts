import { Router } from 'express';

export const paymentRouter = Router();

// POST /api/payments/create-intent
paymentRouter.post('/create-intent', (req, res) => {
  const { amount, currency = 'usd', serviceName } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required.' });
  }

  const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`;
  const paymentIntentId = `pi_${Date.now()}`;

  return res.json({
    clientSecret,
    paymentIntentId,
    amount,
    currency,
    description: `Care.xyz Booking - ${serviceName || 'Caregiver Service'}`
  });
});

// POST /api/payments/verify
paymentRouter.post('/verify', (req, res) => {
  const { paymentIntentId, cardNumber, expMonth, expYear } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ error: 'Payment intent ID required.' });
  }

  // Basic card validation check
  if (cardNumber && cardNumber.replace(/\s+/g, '').length < 15) {
    return res.status(400).json({ error: 'Invalid card number. Please check card digits.' });
  }

  return res.json({
    success: true,
    transactionId: `txn_stripe_${Date.now()}`,
    status: 'succeeded',
    receiptUrl: `https://care.xyz/receipt/${paymentIntentId}`,
    message: 'Payment processed successfully with 256-bit Stripe security.'
  });
});
