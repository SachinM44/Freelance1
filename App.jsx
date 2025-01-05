import 'react-native-gesture-handler';
import { React, useRef, useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './src/screen/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import InvestmentApp from './src/screen/InvestmentAppScreen';
import CustomAppbar from './src/components/CustomAppbar';
import SubscriptionPlans from './src/screen/SubscriptionScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import CalculatorScreen from './src/screen/Calculator';
import InvestmentHistory from './src/screen/InvestmentHistoryScreen';
import * as Sentry from '@sentry/react-native';
import config from './src/config/config';
import CustomAlert from './src/components/CustomAlert';
import { setAlertRef } from './src/config/axiosInstance';

const Stack = createNativeStackNavigator();

// Simplified Sentry initialization
Sentry.init({
  dsn: config.sentryDns,
  debug: true, // Enable debug mode to see what's happening
  enabled: true, // Enable Sentry in all environments for testing
  tracesSampleRate: 1.0,
});

const App = () => {
  const alertRef = useRef(null);

  useEffect(() => {
    setAlertRef(alertRef.current);
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({route, navigation}) => ({
            header: () => {
              // Removed testSentry from here as it was causing repeated calls
              // Render CustomAppbar for all screens except LOGIN, REGISTER, and HOME
              if (['HOME', 'LOGIN', 'REGISTER'].includes(route.name)) {
                return null;
              }
              return (
                <CustomAppbar navigation={navigation} routeName={route.name} />
              );
            },
          })}>
          <Stack.Screen name="HOME" component={HomeScreen} />
          <Stack.Screen name="LOGIN" component={LoginScreen} />
          <Stack.Screen name="REGISTER" component={RegisterScreen} />
          <Stack.Screen name="USERHOME" component={InvestmentApp} />
          <Stack.Screen name="SUBSCRIPTION" component={SubscriptionPlans} />
          <Stack.Screen name="PROFILE" component={ProfileScreen} />
          <Stack.Screen name="CALCULATOR" component={CalculatorScreen} />
          <Stack.Screen name="INVESTMENTHISTORY" component={InvestmentHistory} />
        </Stack.Navigator>
      </NavigationContainer>
      <CustomAlert ref={alertRef} />
    </>
    
  );
};

export default App;
