'use client';

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { UserCheck, X } from 'lucide-react';

interface CareRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentProfileId: string;
  onSuccess: () => void;
}

export default function CareRequestModal({ isOpen, onClose, parentProfileId, onSuccess }: CareRequestModalProps) {
  const [requestType, setRequestType] = useState('HOSPITAL_ACCOMPANIMENT');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('04:00 PM');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch('/care/care-requests', {
      method: 'POST',
      body: JSON.stringify({
        parentProfileId,
        requestType,
        description,
        preferredDate,
        preferredTime,
        location,
      }),
    });

    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert(res.message || 'Failed to submit care request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-6 h-6" />
            <h3 className="text-lg font-bold">Request Caregiver Visit</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Request Type *</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="HOSPITAL_ACCOMPANIMENT">🏥 Hospital / Clinic Accompaniment</option>
              <option value="GENERAL_ASSISTANCE">🤝 General Home Assistance</option>
              <option value="GROCERY_ASSISTANCE">🛒 Grocery & Supplies Pick-up</option>
              <option value="HOME_CHECKIN">🏡 Home Safety Check-in</option>
              <option value="OTHER">✨ Other Non-Medical Assistance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description / Specific Instructions *</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Please accompany mom from home to clinic, assist with registration, and ensure safe return."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Date *</label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Time *</label>
              <input
                type="text"
                required
                placeholder="e.g. 04:00 PM"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Pickup / Visit Location</label>
            <input
              type="text"
              placeholder="e.g. 102 Park Avenue, Indiranagar, Bangalore"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Care Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
