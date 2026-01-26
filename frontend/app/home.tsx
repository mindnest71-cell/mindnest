import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STRINGS = {
    en: {
        welcome: "Welcome back,",
        friend: "Friend",
        signOut: "Sign Out",
        signOutConfirm: "Are you sure you want to sign out?",
        cancel: "Cancel",
        express: "Express your feelings",
        resources: "Crisis Resources",
        settings: "Settings",
        langLabel: "EN"
    },
    th: {
        welcome: "ยินดีต้อนรับกลับ,",
        friend: "เพื่อน",
        signOut: "ออกจากระบบ",
        signOutConfirm: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
        cancel: "ยกเลิก",
        express: "ระบายความในใจ",
        resources: "แหล่งช่วยเหลือฉุกเฉิน",
        settings: "การตั้งค่า",
        langLabel: "TH"
    }
};

export default function Home() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [lang, setLang] = useState<'en' | 'th'>('en');
    const t = STRINGS[lang];

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const name = await AsyncStorage.getItem('user_name');
                if (name) {
                    setUserName(name);
                }
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        };
        loadUserData();
    }, []);

    const toggleLang = () => setLang(prev => prev === 'en' ? 'th' : 'en');

    const handleSignOut = async () => {
        Alert.alert(
            t.signOut,
            t.signOutConfirm,
            [
                { text: t.cancel, style: "cancel" },
                {
                    text: t.signOut,
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove(['user_id', 'user_name', 'user_email']);
                            router.replace('/');
                        } catch (error) {
                            console.log('Error signing out:', error);
                        }
                    }
                }
            ]
        );
    };

    const menuItems = [
        {
            title: t.express,
            icon: "chat-processing",
            route: "/chat",
            color: "#4F46E5" // Indigo 600
        },
        {
            title: t.resources,
            icon: "shield-alert",
            route: "/resources",
            color: "#E11D48" // Rose 600
        },
        {
            title: t.settings,
            icon: "cog",
            route: "/settings",
            color: "#475569" // Slate 600
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{t.welcome}</Text>
                    <Text style={styles.userName}>{userName || t.friend}</Text>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={toggleLang} style={styles.langBtn}>
                        <Text style={styles.langText}>{lang === 'en' ? 'TH' : 'EN'}</Text>
                        <MaterialCommunityIcons name="translate" size={20} color="#4F46E5" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
                        <MaterialCommunityIcons name="logout" size={24} color="#64748B" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.grid}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => router.push(item.route as any)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <MaterialCommunityIcons name={item.icon as any} size={32} color={item.color} />
                        </View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" style={styles.arrow} />
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 10,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    greeting: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 4,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    langBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 6,
    },
    langText: {
        fontWeight: 'bold',
        color: '#4F46E5',
        fontSize: 14,
    },
    signOutBtn: {
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    grid: {
        gap: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
    },
    arrow: {
        marginLeft: 'auto',
    }
});
