import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('super_secret');
      try {
        const response = await axios.get('http://10.0.2.2:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,  // Corrected template literal syntax
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);
}