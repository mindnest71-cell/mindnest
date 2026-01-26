import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ==========================================
// DEPLOYMENT CONFIGURATION
// ==========================================
// Set to true when using Railway backend
const USE_PRODUCTION = false;

// TODO: Update this with your Railway URL after deployment
const PRODUCTION_URL = 'https://your-app.up.railway.app';
// ==========================================

const getBaseUrl = () => {
    // Use production URL if enabled
    if (USE_PRODUCTION) {
        return PRODUCTION_URL;
    }

    // Local development URLs
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
};

export const API_BASE = getBaseUrl();

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Auth Token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('user_id'); // Using user_id as token for now
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.log('Error reading token', e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
