import axios from 'axios';
import { API_URL } from '@env';
import { getToken } from '../utils/tokenUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error setting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('accessToken');
      Alert.alert('Session expired', 'Please log in again');
      const navigation = useNavigation();
      navigation.navigate('Login'); 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;