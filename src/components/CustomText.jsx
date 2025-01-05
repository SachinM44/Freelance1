import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

const CustomText = ({ 
  children, 
  style, 
  type = 'regular', // Options: 'regular', 'heading', 'subheading', 'small'
  color = '#000000',
  ...props 
}) => {
  return (
    <RNText 
      style={[
        styles.base,
        styles[type],
        { color },
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: '#000000',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  regular: {
    fontSize: 16,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
  },
  small: {
    fontSize: 14,
  },
  link: {
    color: '#2196F3', // Standard hyperlink blue color
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
    marginLeft: 10
  },
});

export default CustomText;
