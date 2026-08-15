'use client';

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { ShieldAlert, AlertTriangle, Phone, MapPin, CheckCircle, X } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentProfileId?: string;
  emergencyContacts?: any[];
}

export default function EmergencyModal({ isOpen, onClose, parentProfileId, emergencyContacts = [] }: EmergencyModalProps) {
  const [step, setStep] = useState<'CONFIRM' | 'SENDING' | 'SENT'>('CONFIRM');
  const [locationSharing, setLocationSharing] = useState(true);
  const [notes, setNotes] = useState('');
  const [alertResult, setAlertResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTriggerEmergency = async () => {
    setStep('SENDING');

    let locationText = 'Parent Registered Address';
    if (locationSharing && navigator.geolocation) {
      try {
        const pos: any = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
        );
        locationText = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (GPS Live)`;
      } catch {
        locationText = 'Parent Home Address (Indiranagar, Bangalore)';
      }
    }

    const res = await apiFetch('/emergency', {
      method: 'POST',
      body: JSON.stringify({
        parentProfileId,
        location: locationText,
        notes: notes || 'Immediate Help Requested via Emergency Modal',
      }),
    });

    if (res.success) {
      setAlertResult(res.data);
      setStep('SENT');
    } else {
      alert(res.message || 'Failed to trigger emergency alert');
      setStep('CONFIRM');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">🆘 EMERGENCY ALERT</h2>
              <p className="text-xs text-rose-100 font-medium">CareConnect Priority Safety Dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {step === 'CONFIRM' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-rose-900">Are you sure you need emergency assistance?</p>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    This will immediately broadcast a critical alert to all connected family members and record an urgent entry in the platform.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Add details or immediate symptoms (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g., Feeling severe dizziness or chest tightness"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="loc"
                  checked={locationSharing}
                  onChange={(e) => setLocationSharing(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="loc" className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Attach current device location (if available)
                </label>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 leading-relaxed border border-slate-200">
                <strong>Notice:</strong> CareConnect coordinates alerts with family members. For life-threatening medical emergencies, also call local emergency ambulance services (102 / 112).
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleTriggerEmergency}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
                >
                  YES, SEND ALERT
                </button>
              </div>
            </div>
          )}

          {step === 'SENDING' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-base font-bold text-slate-800">Dispatching Emergency Alert...</p>
              <p className="text-xs text-slate-500">Notifying connected family members and recording priority log.</p>
            </div>
          )}

          {step === 'SENT' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800">Emergency Alert Active</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Connected family members have been sent an instant notification.
                </p>
              </div>

              {/* Direct local contacts quick dial */}
              <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Call Emergency Contacts:</p>
                <div className="space-y-2">
                  <a
                    href="tel:112"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                  >
                    <span>🚑 National Medical Emergency Services</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Call 112 / 102</span>
                  </a>
                  {emergencyContacts.map((c: any) => (
                    <a
                      key={c.id}
                      href={`tel:${c.phone}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white text-slate-800 border border-slate-200 text-xs font-semibold hover:border-sky-500 transition-colors"
                    >
                      <span>{c.name} ({c.relationship})</span>
                      <span className="flex items-center gap-1 text-sky-600"><Phone className="w-3.5 h-3.5" /> {c.phone}</span>
                    </a>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors"
              >
                Close Window
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
