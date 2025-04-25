import { Stack, useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { useAuth } from '@/stores/auth';
import { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppLayout() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const logout = useAuth((state) => state.logout);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = setTimeout(() => {
      setIsCheckingAuth(false);
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, 100); // Small timeout to ensure auth state is hydrated

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading while checking auth status
  if (isCheckingAuth) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </GestureHandlerRootView>
    );
  }

  // If not authenticated, this will return nothing as we're already redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <Image
                source={require('@/assets/images/elchemy-logo.png')}
                style={{ width: 100, height: 25, resizeMode: 'contain' }}
              />
            </View>
          ),
          headerTitle: () => null, // Remove the default title
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              disabled={isLoggingOut}
              style={{ marginRight: 16 }}
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <LogOut size={24} color="#0f172a" />
              )}
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: '',
          }}
        />
        <Stack.Screen
          name="order/[id]/index"
          options={{
            headerShown: false, // Completely hide the app header for order details
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
