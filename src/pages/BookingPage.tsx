import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { useAuth } from '../context/AuthContext.js';
import { PrivateRoute } from '../components/PrivateRoute.js';
import { StripePaymentModal } from '../components/StripePaymentModal.js';
import { InvoiceModal } from '../components/InvoiceModal.js';
import { Service, LocationNode, Booking, Invoice } from '../types/index.js';
import { usePageMetadata } from '../utils/metadata.js';
import { api } from '../lib/api.js';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  MailCheck,
  CreditCard
} from 'lucide-react';

export const BookingPageContent: React.FC = () => {
  const { params, navigate } = useRouter();
  const { user } = useAuth();
  const serviceId = params.service_id || 'baby-care';

  const [service, setService] = useState<Service | null>(null);
  const [locations, setLocations] = useState<LocationNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stepper state: 1: Duration, 2: Location, 3: Confirm, 4: Payment
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dynamic Metadata
  usePageMetadata({
    title: service ? `Book ${service.name} - Care.xyz` : 'Book Care Service - Care.xyz',
    description: 'Book verified caretakers in Bangladesh. Dynamic duration, location selection, and instant email invoice.'
  });

  // Booking Form State
  const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>('hours');
  const [durationValue, setDurationValue] = useState<number>(4);
  const [shiftType, setShiftType] = useState<'day' | 'night' | 'full_day'>('day');

  // ZapShift Hierarchical Location
  const [selectedDivision, setSelectedDivision] = useState<string>('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dhaka');
  const [selectedCity, setSelectedCity] = useState<string>('Dhaka');
  const [selectedArea, setSelectedArea] = useState<string>('Dhanmondi');
  const [fullAddress, setFullAddress] = useState<string>('House 12, Road 5, Dhanmondi, Dhaka');

  // Recipient details
  const [recipientName, setRecipientName] = useState<string>(user?.name || '');
  const [emergencyContact, setEmergencyContact] = useState<string>(user?.contact || '+8801712345678');

  // Payment & Invoicing
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'stripe'>('cash_on_delivery');
  const [showStripeModal, setShowStripeModal] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      api.getServiceById(serviceId),
      api.getLocations()
    ])
      .then(([srvData, locData]) => {
        if (srvData) setService(srvData);
        if (locData && locData.length > 0) {
          setLocations(locData);
          const firstDiv = locData[0];
          if (firstDiv) {
            setSelectedDivision(firstDiv.division);
            const firstDist = firstDiv.districts[0];
            if (firstDist) {
              setSelectedDistrict(firstDist.name);
              const firstCity = firstDist.cities[0];
              if (firstCity) {
                setSelectedCity(firstCity.name);
                setSelectedArea(firstCity.areas[0] || 'Dhanmondi');
              }
            }
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Error fetching booking data:', err);
        setError('Failed to load booking resources. Please refresh.');
        setLoading(false);
      });
  }, [serviceId]);

  const handleDivisionChange = (divName: string) => {
    setSelectedDivision(divName);
    const div = locations.find(l => l.division === divName);
    if (div && div.districts.length > 0) {
      const dist = div.districts[0];
      setSelectedDistrict(dist.name);
      if (dist.cities.length > 0) {
        const city = dist.cities[0];
        setSelectedCity(city.name);
        setSelectedArea(city.areas[0] || '');
      }
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const div = locations.find(l => l.division === selectedDivision);
    const dist = div?.districts.find(d => d.name === distName);
    if (dist && dist.cities.length > 0) {
      const city = dist.cities[0];
      setSelectedCity(city.name);
      setSelectedArea(city.areas[0] || '');
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const div = locations.find(l => l.division === selectedDivision);
    const dist = div?.districts.find(d => d.name === selectedDistrict);
    const city = dist?.cities.find(c => c.name === cityName);
    if (city && city.areas.length > 0) {
      setSelectedArea(city.areas[0]);
    }
  };

  // Dynamic Total Cost = Duration × Service Charge
  const unitRate = service
    ? durationUnit === 'hours'
      ? service.hourlyRate
      : service.dailyRate
    : 300;

  const totalCost = durationValue * unitRate;

  const executeBooking = async (stripeId?: string) => {
    setSubmitting(true);
    setError(null);

    const bookingPayload = {
      serviceId,
      durationUnit,
      durationValue,
      shiftType,
      location: {
        division: selectedDivision,
        district: selectedDistrict,
        city: selectedCity,
        area: selectedArea,
        fullAddress: fullAddress.trim() || `${selectedArea}, ${selectedCity}`
      },
      recipient: {
        name: recipientName || user?.name || 'Family Member',
        emergencyContact: emergencyContact || user?.contact || '+8801712345678'
      },
      paymentMethod: stripeId ? 'stripe' : paymentMethod,
      stripePaymentId: stripeId
    };

    try {
      const { booking, invoice } = await api.createBooking({
        ...bookingPayload,
        userId: user?.id || `usr_${Date.now()}`,
        userName: user?.name || recipientName || 'Client',
        userEmail: user?.email || 'user@care.xyz',
        userContact: user?.contact || emergencyContact || '+8801700000000',
        userNid: user?.nid || '19922694589001234',
        serviceName: service?.name || 'Care Service',
        serviceCategory: service?.category || 'general',
        unitRate,
        subtotal: totalCost,
        addOnsTotal: 0,
        totalCost,
        paymentStatus: stripeId ? 'paid' : (paymentMethod === 'stripe' ? 'paid' : 'pending'),
        status: stripeId ? 'Confirmed' : 'Pending',
        startDate: new Date().toISOString().split('T')[0]
      });

      setCreatedBooking(booking);
      setCreatedInvoice(invoice);
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || 'An error occurred while confirming your booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceed = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (paymentMethod === 'stripe') {
        setShowStripeModal(true);
      } else {
        executeBooking();
      }
    }
  };

  const handleStripeSuccess = (paymentId: string) => {
    setShowStripeModal(false);
    executeBooking(paymentId);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading booking options...</p>
      </div>
    );
  }

  const currentDivObj = locations.find(l => l.division === selectedDivision);
  const currentDistricts = currentDivObj ? currentDivObj.districts : [];
  const currentDistObj = currentDistricts.find(d => d.name === selectedDistrict);
  const currentCities = currentDistObj ? currentDistObj.cities : [];
  const currentCityObj = currentCities.find(c => c.name === selectedCity);
  const currentAreas = currentCityObj ? currentCityObj.areas : [];

  return (
    <div className="min-h-screen bg-[#fafcfc] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Book Your Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete the steps below to confirm your booking.
          </p>
        </div>

        {/* 4-Step Stepper Bar matching image.png */}
        <div className="flex items-center justify-between max-w-xl mx-auto mb-10 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep >= 1 ? 'bg-[#008774] text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              1
            </span>
            <span className={currentStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
              Duration
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep >= 2 ? 'bg-[#008774] text-white' : 'text-slate-500'
            }`}>
              2
            </span>
            <span className={currentStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
              Location
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep >= 3 ? 'bg-[#008774] text-white' : 'text-slate-500'
            }`}>
              3
            </span>
            <span className={currentStep >= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
              Confirm
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep >= 4 ? 'bg-[#008774] text-white' : 'text-slate-500'
            }`}>
              4
            </span>
            <span className={currentStep >= 4 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
              Payment
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Confirmation Card */}
        {createdBooking && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Booking Confirmed! (Status: {createdBooking.status})
                  </h3>
                  <p className="text-xs text-slate-600">
                    Booking ID: <strong>{createdBooking.id}</strong> · Email invoice sent to <strong>{createdBooking.userEmail}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {createdInvoice && (
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
                  >
                    <MailCheck className="w-3.5 h-3.5" />
                    <span>View Email Invoice</span>
                  </button>
                )}
                <Link
                  href="/my-bookings"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Go to My Bookings
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showInvoiceModal && createdInvoice && (
          <InvoiceModal
            invoice={createdInvoice}
            booking={createdBooking || undefined}
            onClose={() => setShowInvoiceModal(false)}
          />
        )}

        {showStripeModal && service && (
          <StripePaymentModal
            amount={totalCost}
            serviceName={service.name}
            onSuccess={handleStripeSuccess}
            onClose={() => setShowStripeModal(false)}
          />
        )}

        {/* Main 2-Column Booking Layout as in Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Service Details & 1. Select Duration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Service Details Card Header */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Service Details
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={service?.imageUrl}
                    alt={service?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{service?.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Service Charge <span className="font-semibold text-slate-900">৳{unitRate} / {durationUnit === 'hours' ? 'hour' : 'day'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 1. Select Duration */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900">
                1. Select Duration
              </h3>

              {/* Hours / Days toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDurationUnit('hours');
                    setDurationValue(4);
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    durationUnit === 'hours'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hours</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDurationUnit('days');
                    setDurationValue(1);
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    durationUnit === 'days'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Days</span>
                </button>
              </div>

              {/* Duration dropdown */}
              <div className="space-y-1">
                <select
                  value={durationValue}
                  onChange={(e) => setDurationValue(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  {durationUnit === 'hours' ? (
                    <>
                      <option value={2}>2 hours</option>
                      <option value={4}>4 hours</option>
                      <option value={6}>6 hours</option>
                      <option value={8}>8 hours</option>
                      <option value={12}>12 hours</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>1 day</option>
                      <option value={2}>2 days</option>
                      <option value={3}>3 days</option>
                      <option value={5}>5 days</option>
                      <option value={7}>7 days</option>
                      <option value={14}>14 days</option>
                    </>
                  )}
                </select>
              </div>

              {/* Calculation Summary Lines exactly as in mockup */}
              <div className="space-y-1 text-xs text-slate-700 pt-1">
                <p>Total {durationUnit === 'hours' ? 'Hours' : 'Days'}: <strong>{durationValue}</strong></p>
                <p>
                  Service Charge: ৳{unitRate} × {durationValue} = <strong className="text-slate-900">৳{totalCost.toLocaleString()}</strong>
                </p>
              </div>

              {/* Next Button inside left card */}
              <button
                type="button"
                onClick={handleProceed}
                disabled={submitting}
                className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-md shadow-xs transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: 2. Select Location */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            <h3 className="text-xs font-bold text-slate-900">
              2. Select Location
            </h3>

            {/* Division */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Division</label>
              <select
                value={selectedDivision}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                {locations.map(l => (
                  <option key={l.division} value={l.division}>{l.division}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                {currentDistricts.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">City</label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                {currentCities.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Area</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                {currentAreas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Full Address */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Full Address</label>
              <input
                type="text"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-[11px] font-semibold text-slate-600">Payment Option</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-2 rounded-lg border text-left ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Pay on Arrival
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                    paymentMethod === 'stripe'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span>Stripe Card</span>
                  <CreditCard className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Total Cost Row as shown in Mockup */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">Total Cost</span>
              <span className="text-xl font-bold font-display text-[#059669] tabular-nums">
                ৳{totalCost.toLocaleString()}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export const BookingPage: React.FC = () => {
  return (
    <PrivateRoute>
      <BookingPageContent />
    </PrivateRoute>
  );
};
