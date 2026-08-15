'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { HeartHandshake, ShieldAlert, LogOut, User as UserIcon, Activity, Calendar, Pill, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  onOpenEmergency?: () => void;
}

export default function Navbar({ onOpenEmergency }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 bg-clip-text text-transparent">
              CareConnect
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
              Remote Family Care
            </span>
          </div>
        </Link>

        {/* User Navigation & Actions */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick role badge */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {user.role.replace('_', ' ')}
            </span>

            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Emergency Button */}
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/30 transition-all hover:scale-105"
              >
                <ShieldAlert className="w-4 h-4 animate-bounce" />
                <span>🆘 EMERGENCY</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>

          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20 transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}
