import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User Permission Types
interface PermissionAction {
  read?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface Permission {
  module: string;
  actions: PermissionAction;
}

// User Data Type
interface User {
  id: string;
  email: string;
  role: string;
  userType: string;
  permissions: Permission[];
}

// Login Data from API response
interface LoginUserData {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  role: string;
  userType: string;
  permissions: Permission[];
}

// Auth Store State
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (userData: LoginUserData) => void;
  logout: () => Promise<void>;
  updateToken: (accessToken: string, refreshToken: string) => void;
  hasPermission: (module: string, action: keyof PermissionAction) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Login action
      login: (userData: LoginUserData) =>
        set({
          user: {
            id: userData.userId,
            email: userData.email,
            role: userData.role,
            userType: userData.userType,
            permissions: userData.permissions,
          },
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          isAuthenticated: true,
        }),

      // Logout action
      logout: async () => {
        try {
          const refreshToken = get().refreshToken;

          // Only call API if we have a refresh token
          if (refreshToken) {
            // console.log('Logging out with refresh token');
            const response = await fetch(
              'https://dev-api.elchemy.com/auth/logout/',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  refresh_token: refreshToken,
                }),
              }
            );

            const data = await response.json();
            // console.log('Logout response:', data);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Always clear local state regardless of API success/failure
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      // Update token action (useful for token refresh operations)
      updateToken: (accessToken: string, refreshToken: string) =>
        set({
          accessToken,
          refreshToken,
        }),

      // Check if user has specific permission
      hasPermission: (
        module: string,
        action: keyof PermissionAction
      ): boolean => {
        const { user } = get();
        if (!user || !user.permissions) return false;

        const modulePermission = user.permissions.find(
          (p) => p.module === module
        );
        if (!modulePermission) return false;

        return (
          modulePermission.actions && modulePermission.actions[action] === true
        );
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook to check auth status
export function useIsAuthenticated(): boolean {
  return useAuth((state) => state.isAuthenticated);
}

// Hook to get user data
export function useUser(): User | null {
  return useAuth((state) => state.user);
}

// Hook to check permissions
export function usePermission(
  module: string,
  action: keyof PermissionAction
): boolean {
  return useAuth((state) => state.hasPermission(module, action));
}

// Hook to get access token
export function useAccessToken(): string | null {
  return useAuth((state) => state.accessToken);
}

export const getAccessToken = (): string | null => {
  return useAuth.getState().accessToken;
};
