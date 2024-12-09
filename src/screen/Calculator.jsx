import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { getUserDetails } from '../apiService';
import SkeletonLoader from '../components/Skeleton';

function CalculatorScreen() {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [estimatedReturns, setEstimatedReturns] = useState(null);
  const [selectedTab, setSelectedTab] = useState('calculator');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails && userDetails.subscriptions_taken) {
          setSubscriptionPlans(userDetails.subscriptions_taken);
          setSelectedPlan(userDetails.subscriptions_taken[0]);
        } else {
          setSubscriptionPlans([]);
        }
      } catch (error) {
        console.error('Error fetching user subscription plans:', error);
        Alert.alert('Error', 'Could not fetch subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlans();
  }, []);

  const handleSubmit = () => {
    const enteredAmount = parseFloat(amount);
    if (selectedPlan && enteredAmount >= selectedPlan.price) {
      const returns = (enteredAmount * (selectedPlan.expected_return / 100)) + enteredAmount;
      setEstimatedReturns(returns.toFixed(2));
    } else {
      Alert.alert(`Minimum amount should be ₹${selectedPlan?.price || 0}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>ROI Calculator</Text>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            {loading ? (
              <SkeletonLoader /> 
            ) : (
              <>
                <Text style={styles.label}>Select Plan</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedPlan}
                    onValueChange={(itemValue) => setSelectedPlan(itemValue)}
                    style={styles.picker}
                  >
                    {subscriptionPlans.length > 0 ? (
                      subscriptionPlans.map((plan) => (
                        <Picker.Item key={plan.plan_id} label={plan.name} value={plan} />
                      ))
                    ) : (
                      <Picker.Item label="No plans available" value={null} />
                    )}
                  </Picker>
                </View>

                <Text style={styles.label}>Enter Amount</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  placeholderTextColor="#A0AEC0"
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Calculate ROI</Text>
                </TouchableOpacity>

                {estimatedReturns !== null && (
                  <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>Estimated Returns:</Text>
                    <Text style={styles.resultValue}>{`₹${estimatedReturns}`}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </Card>
      </ScrollView>
      <BottomNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </SafeAreaView>
  );
}

const BottomNavigation = ({ selectedTab, setSelectedTab }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
      {['home', 'calculator', 'account', 'chart-line'].map((icon, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedTab(icon);
            if (icon === 'account') {
              navigation.navigate('PROFILE');
            } else if (icon === 'calculator') {
              navigation.navigate('CALCULATOR');
            } else if (icon === 'home') {
              navigation.navigate('USERHOME');
            } else if (icon === 'chart-line') {
              navigation.navigate('INVESTMENTHISTORY');
            }
          }}
        >
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={selectedTab === icon ? colors.primary : 'gray'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

BottomNavigation.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 15,
    elevation: 4,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  cardContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  input: {
    height: 50,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CalculatorScreen;