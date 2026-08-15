'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Pill, Calendar, Heart, Phone, UserCheck, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface ParentDashboardViewProps {
  user: any;
  onOpenEmergency: () => void;
}

export default function ParentDashboardView({ user, onOpenEmergency }: ParentDashboardViewProps) {
  const [parentData, setParentData] = useState<any>(null);
  const [checkInMood, setCheckInMood] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'HOME' | 'MEDICINES' | 'APPOINTMENTS' | 'CHECKIN' | 'CONTACTS'>('HOME');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchParentInfo = async () => {
    const res = await apiFetch('/parents');
    if (res.success && res.data && res.data.length > 0) {
      setParentData(res.data[0]);
    }
  };

  useEffect(() => {
    fetchParentInfo();
  }, []);

  const handleMarkTaken = async (medicationId: string, status: string = 'TAKEN') => {
    const res = await apiFetch(`/medications/${medicationId}/taken`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      setActionSuccessMessage(`Medicine marked as ${status.toLowerCase()}!`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      fetchParentInfo();
    }
  };

  const handleDailyCheckIn = async (mood: string) => {
    setCheckInMood(mood);
    const res = await apiFetch('/checkins', {
      method: 'POST',
      body: JSON.stringify({ mood }),
    });
    if (res.success) {
      setActionSuccessMessage('Daily check-in recorded! Your family has been notified.');
      setTimeout(() => setActionSuccessMessage(null), 4000);
      fetchParentInfo();
    }
  };

  const medications = parentData?.medications || [];
  const appointments = parentData?.appointments || [];
  const contacts = parentData?.emergencyContacts || [];
  const checkIns = parentData?.checkIns || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Friendly Elderly Greeting Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-emerald-100">CareConnect Senior Portal</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">
            Good day, {user.name} 👋
          </h1>
          <p className="text-emerald-100 text-base mt-1">
            We are here to support your daily wellness and family connections.
          </p>
        </div>
        
        {/* BIG EMERGENCY BUTTON */}
        <button
          onClick={onOpenEmergency}
          className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xl shadow-2xl shadow-rose-600/50 border-4 border-white animate-pulse transition-transform hover:scale-105 flex items-center justify-center gap-3 shrink-0"
        >
          <ShieldAlert className="w-8 h-8" />
          <span>🆘 EMERGENCY</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold text-lg flex items-center gap-3 animate-fade-in shadow-md">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Main Tab Navigation Buttons - VERY LARGE & ACCESSIBLE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('MEDICINES')}
          className={`p-6 rounded-3xl border-3 text-left transition-all shadow-md flex flex-col justify-between ${
            activeTab === 'MEDICINES'
              ? 'bg-purple-600 text-white border-purple-700 scale-102 ring-4 ring-purple-300'
              : 'bg-white text-purple-950 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-black">💊 My Medicines</div>
            <div className="text-sm font-semibold opacity-90 mt-1">{medications.length} Scheduled Reminders</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('APPOINTMENTS')}
          className={`p-6 rounded-3xl border-3 text-left transition-all shadow-md flex flex-col justify-between ${
            activeTab === 'APPOINTMENTS'
              ? 'bg-sky-600 text-white border-sky-700 scale-102 ring-4 ring-sky-300'
              : 'bg-white text-sky-950 border-sky-200 hover:bg-sky-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-black">🏥 Doctor Visits</div>
            <div className="text-sm font-semibold opacity-90 mt-1">{appointments.length} Upcoming Appointments</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('CHECKIN')}
          className={`p-6 rounded-3xl border-3 text-left transition-all shadow-md flex flex-col justify-between col-span-2 sm:col-span-1 ${
            activeTab === 'CHECKIN'
              ? 'bg-emerald-600 text-white border-emerald-700 scale-102 ring-4 ring-emerald-300'
              : 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-black">❤️ Daily Check-in</div>
            <div className="text-sm font-semibold opacity-90 mt-1">Log how you feel today</div>
          </div>
        </button>
      </div>

      {/* Dynamic Accessible Tab Views */}

      {/* 1. Daily Check-in View */}
      {(activeTab === 'HOME' || activeTab === 'CHECKIN') && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500" />
            <div>
              <h2 className="text-2xl font-black text-slate-900">How are you feeling today?</h2>
              <p className="text-sm text-slate-600 font-medium">Tap one button below to update your family.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => handleDailyCheckIn('GOOD')}
              className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                checkInMood === 'GOOD'
                  ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300 scale-105 font-bold'
                  : 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100 font-bold'
              }`}
            >
              <span className="text-4xl">😊</span>
              <span className="text-lg">Good</span>
            </button>

            <button
              onClick={() => handleDailyCheckIn('OKAY')}
              className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                checkInMood === 'OKAY'
                  ? 'bg-sky-500 text-white border-sky-600 ring-4 ring-sky-300 scale-105 font-bold'
                  : 'bg-sky-50 text-sky-950 border-sky-300 hover:bg-sky-100 font-bold'
              }`}
            >
              <span className="text-4xl">😐</span>
              <span className="text-lg">Okay</span>
            </button>

            <button
              onClick={() => handleDailyCheckIn('NOT_GOOD')}
              className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                checkInMood === 'NOT_GOOD'
                  ? 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-300 scale-105 font-bold'
                  : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100 font-bold'
              }`}
            >
              <span className="text-4xl">😟</span>
              <span className="text-lg">Not Feeling Well</span>
            </button>

            <button
              onClick={() => handleDailyCheckIn('NEED_HELP')}
              className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                checkInMood === 'NEED_HELP'
                  ? 'bg-rose-600 text-white border-rose-700 ring-4 ring-rose-300 scale-105 font-bold'
                  : 'bg-rose-50 text-rose-950 border-rose-300 hover:bg-rose-100 font-bold'
              }`}
            >
              <span className="text-4xl">😔</span>
              <span className="text-lg">Need Help</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 italic">
            * Check-in selections record how you feel and inform your family. They do not substitute medical care.
          </p>
        </div>
      )}

      {/* 2. Medicines View */}
      {(activeTab === 'HOME' || activeTab === 'MEDICINES') && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Pill className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-2xl font-black text-slate-900">💊 My Medicines Today</h2>
                <p className="text-sm text-slate-600 font-medium">Tap "Taken" after taking your medication.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {medications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 font-semibold text-base">
                No medicines scheduled. Your family member can add reminders for you.
              </div>
            ) : (
              medications.map((med: any) => (
                <div
                  key={med.id}
                  className="p-5 rounded-2xl bg-purple-50/60 border-2 border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-purple-200 text-purple-900 font-bold text-xs">
                      ⏰ Time: {med.timeOfDay}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{med.name}</h3>
                    <p className="text-sm text-purple-900 font-semibold">Dosage: {med.dosage}</p>
                    {med.instructions && (
                      <p className="text-xs text-slate-600">Instructions: {med.instructions}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleMarkTaken(med.id, 'TAKEN')}
                      className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Taken</span>
                    </button>
                    <button
                      onClick={() => handleMarkTaken(med.id, 'SKIPPED')}
                      className="px-4 py-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm"
                    >
                      Remind Later
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Appointments View */}
      {(activeTab === 'HOME' || activeTab === 'APPOINTMENTS') && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-sky-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-900">🏥 Doctor Appointments</h2>
              <p className="text-sm text-slate-600 font-medium">Your scheduled visits and hospital details.</p>
            </div>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 font-semibold text-base">
                No upcoming appointments.
              </div>
            ) : (
              appointments.map((app: any) => (
                <div key={app.id} className="p-5 rounded-2xl bg-sky-50/60 border-2 border-sky-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-sky-200 text-sky-900 font-bold text-xs">
                      📅 {app.appointmentDate} at {app.time}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{app.doctorName}</h3>
                  <p className="text-sm font-semibold text-sky-900">🏥 {app.hospitalName}</p>
                  <p className="text-xs text-slate-600">Purpose: {app.purpose}</p>
                  {app.location && <p className="text-xs text-slate-500">📍 Location: {app.location}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Contact Family Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Phone className="w-7 h-7 text-emerald-600" />
          <span>👨‍👩‍👧 Quick Contact Family & Doctor</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contacts.map((c: any) => (
            <a
              key={c.id}
              href={`tel:${c.phone}`}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-base font-bold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500 font-semibold">{c.relationship}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
