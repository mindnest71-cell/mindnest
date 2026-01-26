import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ChatScreen from './screens/ChatScreen';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ChatScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D6EAF8',
    },
});
