// OpenAPI仕様に基づく型定義

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
}

export interface Slot {
  id: number;
  start_time: string;
  capacity: number;
  reserved: number;
  available: number;
}

export interface ServiceSlots {
  service_id: number;
  date: string;
  slots: Slot[];
}

export interface BookingDetail {
  id: number;
  service_id: number;
  service_name: string;
  date: string;
  start_time: string;
  status: 'confirmed' | 'cancelled';
}

// Alias for compatibility
export type Booking = BookingDetail;

export interface CreateBookingResponse {
  booking_id: number;
  status: string;
  service_id: number;
  date: string;
  start_time: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Alias for compatibility
export type LoginCredentials = LoginRequest;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Alias for compatibility
export type RegisterData = RegisterRequest;

export interface CreateBookingRequest {
  service_id: number;
  slot_id: number;
  date: string;
  start_time: string;
}
