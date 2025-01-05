import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToken = async (token) => {
  if (!token) {
   // console.error('Error setting token: Token is null or undefined');
    return;
  }
  try {
    await AsyncStorage.setItem('accessToken', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
     // throw new Error('Token is null or undefined');
    }
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
};
