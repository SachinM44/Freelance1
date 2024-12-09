import React, { useState } from "react";
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { BlurView } from 'expo-blur';
import axiosInstance from '../config/axiosInstance'; 
import { setToken } from '../utils/tokenUtils'; 
import { Checkbox } from 'react-native-paper'; 

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState(''); 
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false); 

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const validateInputs = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return false;
    }
    const phonePattern = /^(\+?\d{1,4})?\d{10}$/;
if (!phonePattern.test(phone)) {
  Alert.alert("Error", "Please enter a valid phone number with 10 digits.");
  return false;
}

    if (!consent) {
      Alert.alert("Error", "Please accept the terms and conditions.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/users/`, {
        username: name,
        email,
        phone,
        password,
        consent: consent.toString(),
        referral_code: referralCode, 
      });
      const data = response.data;
      setLoading(false);
      
      console.log('API Response:', data);
  
      if (data.status === 'success') {
        console.log('Received Token:', data.data.access_token);
        await setToken(data.data.access_token);
        navigation.navigate("LOGIN");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again later.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Let's get</Text>
        <Text style={styles.headingText}>started</Text>
      </View>
      <View style={styles.formContainer}>
        <InputField
          icon="person-outline"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <InputField
          icon="mail-outline"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          icon="call-outline"
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <InputField
          icon="lock-closed-outline"
          placeholder="Enter your password"
          secureTextEntry={secureEntry}
          value={password}
          onChangeText={setPassword}
        />
        <InputField
          icon="lock-closed-outline"
          placeholder="Confirm your password"
          secureTextEntry={secureEntry}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <InputField
          icon="gift-outline"
          placeholder="Referral Code (optional)"
          value={referralCode}
          onChangeText={setReferralCode}
        />
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={consent ? 'checked' : 'unchecked'}
            onPress={() => setConsent(!consent)}
            color={colors.primary}
          />
          <Text style={styles.checkboxLabel}>I accept terms & conditions</Text>
        </View>
        <Button title="Register" onPress={handleRegister} />
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Already have an account!</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
        <BlurView intensity={150} style={styles.absolute}>
          <ActivityIndicator size="large" color={colors.primary} />
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.primary,
  },
  formContainer: {
    flex: 1,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  accountText: {
    fontSize: 16,
    color: colors.gray,
  },
  loginText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 5,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary,
  },
});

export default RegisterScreen;