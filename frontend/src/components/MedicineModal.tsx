'use client';

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { Pill, X } from 'lucide-react';

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentProfileId: string;
  onSuccess: () => void;
}

export default function MedicineModal({ isOpen, onClose, parentProfileId, onSuccess }: MedicineModalProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('08:00 AM');
  const [frequency, setFrequency] = useState('Every day');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch('/medications', {
      method: 'POST',
      body: JSON.stringify({
        parentProfileId,
        name,
        dosage,
        timeOfDay,
        frequency,
        startDate,
        instructions,
      }),
    });

    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert(res.message || 'Failed to create medicine reminder');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-sky-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Pill className="w-6 h-6" />
            <h3 className="text-lg font-bold">Add Medicine Reminder</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Medicine Name & Strength *</label>
            <input
              type="text"
              required
              placeholder="e.g. Blood pressure tablet (Amlodipine 5mg)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Dosage *</label>
              <input
                type="text"
                required
                placeholder="e.g. 1 Tablet"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Time of Day *</label>
              <input
                type="text"
                required
                placeholder="e.g. 08:00 AM"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              >
                <option value="Every day">Every day</option>
                <option value="Twice daily">Twice daily</option>
                <option value="As needed">As needed</option>
                <option value="Alternate days">Alternate days</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Instructions / Meal Advice</label>
            <input
              type="text"
              placeholder="e.g. Take after breakfast with warm water"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <p className="text-[11px] text-slate-400">
            * CareConnect records user-defined reminders. It does not provide medical prescriptions or advice.
          </p>

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
              className="px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
