import React from 'react';
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
    backgroundColor: colors.purpule,
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