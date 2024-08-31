import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serial_number, setSerial_number] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:5000/api/register', {
                name,
                surname,
                email,
                password,
                serial_number
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || 'An error occurred');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
            />
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
            <TextInput
                style={styles.input}
                placeholder="Serial_number"
                value={serial_number}
                onChangeText={setSerial_number}
            />
            <Button 
                title="Register" 
                onPress={handleRegister} 
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
};

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


export default Register;