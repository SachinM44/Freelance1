import React, { useState, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import InputField from "../components/InputField";
import Button from "../components/Button";
import axiosInstance from '../config/axiosInstance';
import { setToken } from '../utils/tokenUtils';
import { Checkbox } from 'react-native-paper';
import CustomAlert from "../components/CustomAlert";
import CustomText from "../components/CustomText";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const alertRef = useRef(null);

  const showAlert = (title, message) => {
    if (alertRef.current?.show) {
      alertRef.current.show({
        title,
        message,
        buttonText: 'Okay'
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const validateEmailOnChange = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };
  
  const validatePasswordOnChange = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
      return;
    }
    
    let errorMessage = [];
    if (text.length < 8) errorMessage.push('At least 8 characters');
    if (!/[A-Z]/.test(text)) errorMessage.push('One uppercase letter');
    if (!/[a-z]/.test(text)) errorMessage.push('One lowercase letter');
    if (!/[0-9]/.test(text)) errorMessage.push('One number');
    if (!/[@$!%*?&]/.test(text)) errorMessage.push('One special character (@$!%*?&)');
    
    setPasswordError(errorMessage.length > 0 ? errorMessage.join(', ') : '');
    validateConfirmPassword(confirmPassword, text);
  };
  
  const validateConfirmPassword = (text, currentPassword = password) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError('Confirm password is required');
    } else if (text !== currentPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateInputs = () => {
    // Trigger all validations
    validateEmailOnChange(email);
    validatePasswordOnChange(password);
    validateConfirmPassword(confirmPassword);
  
    if (emailError || passwordError || confirmPasswordError) {
      return false;
    }
  
    if (name.length === 0 || phone.length === 0) {
      showAlert("Validation Error", "All fields are required!");
      return false;
    }
  
    const phonePattern = /^(\+?\d{1,4})?\d{10}$/;
    if (!phonePattern.test(phone)) {
      showAlert("Validation Error", "Please enter a valid phone number with 10 digits.");
      return false;
    }
  
    if (!consent) {
      showAlert("Validation Error", "Please accept the terms and conditions.");
      return false;
    }
  
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/', {
        username: name,
        email,
        phone,
        password,
        consent: consent.toString(),
        referral_code: referralCode,
      });

      if (response.data) {
        await setToken(response.data.data.access_token);
        showAlert("Success", "Registration successful! Please login to continue.");
        setTimeout(() => {
          navigation.navigate("LOGIN");
        }, 1500);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
            <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <CustomText type="heading" style={styles.headingText}>Let's get</CustomText>
            <CustomText type="heading" style={styles.headingText}>started</CustomText>
          </View>

          <View style={styles.formContainer}>
            <InputField
              icon="person-outline"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <View>
                <InputField
                  icon="mail-outline"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={validateEmailOnChange}
                />
                {emailError ? (
                  <CustomText style={styles.errorText}>{emailError}</CustomText>
                ) : null}
            </View>
            <InputField
              icon="call-outline"
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <View>
              <InputField
                icon="lock-closed-outline"
                placeholder="Enter your password"
                secureTextEntry={secureEntry}
                value={password}
                onChangeText={validatePasswordOnChange}
              />
              {passwordError ? (
                <CustomText style={styles.errorText}>{passwordError}</CustomText>
              ) : null}
            </View>

            <View>
              <InputField
                icon="lock-closed-outline"
                placeholder="Confirm your password"
                secureTextEntry={secureEntry}
                value={confirmPassword}
                onChangeText={(text) => validateConfirmPassword(text)}
              />
              {confirmPasswordError ? (
                <CustomText style={styles.errorText}>{confirmPasswordError}</CustomText>
              ) : null}
            </View>
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
              <CustomText style={styles.checkboxLabel}>I accept terms & conditions</CustomText>
            </View>

            <Button title="Register" onPress={handleRegister} />

            <View style={styles.footerContainer}>
              <CustomText type="bold">Already have an account!</CustomText>
              <TouchableOpacity onPress={handleLogin}>
              <CustomText type="link" style={{ color: '#2196F3' }}>Login</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {loading && (
        <View style={[styles.absolute, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      
      <CustomAlert ref={alertRef} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingLeft: 0,
    flexGrow: 1,
    paddingBottom: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: colors.gray,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    paddingLeft: 25,
    color: colors.primary,
  },
  formContainer: {
    padding: 20,
    paddingTop: 0,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  accountText: {
    color: colors.gray,
  },
  loginText: {
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
    color: colors.primary,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
    marginLeft: 10
  }
});

export default RegisterScreen;