'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { HeartHandshake, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'family') setEmail('preeti@example.com');
    else if (roleParam === 'parent') setEmail('lakshmi@example.com');
    else if (roleParam === 'caregiver') setEmail('ravi@example.com');
    else if (roleParam === 'admin') setEmail('admin@example.com');
    else setEmail('preeti@example.com');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-600/30">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign In to CareConnect</h1>
            <p className="text-xs text-slate-500 mt-1">Access your remote family care dashboard</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Preset Switcher */}
          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Select Demo Role Preset:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setDemoAccount('preeti@example.com')}
                className={`p-2 rounded-xl border text-left transition-colors ${
                  email === 'preeti@example.com' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                👨‍👩‍👧 Family Member
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('lakshmi@example.com')}
                className={`p-2 rounded-xl border text-left transition-colors ${
                  email === 'lakshmi@example.com' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                👵 Elderly Parent
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('ravi@example.com')}
                className={`p-2 rounded-xl border text-left transition-colors ${
                  email === 'ravi@example.com' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🩺 Caregiver
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('admin@example.com')}
                className={`p-2 rounded-xl border text-left transition-colors ${
                  email === 'admin@example.com' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🛡️ Platform Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link href="#" onClick={(e) => { e.preventDefault(); alert("Demo Mode: Password for all test accounts is 'Password123!'"); }} className="text-[11px] text-sky-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-sky-600 hover:underline">
              Create an account
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
