'use client';

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { Calendar, X } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentProfileId: string;
  onSuccess: () => void;
}

export default function AppointmentModal({ isOpen, onClose, parentProfileId, onSuccess }: AppointmentModalProps) {
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [time, setTime] = useState('04:30 PM');
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch('/appointments', {
      method: 'POST',
      body: JSON.stringify({
        parentProfileId,
        doctorName,
        hospitalName,
        appointmentDate,
        time,
        purpose,
        location,
        notes,
      }),
    });

    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert(res.message || 'Failed to schedule appointment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-emerald-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-6 h-6" />
            <h3 className="text-lg font-bold">Schedule Doctor Appointment</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Ramesh Sharma"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Hospital / Clinic Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Manipal Hospital, Old Airport Road"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date *</label>
              <input
                type="date"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Time *</label>
              <input
                type="text"
                required
                placeholder="e.g. 04:30 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Purpose of Visit *</label>
            <input
              type="text"
              required
              placeholder="e.g. Routine Hypertension & Cardiac Evaluation"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Department / Location Notes</label>
            <input
              type="text"
              placeholder="e.g. Cardiology OPD, 3rd Floor"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Preparation Notes / Documents</label>
            <textarea
              rows={2}
              placeholder="e.g. Carry blood pressure check logbook and previous test reports"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
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
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
