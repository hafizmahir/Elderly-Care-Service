export interface Service {
  id: string;
  name: string;
  banglaTitle: string;
  category: 'baby' | 'elderly' | 'sick';
  tagline: string;
  description: string;
  fullOverview: string;
  hourlyRate: number;
  dailyRate: number;
  imageUrl: string;
  galleryImages?: string[];
  rating: number;
  reviewCount: number;
  completedCareSessions: number;
  features: string[];
  qualifications: string[];
  safetyProtocols: string[];
  faqs?: { question: string; answer: string }[];
  caregiverCount: number;
  sampleCaregiver: {
    name: string;
    role: string;
    experience: string;
    verified: boolean;
    rating: number;
  };
}

export interface LocationNode {
  division: string;
  districts: {
    name: string;
    cities: {
      name: string;
      areas: string[];
    }[];
  }[];
}

export interface User {
  id: string;
  nid: string;
  name: string;
  email: string;
  contact: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userContact: string;
  userNid: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  durationUnit: 'hours' | 'days';
  durationValue: number;
  shiftType: 'day' | 'night' | 'full_day';
  startDate: string;
  endDate?: string;
  unitRate: number;
  subtotal: number;
  addOnsTotal: number;
  totalCost: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: 'stripe' | 'cash_on_delivery' | 'card';
  stripePaymentId?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  location: {
    division: string;
    district: string;
    city: string;
    area: string;
    fullAddress: string;
  };
  recipient: {
    name: string;
    age: number | string;
    gender: 'male' | 'female' | 'other';
    specialRequirements: string;
    emergencyContact: string;
  };
  caregiver?: {
    name: string;
    phone: string;
    badge: string;
    avatarInitials: string;
  };
  invoiceId: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  issuedAt: string;
  recipientEmail: string;
  recipientName: string;
  items: {
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid';
  status: 'sent' | 'delivered';
}

export interface Caregiver {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  badge: string;
  experience: string;
  rating: number;
  completedJobs: number;
  verified: boolean;
  status: 'active' | 'busy' | 'offline';
  services: string[];
}

