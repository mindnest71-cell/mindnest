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
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../utils/api';

const STRINGS = {
    en: {
        title: 'Create Account',
        step1: 'Personal Info',
        step2: 'Account Details',
        step3: 'Security',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        password: 'Password',
        confirm: 'Confirm password',
        next: 'Next',
        back: 'Back',
        signup: 'Complete Setup',
        signingUp: 'Creating Account...',
        haveAccount: 'Already have an account?',
        login: 'Log in',
        fillAll: 'Please fill in all fields.',
        pwNotMatch: 'Passwords do not match.',
        pwShort: 'Password must be at least 6 characters.',
        errorTitle: 'Error',
        errorSignup: 'Sign up failed.',
        langLabel: 'TH / EN',
        q1Label: 'Security Question 1',
        a1Label: 'Answer 1',
        q2Label: 'Security Question 2',
        a2Label: 'Answer 2',
        selectQuestion: 'Select a Question',
    },
    th: {
        title: 'สร้างบัญชี',
        step1: 'ข้อมูลส่วนตัว',
        step2: 'ข้อมูลบัญชี',
        step3: 'ความปลอดภัย',
        firstName: 'ชื่อ',
        lastName: 'นามสกุล',
        email: 'อีเมล',
        password: 'รหัสผ่าน',
        confirm: 'ยืนยันรหัสผ่าน',
        next: 'ถัดไป',
        back: 'ย้อนกลับ',
        signup: 'เสร็จสิ้น',
        signingUp: 'กำลังสร้างบัญชี...',
        haveAccount: 'มีบัญชีอยู่แล้ว?',
        login: 'เข้าสู่ระบบ',
        fillAll: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        pwNotMatch: 'รหัสผ่านไม่ตรงกัน',
        pwShort: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        errorTitle: 'เกิดข้อผิดพลาด',
        errorSignup: 'สมัครสมาชิกไม่สำเร็จ',
        langLabel: 'TH / EN',
        q1Label: 'คำถามความปลอดภัย 1',
        a1Label: 'คำตอบ 1',
        q2Label: 'คำถามความปลอดภัย 2',
        a2Label: 'คำตอบ 2',
        selectQuestion: 'เลือกคำถาม',
    },
};

const QUESTIONS = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was the name of your first school?",
    "What is your favorite food?",
    "What city were you born in?",
];

export default function SignupScreen() {
    const router = useRouter();
    const [lang, setLang] = useState<'en' | 'th'>('en');
    const t = STRINGS[lang];

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [secure1, setSecure1] = useState(true);
    const [secure2, setSecure2] = useState(true);

    // Security Questions
    const [q1, setQ1] = useState('');
    const [a1, setA1] = useState('');
    const [q2, setQ2] = useState('');
    const [a2, setA2] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [activeQField, setActiveQField] = useState<1 | 2 | null>(null);

    const toggleLang = () => setLang((p) => (p === 'en' ? 'th' : 'en'));

    const handleNext = () => {
        if (step === 1) {
            if (!firstName.trim() || !lastName.trim()) {
                Alert.alert("Missing Info", t.fillAll);
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!email.trim() || !password || !confirm) {
                Alert.alert("Missing Info", t.fillAll);
                return;
            }
            if (password !== confirm) {
                Alert.alert("Error", t.pwNotMatch);
                return;
            }
            if (password.length < 6) {
                Alert.alert("Error", t.pwShort);
                return;
            }
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSignup = async () => {
        if (!q1 || !a1 || !q2 || !a2) {
            Alert.alert("Missing Info", t.fillAll);
            return;
        }

        try {
            setLoading(true);
            await api.post('/auth/register', {
                name: `${firstName.trim()} ${lastName.trim()}`,
                email,
                password,
                security_question_1: q1,
                security_answer_1: a1,
                security_question_2: q2,
                security_answer_2: a2,
            });

            Alert.alert('✅', lang === 'en' ? 'Welcome to MindNest!' : 'ยินดีต้อนรับสู่ MindNest!');
            router.replace('/login');

        } catch (e: any) {
            console.log(e?.response || e);
            const msg = e?.response?.data?.detail || t.errorSignup;
            Alert.alert(t.errorTitle, msg);
        } finally {
            setLoading(false);
        }
    };

    const openPicker = (field: 1 | 2) => {
        setActiveQField(field);
        setShowModal(true);
    };

    const selectQuestion = (q: string) => {
        if (activeQField === 1) setQ1(q);
        if (activeQField === 2) setQ2(q);
        setShowModal(false);
        setActiveQField(null);
    };

    // --- Render Steps ---

    // Step indicator dots
    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            <View style={[styles.progressDot, step >= 1 && styles.activeDot]} />
            <View style={styles.progressLine} />
            <View style={[styles.progressDot, step >= 2 && styles.activeDot]} />
            <View style={styles.progressLine} />
            <View style={[styles.progressDot, step >= 3 && styles.activeDot]} />
        </View>
    );

    return (
        <SafeAreaView style={styles.root}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>

                    {/* Header: Logo & Progress */}
                    <View style={styles.headerSection}>
                        <Image
                            source={require('../assets/images/mindnest-logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerTitle}>
                            {step === 1 ? t.step1 : step === 2 ? t.step2 : t.step3}
                        </Text>
                        {renderProgressBar()}
                    </View>

                    {/* Scrollable Content Area */}
                    <ScrollView
                        style={styles.contentScroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* STEP 1: Personal Info */}
                        {step === 1 && (
                            <View style={styles.formSection}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.firstName}</Text>
                                    <TextInput
                                        placeholder="Ex. John"
                                        style={styles.input}
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.lastName}</Text>
                                    <TextInput
                                        placeholder="Ex. Doe"
                                        style={styles.input}
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>
                            </View>
                        )}

                        {/* STEP 2: Account Details */}
                        {step === 2 && (
                            <View style={styles.formSection}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.email}</Text>
                                    <TextInput
                                        placeholder="john@example.com"
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.password}</Text>
                                    <View style={styles.passwordWrapper}>
                                        <TextInput
                                            placeholder="******"
                                            style={[styles.input, { flex: 1 }]}
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={secure1}
                                        />
                                        <TouchableOpacity onPress={() => setSecure1(!secure1)} style={styles.eyeIcon}>
                                            <MaterialCommunityIcons name={secure1 ? "eye-off" : "eye"} size={22} color="#94A3B8" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.confirm}</Text>
                                    <View style={styles.passwordWrapper}>
                                        <TextInput
                                            placeholder="******"
                                            style={[styles.input, { flex: 1 }]}
                                            value={confirm}
                                            onChangeText={setConfirm}
                                            secureTextEntry={secure2}
                                        />
                                        <TouchableOpacity onPress={() => setSecure2(!secure2)} style={styles.eyeIcon}>
                                            <MaterialCommunityIcons name={secure2 ? "eye-off" : "eye"} size={22} color="#94A3B8" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* STEP 3: Security Questions */}
                        {step === 3 && (
                            <View style={styles.formSection}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.q1Label}</Text>
                                    <TouchableOpacity style={styles.selectInput} onPress={() => openPicker(1)}>
                                        <Text style={{ color: q1 ? '#1E293B' : '#94A3B8' }}>{q1 || t.selectQuestion}</Text>
                                        <MaterialCommunityIcons name="chevron-down" size={20} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.a1Label}</Text>
                                    <TextInput
                                        placeholder="Answer..."
                                        style={styles.input}
                                        value={a1}
                                        onChangeText={setA1}
                                    />
                                </View>

                                <View style={{ height: 20 }} />

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.q2Label}</Text>
                                    <TouchableOpacity style={styles.selectInput} onPress={() => openPicker(2)}>
                                        <Text style={{ color: q2 ? '#1E293B' : '#94A3B8' }}>{q2 || t.selectQuestion}</Text>
                                        <MaterialCommunityIcons name="chevron-down" size={20} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t.a2Label}</Text>
                                    <TextInput
                                        placeholder="Answer..."
                                        style={styles.input}
                                        value={a2}
                                        onChangeText={setA2}
                                    />
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footerSection}>
                        <View style={styles.btnRow}>
                            {step > 1 ? (
                                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                                    <Text style={styles.backButtonText}>{t.back}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={toggleLang} style={styles.langButton}>
                                    <Text style={styles.langButtonText}>{lang === 'en' ? 'TH' : 'EN'}</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={step === 3 ? handleSignup : handleNext}
                                disabled={loading}
                            >
                                <Text style={styles.nextButtonText}>
                                    {loading ? t.signingUp : (step === 3 ? t.signup : t.next)}
                                </Text>
                                {!loading && step < 3 && <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.loginRow}>
                            <Text style={styles.helperText}>{t.haveAccount} </Text>
                            <TouchableOpacity onPress={() => router.replace('/login')}>
                                <Text style={styles.helperLink}>{t.login}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Modal */}
                    {showModal && (
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>{t.selectQuestion}</Text>
                                <ScrollView style={{ maxHeight: 300 }}>
                                    {QUESTIONS.map((q, i) => {
                                        if (activeQField === 1 && q === q2) return null;
                                        if (activeQField === 2 && q === q1) return null;
                                        return (
                                            <TouchableOpacity key={i} style={styles.modalItem} onPress={() => selectQuestion(q)}>
                                                <Text style={styles.modalItemText}>{q}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                                <TouchableOpacity style={styles.modalClose} onPress={() => setShowModal(false)}>
                                    <Text style={styles.modalCloseText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F8FAFC' },
    container: { flex: 1 },

    headerSection: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    logoImage: { width: 60, height: 60, marginBottom: 10 },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 16 },

    progressContainer: { flexDirection: 'row', alignItems: 'center' },
    progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E2E8F0' },
    activeDot: { backgroundColor: '#4F46E5', transform: [{ scale: 1.2 }] },
    progressLine: { width: 40, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 4 },

    contentScroll: { flex: 1 },
    scrollContent: { padding: 24, paddingBottom: 40 },

    formSection: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginLeft: 4 },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1E293B',
    },
    selectInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 16,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
    },
    eyeIcon: { padding: 14 },

    footerSection: {
        padding: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },

    backButton: { padding: 16 },
    backButtonText: { fontSize: 16, fontWeight: '600', color: '#64748B' },

    langButton: { padding: 16 },
    langButtonText: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },

    nextButton: {
        flexDirection: 'row',
        backgroundColor: '#4F46E5',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    loginRow: { flexDirection: 'row', justifyContent: 'center' },
    helperText: { color: '#64748B' },
    helperLink: { color: '#4F46E5', fontWeight: 'bold' },

    modalOverlay: {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modalContent: {
        width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16, textAlign: 'center' },
    modalItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    modalItemText: { fontSize: 16, color: '#334155' },
    modalClose: { marginTop: 16, alignItems: 'center', padding: 8 },
    modalCloseText: { color: '#EF4444', fontWeight: '600' },
});
