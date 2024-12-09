
import React from 'react';
import { Appbar } from 'react-native-paper';
import { colors } from '../utils/colors';

const CustomAppbar = ({  navigation }) => {
  return (
    <Appbar.Header style={{ backgroundColor: 'white'}}>
      <Appbar.Content title={'Trade Streaks'} titleStyle={{ color: colors.primary, textAlign: 'left' , fontWeight:'bold'}} />
    </Appbar.Header>
  );
};

export default CustomAppbar;