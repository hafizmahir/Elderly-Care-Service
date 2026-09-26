import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface StripePaymentModalProps {
  amount: number;
  serviceName: string;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
}

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  amount,
  serviceName,
  onSuccess,
  onClose
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Hafizur Rahman');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('889');
  const [zip, setZip] = useState('1212');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Call payment intent & verify
      const intentRes = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, serviceName })
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok) {
        throw new Error(intentData.error || 'Failed to initialize payment');
      }

      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntentId,
          cardNumber
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Card verification declined');
      }

      // Successful simulated payment
      setTimeout(() => {
        setProcessing(false);
        onSuccess(verifyData.transactionId);
      }, 700);
    } catch (err: any) {
      setProcessing(false);
      setError(err.message || 'Payment could not be completed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-tight">Stripe Secure Checkout</h3>
              <p className="text-[11px] text-slate-400">256-bit AES End-to-End Encryption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} className="p-6 space-y-4 text-xs">
          
          {/* Order Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 text-xs truncate max-w-[200px]">{serviceName}</p>
              <p className="text-[11px] text-slate-500">Care.xyz Booking Escrow Deposit</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold font-display text-emerald-800 tabular-nums">
                ${amount} USD
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Cardholder name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              Cardholder Name
            </label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              placeholder="e.g. Hafizur Rahman"
            />
          </div>

          {/* Card Number */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] flex items-center justify-between">
              <span>Card Number</span>
              <span className="text-[10px] text-emerald-700 font-medium">Stripe Test Card Ready</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                placeholder="4242 4242 4242 4242"
              />
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Expiry & CVC */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                Expires
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-center focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                placeholder="MM/YY"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                CVC
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-center focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                placeholder="123"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                Postal / Zip
              </label>
              <input
                type="text"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-center focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                placeholder="1212"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Funds held safely until caregiver arrives and completes check-in.</span>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full mt-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Stripe Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ${amount} USD with Stripe</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
