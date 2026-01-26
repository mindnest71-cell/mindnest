import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../utils/api';

const STRINGS = {
    en: {
        title: 'MindNest',
        header: 'Reset password',
        desc: 'Enter your email to find your account.',
        email: 'Email',
        next: 'Next',
        reset: 'Reset Password',
        sending: 'Processing...',
        back: 'Back to login',
        langLabel: 'TH / EN',
        fillEmail: 'Please enter your email.',
        fillAll: 'Please fill in all fields.',
        successTitle: 'Success',
        successMsg: 'Password has been reset. Login now.',
        errorTitle: 'Error',
        errorMsg: 'Request failed.',
        newPassword: 'New Password',
        ans1: 'Answer 1',
        ans2: 'Answer 2',
    },
    th: {
        title: 'MindNest',
        header: 'รีเซ็ตรหัสผ่าน',
        desc: 'กรอกอีเมลเพื่อค้นหาบัญชีของคุณ',
        email: 'อีเมล',
        next: 'ถัดไป',
        reset: 'รีเซ็ตรหัสผ่าน',
        sending: 'กำลังดำเนินการ...',
        back: 'กลับไปหน้าเข้าสู่ระบบ',
        langLabel: 'TH / EN',
        fillEmail: 'กรุณากรอกอีเมล',
        fillAll: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        successTitle: 'สำเร็จ',
        successMsg: 'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว',
        errorTitle: 'เกิดข้อผิดพลาด',
        errorMsg: 'ทำรายการไม่สำเร็จ',
        newPassword: 'รหัสผ่านใหม่',
        ans1: 'คำตอบ 1',
        ans2: 'คำตอบ 2',
    },
};

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [lang, setLang] = useState<'en' | 'th'>('en');
    const t = STRINGS[lang];

    // Step 1: Email
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [questions, setQuestions] = useState({ q1: '', q2: '' });

    // Step 2: Answers & New Password
    const [a1, setA1] = useState('');
    const [a2, setA2] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const toggleLang = () => setLang((p) => (p === 'en' ? 'th' : 'en'));

    // Step 1: Find User & Get Questions
    const handleFindAccount = async () => {
        if (!email.trim()) {
            Alert.alert(t.fillEmail);
            return;
        }
        try {
            setLoading(true);
            const res = await api.post('/auth/security-questions', { email });
            setQuestions({
                q1: res.data.question_1,
                q2: res.data.question_2
            });
            setStep(2);
        } catch (e: any) {
            console.log(e?.response || e);
            const msg = e?.response?.data?.detail || t.errorMsg;
            Alert.alert(t.errorTitle, msg);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify Answers & Reset
    const handleReset = async () => {
        if (!a1.trim() || !a2.trim() || !newPassword) {
            Alert.alert(t.fillAll);
            return;
        }
        try {
            setLoading(true);
            await api.post('/auth/reset-password', {
                email,
                security_answer_1: a1,
                security_answer_2: a2,
                new_password: newPassword
            });
            Alert.alert(t.successTitle, t.successMsg, [
                { text: 'OK', onPress: () => router.replace('/login') }
            ]);
        } catch (e: any) {
            console.log(e?.response || e);
            const msg = e?.response?.data?.detail || t.errorMsg;
            Alert.alert(t.errorTitle, msg);
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
                    {/* Logo */}
                    <View style={styles.logoSection}>
                        <Image
                            source={require('../assets/images/mindnest-logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.appName}>{t.title}</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.formSection}>
                        <Text style={styles.header}>{t.header}</Text>

                        {step === 1 && (
                            <>
                                <Text style={styles.desc}>{t.desc}</Text>
                                <View style={{ marginTop: 18 }}>
                                    <TextInput
                                        placeholder={t.email}
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />

                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        activeOpacity={0.9}
                                        onPress={handleFindAccount}
                                        disabled={loading}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {loading ? t.sending : t.next}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <View style={{ marginTop: 18 }}>
                                    {/* Question 1 */}
                                    <Text style={styles.questionLabel}>{questions.q1}</Text>
                                    <TextInput
                                        placeholder={t.ans1}
                                        style={[styles.input, { marginBottom: 12 }]}
                                        value={a1}
                                        onChangeText={setA1}
                                    />

                                    {/* Question 2 */}
                                    <Text style={styles.questionLabel}>{questions.q2}</Text>
                                    <TextInput
                                        placeholder={t.ans2}
                                        style={[styles.input, { marginBottom: 12 }]}
                                        value={a2}
                                        onChangeText={setA2}
                                    />

                                    {/* New Password */}
                                    <TextInput
                                        placeholder={t.newPassword}
                                        style={[styles.input, { marginBottom: 12 }]}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                    />

                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        activeOpacity={0.9}
                                        onPress={handleReset}
                                        disabled={loading}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {loading ? t.sending : t.reset}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.backWrapper}
                            onPress={() => router.replace('/login')}
                        >
                            <Text style={styles.backText}>{t.back}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={toggleLang}>
                            <Text style={styles.footerLeft}>
                                {t.langLabel} {lang === 'en' ? '(EN)' : '(TH)'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#fff' },
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 60,
        paddingBottom: 24,
        justifyContent: 'space-between',
    },

    logoSection: { alignItems: 'center', marginTop: 24 },
    logoImage: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    appName: { fontSize: 32, fontWeight: '700' },

    formSection: { marginTop: 30 },
    header: { fontSize: 18, fontWeight: '700', color: '#111827' },
    desc: { marginTop: 8, fontSize: 14, color: '#6b7280', lineHeight: 20 },

    questionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        marginTop: 4
    },

    input: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        fontSize: 16,
        backgroundColor: '#fff',
    },

    primaryButton: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#3467ff',
        alignItems: 'center',
    },
    primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },

    backWrapper: { marginTop: 18, alignItems: 'center' },
    backText: { fontSize: 14, color: '#374151' },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    footerLeft: { fontSize: 14, color: '#111827', letterSpacing: 1 },
    footerRight: { fontSize: 14, color: '#111827' },
});
