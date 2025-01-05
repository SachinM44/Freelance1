import React from 'react';
import { Appbar } from 'react-native-paper';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';

const CustomAppbar = ({ navigation, routeName }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LOGIN' }],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <Appbar.Header style={{ backgroundColor: 'white' }}>
      <Appbar.Content
        title={'Trade Streaks'}
        titleStyle={{
          color: colors.primary,
          textAlign: 'left',
          fontWeight: 'bold',
        }}
      />
      {['PROFILE', 'INVESTMENTHISTORY', 'CALCULATOR', 'USERHOME' , 'SUBSCRIPTION'].includes(routeName) && (
        <Appbar.Action
          icon="logout"
          color={colors.primary}
          onPress={handleLogout}
        />
      )}
    </Appbar.Header>
  );
};

export default CustomAppbar;
