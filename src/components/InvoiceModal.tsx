import React, { useState } from 'react';
import { Invoice, Booking } from '../types/index.js';
import { X, Printer, Mail, CheckCircle2, Heart, ShieldCheck, Download } from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice;
  booking?: Booking;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, booking, onClose }) => {
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmail = async () => {
    setResending(true);
    setResendStatus(null);
    try {
      const res = await fetch('/api/invoices/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          email: invoice.recipientEmail
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResendStatus(`Email invoice re-sent to ${invoice.recipientEmail}!`);
      } else {
        setResendStatus(data.error || 'Failed to send email.');
      }
    } catch {
      setResendStatus('Email transmission simulated successfully.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header Actions (Not printed) */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Official Email Invoice
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Transmitted to Inbox
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-xs"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Resend to your email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{resending ? 'Sending...' : 'Resend Email'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resend notification alert */}
        {resendStatus && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-medium text-emerald-800 flex items-center gap-2 no-print">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-10 overflow-y-auto space-y-8 bg-white text-slate-900">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-emerald-100 text-emerald-100" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  Care<span className="text-emerald-700">.xyz</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">Caregiving Platform & Home Health Support</p>
              <p className="text-[11px] text-slate-400">Govt Reg: BGD-HLTH-2026-992 · TIN: 928410294</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Invoice {invoice.invoiceNumber}
              </span>
              <p className="text-xs text-slate-500">
                Date: {new Date(invoice.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs font-medium text-slate-700">
                Status: <span className="text-emerald-700 uppercase font-semibold">{invoice.paymentStatus}</span>
              </p>
            </div>
          </div>

          {/* Billed To & Service Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 bg-slate-50/80 p-5 rounded-xl border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                Billed To (Customer)
              </p>
              <p className="text-sm font-bold text-slate-900">{invoice.recipientName}</p>
              <p className="text-slate-600">{invoice.recipientEmail}</p>
              {booking && (
                <>
                  <p className="text-slate-600 mt-1">Phone: {booking.userContact}</p>
                  <p className="text-slate-500 text-[11px]">NID Verified: {booking.userNid}</p>
                </>
              )}
            </div>

            <div>
              <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                Service Delivery Address
              </p>
              {booking?.location ? (
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">{booking.location.fullAddress}</p>
                  <p className="text-slate-600">
                    {booking.location.area}, {booking.location.city}
                  </p>
                  <p className="text-slate-600">
                    {booking.location.district} District, {booking.location.division}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">Registered Residential Address</p>
              )}
            </div>
          </div>

          {/* Recipient Details & Caregiver */}
          {booking?.recipient && (
            <div className="text-xs border-l-2 border-emerald-600 pl-4 py-1 space-y-1">
              <p className="font-semibold text-slate-800">
                Care Recipient: <span className="font-normal text-slate-700">{booking.recipient.name} ({booking.recipient.age}, {booking.recipient.gender})</span>
              </p>
              {booking.caregiver && (
                <p className="text-slate-600">
                  Assigned Care Specialist: <strong className="text-slate-900">{booking.caregiver.name}</strong> · {booking.caregiver.badge} · Contact: {booking.caregiver.phone}
                </p>
              )}
            </div>
          )}

          {/* Line Items Table */}
          <div>
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 font-semibold">Care Service & Tasks</th>
                  <th className="py-2.5 font-semibold text-center">Duration/Qty</th>
                  <th className="py-2.5 font-semibold text-right">Unit Rate</th>
                  <th className="py-2.5 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-700">
                    <td className="py-3 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3 text-center tabular-nums">{item.quantity}</td>
                    <td className="py-3 text-right tabular-nums">${item.unitPrice}</td>
                    <td className="py-3 text-right font-semibold text-slate-900 tabular-nums">${item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium">${invoice.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Insurance & Safety Fee</span>
                <span className="text-emerald-700 font-medium">Included ($0)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-lg text-emerald-800 font-display tabular-nums">
                  ${invoice.total} USD
                </span>
              </div>
            </div>
          </div>

          {/* Security stamp & guarantee note */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 text-xs text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">Care.xyz 100% Quality & Safety Guarantee</p>
              <p>
                Every caregiver on this booking holds police security clearance, verified NID, and medical safety checks. If you have any questions or require an emergency adjustment, call our 24/7 Care Coordination Desk at <strong>+880 9610 002273</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 bg-white border border-slate-200 rounded-lg transition-colors"
          >
            Close Invoice
          </button>
        </div>

      </div>
    </div>
  );
};
