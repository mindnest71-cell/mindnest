import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const ChatHeader = () => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home'); // Fallback to Home
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={28} color="#1E3A5F" />
        </TouchableOpacity>

        <View style={styles.logoContainer} pointerEvents="none">
          <Image
            source={require('../assets/images/mindnest-logo.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.rightIcons} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#D6EAF8', // Light blue background matching the design
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  rightIcons: {
    width: 40, // Placeholder to balance the left icon
  },
  iconButton: {
    padding: 5,
  },
});

export default ChatHeader;
