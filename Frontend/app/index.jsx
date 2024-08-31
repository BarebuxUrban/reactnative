import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function App() {
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync('super_secret');
            if (token) {
                router.replace('/Dashboard'); // Redirect to home if auth token exists
            } else {
                setIsAuthChecked(true); // Show login screen if auth token doesn't exist
            }
        };
  
        checkAuth();
    }, []);
  
    if (!isAuthChecked) {
      return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Добро пожаловать</Text>

            <TouchableOpacity>
                <Link href="/Login" style={styles.link}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Войти</Text>
                    </View>
                </Link>
            </TouchableOpacity>

            <View style={styles.space} />

            <TouchableOpacity>
                <Link href="/Register" style={styles.link}>
                    <View style={styles.buttonAlt}>
                        <Text style={styles.buttonTextAlt}>Регистрация</Text>
                    </View>
                </Link>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        width: 200,
        backgroundColor: '#007BFF',
        padding: 17,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    space: {
        height: 2
    },
    buttonAlt: {
        width: 200,
        backgroundColor: '#f5f5f5',
        padding: 17,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextAlt: {
        color: 'black',
        fontSize: 18
    }
});