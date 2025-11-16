import {
  User,
  Service,
  ServiceSlots,
  BookingDetail,
  LoginResponse,
  CreateBookingResponse,
  LoginRequest,
  RegisterRequest,
  CreateBookingRequest,
} from './types';

// モックデータ
const mockServices: Service[] = [
  {
    id: 1,
    name: 'ベーシックヨガ',
    description: '初心者向けの基本的なヨガレッスンです。呼吸法とポーズの基本を学びます。',
    duration: 60,
  },
  {
    id: 2,
    name: 'パワーヨガ',
    description: 'よりアクティブで体力を使うヨガクラスです。体幹を鍛えます。',
    duration: 75,
  },
  {
    id: 3,
    name: 'リラックスヨガ',
    description: 'ストレス解消とリラクゼーションに重点を置いたヨガです。',
    duration: 60,
  },
];

let mockBookings: BookingDetail[] = [
  {
    id: 1,
    service_id: 1,
    service_name: 'ベーシックヨガ',
    date: '2025-11-20',
    start_time: '10:00',
    status: 'confirmed',
  },
];

let nextBookingId = 2;

// モックAPI関数
export const mockApi = {
  // ログイン
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      access: 'mock_access_token_' + Date.now(),
      refresh: 'mock_refresh_token_' + Date.now(),
      user: {
        id: 1,
        name: '山田太郎',
        email: credentials.email,
      },
    };
  },

  // ユーザー登録
  register: async (data: RegisterRequest): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      id: 2,
      name: data.name,
      email: data.email,
    };
  },

  // サービス一覧取得
  getServices: async (): Promise<Service[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockServices;
  },

  // サービス詳細取得
  getServiceById: async (id: number): Promise<Service | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockServices.find((s) => s.id === id) || null;
  },

  // 予約可能枠取得
  getServiceSlots: async (serviceId: number, date: string): Promise<ServiceSlots> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // 予約済み数をカウント
    const existingBookings = mockBookings.filter(
      (b) => b.service_id === serviceId && b.date === date && b.status === 'confirmed'
    );

    const slots = [
      '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    ].map((time, index) => {
      const reserved = existingBookings.filter((b) => b.start_time === time).length;
      const capacity = 5;
      return {
        id: serviceId * 100 + index, // Generate a unique ID
        start_time: time,
        capacity,
        reserved,
        available: capacity - reserved,
      };
    });

    return {
      service_id: serviceId,
      date,
      slots,
    };
  },

  // 予約作成
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const service = mockServices.find((s) => s.id === data.service_id);
    const bookingId = nextBookingId++;
    
    const newBooking: BookingDetail = {
      id: bookingId,
      service_id: data.service_id,
      service_name: service?.name || 'Unknown Service',
      date: data.date,
      start_time: data.start_time,
      status: 'confirmed',
    };
    
    mockBookings.push(newBooking);

    return {
      booking_id: bookingId,
      status: 'confirmed',
      service_id: data.service_id,
      date: data.date,
      start_time: data.start_time,
    };
  },

  // 自分の予約一覧取得
  getMyBookings: async (): Promise<BookingDetail[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockBookings.filter((b) => b.status === 'confirmed');
  },

  // 予約キャンセル
  cancelBooking: async (bookingId: number): Promise<{ id: number; status: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
    }

    return {
      id: bookingId,
      status: 'cancelled',
    };
  },
};

// 認証状態管理（LocalStorage）
export const authStorage = {
  setAuth: (token: string, user: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getAuth: (): { token: string | null; user: User | null } => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },

  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};
