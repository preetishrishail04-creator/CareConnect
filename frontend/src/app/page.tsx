'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Pill,
  Calendar,
  Heart,
  UserCheck,
  ShieldAlert,
  Users,
  Bell,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-800 text-xs sm:text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
            <span>Remote Family Care & Safety Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Be there, even when you <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">can't be there.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            CareConnect helps families stay connected with elderly parents through medicine reminders, doctor appointments, daily check-ins, caregiver coordination, and immediate emergency alerts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-2xl shadow-lg shadow-sky-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 shadow-sm transition-all hover:scale-105"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Demo Quick Access Bar */}
          <div className="mt-12 p-4 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-md max-w-xl mx-auto text-left">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">Instant Demo Login Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/login?role=family" className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold flex items-center justify-between">
                <span>👨‍👩‍👧 Family (Preeti)</span>
                <span className="text-[10px] text-sky-600">preeti@example.com</span>
              </Link>
              <Link href="/login?role=parent" className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-between">
                <span>👵 Parent (Lakshmi)</span>
                <span className="text-[10px] text-emerald-600">lakshmi@example.com</span>
              </Link>
              <Link href="/login?role=caregiver" className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold flex items-center justify-between">
                <span>🩺 Caregiver (Ravi)</span>
                <span className="text-[10px] text-indigo-600">ravi@example.com</span>
              </Link>
              <Link href="/login?role=admin" className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold flex items-center justify-between">
                <span>🛡️ Admin</span>
                <span className="text-[10px] text-purple-600">admin@example.com</span>
              </Link>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">Password for all demo accounts: <code>Password123!</code></p>
          </div>

        </div>
      </section>

      {/* How CareConnect Works */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">How CareConnect Works</h2>
            <p className="mt-3 text-slate-600 text-base">
              Simple 3-step remote coordination designed for families caring across cities.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-extrabold text-xl flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Connect Your Family</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Send an invitation to connect your elderly parent's account with explicit consent and permission controls.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-extrabold text-xl flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Set Up Care Routines</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Schedule medicine reminders, add doctor appointments, and request verified caregivers for hospital accompaniment.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Stay Informed Remotely</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Receive real-time notifications for completed medicines, daily check-in feelings, care visit progress, and immediate emergency alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">Designed for Family Peace of Mind</h2>
            <p className="mt-3 text-slate-600">Everything needed to manage day-to-day elderly care remotely.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-purple-100 text-purple-700 mb-4">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">💊 Medicine Reminders</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Set schedules for daily medicines. Parents log compliance with easy "Taken" or "Remind later" buttons.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🏥 Appointments</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Keep track of upcoming doctor visits, hospital clinic locations, and prep instructions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-rose-100 text-rose-700 mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">❤️ Daily Check-ins</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Elderly parents log how they feel each day with clear mood buttons (😊 Good, 😐 Okay, 😟 Not feeling well, 😔 Need help).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-indigo-100 text-indigo-700 mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🤝 Caregiver Coordination</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Request admin-verified caregivers for hospital accompaniment, grocery assistance, or home safety check-ins.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-rose-100 text-rose-700 mb-4">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🆘 Emergency Alerts</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Prominent emergency button with confirmation, optional GPS attachment, and emergency contact phone links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-sky-100 text-sky-700 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">👨‍👩‍👧 Family Dashboard</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Overview of parent well-being status, today's completed routines, upcoming visits, and active connection access.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-amber-100 text-amber-700 mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🔔 Notifications</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                In-app notification center for medicine compliance, missed doses, visit updates, and emergency status.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 w-fit rounded-xl bg-teal-100 text-teal-700 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">📋 Activity Timeline</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Chronological log of all parent check-ins, medicine actions, appointment bookings, and caregiver visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Section */}
      <section className="py-12 bg-amber-500/5 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">Important Safety Notice</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            CareConnect is a care coordination and communication platform. CareConnect does NOT provide medical diagnosis, treatment, prescriptions, or professional medical advice. Always consult a qualified healthcare provider for medical decisions.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
