import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { usePageMetadata } from '../utils/metadata.js';
import { Service } from '../types/index.js';
import { api } from '../lib/api.js';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Calendar, 
  UserCheck, 
  Headphones, 
  AlertCircle,
  Baby,
  Smile,
  Activity,
  Heart,
  Image as ImageIcon
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { params } = useRouter();
  const serviceId = params.service_id || 'baby-care';
  const [service, setService] = useState<Service | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'faqs'>('overview');

  // Dynamic Metadata
  usePageMetadata({
    title: service ? `${service.name} - Care.xyz` : 'Service Details - Care.xyz',
    description: service ? `${service.tagline} From ৳${service.hourlyRate}/hour.` : 'Reliable care services for your family.',
    ogTitle: service ? `${service.name} - Care.xyz` : 'Care.xyz',
    ogDescription: service?.description || 'Reliable care services.'
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getServiceById(serviceId)
      .then(found => {
        if (found) {
          setService(found);
          setSelectedPhoto(found.imageUrl);
        } else {
          setError('Care service not found.');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load service details.');
        setLoading(false);
      });
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Service Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">The requested care specialty does not exist or has been updated.</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md transition-colors"
        >
          Return to All Services
        </Link>
      </div>
    );
  }

  const getServiceAvatar = () => {
    switch (service.category) {
      case 'baby':
        return (
          <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
            <Baby className="w-8 h-8" />
          </div>
        );
      case 'elderly':
        return (
          <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
            <Smile className="w-8 h-8" />
          </div>
        );
      case 'sick':
        return (
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-8 h-8" />
          </div>
        );
      default:
        return null;
    }
  };

  const allPhotos = service.galleryImages && service.galleryImages.length > 0 
    ? service.galleryImages 
    : [service.imageUrl];

  return (
    <div className="min-h-screen bg-white dark:bg-[#070d12] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      
      {/* Top Banner Image with Badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span>&gt;</span>
          <Link href="/#services" className="hover:text-slate-900 dark:hover:text-white transition-colors">Services</Link>
          <span>&gt;</span>
          <span className="text-slate-900 dark:text-white font-medium">{service.name}</span>
        </div>

        {/* Wide Header Photo Banner */}
        <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
          <img
            src={selectedPhoto || service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          {/* Sun badge */}
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>
        </div>

        {/* Gallery Thumbnails Strip */}
        {allPhotos.length > 1 && (
          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
              <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Care Photos:</span>
            </div>
            {allPhotos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  selectedPhoto === photo
                    ? 'border-emerald-500 shadow-sm scale-105'
                    : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo} alt={`${service.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Title, Rating, Price & CTA Section */}
        <div className="mt-8 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              {getServiceAvatar()}
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {service.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {service.tagline}
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-xs">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">{service.rating}</span>
                  <span className="text-slate-400 dark:text-slate-500">({service.reviewCount}+ reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  From <span className="text-emerald-700 dark:text-emerald-400 text-xl">৳{service.hourlyRate}</span>/hour
                </span>
              </div>
              <Link
                href={`/booking/${service.id}`}
                className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-md shadow-xs transition-colors text-xs cursor-pointer"
              >
                Book Service
              </Link>
            </div>

          </div>

          {/* 4 Green Bullet Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {service.features.slice(0, 4).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-b border-slate-200 dark:border-slate-800 flex items-center gap-8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'features'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'faqs'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Text & 4 Trust Badges */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    Service Overview
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.fullOverview}
                  </p>
                </div>

                {/* 4 Icon Features along bottom */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Safe & Secure</p>
                  </div>

                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Verified Caregivers</p>
                  </div>

                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Flexible Booking</p>
                  </div>

                  <div className="space-y-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">24/7 Support</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Action Photo */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 h-64 sm:h-72 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={allPhotos[1] || allPhotos[0]}
                    alt={`${service.name} caregiver`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                All Included Features & Tasks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-[#0e1720] rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {service.faqs?.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-[#0e1720] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-xs">{faq.question}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
