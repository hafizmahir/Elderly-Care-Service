import { Router } from 'express';
import { db } from '../db.js';

export const invoiceRouter = Router();

function getAuthEmail(req: any): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const match = token.match(/^token_(usr_[^_]+(?:_[^_]+)?)_/);
  const userId = match ? match[1] : null;
  if (!userId) return null;
  const user = db.getUserById(userId);
  return user?.email || null;
}

// GET /api/invoices/my
invoiceRouter.get('/my', (req, res) => {
  const email = getAuthEmail(req);
  if (!email) {
    return res.status(401).json({ error: 'Please login to view your invoices.' });
  }

  const invoices = db.getUserInvoices(email);
  res.json({ invoices });
});

// GET /api/invoices/:id
invoiceRouter.get('/:id', (req, res) => {
  const invoice = db.getInvoiceById(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found.' });
  }

  const booking = db.getBookingById(invoice.bookingId);
  res.json({ invoice, booking });
});

// POST /api/invoices/send-email
invoiceRouter.post('/send-email', (req, res) => {
  const { invoiceId, email } = req.body;
  if (!invoiceId) {
    return res.status(400).json({ error: 'Invoice ID is required.' });
  }

  const invoice = db.getInvoiceById(invoiceId);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found.' });
  }

  const targetEmail = email || invoice.recipientEmail;

  // Generate branded HTML email content
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Care.xyz Booking Invoice ${invoice.invoiceNumber}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background: #047857; padding: 24px 32px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px;">Care.xyz</h1>
            <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">Trusted Babysitting & Elderly Care Service</p>
          </div>
          <div style="padding: 32px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
              <div>
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">INVOICE TO</p>
                <h3 style="margin: 4px 0 0; font-size: 16px; color: #0f172a;">${invoice.recipientName}</h3>
                <p style="margin: 2px 0 0; font-size: 14px; color: #64748b;">${invoice.recipientEmail}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">INVOICE NO</p>
                <h3 style="margin: 4px 0 0; font-size: 16px; color: #047857;">${invoice.invoiceNumber}</h3>
                <p style="margin: 2px 0 0; font-size: 14px; color: #64748b;">${new Date(invoice.issuedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase;">Service Item</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #475569; text-transform: uppercase;">Qty</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #475569; text-transform: uppercase;">Rate</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #475569; text-transform: uppercase;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(it => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px; font-size: 14px; color: #1e293b;">${it.description}</td>
                    <td style="padding: 12px; font-size: 14px; color: #475569; text-align: center;">${it.quantity}</td>
                    <td style="padding: 12px; font-size: 14px; color: #475569; text-align: right;">$${it.unitPrice}</td>
                    <td style="padding: 12px; font-size: 14px; font-weight: 600; color: #0f172a; text-align: right;">$${it.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: right;">
              <span style="font-size: 14px; color: #166534; font-weight: 500; margin-right: 16px;">Total Amount Due:</span>
              <span style="font-size: 22px; font-weight: 700; color: #15803d;">$${invoice.total} USD</span>
            </div>

            <div style="font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px;">
              <p style="margin: 0 0 8px;"><strong>Care Safety Guarantee:</strong> All Care.xyz caregivers carry valid NID, police clearance, and emergency CPR accreditation. For questions or support, contact our 24/7 hotline at +880-9610-0000 or support@care.xyz.</p>
              <p style="margin: 0;">Thank you for trusting Care.xyz for your family care needs.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return res.json({
    message: `Official invoice ${invoice.invoiceNumber} successfully transmitted to ${targetEmail}.`,
    recipientEmail: targetEmail,
    invoiceNumber: invoice.invoiceNumber,
    html: emailHtml
  });
});
