import React, { useState } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import InputField from "../components/InputField";
import Button from "../components/Button";
import axiosInstance from '../config/axiosInstance';
import { setToken } from '../utils/tokenUtils';
import CustomText from "../components/CustomText";

const LoginScreen = () => {
   const navigation = useNavigation();
   const [phone, setPhone] = useState('+91');
   const [password, setPassword] = useState('');
   const [secureEntry, setSecureEntry] = useState(true);
   const [loading, setLoading] = useState(false);

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
         password: password.trim(),
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
         //Alert.alert("Error", "Wrong password or user with this mobile number does not exist.");
       } 
     } catch (error) {
       setLoading(false);
       //Alert.alert("Error", "Something went wrong. Please try again later.");
       console.error(error);
     }
   };

   return (
     <View style={styles.container}>
       <View style={styles.textContainer}>
         <CustomText type="heading">Hey,</CustomText>
         <CustomText type="heading">Welcome</CustomText>
         <CustomText type="heading">Back</CustomText>
       </View>
       <View style={styles.formContainer}>
         <InputField
           icon="call-outline"
           placeholder="Enter your Mobile Number"
           keyboardType="phone-pad"
           type="number"
           value={phone}
           maxLength={13}
           onChangeText={(text) => setPhone(text)}
         />
         <InputField
           icon="lock-closed-outline"
           placeholder="Enter your password"
           secureTextEntry={secureEntry}
           value={password}
           onChangeText={(text) => setPassword(text)}
         />
         <Button title="Login" onPress={handleLogin} />
         <View style={styles.footerContainer}>
           <CustomText type="bold">Don't have an account?</CustomText>
           <TouchableOpacity onPress={handleRegister}>
             <CustomText type="link" style={{ color: '#2196F3' }}>Register</CustomText>
           </TouchableOpacity>
         </View>
       </View>
       {loading && (
         <View style={[styles.absolute, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
           <ActivityIndicator size="large" color={colors.primary} />
         </View>
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
   textContainer: {
     marginTop: 50,
   },
   headingText: {
     fontSize: 32,
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
