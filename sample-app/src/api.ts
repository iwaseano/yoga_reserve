import {
  User,
  Service,
  Slot,
  Booking,
  LoginCredentials,
  RegisterData,
} from './types';
import config from './config';

const API_BASE_URL = config.apiBaseUrl;

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Auth API
export const login = async (credentials: LoginCredentials): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await handleResponse(response);
  
  // Store tokens
  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return {
    user: data.user,
    accessToken: data.access,
    refreshToken: data.refresh,
  };
};

export const register = async (data: RegisterData): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result = await handleResponse(response);
  
  // Store tokens
  localStorage.setItem('accessToken', result.access);
  localStorage.setItem('refreshToken', result.refresh);
  localStorage.setItem('user', JSON.stringify(result.user));
  
  return {
    user: result.user,
    accessToken: result.access,
    refreshToken: result.refresh,
  };
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Services API
export const getServices = async (): Promise<Service[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/services`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getService = async (serviceId: number): Promise<Service> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getAvailableSlots = async (
  serviceId: number,
  date: string
): Promise<Slot[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(
    `${API_BASE_URL}/services/${serviceId}/slots?date=${date}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  const data = await handleResponse(response);
  return data.slots;
};

// Bookings API
export const createBooking = async (
  serviceId: number,
  slotId: number,
  date: string,
  startTime: string
): Promise<Booking> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      service_id: serviceId,
      slot_id: slotId,
      date,
      start_time: startTime,
    }),
  });
  
  return handleResponse(response);
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/bookings/mine`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return handleResponse(response);
};

export const cancelBooking = async (bookingId: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to cancel booking' }));
    throw new Error(error.detail);
  }
};

// Admin API
export const getAllBookings = async (): Promise<Booking[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return handleResponse(response);
};
