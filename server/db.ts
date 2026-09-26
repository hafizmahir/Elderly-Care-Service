import { Booking, Invoice, SERVICES, Service, User, ZAPSHIFT_LOCATIONS, Caregiver, DEFAULT_CAREGIVERS } from './data.js';
import { mongoService, UserDoc, BookingDoc } from './mongo.js';

class DatabaseStore {
  private users: Map<string, User> = new Map();
  private userPasswords: Map<string, string> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private caregivers: Map<string, Caregiver> = new Map();
  private services: Service[] = [...SERVICES];
  private systemSettings = {
    platformName: 'Care.xyz',
    supportPhone: '+880 9610-0000',
    supportEmail: 'support@care.xyz',
    mongoUriMasked: 'mongodb+srv://CareService:****@cluster0.owqcpnx.mongodb.net/care_service',
    firebaseProject: 'care-service-d94f7',
    zapShiftSyncActive: true,
    emailInvoiceActive: true
  };

  constructor() {
    this.seed();
    // Non-blocking MongoDB initialization
    mongoService.init().then((connected) => {
      if (connected) {
        console.log('[DatabaseStore] MongoDB Atlas synchronized with memory store.');
      }
    }).catch(err => {
      console.warn('[DatabaseStore] Mongo init non-fatal note:', err.message);
    });
  }

  private seed() {
    // Seed Demo User
    const demoUser: User = {
      id: 'usr_demo_hafiz',
      nid: '19922694589001234',
      name: 'Hafizur Rahman',
      email: 'hafizurrahmanhafiz146@gmail.com',
      contact: '+8801712345678',
      role: 'user',
      createdAt: '2025-08-15T10:00:00.000Z'
    };
    this.users.set(demoUser.id, demoUser);
    this.users.set(demoUser.email.toLowerCase(), demoUser);
    this.userPasswords.set(demoUser.email.toLowerCase(), 'Care2026!');

    // Seed Admin User
    const adminUser: User = {
      id: 'usr_admin_care',
      nid: '19882694589009999',
      name: 'Care Admin',
      email: 'admin@care.xyz',
      contact: '+8801811223344',
      role: 'admin',
      createdAt: '2025-01-01T10:00:00.000Z'
    };
    this.users.set(adminUser.id, adminUser);
    this.users.set(adminUser.email.toLowerCase(), adminUser);
    this.userPasswords.set(adminUser.email.toLowerCase(), 'AdminCare2026!');

    // 1. Seed Booking: Baby Care (Pending, ৳1,200) exactly as shown in My Bookings
    const booking1: Booking = {
      id: 'BK-2025-001',
      userId: demoUser.id,
      userName: demoUser.name,
      userEmail: demoUser.email,
      userContact: demoUser.contact,
      userNid: demoUser.nid,
      serviceId: 'baby-care',
      serviceName: 'Baby Care',
      serviceCategory: 'baby',
      durationUnit: 'hours',
      durationValue: 4,
      shiftType: 'day',
      startDate: '2025-09-20',
      unitRate: 300,
      subtotal: 1200,
      addOnsTotal: 0,
      totalCost: 1200,
      paymentStatus: 'pending',
      paymentMethod: 'cash_on_delivery',
      status: 'Pending',
      createdAt: '2025-09-20T08:30:00.000Z',
      updatedAt: '2025-09-20T08:30:00.000Z',
      location: {
        division: 'Dhaka',
        district: 'Dhaka',
        city: 'Dhaka',
        area: 'Dhanmondi',
        fullAddress: 'House 12, Road 5, Dhanmondi, Dhaka'
      },
      recipient: {
        name: 'Ayaan Rahman (Toddler)',
        age: '2 Years',
        gender: 'male',
        specialRequirements: 'Play supervision and afternoon nap routine',
        emergencyContact: demoUser.contact
      },
      caregiver: {
        name: 'Farzana Sultana',
        phone: '+8801711223344',
        badge: 'Certified Montessori Nanny',
        avatarInitials: 'FS'
      },
      invoiceId: 'INV-2025-001'
    };

    const invoice1: Invoice = {
      id: 'INV-2025-001',
      bookingId: booking1.id,
      invoiceNumber: 'INV-2025-001',
      issuedAt: booking1.createdAt,
      recipientEmail: demoUser.email,
      recipientName: demoUser.name,
      items: [
        {
          description: 'Baby Care Service (4 Hours Day Shift)',
          unitPrice: 300,
          quantity: 4,
          total: 1200
        }
      ],
      subtotal: 1200,
      tax: 0,
      total: 1200,
      paymentStatus: 'pending',
      status: 'sent'
    };

    // 2. Seed Booking: Elderly Service (Confirmed, ৳2,500)
    const booking2: Booking = {
      id: 'BK-2025-002',
      userId: demoUser.id,
      userName: demoUser.name,
      userEmail: demoUser.email,
      userContact: demoUser.contact,
      userNid: demoUser.nid,
      serviceId: 'elderly-service',
      serviceName: 'Elderly Service',
      serviceCategory: 'elderly',
      durationUnit: 'days',
      durationValue: 1,
      shiftType: 'day',
      startDate: '2025-09-19',
      unitRate: 2500,
      subtotal: 2500,
      addOnsTotal: 0,
      totalCost: 2500,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      stripePaymentId: 'ch_stripe_2500_demo',
      status: 'Confirmed',
      createdAt: '2025-09-19T09:00:00.000Z',
      updatedAt: '2025-09-19T09:15:00.000Z',
      location: {
        division: 'Khulna',
        district: 'Khulna',
        city: 'Khulna',
        area: 'Sonadanga',
        fullAddress: 'Holding 45, Road 2, Sonadanga R/A, Khulna'
      },
      recipient: {
        name: 'Abdul Malek (Senior)',
        age: 76,
        gender: 'male',
        specialRequirements: 'Medication assistance and walking companionship',
        emergencyContact: demoUser.contact
      },
      caregiver: {
        name: 'Mohammad Rafiqul Islam',
        phone: '+8801822334455',
        badge: 'Senior Care Companion',
        avatarInitials: 'RI'
      },
      invoiceId: 'INV-2025-002'
    };

    const invoice2: Invoice = {
      id: 'INV-2025-002',
      bookingId: booking2.id,
      invoiceNumber: 'INV-2025-002',
      issuedAt: booking2.createdAt,
      recipientEmail: demoUser.email,
      recipientName: demoUser.name,
      items: [
        {
          description: 'Elderly Service (1 Day Companion Shift)',
          unitPrice: 2500,
          quantity: 1,
          total: 2500
        }
      ],
      subtotal: 2500,
      tax: 0,
      total: 2500,
      paymentStatus: 'paid',
      status: 'delivered'
    };

    // 3. Seed Booking: Sick People Service (Completed, ৳7,500)
    const booking3: Booking = {
      id: 'BK-2025-003',
      userId: demoUser.id,
      userName: demoUser.name,
      userEmail: demoUser.email,
      userContact: demoUser.contact,
      userNid: demoUser.nid,
      serviceId: 'sick-people-service',
      serviceName: 'Sick People Service',
      serviceCategory: 'sick',
      durationUnit: 'days',
      durationValue: 3,
      shiftType: 'day',
      startDate: '2025-09-18',
      unitRate: 2500,
      subtotal: 7500,
      addOnsTotal: 0,
      totalCost: 7500,
      paymentStatus: 'paid',
      paymentMethod: 'card',
      status: 'Completed',
      createdAt: '2025-09-18T07:45:00.000Z',
      updatedAt: '2025-09-21T18:00:00.000Z',
      location: {
        division: 'Rajshahi',
        district: 'Rajshahi',
        city: 'Rajshahi',
        area: 'Lakshmipur',
        fullAddress: 'House 8, Medical College Road, Lakshmipur, Rajshahi'
      },
      recipient: {
        name: 'Rashida Begum (Post-op)',
        age: 68,
        gender: 'female',
        specialRequirements: 'Post-surgery wound dressing and vitals monitoring',
        emergencyContact: demoUser.contact
      },
      caregiver: {
        name: 'Nurse Nusrat Jahan, RN',
        phone: '+8801933445566',
        badge: 'Clinical Care Specialist',
        avatarInitials: 'NJ'
      },
      invoiceId: 'INV-2025-003'
    };

    const invoice3: Invoice = {
      id: 'INV-2025-003',
      bookingId: booking3.id,
      invoiceNumber: 'INV-2025-003',
      issuedAt: booking3.createdAt,
      recipientEmail: demoUser.email,
      recipientName: demoUser.name,
      items: [
        {
          description: 'Sick People Service (3 Days Clinical Home Care)',
          unitPrice: 2500,
          quantity: 3,
          total: 7500
        }
      ],
      subtotal: 7500,
      tax: 0,
      total: 7500,
      paymentStatus: 'paid',
      status: 'delivered'
    };

    this.bookings.set(booking1.id, booking1);
    this.invoices.set(invoice1.id, invoice1);
    this.bookings.set(booking2.id, booking2);
    this.invoices.set(invoice2.id, invoice2);
    this.bookings.set(booking3.id, booking3);
    this.invoices.set(invoice3.id, invoice3);

    // Seed additional admin bookings to match the screenshot table
    const adminBooking1: Booking = {
      id: 'BK-2025-104',
      userId: 'usr_ayesha',
      userName: 'Ayesha Rahman',
      userEmail: 'ayesha@example.com',
      userContact: '+8801700112233',
      userNid: '19952694589001111',
      serviceId: 'baby-care',
      serviceName: 'Baby Care',
      serviceCategory: 'baby',
      durationUnit: 'hours',
      durationValue: 4,
      shiftType: 'day',
      startDate: '2025-09-20',
      unitRate: 300,
      subtotal: 1200,
      addOnsTotal: 0,
      totalCost: 1200,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      status: 'Pending',
      createdAt: '2025-09-20T10:00:00.000Z',
      updatedAt: '2025-09-20T10:00:00.000Z',
      location: { division: 'Dhaka', district: 'Dhaka', city: 'Dhaka', area: 'Dhanmondi', fullAddress: 'House 12, Dhanmondi' },
      recipient: { name: 'Zara', age: '1.5 yrs', gender: 'female', specialRequirements: 'Routine care', emergencyContact: '+8801700112233' },
      invoiceId: 'INV-2025-104'
    };

    const adminBooking2: Booking = {
      id: 'BK-2025-105',
      userId: 'usr_hasan',
      userName: 'Md. Hasan',
      userEmail: 'hasan@example.com',
      userContact: '+8801700223344',
      userNid: '19912694589002222',
      serviceId: 'elderly-service',
      serviceName: 'Elderly Service',
      serviceCategory: 'elderly',
      durationUnit: 'days',
      durationValue: 1,
      shiftType: 'day',
      startDate: '2025-09-19',
      unitRate: 2500,
      subtotal: 2500,
      addOnsTotal: 0,
      totalCost: 2500,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      status: 'Confirmed',
      createdAt: '2025-09-19T09:30:00.000Z',
      updatedAt: '2025-09-19T09:30:00.000Z',
      location: { division: 'Khulna', district: 'Khulna', city: 'Khulna', area: 'Sonadanga', fullAddress: 'Sonadanga R/A' },
      recipient: { name: 'Parent', age: 72, gender: 'male', specialRequirements: 'Companionship', emergencyContact: '+8801700223344' },
      invoiceId: 'INV-2025-105'
    };

    const adminBooking3: Booking = {
      id: 'BK-2025-106',
      userId: 'usr_nusrat',
      userName: 'Nusrat Jahan',
      userEmail: 'nusrat@example.com',
      userContact: '+8801700334455',
      userNid: '19932694589003333',
      serviceId: 'sick-people-service',
      serviceName: 'Sick People Service',
      serviceCategory: 'sick',
      durationUnit: 'days',
      durationValue: 3,
      shiftType: 'day',
      startDate: '2025-09-18',
      unitRate: 2500,
      subtotal: 7500,
      addOnsTotal: 0,
      totalCost: 7500,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      status: 'Completed',
      createdAt: '2025-09-18T11:00:00.000Z',
      updatedAt: '2025-09-18T11:00:00.000Z',
      location: { division: 'Rajshahi', district: 'Rajshahi', city: 'Rajshahi', area: 'Lakshmipur', fullAddress: 'Lakshmipur Medical Rd' },
      recipient: { name: 'Mother', age: 65, gender: 'female', specialRequirements: 'Post-op care', emergencyContact: '+8801700334455' },
      invoiceId: 'INV-2025-106'
    };

    const adminBooking4: Booking = {
      id: 'BK-2025-107',
      userId: 'usr_rafiq',
      userName: 'Rafiq Ahmed',
      userEmail: 'rafiq@example.com',
      userContact: '+8801700445566',
      userNid: '19892694589004444',
      serviceId: 'baby-care',
      serviceName: 'Baby Care',
      serviceCategory: 'baby',
      durationUnit: 'hours',
      durationValue: 4,
      shiftType: 'day',
      startDate: '2025-09-17',
      unitRate: 300,
      subtotal: 1200,
      addOnsTotal: 0,
      totalCost: 1200,
      paymentStatus: 'refunded',
      paymentMethod: 'stripe',
      status: 'Cancelled',
      cancellationReason: 'Schedule conflict',
      createdAt: '2025-09-17T14:00:00.000Z',
      updatedAt: '2025-09-17T15:00:00.000Z',
      location: { division: 'Dhaka', district: 'Dhaka', city: 'Dhaka', area: 'Gulshan', fullAddress: 'Gulshan 2' },
      recipient: { name: 'Child', age: '3 yrs', gender: 'male', specialRequirements: 'Day babysit', emergencyContact: '+8801700445566' },
      invoiceId: 'INV-2025-107'
    };

    const adminBooking5: Booking = {
      id: 'BK-2025-108',
      userId: 'usr_sadia',
      userName: 'Sadia Islam',
      userEmail: 'sadia@example.com',
      userContact: '+8801700556677',
      userNid: '19962694589005555',
      serviceId: 'elderly-service',
      serviceName: 'Elderly Service',
      serviceCategory: 'elderly',
      durationUnit: 'days',
      durationValue: 1,
      shiftType: 'day',
      startDate: '2025-09-16',
      unitRate: 2500,
      subtotal: 2500,
      addOnsTotal: 0,
      totalCost: 2500,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      status: 'Confirmed',
      createdAt: '2025-09-16T16:30:00.000Z',
      updatedAt: '2025-09-16T16:30:00.000Z',
      location: { division: 'Chittagong', district: 'Chittagong', city: 'Chittagong', area: 'Agrabad', fullAddress: 'Agrabad C/A' },
      recipient: { name: 'Grandmother', age: 79, gender: 'female', specialRequirements: 'Mobility support', emergencyContact: '+8801700556677' },
      invoiceId: 'INV-2025-108'
    };

    this.bookings.set(adminBooking1.id, adminBooking1);
    this.bookings.set(adminBooking2.id, adminBooking2);
    this.bookings.set(adminBooking3.id, adminBooking3);
    this.bookings.set(adminBooking4.id, adminBooking4);
    this.bookings.set(adminBooking5.id, adminBooking5);

    // Seed Caregivers
    DEFAULT_CAREGIVERS.forEach(cg => {
      this.caregivers.set(cg.id, cg);
    });
  }

  // Services with alias normalization
  getServices(): Service[] {
    return this.services;
  }

  getServiceById(id: string): Service | undefined {
    const normalized = id.toLowerCase().trim();
    if (normalized === 'baby-care' || normalized === 'baby') {
      return this.services.find(s => s.id === 'baby-care');
    }
    if (normalized === 'elderly-service' || normalized === 'elderly-care' || normalized === 'elderly') {
      return this.services.find(s => s.id === 'elderly-service');
    }
    if (normalized === 'sick-people-service' || normalized === 'sick-care' || normalized === 'sick') {
      return this.services.find(s => s.id === 'sick-people-service');
    }
    return this.services.find(s => s.id === id);
  }

  // Locations
  getLocations() {
    return ZAPSHIFT_LOCATIONS;
  }

  // Users
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.get(email.toLowerCase());
  }

  verifyPassword(email: string, pass: string): boolean {
    const saved = this.userPasswords.get(email.toLowerCase());
    return saved === pass;
  }

  updateUserPassword(email: string, newPass: string): boolean {
    const normalized = email.toLowerCase();
    this.userPasswords.set(normalized, newPass);
    const user = this.getUserByEmail(normalized);
    if (user) {
      mongoService.saveUser({ ...user, passwordHash: newPass }).catch(() => {});
      return true;
    }
    return false;
  }

  createUser(userData: {
    nid: string;
    name: string;
    email: string;
    contact: string;
    password: string;
  }): User {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: User = {
      id,
      nid: userData.nid.trim(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      contact: userData.contact.trim(),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    this.users.set(user.id, user);
    this.users.set(user.email, user);
    this.userPasswords.set(user.email, userData.password);

    // Asynchronously sync to MongoDB Atlas
    mongoService.saveUser({ ...user, passwordHash: userData.password }).catch(err => {
      console.warn('[MongoDB] Save user background sync warning:', err.message);
    });

    return user;
  }

  createOrGetGoogleUser(googleProfile: {
    email: string;
    name: string;
  }): User {
    const existing = this.getUserByEmail(googleProfile.email);
    if (existing) return existing;

    const id = `usr_g_${Date.now()}`;
    const user: User = {
      id,
      nid: '19952694589009999',
      name: googleProfile.name,
      email: googleProfile.email.toLowerCase(),
      contact: '+8801700000000',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    this.users.set(user.id, user);
    this.users.set(user.email, user);
    this.userPasswords.set(user.email, 'GoogleOAuthVerified!');

    // Asynchronously sync to MongoDB Atlas
    mongoService.saveUser({ ...user, passwordHash: 'GoogleOAuthVerified!' }).catch(err => {
      console.warn('[MongoDB] Save Google user sync warning:', err.message);
    });

    return user;
  }

  // Bookings
  getBookingsByUser(userId: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'invoiceId' | 'status'> & { status?: Booking['status'] }): { booking: Booking; invoice: Invoice } {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingId = `BK-2025-${randomSuffix}`;
    const invoiceId = `INV-2025-${randomSuffix}`;
    const now = new Date().toISOString();

    const service = this.getServiceById(bookingData.serviceId);

    const caregiver = service?.sampleCaregiver
      ? {
          name: service.sampleCaregiver.name,
          phone: '+88017' + Math.floor(10000000 + Math.random() * 90000000),
          badge: `${service.sampleCaregiver.role} (${service.sampleCaregiver.experience})`,
          avatarInitials: service.sampleCaregiver.name.split(' ').map(n => n[0]).slice(0, 2).join('')
        }
      : undefined;

    const booking: Booking = {
      ...bookingData,
      id: bookingId,
      status: bookingData.status || 'Pending',
      createdAt: now,
      updatedAt: now,
      caregiver,
      invoiceId
    };

    const invoice: Invoice = {
      id: invoiceId,
      bookingId: booking.id,
      invoiceNumber: invoiceId,
      issuedAt: now,
      recipientEmail: booking.userEmail,
      recipientName: booking.userName,
      items: [
        {
          description: `${booking.serviceName} (${booking.durationValue} ${booking.durationUnit})`,
          unitPrice: booking.unitRate,
          quantity: booking.durationValue,
          total: booking.subtotal
        }
      ],
      subtotal: booking.totalCost,
      tax: 0,
      total: booking.totalCost,
      paymentStatus: booking.paymentStatus === 'paid' ? 'paid' : 'pending',
      status: 'sent'
    };

    this.bookings.set(booking.id, booking);
    this.invoices.set(invoice.id, invoice);

    // Sync booking and invoice to MongoDB Atlas
    mongoService.createBooking(booking).catch(err => {
      console.warn('[MongoDB] Create booking sync warning:', err.message);
    });
    mongoService.saveInvoice(invoice).catch(err => {
      console.warn('[MongoDB] Save invoice sync warning:', err.message);
    });

    return { booking, invoice };
  }

  cancelBooking(bookingId: string, reason: string): Booking | null {
    const booking = this.bookings.get(bookingId);
    if (!booking) return null;

    booking.status = 'Cancelled';
    booking.cancellationReason = reason || 'Cancelled by user';
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(bookingId, booking);

    // Sync to MongoDB
    mongoService.cancelBooking(bookingId, reason).catch(err => {
      console.warn('[MongoDB] Cancel booking sync warning:', err.message);
    });

    return booking;
  }

  updateBookingStatus(bookingId: string, status: Booking['status']): Booking | null {
    const booking = this.bookings.get(bookingId);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(bookingId, booking);

    // Sync to MongoDB
    mongoService.updateBookingStatus(bookingId, status).catch(err => {
      console.warn('[MongoDB] Update booking status sync warning:', err.message);
    });

    return booking;
  }

  // Invoices
  getInvoiceById(id: string): Invoice | undefined {
    return this.invoices.get(id);
  }

  getInvoiceByBookingId(bookingId: string): Invoice | undefined {
    return Array.from(this.invoices.values()).find(i => i.bookingId === bookingId);
  }

  getUserInvoices(userEmail: string): Invoice[] {
    return Array.from(this.invoices.values())
      .filter(i => i.recipientEmail.toLowerCase() === userEmail.toLowerCase())
      .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  }

  // Users Admin CRUD
  getAllUsers(): User[] {
    const unique = new Map<string, User>();
    for (const u of this.users.values()) {
      unique.set(u.id, u);
    }
    return Array.from(unique.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  deleteUser(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;
    this.users.delete(id);
    this.users.delete(user.email.toLowerCase());
    return true;
  }

  updateUserRole(id: string, role: 'admin' | 'user'): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    user.role = role;
    this.users.set(user.id, user);
    this.users.set(user.email.toLowerCase(), user);
    return user;
  }

  deleteBooking(id: string): boolean {
    return this.bookings.delete(id);
  }

  // Caregivers Admin CRUD
  getAllCaregivers(): Caregiver[] {
    return Array.from(this.caregivers.values());
  }

  addCaregiver(data: Omit<Caregiver, 'id'>): Caregiver {
    const id = `cg-${Date.now()}`;
    const cg: Caregiver = {
      ...data,
      id
    };
    this.caregivers.set(id, cg);
    return cg;
  }

  updateCaregiver(id: string, updates: Partial<Caregiver>): Caregiver | null {
    const cg = this.caregivers.get(id);
    if (!cg) return null;
    const updated = { ...cg, ...updates };
    this.caregivers.set(id, updated);
    return updated;
  }

  deleteCaregiver(id: string): boolean {
    return this.caregivers.delete(id);
  }

  // Services Admin CRUD
  updateService(id: string, updates: Partial<Service>): Service | null {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.services[index] = { ...this.services[index], ...updates };
    return this.services[index];
  }

  addService(serviceData: Service): Service {
    this.services.push(serviceData);
    return serviceData;
  }

  // Reports
  getReports() {
    const allBookings = this.getAllBookings();
    let totalRevenue = 0;
    const categoryBreakdown: Record<string, { count: number; revenue: number }> = {
      baby: { count: 0, revenue: 0 },
      elderly: { count: 0, revenue: 0 },
      sick: { count: 0, revenue: 0 }
    };

    allBookings.forEach(b => {
      totalRevenue += b.totalCost;
      const cat = b.serviceCategory || 'baby';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { count: 0, revenue: 0 };
      }
      categoryBreakdown[cat].count += 1;
      categoryBreakdown[cat].revenue += b.totalCost;
    });

    return {
      totalRevenue,
      totalBookings: allBookings.length,
      completedBookings: allBookings.filter(b => b.status === 'Completed').length,
      pendingBookings: allBookings.filter(b => b.status === 'Pending').length,
      categoryBreakdown,
      monthlyProjection: Math.round(totalRevenue * 1.35)
    };
  }

  // System Settings
  getSettings() {
    return {
      ...this.systemSettings,
      mongoConnected: mongoService.status.connected,
      collections: mongoService.status.collections,
      timestamp: new Date().toISOString()
    };
  }

  updateSettings(updates: Partial<typeof this.systemSettings>) {
    this.systemSettings = { ...this.systemSettings, ...updates };
    return this.getSettings();
  }
}


export const db = new DatabaseStore();
