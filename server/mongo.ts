import { MongoClient, Db, Collection } from 'mongodb';
import { Booking, Invoice, SERVICES, Service, User, ZAPSHIFT_LOCATIONS } from './data.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://CareService:2axNUGVAwHBEyLjy@cluster0.owqcpnx.mongodb.net/care_service?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'care_service';

export interface UserDoc extends User {
  passwordHash?: string;
  _id?: any;
}

export interface ServiceDoc extends Service {
  _id?: any;
}

export interface BookingDoc extends Booking {
  _id?: any;
}

export interface InvoiceDoc extends Invoice {
  _id?: any;
}

class MongoService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private connectionAttempted: boolean = false;
  private connectPromise: Promise<boolean> | null = null;

  public usersCol: Collection<UserDoc> | null = null;
  public servicesCol: Collection<ServiceDoc> | null = null;
  public bookingsCol: Collection<BookingDoc> | null = null;
  public invoicesCol: Collection<InvoiceDoc> | null = null;

  async init(): Promise<boolean> {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = (async () => {
      try {
        console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');
        this.client = new MongoClient(MONGO_URI, {
          serverSelectionTimeoutMS: 6000,
          connectTimeoutMS: 6000,
        });

        await this.client.connect();
        this.db = this.client.db(DB_NAME);
        this.usersCol = this.db.collection<UserDoc>('users');
        this.servicesCol = this.db.collection<ServiceDoc>('services');
        this.bookingsCol = this.db.collection<BookingDoc>('bookings');
        this.invoicesCol = this.db.collection<InvoiceDoc>('invoices');

        this.isConnected = true;
        this.connectionAttempted = true;
        console.log('[MongoDB] Successfully connected to MongoDB Atlas. DB:', DB_NAME);

        // Seed initial data if empty
        await this.seedInitialData();
        return true;
      } catch (err: any) {
        this.isConnected = false;
        this.connectionAttempted = true;
        console.warn('[MongoDB] Atlas connection warning:', err.message || err);
        console.warn('[MongoDB] Operating in high-availability hybrid mode with memory store fallback.');
        return false;
      }
    })();

    return this.connectPromise;
  }

  get status() {
    return {
      connected: this.isConnected,
      dbName: DB_NAME,
      host: 'cluster0.owqcpnx.mongodb.net',
      collections: ['users', 'services', 'bookings', 'invoices']
    };
  }

  private async seedInitialData() {
    if (!this.isConnected || !this.servicesCol || !this.usersCol || !this.bookingsCol) return;

    try {
      // 1. Seed Services
      const servicesCount = await this.servicesCol.countDocuments();
      if (servicesCount === 0) {
        console.log('[MongoDB] Seeding services collection...');
        await this.servicesCol.insertMany(SERVICES as any[]);
      }

      // 2. Seed Users
      const usersCount = await this.usersCol.countDocuments();
      if (usersCount === 0) {
        console.log('[MongoDB] Seeding users collection with default accounts...');
        const demoUser: UserDoc = {
          id: 'usr_demo_hafiz',
          nid: '19922694589001234',
          name: 'Hafizur Rahman',
          email: 'hafizurrahmanhafiz146@gmail.com',
          contact: '+8801712345678',
          role: 'user',
          createdAt: '2025-08-15T10:00:00.000Z',
          passwordHash: 'Care2026!'
        };
        const adminUser: UserDoc = {
          id: 'usr_admin_care',
          nid: '19882694589009999',
          name: 'Care Admin',
          email: 'admin@care.xyz',
          contact: '+8801811223344',
          role: 'admin',
          createdAt: '2025-01-01T10:00:00.000Z',
          passwordHash: 'AdminCare2026!'
        };
        await this.usersCol.insertMany([demoUser, adminUser]);
      }

      // 3. Seed Bookings
      const bookingsCount = await this.bookingsCol.countDocuments();
      if (bookingsCount === 0) {
        console.log('[MongoDB] Seeding bookings collection...');
        const seedBookings: BookingDoc[] = [
          {
            id: 'BK-2025-001',
            userId: 'usr_demo_hafiz',
            userName: 'Hafizur Rahman',
            userEmail: 'hafizurrahmanhafiz146@gmail.com',
            userContact: '+8801712345678',
            userNid: '19922694589001234',
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
              emergencyContact: '+8801712345678'
            },
            caregiver: {
              name: 'Farzana Sultana',
              phone: '+8801711223344',
              badge: 'Certified Montessori Nanny',
              avatarInitials: 'FS'
            },
            invoiceId: 'INV-2025-001'
          },
          {
            id: 'BK-2025-002',
            userId: 'usr_demo_hafiz',
            userName: 'Hafizur Rahman',
            userEmail: 'hafizurrahmanhafiz146@gmail.com',
            userContact: '+8801712345678',
            userNid: '19922694589001234',
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
              emergencyContact: '+8801712345678'
            },
            caregiver: {
              name: 'Mohammad Rafiqul Islam',
              phone: '+8801822334455',
              badge: 'Senior Care Companion',
              avatarInitials: 'RI'
            },
            invoiceId: 'INV-2025-002'
          },
          {
            id: 'BK-2025-003',
            userId: 'usr_demo_hafiz',
            userName: 'Hafizur Rahman',
            userEmail: 'hafizurrahmanhafiz146@gmail.com',
            userContact: '+8801712345678',
            userNid: '19922694589001234',
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
              emergencyContact: '+8801712345678'
            },
            caregiver: {
              name: 'Nurse Nusrat Jahan, RN',
              phone: '+8801933445566',
              badge: 'Clinical Care Specialist',
              avatarInitials: 'NJ'
            },
            invoiceId: 'INV-2025-003'
          }
        ];
        await this.bookingsCol.insertMany(seedBookings);
      }
      console.log('[MongoDB] Collections successfully seeded or verified in MongoDB Atlas.');
    } catch (err) {
      console.error('[MongoDB] Error during initial data seeding:', err);
    }
  }

  // User queries
  async findUserByEmail(email: string): Promise<UserDoc | null> {
    if (this.isConnected && this.usersCol) {
      try {
        const found = await this.usersCol.findOne({ email: email.toLowerCase() });
        if (found) return found;
      } catch (err) {
        console.warn('[MongoDB] Query error, falling back:', err);
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<UserDoc | null> {
    if (this.isConnected && this.usersCol) {
      try {
        const found = await this.usersCol.findOne({ id });
        if (found) return found;
      } catch (err) {
        console.warn('[MongoDB] Query error, falling back:', err);
      }
    }
    return null;
  }

  async saveUser(user: UserDoc): Promise<UserDoc> {
    if (this.isConnected && this.usersCol) {
      try {
        await this.usersCol.updateOne(
          { email: user.email.toLowerCase() },
          { $set: user },
          { upsert: true }
        );
      } catch (err) {
        console.warn('[MongoDB] Save user error:', err);
      }
    }
    return user;
  }

  // Services queries
  async getServices(): Promise<ServiceDoc[]> {
    if (this.isConnected && this.servicesCol) {
      try {
        const docs = await this.servicesCol.find({}).toArray();
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('[MongoDB] Get services error:', err);
      }
    }
    return SERVICES;
  }

  async getServiceById(id: string): Promise<ServiceDoc | null> {
    if (this.isConnected && this.servicesCol) {
      try {
        const doc = await this.servicesCol.findOne({ id });
        if (doc) return doc;
      } catch (err) {
        console.warn('[MongoDB] Get service by id error:', err);
      }
    }
    const found = SERVICES.find(s => s.id === id);
    return found || null;
  }

  // Bookings queries
  async createBooking(booking: BookingDoc): Promise<BookingDoc> {
    if (this.isConnected && this.bookingsCol) {
      try {
        await this.bookingsCol.insertOne({ ...booking });
      } catch (err) {
        console.warn('[MongoDB] Create booking error:', err);
      }
    }
    return booking;
  }

  async getBookingsByUser(userId: string): Promise<BookingDoc[]> {
    if (this.isConnected && this.bookingsCol) {
      try {
        const docs = await this.bookingsCol.find({ userId }).sort({ createdAt: -1 }).toArray();
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('[MongoDB] Get bookings by user error:', err);
      }
    }
    return [];
  }

  async getAllBookings(): Promise<BookingDoc[]> {
    if (this.isConnected && this.bookingsCol) {
      try {
        const docs = await this.bookingsCol.find({}).sort({ createdAt: -1 }).toArray();
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn('[MongoDB] Get all bookings error:', err);
      }
    }
    return [];
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<BookingDoc | null> {
    if (this.isConnected && this.bookingsCol) {
      try {
        const now = new Date().toISOString();
        const res = await this.bookingsCol.findOneAndUpdate(
          { id },
          { $set: { status, updatedAt: now } },
          { returnDocument: 'after' }
        );
        if (res) return res as BookingDoc;
      } catch (err) {
        console.warn('[MongoDB] Update booking status error:', err);
      }
    }
    return null;
  }

  async cancelBooking(id: string, reason: string): Promise<BookingDoc | null> {
    if (this.isConnected && this.bookingsCol) {
      try {
        const now = new Date().toISOString();
        const res = await this.bookingsCol.findOneAndUpdate(
          { id },
          { $set: { status: 'Cancelled', cancellationReason: reason, updatedAt: now } },
          { returnDocument: 'after' }
        );
        if (res) return res as BookingDoc;
      } catch (err) {
        console.warn('[MongoDB] Cancel booking error:', err);
      }
    }
    return null;
  }

  // Invoices queries
  async saveInvoice(invoice: InvoiceDoc): Promise<InvoiceDoc> {
    if (this.isConnected && this.invoicesCol) {
      try {
        await this.invoicesCol.updateOne(
          { id: invoice.id },
          { $set: invoice },
          { upsert: true }
        );
      } catch (err) {
        console.warn('[MongoDB] Save invoice error:', err);
      }
    }
    return invoice;
  }
}

export const mongoService = new MongoService();
