import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Add your initialization logic here
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAppIsReady(true);
        setTimeout(() => {
          navigation.navigate("LOGIN");
        }, 2000);
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/logo_-removebg-preview.png")} 
        style={styles.tsContainer} 
      />
    </View>
  );
};

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

export default HomeScreen;