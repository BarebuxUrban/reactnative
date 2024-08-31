import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';


const Cups = () => {
  const [cupsData, setCupsData] = useState(null);

  useEffect(() => {
    const fetchCupsData = async () => {
      try {
        // Assuming user ID is stored in some user context or fetched from secure storage
        const response = await axios.get('http://10.0.2.2:5000/cups/?id=39'); // replace with your dynamic user ID
        setCupsData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCupsData();
    const intervalId = setInterval(fetchCupsData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (!cupsData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.label}>Серийный номер</Text>
      <Text style={styles.text}>{cupsData.serial_number}</Text>
      <Text style={styles.label}>Количество стаканчиков</Text>
      <Text style={styles.text}>{cupsData.cups_amount}</Text>
      {/* Add more fields as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default Cups;
