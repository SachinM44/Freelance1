import axios from 'axios';
import { getToken } from '../utils/tokenUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { Logger } from './sentryLoggin';
import config from './config';

let customAlertRef = null;

// Function to set the alert ref
export const setAlertRef = (ref) => {
  customAlertRef = ref;
};

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
});

// Add timing to requests
axiosInstance.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

// Console styling helper
const consoleStyle = {
  request: 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;',
  response: 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;',
  error: 'background: #f44336; color: white; padding: 2px 5px; border-radius: 3px;'
};

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log the API request
      const logData = {
        url: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        headers: { ...config.headers, Authorization: token ? 'Bearer [HIDDEN]' : 'No token' },
      };

      // Only include request data for non-GET requests
      if (config.method?.toLowerCase() !== 'get' && config.data) {
        logData.requestData = config.data;
      }

      // Console log with styling
      if (__DEV__) {
        console.group(`%c📤 API Request: ${config.method?.toUpperCase()} ${config.url}`, consoleStyle.request);
        console.log('Details:', logData);
        // Remove this line that was causing the error
        // console.log('Details:', logData,config.data.status_code);
        console.groupEnd();
      }

    } catch (error) {
      if (__DEV__) {
        console.group(`%c❌ Request Error: ${config.url}`, consoleStyle.error);
        console.error(error);
        console.groupEnd();
      }
      Logger.error(error, {
        context: 'API Request Interceptor',
        url: config.url
      });
    }
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.group('%c❌ Request Failed', consoleStyle.error);
      console.error(error);
      console.groupEnd();
    }
    Logger.error(error, {
      context: 'API Request Interceptor',
      stage: 'Pre-Request'
    });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async(response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    
    const logData = {
      url: `${response.config.baseURL}${response.config.url}`,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(response.data).length,
      ...__DEV__ && { responseData: response.data }
    };

    
    // Console log with styling
    if (__DEV__) {
      console.group(`%c📥 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, consoleStyle.response);
      console.log('Details:', logData);
      console.groupEnd();
    }

    // Sentry logging
    Logger.info('API Response Success', logData);
    if(response.data.status.toLowerCase()!=="success"){

      if (response.data.status_code === 401) {
        Logger.warn('Session expired - User being redirected to login', {
          lastRequestUrl: error.config?.url
        });
        
        await AsyncStorage.removeItem('accessToken');
        const navigation = useNavigation();
        if (customAlertRef?.show) {
          customAlertRef.show({
            title: 'Session Expired',
            message: 'Please log in again to continue.',
            buttonText: 'Login',
            onClose: () => {
             
              
              navigation.navigate('LOGIN');
            }
            
          });
          navigation.navigate('LOGIN');
        }
      } else {
        if (customAlertRef?.show) {
          customAlertRef.show({
            title: 'Unable to Process',
            message: error.response?.data?.message || 'Something went wrong. Please try again later.',
            buttonText: 'Try Again',
            onClose: () => {
              // Add any additional handling here if needed
            }
          });
        }
      }
    }
    
    
    return response;
  },
  async (error) => {
    const duration = Date.now() - error.config?.metadata?.startTime;
    
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      duration: `${duration}ms`,
      errorMessage: error.message,
      responseData: error.response?.data,
      requestData: error.config?.data,
    };

    // Console log with styling
    if (__DEV__) {
      console.group(`%c❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, consoleStyle.error);
      console.log('Details:', errorDetails);
      console.groupEnd();
    }

    // Sentry logging
    Logger.error(error, {
      context: 'API Response Error',
      ...errorDetails
    });
      
    if (errorDetails.responseData.status_code === 401) {
      Logger.warn('Session expired - User being redirected to login', {
        lastRequestUrl: error.config?.url
      });
      
      await AsyncStorage.removeItem('accessToken');
      const navigation = useNavigation();
      if (customAlertRef?.show) {
        customAlertRef.show({
          title: 'Session Expired',
          message: 'Please log in again to continue.',
          buttonText: 'Login',
          onClose: () => {
           
            
            navigation.navigate('LOGIN');
          }
          
        });
        navigation.navigate('LOGIN');
      }
    } else {
      if (customAlertRef?.show) {
        customAlertRef.show({
          title: 'Unable to Process',
          message: error.response?.data?.message || 'Something went wrong. Please try again later.',
          buttonText: 'Try Again',
          onClose: () => {
            // Add any additional handling here if needed
          }
        });
      }
    }
      
    return Promise.reject(error);
  }
);

export default axiosInstance;