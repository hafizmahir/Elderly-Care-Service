import React from 'react';
import { Link } from '../router/Router.js';
import { usePageMetadata } from '../utils/metadata.js';
import { FileText, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  usePageMetadata({
    title: '404 - Page Not Found | Care.xyz',
    description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  });

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#fafcfc] px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        
        {/* Custom 404 Document Illustration matching image.png */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          {/* Sparkles around document */}
          <span className="absolute -top-1 left-4 text-cyan-400 text-sm">✦</span>
          <span className="absolute top-2 right-4 text-cyan-400 text-base">✦</span>
          <span className="absolute bottom-2 left-2 text-cyan-400 text-xs">✦</span>
          <span className="absolute -bottom-1 right-5 text-cyan-400 text-sm">✦</span>

          {/* Document Sheet with folded corner */}
          <div className="relative w-24 h-28 bg-white border-2 border-cyan-200 rounded-xl shadow-sm p-3 flex flex-col justify-between">
            {/* Top folded corner */}
            <div className="absolute top-0 right-0 w-5 h-5 bg-cyan-100 rounded-bl-md border-b border-l border-cyan-300" />

            {/* Document lines */}
            <div className="space-y-1.5 pt-1">
              <div className="h-1.5 bg-cyan-100 rounded-full w-10" />
              <div className="h-1.5 bg-cyan-100 rounded-full w-14" />
              <div className="h-1.5 bg-cyan-100 rounded-full w-8" />
            </div>

            {/* Central 404 Pill Badge */}
            <div className="mx-auto my-auto px-3.5 py-1.5 rounded-lg bg-[#008774] text-white font-extrabold text-sm tracking-wider shadow-sm">
              404
            </div>

            {/* Bottom lines */}
            <div className="space-y-1 pb-1">
              <div className="h-1.5 bg-cyan-100 rounded-full w-12 mx-auto" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-md text-xs shadow-xs transition-colors"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};
