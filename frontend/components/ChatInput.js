import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatInput = ({ onSend }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Message"
                    placeholderTextColor="#5D7A99"
                    value={text}
                    onChangeText={setText}
                    multiline
                />
            </View>
            <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={!text.trim()}>
                <Ionicons name="paper-plane-outline" size={24} color={text.trim() ? "#1E3A5F" : "#A0B0C0"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#D6EAF8', // Match background
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        minHeight: 45,
        justifyContent: 'center',
        marginRight: 10,
    },
    input: {
        fontSize: 16,
        color: '#1E3A5F',
        maxHeight: 100,
    },
    sendButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatInput;
