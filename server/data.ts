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

// ZapShift Resource Database: Services with Bangladeshi Taka (৳) Pricing
export const SERVICES: Service[] = [
  {
    id: 'baby-care',
    name: 'Baby Care',
    banglaTitle: 'শিশু যত্ন ও বেবি সিটিং সার্ভিস',
    category: 'baby',
    tagline: 'Safe, loving and professional care for your little ones.',
    description: 'Professional babysitters for your little ones. Safe, fun and loving care.',
    fullOverview: "Our baby care service provides professional and caring babysitters who ensure your child's safety, happiness and development. Whether you need a few hours or full day care, we are here to help.",
    hourlyRate: 300,
    dailyRate: 2400,
    imageUrl: '/images/baby-care-1.jpg',
    galleryImages: ['/images/baby-care-1.jpg', '/images/baby-care-2.jpg'],
    rating: 4.8,
    reviewCount: 120,
    completedCareSessions: 4210,
    features: [
      'Experienced and verified babysitters',
      'Flexible hours (day/night)',
      'Fun and educational activities',
      'Background checked caregivers',
      'Nutritious meal preparation according to diet',
      'Pediatric CPR & Basic Emergency First Aid'
    ],
    qualifications: [
      'Verified National ID (NID) & Police Clearance Certificate',
      'Minimum 2+ years verified childcare or nursery experience',
      'Clear toxicology and communicable disease health screening',
      'Certified by Bangladesh Child Health & Care Academy'
    ],
    safetyProtocols: [
      'Strict no-unauthorized-visitor policy during babysitting shift',
      'Immediate GPS location check-in via Care.xyz caretaker portal',
      'Emergency response hotline 24/7 with on-call pediatric doctor'
    ],
    faqs: [
      {
        question: 'Are all babysitters background checked?',
        answer: 'Yes, 100% of our caretakers go through National ID validation, address verification, and police clearance.'
      },
      {
        question: 'Can I book for just a few hours?',
        answer: 'Yes, you can choose flexible hours or daily booking according to your family needs.'
      },
      {
        question: 'What if I need to cancel my booking?',
        answer: 'You can easily cancel from the My Bookings page prior to shift dispatch without penalty.'
      }
    ],
    caregiverCount: 54,
    sampleCaregiver: {
      name: 'Farzana Sultana',
      role: 'Certified Montessori Nanny',
      experience: '5 Years Experience',
      verified: true,
      rating: 4.9
    }
  },
  {
    id: 'elderly-service',
    name: 'Elderly Service',
    banglaTitle: 'প্রবীণ ও বয়োবৃদ্ধদের স্নেহপূর্ণ সেবা',
    category: 'elderly',
    tagline: 'Compassionate care for your elderly family members.',
    description: 'Compassionate care for your elderly family members.',
    fullOverview: 'Our elderly companion service provides dignified, respectful and patient support for seniors. From medication reminders, walking support, to empathetic conversation and home comfort, your parents and grandparents are in trusted hands.',
    hourlyRate: 350,
    dailyRate: 2500,
    imageUrl: '/images/elderly-care-1.jpg',
    galleryImages: ['/images/elderly-care-1.jpg', '/images/elderly-care-2.jpg'],
    rating: 4.9,
    reviewCount: 150,
    completedCareSessions: 6890,
    features: [
      'Compassionate companionship & daily mobility support',
      'Strict medication schedule tracking & doctor escort',
      'Nutritious meal assistance & vital signs monitoring',
      'Experienced, background-verified caregivers',
      'Assistance with grooming, gentle bathing and dressing',
      'Daily vital parameters log (BP, Sugar, Pulse)'
    ],
    qualifications: [
      'Senior Care Assistance Certificate & Geriatric Training',
      'Verified National ID with police security verification',
      'Physical fitness and lifting/support ergonomics certified',
      'Patience and empathy evaluation passed with 95%+ grade'
    ],
    safetyProtocols: [
      'Fall prevention risk assessment of the senior living area',
      'Digital vital signs log updated twice daily in the portal',
      'Direct contact line to nearest partner diagnostic center & ambulance'
    ],
    faqs: [
      {
        question: 'Can caregivers assist with diabetes & blood pressure checks?',
        answer: 'Yes, our elderly companions are equipped and trained to monitor vital signs twice daily.'
      },
      {
        question: 'Is overnight care available for seniors?',
        answer: 'Yes, we provide Day Shift, Night Shift, and 24/7 Live-In Resident Care options.'
      }
    ],
    caregiverCount: 68,
    sampleCaregiver: {
      name: 'Mohammad Rafiqul Islam',
      role: 'Senior Care Companion',
      experience: '7 Years Experience',
      verified: true,
      rating: 4.95
    }
  },
  {
    id: 'sick-people-service',
    name: 'Sick People Service',
    banglaTitle: 'অসুস্থ রোগীর বিশেষায়িত নার্সিং সেবা',
    category: 'sick',
    tagline: 'Special care for patients at home with trained caregivers.',
    description: 'Special care for patients at home with trained caregivers.',
    fullOverview: 'Post-hospital recovery and chronic illness require meticulous hygiene, medication accuracy, and constant clinical vigilance. Care.xyz Sick People Service connects you with verified clinical assistants trained in wound hygiene, post-surgery recovery, and bedridden patient comfort at your home.',
    hourlyRate: 450,
    dailyRate: 3500,
    imageUrl: '/images/sick-care-1.jpg',
    galleryImages: ['/images/sick-care-1.jpg', '/images/sick-care-2.jpg'],
    rating: 4.9,
    reviewCount: 95,
    completedCareSessions: 3940,
    features: [
      'Trained medical attendants & clinical nursing aides',
      'Vitals recording, oxygen, nebulization & catheter assistance',
      'Sterile wound dressing & post-operative recovery care',
      'Bed sore prevention & passive mobility support',
      'Strict medication schedules & doctor instruction adherence',
      'Emergency ambulance coordination support'
    ],
    qualifications: [
      'Diploma in Medical Technology / Certified Nursing Assistant (CNA)',
      'Minimum 3 years clinical hospital or critical home care exposure',
      'NID and Police Verification clearance with medical board check',
      'Certified in BLS (Basic Life Support) and Infection Control'
    ],
    safetyProtocols: [
      'Sterile equipment and PPE kit adherence on every home shift',
      'Weekly physician tele-review integrated with clinical logs',
      'Priority emergency ambulance transfer within 20 minutes'
    ],
    faqs: [
      {
        question: 'Are nursing aides qualified for post-surgical care?',
        answer: 'Yes, all our clinical caregivers hold nursing diplomas or accredited CNA certifications.'
      },
      {
        question: 'Can you handle oxygen cylinders and nebulizers?',
        answer: 'Yes, caregivers are specifically trained in home respiratory equipment and catheter hygiene.'
      }
    ],
    caregiverCount: 41,
    sampleCaregiver: {
      name: 'Nurse Nusrat Jahan, RN',
      role: 'Clinical Care Specialist',
      experience: '6 Years Clinical Experience',
      verified: true,
      rating: 4.97
    }
  }
];

// Hierarchical ZapShift Locations (Division -> District -> City -> Area)
export const ZAPSHIFT_LOCATIONS: LocationNode[] = [
  {
    division: 'Dhaka',
    districts: [
      {
        name: 'Dhaka',
        cities: [
          {
            name: 'Dhaka',
            areas: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Badda', 'Lalmatia']
          }
        ]
      },
      {
        name: 'Gazipur',
        cities: [
          {
            name: 'Gazipur',
            areas: ['Joydebpur', 'Chowrasta', 'Board Bazar', 'Tongi']
          }
        ]
      },
      {
        name: 'Narayanganj',
        cities: [
          {
            name: 'Narayanganj',
            areas: ['Chashara', 'Mondolpara', 'Nitaiganj']
          }
        ]
      }
    ]
  },
  {
    division: 'Khulna',
    districts: [
      {
        name: 'Khulna',
        cities: [
          {
            name: 'Khulna',
            areas: ['Sonadanga', 'Khalishpur', 'Boyra', 'Daulatpur', 'Shibbari']
          }
        ]
      }
    ]
  },
  {
    division: 'Rajshahi',
    districts: [
      {
        name: 'Rajshahi',
        cities: [
          {
            name: 'Rajshahi',
            areas: ['Lakshmipur', 'Shaheb Bazar', 'Kazihata', 'Motihar', 'Upashahar']
          }
        ]
      }
    ]
  },
  {
    division: 'Chittagong',
    districts: [
      {
        name: 'Chittagong',
        cities: [
          {
            name: 'Chittagong',
            areas: ['Agrabad', 'Nasirabad', 'GEC Circle', 'Khulshi', 'Panchlaish', 'Halishahar']
          }
        ]
      }
    ]
  },
  {
    division: 'Sylhet',
    districts: [
      {
        name: 'Sylhet',
        cities: [
          {
            name: 'Sylhet',
            areas: ['Zindabazar', 'Amberkhana', 'Shahjalal Upashahar', 'Shibgonj']
          }
        ]
      }
    ]
  }
];

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

export const DEFAULT_CAREGIVERS: Caregiver[] = [
  {
    id: 'cg-1',
    name: 'Farzana Sultana',
    phone: '+8801711223344',
    email: 'farzana.nanny@care.xyz',
    role: 'Certified Montessori Nanny',
    badge: 'Pediatric Care Verified',
    experience: '5 Years Experience',
    rating: 4.9,
    completedJobs: 142,
    verified: true,
    status: 'active',
    services: ['Baby Care']
  },
  {
    id: 'cg-2',
    name: 'Mohammad Rafiqul Islam',
    phone: '+8801822334455',
    email: 'rafiqul.elderly@care.xyz',
    role: 'Senior Care Companion',
    badge: 'Geriatric Certified',
    experience: '7 Years Experience',
    rating: 4.95,
    completedJobs: 215,
    verified: true,
    status: 'active',
    services: ['Elderly Service']
  },
  {
    id: 'cg-3',
    name: 'Nurse Nusrat Jahan, RN',
    phone: '+8801933445566',
    email: 'nusrat.nurse@care.xyz',
    role: 'Clinical Care Specialist',
    badge: 'Registered Nurse (BNMC)',
    experience: '6 Years Hospital ICU',
    rating: 4.9,
    completedJobs: 98,
    verified: true,
    status: 'active',
    services: ['Sick People Service']
  },
  {
    id: 'cg-4',
    name: 'Selina Akter',
    phone: '+8801644556677',
    email: 'selina.care@care.xyz',
    role: 'Newborn Care Specialist',
    badge: 'Infant CPR Certified',
    experience: '4 Years Experience',
    rating: 4.85,
    completedJobs: 86,
    verified: true,
    status: 'active',
    services: ['Baby Care']
  },
  {
    id: 'cg-5',
    name: 'Tanvir Ahmed',
    phone: '+8801555667788',
    email: 'tanvir.companion@care.xyz',
    role: 'Elderly Mobility Assistant',
    badge: 'Physiotherapy Aide',
    experience: '3 Years Experience',
    rating: 4.8,
    completedJobs: 64,
    verified: true,
    status: 'active',
    services: ['Elderly Service', 'Sick People Service']
  }
];

