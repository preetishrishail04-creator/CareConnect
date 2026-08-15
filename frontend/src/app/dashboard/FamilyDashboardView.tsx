'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import MedicineModal from '../../components/MedicineModal';
import AppointmentModal from '../../components/AppointmentModal';
import CareRequestModal from '../../components/CareRequestModal';
import ParentInviteModal from '../../components/ParentInviteModal';
import {
  Pill,
  Calendar,
  Heart,
  UserCheck,
  ShieldAlert,
  UserPlus,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Phone,
  Activity,
  User,
} from 'lucide-react';

interface FamilyDashboardViewProps {
  user: any;
  onOpenEmergency: () => void;
}

export default function FamilyDashboardView({ user, onOpenEmergency }: FamilyDashboardViewProps) {
  const [parents, setParents] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [parentDetail, setParentDetail] = useState<any>(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal open states
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchFamilyData = async () => {
    setLoading(true);
    const res = await apiFetch('/parents');
    if (res.success && res.data) {
      setParents(res.data);
      if (res.data.length > 0 && !selectedParentId) {
        setSelectedParentId(res.data[0].parentProfile.id);
      }
    }

    const alertRes = await apiFetch('/emergency');
    if (alertRes.success && alertRes.data) {
      setEmergencyAlerts(alertRes.data);
    }

    setLoading(false);
  };

  const fetchSelectedParentDetail = async () => {
    if (!selectedParentId) return;
    const res = await apiFetch(`/parents/${selectedParentId}`);
    if (res.success && res.data) {
      setParentDetail(res.data);
    }
    const actRes = await apiFetch(`/activities?parentProfileId=${selectedParentId}`);
    if (actRes.success && actRes.data) {
      setActivities(actRes.data);
    }
  };

  useEffect(() => {
    fetchFamilyData();
  }, []);

  useEffect(() => {
    if (selectedParentId) {
      fetchSelectedParentDetail();
    }
  }, [selectedParentId]);

  const handleAcknowledgeAlert = async (alertId: string) => {
    await apiFetch(`/emergency/${alertId}/acknowledge`, { method: 'PUT' });
    fetchFamilyData();
    fetchSelectedParentDetail();
  };

  const handleResolveAlert = async (alertId: string) => {
    await apiFetch(`/emergency/${alertId}/resolve`, { method: 'PUT' });
    fetchFamilyData();
    fetchSelectedParentDetail();
  };

  const activeAlert = emergencyAlerts.find((a) => a.status !== 'RESOLVED');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Greeting */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Good day, {user.name} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Remote Family Care Coordinator | Monitor your loved ones in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Connect Parent</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>🆘 EMERGENCY</span>
          </button>
        </div>
      </div>

      {/* Active Emergency Alert Warning Banner */}
      {activeAlert && (
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs font-bold uppercase">
                🚨 CRITICAL EMERGENCY ALERT ({activeAlert.status})
              </span>
              <h2 className="text-xl font-black text-rose-950 mt-1">
                Emergency Alert Triggered for {activeAlert.parent?.user?.name || 'Parent'}
              </h2>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                Time: {new Date(activeAlert.createdAt).toLocaleTimeString()} | Location: {activeAlert.location || 'Attached'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {activeAlert.status === 'ACTIVE' && (
              <button
                onClick={() => handleAcknowledgeAlert(activeAlert.id)}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
              >
                Acknowledge Alert
              </button>
            )}
            <button
              onClick={() => handleResolveAlert(activeAlert.id)}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      )}

      {/* Parent Switcher Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-sky-600" />
          <span>Connected Parents</span>
        </h2>

        {parents.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
            <p className="text-slate-500 text-sm">No parents connected yet.</p>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              Connect Parent Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parents.map((p: any) => {
              const profile = p.parentProfile;
              const isSelected = profile.id === selectedParentId;
              const latestCheckIn = profile.checkIns && profile.checkIns[0];

              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedParentId(profile.id)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50/90 border-sky-500 shadow-md ring-2 ring-sky-200'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white font-bold text-xl flex items-center justify-center">
                        {profile.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{profile.user.name}</h3>
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          🟢 Doing Well
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-sky-600' : 'text-slate-300'}`} />
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-600 font-medium">Latest Check-in:</span>
                      <p className="font-bold text-slate-800">
                        {latestCheckIn ? `${latestCheckIn.mood} (${latestCheckIn.time})` : 'Good 😊'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Medicines:</span>
                      <p className="font-bold text-slate-800">{profile.medications?.length || 0} Reminders</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Parent Overview & Detailed Management Section */}
      {parentDetail && (
        <div className="space-y-6">
          
          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-5 rounded-3xl shadow-md">
            <div>
              <h2 className="text-lg font-bold">Manage Care for {parentDetail.user?.name}</h2>
              <p className="text-xs text-slate-400">Add reminders, doctor visits, or request caregiver visits</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsMedModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>

              <button
                onClick={() => setIsApptModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Appointment</span>
              </button>

              <button
                onClick={() => setIsCareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Request Caregiver</span>
              </button>
            </div>
          </div>

          {/* Today's Status Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Medicines Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">💊 Today's Medicines</h3>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                  {parentDetail.medications?.length || 0} Total
                </span>
              </div>

              <div className="space-y-3">
                {parentDetail.medications?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No medicine reminders configured.</p>
                ) : (
                  parentDetail.medications?.map((m: any) => (
                    <div key={m.id} className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{m.name}</span>
                        <span className="text-purple-700">{m.timeOfDay}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{m.dosage} — {m.instructions || 'Daily'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Appointments Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">🏥 Appointments</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {parentDetail.appointments?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {parentDetail.appointments?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No upcoming doctor appointments.</p>
                ) : (
                  parentDetail.appointments?.map((app: any) => (
                    <div key={app.id} className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{app.doctorName}</span>
                        <span className="text-emerald-700">{app.time}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-900">{app.hospitalName}</p>
                      <p className="text-[10px] text-slate-500">Date: {app.appointmentDate}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Check-ins & Emergency Contacts Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">❤️ Check-in History</h3>
                </div>
              </div>

              <div className="space-y-2.5">
                {parentDetail.checkIns?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No check-ins submitted yet today.</p>
                ) : (
                  parentDetail.checkIns?.slice(0, 4).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {c.mood === 'GOOD' ? '😊' : c.mood === 'OKAY' ? '😐' : c.mood === 'NOT_GOOD' ? '😟' : '😔'}
                        </span>
                        <span className="font-bold text-slate-800">{c.mood}</span>
                      </div>
                      <span className="text-[10px] text-slate-600">{c.date} at {c.time}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-2">Emergency Contacts</h4>
                <div className="space-y-1.5">
                  {parentDetail.emergencyContacts?.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">{c.name} ({c.relationship})</span>
                      <a href={`tel:${c.phone}`} className="text-sky-600 font-bold hover:underline">{c.phone}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Activity Timeline Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                <span>Family Activity Timeline</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Real-time log</span>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400">No activity logs recorded yet.</p>
              ) : (
                activities.map((act: any) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-sky-600 border-2 border-white ring-4 ring-sky-100" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{act.action.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] text-slate-600">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{act.details}</p>
                      <span className="text-[10px] text-sky-600 font-medium mt-0.5 block">By: {act.actor?.name || 'User'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      {selectedParentId && (
        <>
          <MedicineModal
            isOpen={isMedModalOpen}
            onClose={() => setIsMedModalOpen(false)}
            parentProfileId={selectedParentId}
            onSuccess={fetchSelectedParentDetail}
          />
          <AppointmentModal
            isOpen={isApptModalOpen}
            onClose={() => setIsApptModalOpen(false)}
            parentProfileId={selectedParentId}
            onSuccess={fetchSelectedParentDetail}
          />
          <CareRequestModal
            isOpen={isCareModalOpen}
            onClose={() => setIsCareModalOpen(false)}
            parentProfileId={selectedParentId}
            onSuccess={fetchSelectedParentDetail}
          />
        </>
      )}

      <ParentInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={fetchFamilyData}
      />

    </div>
  );
}
