'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { HeartHandshake, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'FAMILY_MEMBER' | 'PARENT' | 'CAREGIVER' | 'ADMIN'>('FAMILY_MEMBER');
  
  // Extra fields based on role
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState('3');
  const [skills, setSkills] = useState('Elderly care assistance, Vital checks, Companionship');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register({
      name,
      email,
      phone,
      password,
      role,
      age,
      address,
      location,
      experienceYears,
      skills,
    });

    setLoading(false);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-600/30">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create CareConnect Account</h1>
            <p className="text-xs text-slate-500 mt-1">Join the remote family care network</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Role *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('FAMILY_MEMBER')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    role === 'FAMILY_MEMBER' ? 'bg-sky-600 text-white border-sky-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  👨‍👩‍👧 Family Member
                </button>

                <button
                  type="button"
                  onClick={() => setRole('PARENT')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    role === 'PARENT' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  👵 Elderly Parent
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CAREGIVER')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    role === 'CAREGIVER' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🩺 Caregiver
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    role === 'ADMIN' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Preeti Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Role specific inputs */}
            {role === 'PARENT' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="68"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-emerald-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-emerald-900 block mb-1">Home Address</label>
                  <input
                    type="text"
                    placeholder="Indiranagar, Bangalore"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-emerald-300"
                  />
                </div>
              </div>
            )}

            {role === 'CAREGIVER' && (
              <div className="space-y-2 p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs">
                <div>
                  <label className="font-bold text-indigo-900 block mb-1">Service Location</label>
                  <input
                    type="text"
                    placeholder="Indiranagar, Bangalore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-indigo-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-indigo-900 block mb-1">Skills & Care Capabilities</label>
                  <input
                    type="text"
                    placeholder="Elder Care, Vital Checks, Hospital Accompaniment"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-indigo-300"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-sky-600 hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
