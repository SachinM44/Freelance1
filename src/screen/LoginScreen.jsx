// LoginScreen.js
import React, { useState, useEffect } from "react";
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { API_URL } from '@env';
import { BlurView } from 'expo-blur';
import axiosInstance from '../config/axiosInstance';
import { setToken } from '../utils/tokenUtils';

SplashScreen.preventAutoHideAsync();

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('+91');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          setAppIsReady(true);
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRegister = () => {
    navigation.navigate("REGISTER");
  };

  const validateInputs = () => {
    if (!phone || !password) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/login', {
        phone,
        password,
      });
      const data = response.data;
      setLoading(false);

      if (data.status === 'success') {
        await setToken(data.data.access_token);

        if (data.data.subscription_done) {
          navigation.navigate("USERHOME");
        } else {
          navigation.navigate("SUBSCRIPTION");
        }
      } else if (data.message === 'Invalid credentials') {
        Alert.alert("Error", "Wrong password or user with this mobile number does not exist.");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again later.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      <View style={styles.formContainer}>
        <InputField
          icon="call-outline"
          placeholder="Enter your Mobile Number"
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
        <Button title="Login" onPress={handleLogin} />
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
        <BlurView intensity={120} style={styles.absolute}>
          <ActivityIndicator size="large" color={colors.primary} />
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  backButtonWrapper: {
    alignSelf: 'flex-start',
  },
  textContainer: {
    marginTop: 50,
  },
  headingText: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  formContainer: {
    marginTop: 30,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  accountText: {
    fontSize: 16,
    color: colors.text,
  },
  registerText: {
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
});

export default LoginScreen;
