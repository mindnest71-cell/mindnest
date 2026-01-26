import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../utils/api';

export default function Resources() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('en'); // 'en' or 'th'
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetchResources();
    }, [language]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/resources/?language=${language}`);
            setResources(response.data);
        } catch (error) {
            console.log("Error fetching resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCall = (phoneNumber) => {
        // Extract the first number if multiple exist (split by /)
        // Remove all non-numeric characters for the `tel` link
        const cleanNumber = phoneNumber.split('/')[0].replace(/[^0-9]/g, '');
        Linking.openURL(`tel:${cleanNumber}`);
    };

    const handleWebsite = (url) => {
        Linking.openURL(url);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <MaterialCommunityIcons name="shield-check" size={20} color="#4F46E5" />
            </View>

            <Text style={styles.cardDescription}>{item.description}</Text>

            {/* Display Contact Info Text */}
            {item.phone && (
                <Text style={styles.contactText}>📞 {item.phone}</Text>
            )}

            <View style={styles.cardActions}>
                {item.phone && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.callBtn]}
                        onPress={() => handleCall(item.phone)}
                    >
                        <MaterialCommunityIcons name="phone" size={18} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Call</Text>
                    </TouchableOpacity>
                )}

                {item.website && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.webBtn]}
                        onPress={() => handleWebsite(item.website)}
                    >
                        <MaterialCommunityIcons name="web" size={18} color="#4F46E5" />
                        <Text style={[styles.actionBtnText, { color: '#4F46E5' }]}>Website</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crisis Resources</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.languageToggleContainer}>
                <View style={styles.languageToggle}>
                    <TouchableOpacity
                        style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                        onPress={() => setLanguage('en')}
                    >
                        <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.langBtn, language === 'th' && styles.langBtnActive]}
                        onPress={() => setLanguage('th')}
                    >
                        <Text style={[styles.langText, language === 'th' && styles.langTextActive]}>ภาษาไทย</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <FlatList
                    data={resources}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No resources found for this language.</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    backBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    languageToggleContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    languageToggle: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
    },
    langBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    langBtnActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    langText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    langTextActive: {
        color: '#4F46E5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        gap: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
        marginRight: 10,
    },
    cardDescription: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 22,
        lineHeight: 22,
        marginBottom: 10,
    },
    contactText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 16,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
    },
    callBtn: {
        backgroundColor: '#4F46E5',
    },
    webBtn: {
        backgroundColor: '#EEF2FF',
    },
    actionBtnText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#FFFFFF',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#94A3B8',
        fontSize: 16,
    }
});
