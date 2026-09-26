import React from 'react';
import { useRouter, Link } from '../router/Router.js';
import { usePageMetadata } from '../utils/metadata.js';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Building2, 
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  usePageMetadata({
    title: 'About Us & Mission - Care.xyz',
    description: 'Learn about Care.xyz mission, background-checked caregivers, and dedication to reliable family support in Bangladesh.',
    ogTitle: 'About Care.xyz - Trusted Care in Bangladesh',
    ogDescription: 'Providing safe, certified baby care, elderly companionship, and sick patient support across Bangladesh.'
  });

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 via-white to-slate-50 pt-14 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>Compassion, Integrity & Professional Care</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            About <span className="text-[#059669]">Care.xyz</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            We are Bangladesh's premier verified caregiving platform, connecting families with compassionate nannies, certified geriatric companions, and trained patient caregivers.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Our Purpose</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                Because Every Loved One Deserves Dedicated, Dignified Care
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Finding reliable, safe care for an infant or aging parent in Bangladesh has traditionally been stressful and uncertain. Care.xyz was born out of a real personal need: to provide families with vetted, trustworthy, and certified professionals who treat your home with respect and your family like their own.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Comprehensive Verification</h4>
                  <p className="text-xs text-slate-500">Every caregiver passes biometric NID validation, residential address check, and police record scrutiny.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Certified Healthcare Training</h4>
                  <p className="text-xs text-slate-500">Continuous training in early childhood development, geriatric mobility, dementia care, and patient vital monitoring.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Transparent & Accountable</h4>
                  <p className="text-xs text-slate-500">Clear hourly and daily pricing in BDT (৳) with automatic digital invoices and zero hidden commissions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
              <img
                src="/images/hero.jpg"
                alt="Caregiver bonding with child"
                className="w-full h-[400px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#0e1720] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="text-xs font-bold text-slate-800 ml-1">4.9 / 5.0</span>
              </div>
              <p className="text-xs font-semibold text-slate-900">Rated by 10,000+ Families</p>
              <p className="text-[11px] text-slate-500">Across Dhaka, Chittagong, Khulna & Sylhet.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-3xl font-extrabold text-emerald-600 font-display tabular-nums">10,000+</p>
              <p className="text-xs font-medium text-slate-600">Care Hours Completed</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-3xl font-extrabold text-emerald-600 font-display tabular-nums">500+</p>
              <p className="text-xs font-medium text-slate-600">Verified Caregivers</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-3xl font-extrabold text-emerald-600 font-display tabular-nums">8</p>
              <p className="text-xs font-medium text-slate-600">Divisions in Bangladesh</p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-3xl font-extrabold text-emerald-600 font-display tabular-nums">98%</p>
              <p className="text-xs font-medium text-slate-600">Customer Satisfaction</p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Our Core Values
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            The guiding principles that shape every caregiver match and home visit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">Uncompromising Safety</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never cut corners. Biometric NID checks, background checks, and reference interviews protect your home and loved ones.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">Genuine Empathy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Caregiving is more than assistance; it is warmth, patience, and companionship. We nurture genuine relationships.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">Reliability & Punctuality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you schedule a shift, our caregivers arrive on time. Our backup network ensures you are never left without support.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 font-display">
            Need Care for Your Family Today?
          </h3>
          <p className="text-sm text-slate-600">
            Book online in less than 2 minutes or speak directly with our care coordinator.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/services"
              className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-md shadow-xs transition-colors text-sm"
            >
              Browse Services
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-md border border-slate-300 transition-colors text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
