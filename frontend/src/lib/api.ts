const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('careconnect_access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If token expired (401), try refresh
    if (res.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('careconnect_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          const refreshData = await refreshRes.json();
          if (refreshData.success && refreshData.data?.accessToken) {
            localStorage.setItem('careconnect_access_token', refreshData.data.accessToken);
            localStorage.setItem('careconnect_refresh_token', refreshData.data.refreshToken);

            // Retry original request with new access token
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers,
            });
            return await retryRes.json();
          }
        } catch {
          localStorage.removeItem('careconnect_access_token');
          localStorage.removeItem('careconnect_refresh_token');
          localStorage.removeItem('careconnect_user');
        }
      }
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('API Fetch Error:', error);
    return {
      success: false,
      message: error.message || 'Network request failed',
    };
  }
}
