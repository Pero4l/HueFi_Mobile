import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';


import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { login, setAuthToken } from '@/utils/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [userLog, setUserLog] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userLog || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }


    setLoading(true);
    try {
      const data = await login({ userLog, password });
      if (data.success) {
        setAuthToken(data.token);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged in successfully!'
        });
        router.replace('/(tabs)' as any);
      } else {

        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage
      });
    } finally {

      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}
        >
          <Animated.View entering={FadeInUp.delay(200).duration(1000)} className="mb-12">
            <Text style={{ color: theme.secondary, fontSize: 12, fontWeight: '900', letterSpacing: 4, marginBottom: 8 }}>
              WELCOME BACK
            </Text>
            <Text style={{ color: theme.text, fontSize: 42, fontWeight: '900', letterSpacing: -1 }}>
              Sign In{'\n'}Securely
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(1000)} className="gap-y-6">
            <View>
              <Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, marginLeft: 4 }}>
                Email or Username
              </Text>
              <TextInput
                placeholder="john@example.com"
                placeholderTextColor={theme.muted}
                value={userLog}
                onChangeText={setUserLog}
                autoCapitalize="none"
                style={{
                  backgroundColor: theme.surface,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 16,
                  padding: 18,
                  color: theme.text,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              />
            </View>

            <View>
              <Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, marginLeft: 4 }}>
                Password
              </Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={theme.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  backgroundColor: theme.surface,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 16,
                  padding: 18,
                  color: theme.text,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                backgroundColor: theme.secondary,
                borderRadius: 20,
                padding: 20,
                alignItems: 'center',
                marginTop: 10,
                shadowColor: theme.secondary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={{ color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-4">
              <Text style={{ color: theme.muted, fontSize: 14, fontWeight: '600' }}>
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                <Text style={{ color: theme.secondary, fontSize: 14, fontWeight: '800' }}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
