import React from 'react';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from "../utils/colors";

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Button;