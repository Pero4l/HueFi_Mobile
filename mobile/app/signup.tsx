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
import { register } from '@/utils/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullname || !username || !email || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }

    // Frontend validation to match backend requirements
    if (fullname.length < 5) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Full name must be at least 5 characters' });
      return;
    }
    if (username.length < 4) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Username must be at least 4 characters' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Password must be at least 6 characters' });
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Password must contain both uppercase and lowercase letters' });
      return;
    }
    if (!/[0-9]/.test(password)) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Password must contain a number' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Invalid email format' });
      return;
    }


    setLoading(true);
    try {
      await register({ fullname, username, email, password });
      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Redirecting to login...'
      });
      setTimeout(() => router.push('/login' as any), 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred';
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
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
          <Animated.View entering={FadeInUp.delay(200).duration(1000)} className="">
            <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '900', letterSpacing: 4, marginBottom: 8 }}>
              JOIN THE HUE
            </Text>
            <Text style={{ color: theme.text, fontSize: 42, fontWeight: '900', letterSpacing: -1 }}>
              Create{'\n'}Account
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(1000)} className="gap-y-6">
            <View>
              <Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, marginLeft: 4 }}>
                Full Name
              </Text>
              <TextInput
                placeholder="John Doe"
                placeholderTextColor={theme.muted}
                value={fullname}
                onChangeText={setFullname}
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
                Username
              </Text>
              <TextInput
                placeholder="johndoe_99"
                placeholderTextColor={theme.muted}
                value={username}
                onChangeText={setUsername}
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
                Email Address
              </Text>
              <TextInput
                placeholder="john@example.com"
                placeholderTextColor={theme.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
              onPress={handleSignup}
              disabled={loading}
              style={{
                backgroundColor: theme.primary,
                borderRadius: 20,
                padding: 20,
                alignItems: 'center',
                marginTop: 10,
                shadowColor: theme.primary,
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
                  Register Account
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-4">
              <Text style={{ color: theme.muted, fontSize: 14, fontWeight: '600' }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '800' }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
