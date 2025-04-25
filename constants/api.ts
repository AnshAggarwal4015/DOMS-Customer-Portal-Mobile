// app/constants/api.ts

export const API_BASE_URL = 'https://dev-api.elchemy.com';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  REFRESH: '/auth/refresh/',
};

// Dashboard endpoints
export const ENDPOINTS = {
  // Dashboard
  ORDERS: '/customer/dashboard/orders/',

  // Order details
  ORDER_OVERVIEW: (id: string) => `/customer/dashboard/order/${id}/overview/`,
  ORDER_POCS: (id: string) => `/customer/dashboard/order/${id}/pocs/`,
  ORDER_DOCUMENTS: (id: string) => `/customer/dashboard/order/${id}/documents/`,
  ORDER_TRACKING: (id: string) => `/customer/dashboard/order/${id}/tracking/`,
  ORDER_STUFFING_PHOTOS: (id: string) =>
    `/customer/dashboard/order/${id}/stuffing-photos/`,
  ORDER_PROGRESS: (id: string) => `/customer/dashboard/order/${id}/progress/`,

  // Add more endpoints here as needed
};
