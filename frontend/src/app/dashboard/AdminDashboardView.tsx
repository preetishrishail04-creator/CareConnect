'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { ShieldCheck, Users, AlertTriangle, UserX, CheckCircle, Clock, ShieldAlert, Activity, RefreshCw } from 'lucide-react';

interface AdminDashboardViewProps {
  user: any;
}

export default function AdminDashboardView({ user }: AdminDashboardViewProps) {
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    const statsRes = await apiFetch('/admin/stats');
    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    }

    const usersRes = await apiFetch('/admin/users');
    if (usersRes.success && usersRes.data) {
      setUsersList(usersRes.data);
    }

    const cgRes = await apiFetch('/care/caregivers');
    if (cgRes.success && cgRes.data) {
      setCaregivers(cgRes.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const res = await apiFetch(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.success) {
      alert(`User status updated to ${newStatus}`);
      fetchAdminData();
    } else {
      alert(res.message || 'Failed to update status');
    }
  };

  const handleVerifyCaregiver = async (caregiverProfileId: string, isVerified: boolean) => {
    const res = await apiFetch(`/admin/caregivers/${caregiverProfileId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified }),
    });

    if (res.success) {
      alert(`Caregiver verification updated to ${isVerified ? 'VERIFIED' : 'UNVERIFIED'}`);
      fetchAdminData();
    } else {
      alert(res.message || 'Failed to update verification status');
    }
  };

  const summary = stats?.summary || {};

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">CareConnect Governance</span>
          <h1 className="text-3xl font-extrabold mt-1">Platform Admin Control Panel</h1>
          <p className="text-xs text-slate-300 mt-1">Oversight for platform users, caregiver verification, emergency logs & compliance.</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Analytics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Platform Users</span>
          <p className="text-3xl font-black text-slate-900">{summary.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-400">Accounts across all 4 roles</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Pending Caregiver Approvals</span>
          <p className="text-3xl font-black text-amber-600">{summary.pendingCaregiverApprovals || 0}</p>
          <p className="text-[11px] text-amber-600 font-semibold">Requires verification review</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Active Care Visit Requests</span>
          <p className="text-3xl font-black text-indigo-600">{summary.activeCareRequests || 0}</p>
          <p className="text-[11px] text-slate-400">Open or accepted visits</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Active Emergency Alerts</span>
          <p className="text-3xl font-black text-rose-600">{summary.activeEmergencyAlerts || 0}</p>
          <p className="text-[11px] text-rose-600 font-semibold">Requires immediate oversight</p>
        </div>
      </div>

      {/* Caregiver Approval & Verification Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>Caregiver Verification Approvals</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Verify credentials before assignment</span>
        </div>

        <div className="divide-y divide-slate-100">
          {caregivers.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 text-center">No caregiver profiles registered.</p>
          ) : (
            caregivers.map((cg: any) => (
              <div key={cg.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{cg.user?.name}</h3>
                    {cg.isVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Pending Approval
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location: {cg.location} | Experience: {cg.experienceYears} Years | Rating: {cg.rating} ⭐
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">Skills: {cg.skills}</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {!cg.isVerified ? (
                    <button
                      onClick={() => handleVerifyCaregiver(cg.id, true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                    >
                      Approve & Verify
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyCaregiver(cg.id, false)}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Revoke Verification
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Management & Governance */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-sky-600" />
          <span>User Accounts & Status Governance</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Account Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
