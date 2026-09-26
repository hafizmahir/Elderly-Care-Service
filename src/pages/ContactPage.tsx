import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { usePageMetadata } from '../utils/metadata.js';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Baby Care',
    division: 'Dhaka',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  usePageMetadata({
    title: 'Contact Us - 24/7 Care Support - Care.xyz',
    description: 'Get in touch with Care.xyz. 24/7 emergency helpline, offices in Dhaka, Chittagong, Sylhet, and instant online assistance.',
    ogTitle: 'Contact Care.xyz Support',
    ogDescription: 'Call our 24/7 caregiver hotline or send an inquiry to our care management team.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 pt-14 pb-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>24/7 Care Coordination Hotline Available</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            We are here to <span className="text-[#059669]">Help You</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            Have questions about our care plans, urgent caregiver scheduling, or caregiver background checks? Reach out directly.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Col: Contact Information & Branches */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Hotline Card */}
            <div className="bg-[#0c1a24] text-white p-7 rounded-2xl shadow-md space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                  <Phone className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">24/7 Emergency Line</p>
                  <a href="tel:+8809612227399" className="text-lg font-bold text-white hover:text-emerald-400 font-display">
                    +880 9612-CAREXYZ
                  </a>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Mobile & WhatsApp: +880 1711-223344</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>support@care.xyz | booking@care.xyz</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Care Line: 24 Hours / 7 Days a week</span>
                </div>
              </div>
            </div>

            {/* Nationwide Offices */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
                Our Nationwide Care Centers
              </h3>

              <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
                
                <div className="pt-2 first:pt-0 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dhaka Head Office (Dhanmondi)</span>
                  </div>
                  <p className="text-slate-500 pl-5.5">House 12, Road 5, Dhanmondi, Dhaka 1205</p>
                </div>

                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chittagong Regional Hub (Agrabad)</span>
                  </div>
                  <p className="text-slate-500 pl-5.5">Level 4, City Center, Agrabad Commercial Area, Chittagong</p>
                </div>

                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sylhet Branch (Zindabazar)</span>
                  </div>
                  <p className="text-slate-500 pl-5.5">Shukria Market Commercial Complex, Zindabazar, Sylhet</p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Col: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
            
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, <strong>{formData.name}</strong>. Our care coordinator will contact you at <strong>{formData.phone || formData.email}</strong> within 15 minutes.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        serviceInterest: 'Baby Care',
                        division: 'Dhaka',
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    Send an Inquiry or Schedule a Callback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill in your details and our team will get in touch immediately.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ayesha Rahman"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Contact Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1712-345678"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Care Service Needed</label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none bg-white"
                    >
                      <option value="Baby Care">Baby Care (Infant / Toddler)</option>
                      <option value="Elderly Service">Elderly Care & Companion</option>
                      <option value="Sick People Service">Sick People & Patient Care</option>
                      <option value="Specialized Recovery">Specialized Medical Recovery</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-700">Your Location / Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Dhaka">Dhaka Division</option>
                    <option value="Chittagong">Chittagong Division</option>
                    <option value="Rajshahi">Rajshahi Division</option>
                    <option value="Khulna">Khulna Division</option>
                    <option value="Sylhet">Sylhet Division</option>
                    <option value="Barisal">Barisal Division</option>
                    <option value="Rangpur">Rangpur Division</option>
                    <option value="Mymensingh">Mymensingh Division</option>
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-700">Requirements / Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the patient/child, schedule requirements, or special medical needs..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-lg transition-colors text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};
