'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyModal from '../../components/EmergencyModal';

import FamilyDashboardView from './FamilyDashboardView';
import ParentDashboardView from './ParentDashboardView';
import CaregiverDashboardView from './CaregiverDashboardView';
import AdminDashboardView from './AdminDashboardView';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Loading CareConnect Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenEmergency={() => setIsEmergencyModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'FAMILY_MEMBER' && (
          <FamilyDashboardView user={user} onOpenEmergency={() => setIsEmergencyModalOpen(true)} />
        )}
        {user.role === 'PARENT' && (
          <ParentDashboardView user={user} onOpenEmergency={() => setIsEmergencyModalOpen(true)} />
        )}
        {user.role === 'CAREGIVER' && (
          <CaregiverDashboardView user={user} />
        )}
        {user.role === 'ADMIN' && (
          <AdminDashboardView user={user} />
        )}
      </main>

      <Footer />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        parentProfileId={user.parentProfileId || undefined}
      />
    </div>
  );
}
