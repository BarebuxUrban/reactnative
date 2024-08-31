import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:5000/api/login', {
                email,
                password
            });
            if (response.data.token) {
                await SecureStore.setItemAsync('super_secret', response.data.token);
                setMessage('');
                router.push('/Dashboard');
            } else {
                setMessage(response.data.message);
            }

        } catch (error) {
            // Ensure we extract a string message from the error object
            if (error.response && error.response.data) {
                const errorMessage = typeof error.response.data.message === 'string' 
                    ? error.response.data.message 
                    : JSON.stringify(error.response.data.message || error.response.data);
                setMessage(errorMessage);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button 
                title="Login" 
                onPress={handleLogin} 
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: 'green',
    },
});


export default Login;  