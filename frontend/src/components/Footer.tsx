'use client';

import React from 'react';
import { HeartHandshake, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Safety Disclaimer Banner */}
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200">Mandatory Safety Disclaimer</p>
            <p className="mt-0.5 text-slate-300 leading-relaxed">
              CareConnect is a remote family-care coordination platform. CareConnect does NOT provide medical advice, diagnosis, prescriptions, or emergency services. In the event of a medical emergency, immediately contact local medical emergency services or visit the nearest hospital.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white">CareConnect</span>
            <span className="text-xs text-slate-500">| Be there, even when you can't be there.</span>
          </div>

          <p className="text-xs text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} CareConnect Technologies Inc. All rights reserved. Designed for remote family care coordination.
          </p>
        </div>

      </div>
    </footer>
  );
}
