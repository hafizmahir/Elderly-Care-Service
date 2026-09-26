import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { usePageMetadata } from '../utils/metadata.js';
import { Service } from '../types/index.js';
import { api } from '../lib/api.js';
import { 
  Heart, 
  ShieldCheck, 
  Star, 
  Users, 
  ArrowRight,
  Baby,
  Smile,
  Activity
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Metadata
  usePageMetadata({
    title: 'Care.xyz - Baby Sitting & Elderly Care Service Platform',
    description: 'Find and hire reliable caretakers for your children, elderly family members, or loved ones. We make caregiving easy, secure, and accessible for everyone.',
    ogTitle: 'Care.xyz - Trusted Care for Your Loved Ones',
    ogDescription: 'Reliable and trusted care services for children, elderly, and family members. Book easily online.'
  });

  useEffect(() => {
    api.getServices()
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Error loading services:', err);
        setLoading(false);
      });
  }, []);

  const getServiceBadgeIcon = (category: string) => {
    switch (category) {
      case 'baby':
        return (
          <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-md">
            <Baby className="w-5 h-5" />
          </div>
        );
      case 'elderly':
        return (
          <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md">
            <Smile className="w-5 h-5" />
          </div>
        );
      case 'sick':
        return (
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#070d12] transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f9f8] to-white dark:from-[#0d1822] dark:to-[#070d12] pt-12 pb-16 lg:pt-16 lg:pb-24 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Col: Headline & Actions */}
            <div className="lg:col-span-6 space-y-6">
              
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight font-display text-slate-900 dark:text-white leading-[1.15]">
                Trusted Care <br />
                <span className="text-[#059669] dark:text-emerald-400">for</span> Your Loved Ones
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                Find and hire reliable caretakers for your children, elderly family members, or loved ones. We make caregiving easy, secure, and accessible for everyone.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/service/baby-care"
                  className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-md shadow-xs transition-colors text-sm"
                >
                  Book a Service
                </Link>

                <a
                  href="#about"
                  className="px-6 py-3 bg-white dark:bg-[#111c26] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-md border border-slate-300 dark:border-slate-700 transition-colors text-sm shadow-2xs"
                >
                  Learn More
                </a>
              </div>

            </div>

            {/* Right Col: Hero Photo Banner */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                <img
                  src="/images/hero.jpg"
                  alt="Caregiver with toddler child"
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating pill badge on upper right */}
                <div className="animate-float-slow absolute top-4 right-4 bg-white/95 dark:bg-[#0e1720]/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-dashed border-emerald-400 text-xs shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                    <span>Better Care</span>
                    <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  </div>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Brighter Future</span>
                </div>
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="mt-14 max-w-4xl mx-auto bg-white dark:bg-[#0e1720] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center animate-fade-in-up">
            
            <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#142230] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold font-display text-slate-900 dark:text-white tabular-nums">10K+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Happy Families</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 sm:border-x sm:border-slate-100 dark:sm:border-slate-800 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#142230] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold font-display text-slate-900 dark:text-white tabular-nums">500+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Verified Caregivers</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#142230] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Star className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold font-display text-slate-900 dark:text-white tabular-nums">98%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Satisfaction Rate</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-16 bg-white dark:bg-[#070d12] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-1 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              Our Services
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose the care you need. We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="card-hover-box bg-white dark:bg-[#0e1720] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col group transition-all duration-300"
              >
                {/* Image Container with Badge */}
                <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-[#142230]">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Circular category icon badge overlapping bottom-left */}
                  <div className="absolute bottom-3 left-3">
                    {getServiceBadgeIcon(service.category)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/service/${service.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors group-hover:translate-x-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* What Our Families Say */}
      <section id="about" className="py-16 bg-[#fafcfc] dark:bg-[#091118] border-t border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-1 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
              What Our Families Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="card-hover-box bg-white dark:bg-[#0e1720] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 relative">
              <div className="text-emerald-500 text-lg leading-none font-serif select-none">“</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "Care.xyz gave us peace of mind. The babysitter was amazing and our child loved her!"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">— Sarah Ahmed</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Dhaka</p>
              </div>
            </div>

            <div className="card-hover-box bg-white dark:bg-[#0e1720] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 relative">
              <div className="text-emerald-500 text-lg leading-none font-serif select-none">“</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "Professional, kind and trustworthy. My father is in good hands with their caregiver."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">— Rahman Khan</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Chittagong</p>
              </div>
            </div>

            <div className="card-hover-box bg-white dark:bg-[#0e1720] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 relative">
              <div className="text-emerald-500 text-lg leading-none font-serif select-none">“</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "Very helpful service. Booking was easy and the caregiver was well-trained."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">— Ayesha Islam</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Khulna</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Pre-footer Banner: Because every family deserves care */}
      <section id="contact" className="py-12 bg-white dark:bg-[#070d12] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#e6f4f1] dark:bg-[#0f2425] border border-transparent dark:border-emerald-900/40 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors duration-200">
            
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-600 dark:border-emerald-500 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 bg-white/60 dark:bg-emerald-950/40">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  Because every family deserves care
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Care.xyz — Your trusted caregiving partner
                </p>
              </div>
            </div>

            {/* Decorative wave and loop heart on the right matching image.png */}
            <div className="hidden sm:block text-[#059669] dark:text-emerald-400 z-10 pr-6">
              <svg className="w-36 h-14" viewBox="0 0 120 40" fill="none">
                <path 
                  d="M5 28 C 30 28, 55 18, 75 18 C 88 18, 98 12, 104 20 C 108 26, 102 32, 95 32 C 86 32, 84 22, 92 14 C 98 8, 108 10, 112 16" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
