import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STRINGS = {
  en: {
    email: 'Email',
    password: 'Password',
    login: 'Log in',
    loggingIn: 'Logging in...',
    forgot: 'Forgot password?',
    signup: 'Sign up',
    langLabel: 'TH / EN',
    fillBoth: 'Please fill in both email and password.',
    loginFailed: 'Login failed. Please try again.',
  },
  th: {
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    login: 'เข้าสู่ระบบ',
    loggingIn: 'กำลังเข้าสู่ระบบ...',
    forgot: 'ลืมรหัสผ่าน?',
    signup: 'สมัครสมาชิก',
    langLabel: 'TH / EN',
    fillBoth: 'กรุณากรอกอีเมลและรหัสผ่าน',
    loginFailed: 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'th'>('en');
  const t = STRINGS[lang];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleLang = () => setLang((p) => (p === 'en' ? 'th' : 'en'));

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(t.fillBoth);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/auth/login', { email, password });

      console.log("Login success:", res.data);
      if (res.data.user_id) {
        await AsyncStorage.setItem('user_id', res.data.user_id);
        if (res.data.name) await AsyncStorage.setItem('user_name', res.data.name);
        router.replace('/home');
      } else {
        Alert.alert("Error", "No user ID received");
      }

    } catch (e: any) {
      console.log(e?.response || e);
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        t.loginFailed;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Logo + App name */}
          <View style={styles.logoSection}>
            <Image
              source={require('../assets/images/mindnest-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.appName}>MindNest</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder={t.email}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputGroup, styles.passwordWrapper]}>
              <TextInput
                style={styles.input}
                placeholder={t.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setSecure((s) => !s)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.passwordToggleText}>•••</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? t.loggingIn : t.login}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotWrapper}
              onPress={() => router.push('/forgot-password')}
            >
              <Text style={styles.forgotText}>{t.forgot}</Text>
            </TouchableOpacity>
          </View>

          {/* Footer: TH / EN and Sign up */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={toggleLang}>
              <Text style={styles.footerLeft}>
                {t.langLabel} {lang === 'en' ? '(EN)' : '(TH)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.footerRight}>{t.signup}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
  },
  formSection: {
    marginTop: 48,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  passwordToggleText: {
    fontSize: 18,
    color: '#6b7280',
  },
  loginButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#3467ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotWrapper: {
    marginTop: 18,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  footerLeft: {
    fontSize: 14,
    color: '#111827',
    letterSpacing: 1,
  },
  footerRight: {
    fontSize: 14,
    color: '#111827',
  },
});
