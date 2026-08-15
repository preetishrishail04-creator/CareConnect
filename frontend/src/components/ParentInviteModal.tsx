'use client';

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { UserPlus, X } from 'lucide-react';

interface ParentInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ParentInviteModal({ isOpen, onClose, onSuccess }: ParentInviteModalProps) {
  const [parentEmail, setParentEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('FULL_ACCESS');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch('/family/invite', {
      method: 'POST',
      body: JSON.stringify({ parentEmail, permissionLevel }),
    });

    setLoading(false);
    if (res.success) {
      alert('Invitation sent to parent successfully!');
      onSuccess();
      onClose();
    } else {
      alert(res.message || 'Failed to send parent connection invitation');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-sky-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-6 h-6" />
            <h3 className="text-lg font-bold">Connect Parent</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Parent's Registered Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. lakshmi@example.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Your parent must have a CareConnect Parent account. For demo, try: <code>lakshmi@example.com</code>
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Permission Level</label>
            <select
              value={permissionLevel}
              onChange={(e) => setPermissionLevel(e.target.value)}
              className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 font-medium"
            >
              <option value="FULL_ACCESS">Full Access (Manage Reminders, Appointments & Visits)</option>
              <option value="LIMITED_ACCESS">Limited Access (View & Add Reminders)</option>
              <option value="VIEW_ONLY">View Only (Dashboard & Status Timeline)</option>
            </select>
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
              className="px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Connection Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
