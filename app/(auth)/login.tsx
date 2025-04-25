import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/stores/auth';
import Button from '@/components/base/Button';
import { ApiResponse } from '@/types/api';
import { loginUser } from '@/services/authService';

const { width } = Dimensions.get('window');

export default function Login(): React.ReactNode {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const login = useAuth((state) => state.login);

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await loginUser({
        email,
        password,
        loginVia: 'password',
      });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const data = response.data;

      // Store the user data in your auth state
      login({
        userId: data.user_id,
        email: data.email,
        accessToken: data.access,
        refreshToken: data.refresh,
        role: data.role,
        userType: data.user_authorization_data?.user_type,
        permissions: data.user_auth_info?.permissions || [],
      });

      // Navigate to the app
      router.replace('/(app)');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    // console.log('Click on Forgot Password');
    // router.push('/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/elchemy-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Log In</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email<Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="admin@elchemy.com"
                  placeholderTextColor="#AAAAAA"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Password<Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#AAAAAA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              variant="contained"
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              style={styles.loginButton}
            >
              Log In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    // paddingTop: '25%', // This will push the content down from the top
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 150,
    height: 40,
  },
  formContainer: {
    width: width > 500 ? 400 : '100%',
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingTop: '20%', // This will push the content down from the top
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 24,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  required: {
    color: '#E74C3C',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 48,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginBottom: 28,
    marginTop: 4,
  },
  forgotPasswordText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#E74C3C', // Match the previous button color
    marginTop: 5,
  },
  error: {
    color: '#E74C3C',
    marginBottom: 16,
    fontSize: 14,
  },
});
