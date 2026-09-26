import React, { useState } from 'react';
import { Booking } from '../types/index.js';
import { X, Calendar, Clock, MapPin, User, ShieldCheck, Phone, AlertTriangle, FileText, Ban } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onCancelBooking: (bookingId: string, reason: string) => Promise<void>;
  onViewInvoice: (invoiceId: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onCancelBooking,
  onViewInvoice
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');
  const [cancelling, setCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    setCancelling(true);
    await onCancelBooking(booking.id, cancelReason);
    setCancelling(false);
    setShowCancelConfirm(false);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold text-lg text-slate-900">
              Booking {booking.id}
            </span>
            <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Main Service Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/60 p-5 rounded-xl border border-emerald-100">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Service Booked</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{booking.serviceName}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>Start Date: {booking.startDate}</span>
                <span>·</span>
                <span>{booking.durationValue} {booking.durationUnit}</span>
                <span>·</span>
                <span className="capitalize">{booking.shiftType.replace('_', ' ')}</span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500">Total Calculated Cost</span>
              <p className="text-2xl font-bold font-display text-emerald-800 tabular-nums">
                ${booking.totalCost} USD
              </p>
              <p className="text-[11px] text-slate-500 uppercase mt-0.5 font-medium">
                Payment: <strong className="text-slate-800">{booking.paymentStatus === 'paid' ? 'Paid (Stripe/Card)' : 'Pending on Arrival'}</strong>
              </p>
            </div>
          </div>

          {/* Assigned Care Specialist */}
          {booking.caregiver && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assigned Certified Care Specialist
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> NID & Police Verified
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                  {booking.caregiver.avatarInitials || 'CR'}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-slate-900">{booking.caregiver.name}</h4>
                  <p className="text-xs text-slate-500">{booking.caregiver.badge}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Direct Contact: {booking.caregiver.phone}</span>
                </div>
                <span className="text-slate-400">Available during shift</span>
              </div>
            </div>
          )}

          {/* Location Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Service Location (ZapShift Resource)
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
              <p className="font-medium text-slate-900 text-sm">{booking.location.fullAddress}</p>
              <p className="text-slate-600">
                Area: <strong>{booking.location.area}</strong>, City: <strong>{booking.location.city}</strong>
              </p>
              <p className="text-slate-600">
                District: <strong>{booking.location.district}</strong> · Division: <strong>{booking.location.division}</strong>
              </p>
            </div>
          </div>

          {/* Care Recipient & Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Care Recipient</span>
              <p className="font-medium text-slate-900">{booking.recipient.name}</p>
              <p className="text-xs text-slate-500">
                Age: {booking.recipient.age} · Gender: <span className="capitalize">{booking.recipient.gender}</span>
              </p>
              <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2 rounded">
                "{booking.recipient.specialRequirements}"
              </p>
            </div>

            <div className="border border-slate-200 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emergency Contact</span>
              <p className="font-medium text-slate-900">{booking.userName}</p>
              <p className="text-xs text-slate-600">Phone: {booking.recipient.emergencyContact}</p>
              <p className="text-xs text-slate-600">Email: {booking.userEmail}</p>
              <p className="text-[11px] text-emerald-700 mt-2">Care.xyz Rapid Care Desk: +880 9610 002273</p>
            </div>
          </div>

          {/* Cancel Booking Form Trigger */}
          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
            <div className="pt-2">
              {showCancelConfirm ? (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Are you sure you want to cancel this care booking?
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Reason for cancellation:</label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Schedule conflict">Schedule conflict</option>
                      <option value="Family member recovered / alternative arranged">Family member recovered / alternative arranged</option>
                      <option value="Booking details mistake">Booking details mistake</option>
                      <option value="Travel / Relocation">Travel / Relocation</option>
                      <option value="Other reason">Other reason</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                    >
                      Keep Booking
                    </button>
                    <button
                      onClick={handleConfirmCancel}
                      disabled={cancelling}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                    >
                      {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
                >
                  <Ban className="w-3.5 h-3.5" />
                  Cancel this Booking
                </button>
              )}
            </div>
          )}

          {booking.status === 'Cancelled' && booking.cancellationReason && (
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-xs text-rose-800">
              <strong>Cancellation Reason:</strong> {booking.cancellationReason}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onViewInvoice(booking.invoiceId);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            View Email Invoice
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-white border border-slate-200 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
