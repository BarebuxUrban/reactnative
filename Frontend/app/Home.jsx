import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('super_secret');
    router.replace('/'); // Redirect to the root route (login/register screen)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Добро пожаловать</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF4500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Home;
