import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { useAuth } from '../context/AuthContext.js';
import { PrivateRoute } from '../components/PrivateRoute.js';
import { BookingDetailsModal } from '../components/BookingDetailsModal.js';
import { InvoiceModal } from '../components/InvoiceModal.js';
import { Booking, Invoice } from '../types/index.js';
import { usePageMetadata } from '../utils/metadata.js';
import { api } from '../lib/api.js';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  User, 
  Settings, 
  LogOut, 
  Loader2,
  AlertCircle,
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';

export const MyBookingsPageContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [activeBookingForDetails, setActiveBookingForDetails] = useState<Booking | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [cancelTargetBooking, setCancelTargetBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Schedule change');
  const [cancelling, setCancelling] = useState(false);

  usePageMetadata({
    title: 'My Bookings - Care.xyz',
    description: 'Track and manage your service bookings.'
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('care_auth_token_v1');
      const res = await fetch('/api/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.bookings && Array.isArray(data.bookings) && data.bookings.length > 0) {
          setBookings(data.bookings);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[MyBookings] Backend fetch note, using local store for Netlify:', err);
    }

    // Netlify / local storage fallback
    const local = api.getLocalBookings(user?.email);
    if (local && local.length > 0) {
      setBookings(local);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string, reason: string) => {
    try {
      const token = localStorage.getItem('care_auth_token_v1');
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        await fetchBookings();
        if (activeBookingForDetails?.id === bookingId) {
          setActiveBookingForDetails(null);
        }
        setCancelTargetBooking(null);
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const handleOpenInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`);
      const data = await res.json();
      if (data.invoice) {
        setActiveInvoice(data.invoice);
        setShowInvoiceModal(true);
      }
    } catch (err) {
      console.error('Error fetching invoice:', err);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]';
      case 'Confirmed':
        return 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]';
      case 'Completed':
        return 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]';
      case 'Cancelled':
        return 'bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3]';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getServiceThumbnail = (b: Booking) => {
    if (b.serviceId.includes('baby')) {
      return '/images/baby-care-1.jpg';
    }
    if (b.serviceId.includes('elder')) {
      return '/images/elderly-care-1.jpg';
    }
    return '/images/sick-care-1.jpg';
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#fafcfc] dark:bg-[#070d12] py-8 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Layout exactly as in image.png */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-3 space-y-1 shadow-2xs sticky top-24">
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#059669] bg-[#ecfdf5] transition-colors text-left"
            >
              <CalendarCheck className="w-4 h-4 text-[#059669]" />
              <span>My Bookings</span>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors text-left"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Logout</span>
            </button>
          </div>

          {/* Right Main Content Panel */}
          <div className="md:col-span-9 space-y-6">
            
            {/* Title exactly as in image.png */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                My Bookings
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track and manage your service bookings.
              </p>
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-28 bg-white rounded-2xl animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  No bookings found
                </h3>
                <p className="text-xs text-slate-500">
                  You haven't booked any caregiver services yet.
                </p>
                <Link
                  href="/#services"
                  className="inline-block px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-md hover:bg-[#047857]"
                >
                  Book A Service
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="card-hover-box bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={getServiceThumbnail(b)}
                          alt={b.serviceName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900">
                          {b.serviceName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {b.durationValue} {b.durationUnit} • {b.location.city}, {b.location.area}
                        </p>
                        <p className="text-sm font-bold text-[#059669] font-display tabular-nums">
                          ৳{b.totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Right: Status Pill & Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className={`text-[11px] font-semibold px-3 py-0.5 rounded-full ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveBookingForDetails(b)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => setCancelTargetBooking(b)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Cancel Confirmation Dialog */}
        {cancelTargetBooking && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-slate-900">Cancel Booking #{cancelTargetBooking.id}</h3>
                </div>
                <button
                  onClick={() => setCancelTargetBooking(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Are you sure you want to cancel your scheduled caregiver booking for <strong>{cancelTargetBooking.serviceName}</strong>?
              </p>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-700">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="Schedule change">Schedule change</option>
                  <option value="Found alternative care">Found alternative care</option>
                  <option value="Need different service type">Need different service type</option>
                  <option value="Emergency resolved">Emergency resolved</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelTargetBooking(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={async () => {
                    setCancelling(true);
                    await handleCancelBooking(cancelTargetBooking.id, cancelReason);
                    setCancelling(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Cancellation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Profile Information</h3>
                    <p className="text-[11px] text-emerald-700 font-medium">Government NID Verified Account</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Full Name</span>
                  <p className="font-semibold text-slate-900">{user?.name || 'Verified User'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Email Address</span>
                  <p className="font-semibold text-slate-900">{user?.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">National ID (NID)</span>
                  <p className="font-semibold text-slate-900 font-mono">{user?.nid || '1992451829103'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Primary Contact</span>
                  <p className="font-semibold text-slate-900">{user?.contact || '+880 1712-345678'}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Care Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" />
                  <h3 className="font-bold text-sm text-slate-900">Care Preferences</h3>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-slate-700 font-medium">Email Invoice Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-slate-700 font-medium">Caregiver Arrival SMS Alert</span>
                  <input type="checkbox" defaultChecked className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-slate-700 font-medium">Daily Caregiver Health Log</span>
                  <input type="checkbox" defaultChecked className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4" />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {activeBookingForDetails && (
          <BookingDetailsModal
            booking={activeBookingForDetails}
            onClose={() => setActiveBookingForDetails(null)}
            onCancelBooking={handleCancelBooking}
            onViewInvoice={handleOpenInvoice}
          />
        )}

        {/* Invoice Modal */}
        {showInvoiceModal && activeInvoice && (
          <InvoiceModal
            invoice={activeInvoice}
            booking={bookings.find(b => b.invoiceId === activeInvoice.invoiceNumber) || undefined}
            onClose={() => setShowInvoiceModal(false)}
          />
        )}

      </div>
    </div>
  );
};

export const MyBookingsPage: React.FC = () => {
  return (
    <PrivateRoute>
      <MyBookingsPageContent />
    </PrivateRoute>
  );
};
