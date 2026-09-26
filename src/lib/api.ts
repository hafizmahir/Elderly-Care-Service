import { DEFAULT_SERVICES, DEFAULT_LOCATIONS } from './defaultData.js';
import { Booking, Invoice, LocationNode, Service } from '../types/index.js';

const BOOKINGS_STORAGE_KEY = 'care_user_bookings_v1';

export const api = {
  async getServices(): Promise<Service[]> {
    try {
      const res = await fetch('/api/services');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.services && Array.isArray(data.services) && data.services.length > 0) {
          return data.services;
        }
      }
    } catch (err) {
      console.warn('[API] Fallback to default services dataset on Netlify/offline:', err);
    }
    return DEFAULT_SERVICES;
  },

  async getServiceById(id: string): Promise<Service | undefined> {
    try {
      const res = await fetch(`/api/services/${id}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.service) return data.service;
      }
    } catch (err) {
      console.warn('[API] Fallback to default service detail:', err);
    }
    return DEFAULT_SERVICES.find(s => s.id === id || s.category === id);
  },

  async getLocations(): Promise<LocationNode[]> {
    try {
      const res = await fetch('/api/locations');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.locations && Array.isArray(data.locations) && data.locations.length > 0) {
          return data.locations;
        }
      }
    } catch (err) {
      console.warn('[API] Fallback to default ZapShift locations:', err);
    }
    return DEFAULT_LOCATIONS;
  },

  async createBooking(bookingData: any): Promise<{ booking: Booking; invoice: Invoice }> {
    try {
      const token = localStorage.getItem('care_auth_token_v1');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(bookingData)
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.booking && data.invoice) {
          // Also save copy to localStorage for offline / Netlify persistence
          this.saveLocalBooking(data.booking);
          return { booking: data.booking, invoice: data.invoice };
        }
      }
    } catch (err) {
      console.warn('[API] Backend unreachable, creating resilient client-side booking for Netlify:', err);
    }

    // Client-side fallback generation for Netlify
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingId = `BK-2025-${randomSuffix}`;
    const invoiceId = `INV-2025-${randomSuffix}`;
    const now = new Date().toISOString();

    const service = DEFAULT_SERVICES.find(s => s.id === bookingData.serviceId);

    const booking: Booking = {
      ...bookingData,
      id: bookingId,
      invoiceId,
      status: bookingData.status || (bookingData.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'),
      createdAt: now,
      updatedAt: now,
      caregiver: service?.sampleCaregiver
        ? {
            name: service.sampleCaregiver.name,
            phone: '+88017' + Math.floor(10000000 + Math.random() * 90000000),
            badge: `${service.sampleCaregiver.role} (${service.sampleCaregiver.experience})`,
            avatarInitials: service.sampleCaregiver.name.split(' ').map(n => n[0]).slice(0, 2).join('')
          }
        : undefined
    };

    const invoice: Invoice = {
      id: invoiceId,
      bookingId,
      invoiceNumber: invoiceId,
      issuedAt: now,
      recipientEmail: bookingData.userEmail,
      recipientName: bookingData.userName,
      items: [
        {
          description: `${booking.serviceName} (${booking.durationValue} ${booking.durationUnit})`,
          unitPrice: booking.unitRate,
          quantity: booking.durationValue,
          total: booking.subtotal
        }
      ],
      subtotal: booking.subtotal,
      tax: 0,
      total: booking.totalCost,
      paymentStatus: booking.paymentStatus === 'paid' ? 'paid' : 'pending',
      status: 'delivered'
    };

    this.saveLocalBooking(booking);
    return { booking, invoice };
  },

  getLocalBookings(userEmail?: string): Booking[] {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) {
        const parsed: Booking[] = JSON.parse(saved);
        if (userEmail) {
          return parsed.filter(b => b.userEmail?.toLowerCase() === userEmail.toLowerCase());
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  },

  saveLocalBooking(booking: Booking) {
    try {
      const current = this.getLocalBookings();
      const filtered = current.filter(b => b.id !== booking.id);
      filtered.unshift(booking);
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }
};
