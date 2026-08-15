'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'FAMILY_MEMBER' | 'PARENT' | 'CAREGIVER' | 'ADMIN';
  parentProfileId?: string | null;
  caregiverProfileId?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('careconnect_access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/auth/me');
      if (res.success && res.data) {
        const u = res.data;
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          parentProfileId: u.parentProfile?.id || null,
          caregiverProfileId: u.caregiverProfile?.id || null,
        });
      } else {
        localStorage.removeItem('careconnect_access_token');
        localStorage.removeItem('careconnect_refresh_token');
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data) {
      localStorage.setItem('careconnect_access_token', res.data.accessToken);
      localStorage.setItem('careconnect_refresh_token', res.data.refreshToken);
      setUser(res.data.user);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, message: res.message || 'Login failed' };
    }
  };

  const register = async (formData: any) => {
    setLoading(true);
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.success && res.data) {
      localStorage.setItem('careconnect_access_token', res.data.accessToken);
      localStorage.setItem('careconnect_refresh_token', res.data.refreshToken);
      setUser(res.data.user);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, message: res.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    localStorage.removeItem('careconnect_access_token');
    localStorage.removeItem('careconnect_refresh_token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
