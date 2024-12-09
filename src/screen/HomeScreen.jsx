import { Image, StyleSheet, View } from "react-native";
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from "react";
import { colors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

const HomeScreen = () => {
  const navigation = useNavigation();
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync(); 
          setTimeout(() => {
            setAppIsReady(true); 
            navigation.navigate("LOGIN"); 
          }, 2000); 
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo_-removebg-preview.png")} style={styles.tsContainer} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",  
  },
  tsContainer: {
    height: 350,
    width: 300,
  },
});