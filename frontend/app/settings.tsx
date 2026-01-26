import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export default function Settings() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "New password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('user_id');
            if (!userId) {
                Alert.alert("Error", "User ID not found. Please log in again.");
                router.replace('/');
                return;
            }

            const response = await api.post('/auth/change-password', {
                user_id: userId,
                old_password: oldPassword,
                new_password: newPassword
            });

            if (response.status === 200) {
                Alert.alert("Success", "Password changed successfully", [
                    {
                        text: "OK", onPress: () => {
                            setOldPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            router.back();
                        }
                    }
                ]);
            }
        } catch (error) {
            console.log("Change Password Error:", error);
            const msg = error.response?.data?.detail || "Failed to change password";
            Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteHistory = async () => {
        Alert.alert(
            "Delete Chat History",
            "Are you sure you want to delete all your chat history? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await api.delete('/chat/history');
                            if (response.status === 200) {
                                Alert.alert("Success", "Chat history deleted.");
                            }
                        } catch (error) {
                            console.log("Delete History Error:", error);
                            Alert.alert("Error", "Failed to delete history.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account and all data? This action CANNOT be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete My Account",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await api.delete('/auth/me');
                            if (response.status === 200) {
                                await AsyncStorage.multiRemove(['user_id', 'user_name']);
                                Alert.alert("Account Deleted", "Your account has been deleted.");
                                router.replace('/');
                            }
                        } catch (error) {
                            console.log("Delete Account Error:", error);
                            Alert.alert("Error", "Failed to delete account.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="lock-reset" size={24} color="#4F46E5" />
                        <Text style={styles.sectionTitle}>Change Password</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Password</Text>
                            <TextInput
                                style={styles.input}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry
                                placeholder="Enter current password"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                placeholder="Enter new password"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholder="Confirm new password"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.saveBtn, loading && styles.disabledBtn]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.saveBtnText}>Update Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* DANGER ZONE */}
                <View style={[styles.section, styles.dangerSection]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
                        <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
                    </View>

                    <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteHistory}>
                        <MaterialCommunityIcons name="delete-clock" size={20} color="#EF4444" />
                        <Text style={styles.dangerBtnText}>Delete Chat History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.dangerBtn, { marginTop: 12 }]} onPress={handleDeleteAccount}>
                        <MaterialCommunityIcons name="account-remove" size={20} color="#EF4444" />
                        <Text style={styles.dangerBtnText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    backBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F1F5F9', // slightly grey for touch target
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#1E293B',
    },
    saveBtn: {
        backgroundColor: '#4F46E5',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dangerSection: {
        marginTop: 24,
        borderColor: '#FECACA',
        borderWidth: 1,
        backgroundColor: '#FEF2F2',
    },
    dangerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
        gap: 12,
    },
    dangerBtnText: {
        fontSize: 16,
        color: '#EF4444',
        fontWeight: '600',
    }
});
