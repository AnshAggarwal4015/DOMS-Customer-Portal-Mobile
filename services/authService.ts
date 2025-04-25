// app/services/authService.ts
import httpClient from './httpClient';
import { AUTH_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';

// Types for auth operations
export interface LoginCredentials {
  email: string;
  password: string;
  loginVia?: string;
}

export interface LoginResponseData {
  user_id: string;
  email: string;
  access: string;
  refresh: string;
  role: string;
  first_time_login: boolean;
  user_authorization_data: {
    user_type: string;
    permissions: any[];
  };
  user_auth_info?: {
    permissions: Array<{
      module: string;
      actions: {
        read?: boolean;
        create?: boolean;
        update?: boolean;
        delete?: boolean;
      };
    }>;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

/**
 * Login user with email and password
 * @param credentials Login credentials
 * @returns Promise with login data
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<ApiResponse<LoginResponseData>> {
  try {
    // For login, we don't need to pass a token since the user isn't authenticated yet
    const response = await httpClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Refresh access token
 * @param refreshToken Current refresh token
 * @returns Promise with new tokens
 */
export async function refreshToken(
  refreshToken: string
): Promise<ApiResponse<RefreshTokenResponse>> {
  try {
    const response = await httpClient.post(AUTH_ENDPOINTS.REFRESH, {
      refresh_token: refreshToken,
    });
    return response;
  } catch (error: any) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

/**
 * Logout user
 * @param refreshToken Current refresh token
 * @returns Promise with logout status
 */
export async function logoutUser(
  refreshToken: string
): Promise<ApiResponse<any>> {
  try {
    const response = await httpClient.post(AUTH_ENDPOINTS.LOGOUT, {
      refresh_token: refreshToken,
    });
    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    throw error;
  }
}
