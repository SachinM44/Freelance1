import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../utils/colors";

const InputField = ({ icon, placeholder, secureTextEntry, value, onChangeText, keyboardType = 'default' }) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color='#000000' style={styles.icon} />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={colors.primary}
        secureTextEntry={isSecure}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {secureTextEntry !== undefined && (
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
          <Ionicons name={isSecure ? "eye-off" : "eye"} size={20} color='#000000' style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    color: '#000000',
    borderRadius: 90,
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000'
  },
});

export default InputField;