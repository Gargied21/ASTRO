// Centralized API Client for Chaitanya Ved Pratishthan (ASTRO)

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:4000/api/v1';

const TOKEN_KEY = 'cvp_devotee_token';

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
};

export interface ApiError {
  code: string;
  message: string;
  status?: number;
  details?: any;
}

export class ApiException extends Error {
  code: string;
  status?: number;
  details?: any;

  constructor(error: ApiError) {
    super(error.message || 'API request failed');
    this.name = 'ApiException';
    this.code = error.code || 'UNKNOWN_ERROR';
    this.status = error.status;
    this.details = error.details;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 15000
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorObj = data?.error || {
        code: `HTTP_${response.status}`,
        message: data?.message || response.statusText || 'Request failed',
        status: response.status,
        details: data?.errors || data?.details,
      };
      if (!errorObj.status) {
        errorObj.status = response.status;
      }
      throw new ApiException(errorObj);
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiException({
        code: 'TIMEOUT',
        message: 'The request took too long to complete. Please check your connection.',
      });
    }
    if (err instanceof ApiException) {
      throw err;
    }
    throw new ApiException({
      code: 'NETWORK_ERROR',
      message: err.message || 'Failed to connect to Ashram API server.',
    });
  }
}

// ==========================================
// API SERVICES
// ==========================================

export const api = {
  // Auth
  auth: {
    requestOtp: (phone: string) =>
      request<{ success: boolean; data: { phone: string; expiresInSeconds: number; debugOtp?: string } }>(
        '/auth/request-otp',
        { method: 'POST', body: JSON.stringify({ phone }) }
      ),
    verifyOtp: (phone: string, otp: string, name?: string) =>
      request<{ success: boolean; data: { token: string; user: any } }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp, name }),
      }),
    getMe: () =>
      request<{ success: boolean; data: any }>('/auth/me', { method: 'GET' }),
    logout: () => {
      removeToken();
      return request<{ success: boolean }>('/auth/logout', { method: 'POST' }).catch(() => ({ success: true }));
    },
  },

  // Devotee Profile & Settings
  devotee: {
    getProfile: () =>
      request<{ success: boolean; data: any }>('/devotee/profile', { method: 'GET' }),
    updateProfile: (data: any) =>
      request<{ success: boolean; message: string; data: any }>('/devotee/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    addFamilyMember: (member: { name: string; relation: string; nakshatra: string }) =>
      request<{ success: boolean; data: any }>('/devotee/family', {
        method: 'POST',
        body: JSON.stringify(member),
      }),
    deleteFamilyMember: (id: string) =>
      request<{ success: boolean }>('/devotee/family/' + id, { method: 'DELETE' }),
    getSettings: () =>
      request<{ success: boolean; data: any }>('/devotee/settings', { method: 'GET' }),
    updateSettings: (data: any) =>
      request<{ success: boolean; data: any }>('/devotee/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getDashboardSummary: () =>
      request<{ success: boolean; data: any }>('/devotee/dashboard', { method: 'GET' }),
  },

  // Appointments
  appointments: {
    create: (data: any) =>
      request<{ success: boolean; message: string; data: any }>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMy: () =>
      request<{ success: boolean; data: any[] }>('/appointments/my', { method: 'GET' }),
    getById: (id: string) =>
      request<{ success: boolean; data: any }>('/appointments/' + id, { method: 'GET' }),
  },

  // Donations & 80G Receipts
  donations: {
    create: (data: any) =>
      request<{ success: boolean; message: string; data: any }>('/donations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getReceipts: (fy?: string, category?: string) => {
      const params = new URLSearchParams();
      if (fy) params.append('fy', fy);
      if (category) params.append('category', category);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<{ success: boolean; data: any[] }>(`/donations/receipts${query}`, { method: 'GET' });
    },
    getReceiptByNumber: (receiptNo: string) =>
      request<{ success: boolean; data: any }>(`/donations/receipts/${encodeURIComponent(receiptNo)}`, {
        method: 'GET',
      }),
    getForm10BE: (fy: string) =>
      request<{ success: boolean; data: any }>(`/donations/form10be/${fy}`, { method: 'GET' }),
  },

  // Rituals
  rituals: {
    getAll: (status?: string) => {
      const query = status ? `?status=${status}` : '';
      return request<{ success: boolean; data: any[] }>(`/rituals${query}`, { method: 'GET' });
    },
    getById: (id: string) =>
      request<{ success: boolean; data: any }>('/rituals/' + id, { method: 'GET' }),
    create: (data: any) =>
      request<{ success: boolean; message: string; data: any }>('/rituals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    trackPrasad: (trackingNumber: string) =>
      request<{ success: boolean; data: any }>('/rituals/track/' + trackingNumber, { method: 'GET' }),
  },

  // Astrology
  astrology: {
    getConsultation: () =>
      request<{ success: boolean; data: any }>('/astrology/consultation', { method: 'GET' }),
    getQuestions: () =>
      request<{ success: boolean; data: any[] }>('/astrology/questions', { method: 'GET' }),
    submitQuestion: (data: { category: string; question: string; refBhav: string }) =>
      request<{ success: boolean; message: string; data: any }>('/astrology/questions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Poojas Catalogue
  poojas: {
    getAll: (params?: { category?: string; mode?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.mode) searchParams.append('mode', params.mode);
      if (params?.search) searchParams.append('search', params.search);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ success: boolean; count: number; data: any[] }>(`/poojas${query}`, { method: 'GET' });
    },
    getById: (id: string) =>
      request<{ success: boolean; data: any }>('/poojas/' + id, { method: 'GET' }),
  },

  // Gurukul
  gurukul: {
    getCourses: (category?: string) => {
      const query = category ? `?category=${category}` : '';
      return request<{ success: boolean; count: number; data: any[] }>(`/gurukul/courses${query}`, { method: 'GET' });
    },
    getCourseById: (id: string) =>
      request<{ success: boolean; data: any }>('/gurukul/courses/' + id, { method: 'GET' }),
    submitAudio: (data: { mantraTitle: string; durationSeconds: number }) =>
      request<{ success: boolean; message: string; data: any }>('/gurukul/submissions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMySubmissions: () =>
      request<{ success: boolean; data: any[] }>('/gurukul/submissions/my', { method: 'GET' }),
  },

  // Events
  events: {
    getAll: () =>
      request<{ success: boolean; count: number; data: any[] }>('/events', { method: 'GET' }),
    getById: (id: string) =>
      request<{ success: boolean; data: any }>('/events/' + id, { method: 'GET' }),
    register: (id: string, data: { name: string; phone: string; attendees?: number }) =>
      request<{ success: boolean; message: string; data: any }>(`/events/${id}/register`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Contact
  contact: {
    submit: (data: { name: string; phone: string; email?: string; subject?: string; message: string }) =>
      request<{ success: boolean; message: string; data: any }>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Notifications
  notifications: {
    getAll: () =>
      request<{ success: boolean; count: number; data: any[] }>('/notifications', { method: 'GET' }),
    markAsRead: (id: string) =>
      request<{ success: boolean; data: any }>(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllAsRead: () =>
      request<{ success: boolean }>('/notifications/mark-all-read', { method: 'POST' }),
  },
};
