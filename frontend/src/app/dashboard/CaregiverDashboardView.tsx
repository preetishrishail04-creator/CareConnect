'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { UserCheck, MapPin, Star, CheckCircle, Clock, ShieldCheck, AlertCircle, Phone, ArrowRight } from 'lucide-react';

interface CaregiverDashboardViewProps {
  user: any;
}

export default function CaregiverDashboardView({ user }: CaregiverDashboardViewProps) {
  const [profile, setProfile] = useState<any>(null);
  const [careRequests, setCareRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const userRes = await apiFetch('/auth/me');
    if (userRes.success && userRes.data) {
      setProfile(userRes.data.caregiverProfile);
    }

    const reqRes = await apiFetch('/care/care-requests');
    if (reqRes.success && reqRes.data) {
      setCareRequests(reqRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptRequest = async (careRequestId: string) => {
    const res = await apiFetch(`/care/care-requests/${careRequestId}/accept`, { method: 'POST' });
    if (res.success) {
      alert('Care request accepted! Visit created.');
      fetchData();
    } else {
      alert(res.message || 'Failed to accept care request');
    }
  };

  const handleUpdateStatus = async (visitId: string, status: string) => {
    const res = await apiFetch(`/care/care-visits/${visitId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      alert(`Visit status updated to ${status}`);
      fetchData();
    } else {
      alert(res.message || 'Failed to update visit status');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Caregiver Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
              {profile?.isVerified ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>✓ Admin Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Verification Pending Admin Review</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-600" /> {profile?.location || 'Indiranagar, Bangalore'}</span>
              <span>• {profile?.experienceYears || 3} Years Experience</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {profile?.rating || 4.8} ⭐</span>
              <span>• {profile?.completedVisitsCount || 126} Visits Completed</span>
            </p>

            <div className="mt-2 text-xs text-slate-600 font-medium">
              Skills: <span className="text-slate-800">{profile?.skills || 'Elder Care, Vital Checks, Hospital Accompaniment'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Care Requests Marketplace */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-600" />
          <span>Available & Assigned Care Visit Requests</span>
        </h2>

        <div className="space-y-4">
          {careRequests.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
              No open care visit requests available right now.
            </div>
          ) : (
            careRequests.map((req: any) => {
              const visit = req.visit;
              const isAssignedToMe = visit && visit.caregiverProfileId === profile?.id;

              return (
                <div
                  key={req.id}
                  className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                    isAssignedToMe ? 'bg-indigo-50/70 border-indigo-300' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs uppercase">
                        {req.requestType.replace(/_/g, ' ')}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        Parent: {req.parent?.user?.name || 'Elderly Senior'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'OPEN'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'ACCEPTED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Status: {req.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {req.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                      <span className="text-slate-400 font-medium">Preferred Date & Time:</span>
                      <p className="font-bold text-slate-800">{req.preferredDate} at {req.preferredTime}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                      <span className="text-slate-400 font-medium">Location:</span>
                      <p className="font-bold text-slate-800">{req.location}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                      <span className="text-slate-400 font-medium">Contact Phone:</span>
                      <p className="font-bold text-indigo-600">{req.parent?.user?.phone || '+91 98765 43211'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {req.status === 'OPEN' && (
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Accept Care Visit Assignment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {isAssignedToMe && visit && (
                    <div className="p-4 rounded-2xl bg-white border border-indigo-200 space-y-3">
                      <p className="text-xs font-bold text-indigo-900 uppercase">Update Active Visit Progress:</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(visit.id, 'ON_THE_WAY')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            visit.status === 'ON_THE_WAY' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
                          }`}
                        >
                          🚗 On The Way
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(visit.id, 'ARRIVED')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            visit.status === 'ARRIVED' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                          }`}
                        >
                          🏡 Arrived at Location
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(visit.id, 'COMPLETED')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            visit.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                          }`}
                        >
                          ✓ Mark Visit Completed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
