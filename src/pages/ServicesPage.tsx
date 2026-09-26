import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { usePageMetadata } from '../utils/metadata.js';
import { Service } from '../types/index.js';
import { api } from '../lib/api.js';
import { 
  Heart, 
  Baby, 
  Smile, 
  Activity, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  CalendarCheck, 
  Search, 
  Filter,
  ArrowRight
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { navigate } = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  usePageMetadata({
    title: 'Our Care Services - Care.xyz',
    description: 'Explore verified Baby Care, Elderly Care, and Sick People Care services in Bangladesh. Transparent pricing and certified caregivers.',
    ogTitle: 'Care Services - Care.xyz Bangladesh',
    ogDescription: 'Certified caregivers for children, seniors, and recovering patients. Book online with instant confirmation.'
  });

  useEffect(() => {
    api.getServices()
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  const getServiceBadgeIcon = (category: string) => {
    switch (category) {
      case 'baby':
        return (
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-md">
            <Baby className="w-5 h-5" />
          </div>
        );
      case 'elderly':
        return (
          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md">
            <Smile className="w-5 h-5" />
          </div>
        );
      case 'sick':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5" />
          </div>
        );
      default:
        return null;
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.banglaTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 dark:from-[#0d1822] dark:via-[#070d12] dark:to-[#070d12] pt-14 pb-12 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Verified Caretakers & Certified Nursing Staff</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Our Care <span className="text-[#059669] dark:text-emerald-400">Services</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Choose compassionate, certified, and police-verified care for your family members. From infant supervision to senior assistance and specialized clinical recovery.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search baby care, elderly, nurse, patient..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111c26] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              />
            </div>
            
            {/* Category Filter Buttons */}
            <div className="flex items-center justify-center gap-1.5 bg-white dark:bg-[#111c26] p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('baby')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'baby'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Baby
              </button>
              <button
                onClick={() => setSelectedCategory('elderly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'elderly'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Elderly
              </button>
              <button
                onClick={() => setSelectedCategory('sick')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === 'sick'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Patient
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {loading ? (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400 text-sm">
            Loading care services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-slate-600 dark:text-slate-300 font-medium">No care services found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-[#0e1720] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                {/* Image Container with Badge */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-[#142230]">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category icon badge overlapping bottom-left */}
                  <div className="absolute bottom-3 left-3">
                    {getServiceBadgeIcon(service.category)}
                  </div>

                  {/* Hourly / Daily Rate Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#0e1720]/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">Starting from</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      ৳{service.hourlyRate} / hr
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                        {service.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-2 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Link
                      href={`/service/${service.id}`}
                      className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#111c26] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/booking/${service.id}`}
                      className="flex-1 py-2 px-3 text-center text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Book Now</span>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* Trust Banner Bottom */}
      <section className="py-12 bg-white dark:bg-[#091118] border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="p-6 bg-slate-50 dark:bg-[#0e1720] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Police Verified Staff</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">100% biometric NID & police clearance verification for complete safety.</p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-[#0e1720] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant Booking</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select hours or days with transparent rates and instant digital receipt.</p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-[#0e1720] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Round-the-clock emergency support and live caretaker monitoring.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
