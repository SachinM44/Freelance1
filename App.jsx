import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screen/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import InvestmentApp from './src/screen/InvestmentAppScreen';
import CustomAppbar from './src/components/CustomAppbar';
import SubscriptionPlans from './src/screen/SubscriptionScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import CalculatorScreen from './src/screen/Calculator';
import InvestmentHistory from './src/screen/InvestmentHistoryScreen';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          header: () => {
            if (['HOME', 'LOGIN', 'REGISTER'].includes(route.name)) {
              return null;
            }
            return <CustomAppbar />;
          },
        })}
      >
        <Stack.Screen name="HOME" component={HomeScreen} />
        <Stack.Screen name="LOGIN" component={LoginScreen} />
        <Stack.Screen name="REGISTER" component={RegisterScreen} />
        <Stack.Screen name="USERHOME" component={InvestmentApp} />
        <Stack.Screen name="SUBSCRIPTION" component={SubscriptionPlans} />
        <Stack.Screen name="PROFILE" component={ProfileScreen}/>
        <Stack.Screen name='CALCULATOR' component={CalculatorScreen}/>
        <Stack.Screen name='INVESTMENTHISTORY' component={InvestmentHistory}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;