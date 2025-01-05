import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import CustomText from '../components/CustomText';
import { Card } from 'react-native-paper';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import SkeletonLoader from '../components/Skeleton';
import { getPlans } from '../apiService';
import BottomNavigation from '../components/BottomNavigation';

function CalculatorScreen() {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [estimatedReturns, setEstimatedReturns] = useState(null);
  const [enteredAmount, setEnteredAmount] = useState(null);
  const [selectedTab, setSelectedTab] = useState('calculator');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const plans = await getPlans();
      if (plans && plans.length > 0) {
        setSubscriptionPlans(plans);
        setSelectedPlan(plans[0]);
      } else {
        setSubscriptionPlans([]);
        setSelectedPlan(null);
      }
    } catch (error) {
      // Error handling is done in axios interceptor
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect instead of useEffect to run every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchPlans();
      // Optional: Reset other states when screen comes into focus
      setAmount('');
      setEstimatedReturns(null);
      setEnteredAmount(null);

      // Clean up function (optional)
      return () => {
        // Any cleanup code if needed
      };
    }, []) // Empty dependency array as we want this to run every time the screen focuses
  );

  const handleSubmit = () => {
    const enteredAmountValue = parseFloat(amount);
    if (!selectedPlan) {
      showAlert('No Plan Selected', 'Please select a subscription plan.');
      return;
    }
    if (isNaN(enteredAmountValue) || enteredAmountValue <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (enteredAmountValue < selectedPlan.price) {
      showAlert('Minimum Amount', `Minimum amount should be $${selectedPlan.price}`);
      return;
    }

    const returns = enteredAmountValue * (selectedPlan.expected_return / 100) + enteredAmountValue;
    setEnteredAmount(enteredAmountValue);
    setEstimatedReturns(returns.toFixed(2));
  };

  // Rest of your component remains the same...
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomText type="heading">ROI Calculator</CustomText>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <>
                <CustomText>Select Plan</CustomText>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsModalVisible(true)}
                >
                  <CustomText style={styles.dropdownText}>
                    {selectedPlan ? selectedPlan.name : 'Select a Plan'}
                  </CustomText>
                  <Icon name="chevron-down" size={20} color={colors.primary} />
                </TouchableOpacity>

                <Modal
                  transparent={true}
                  visible={isModalVisible}
                  animationType="slide"
                  onRequestClose={() => setIsModalVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <TouchableOpacity
                        style={styles.modalClose}
                        onPress={() => setIsModalVisible(false)}
                      >
                        <CustomText>✕</CustomText>
                      </TouchableOpacity>
                      <FlatList
                        data={subscriptionPlans}
                        keyExtractor={(item) => item.plan_id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => {
                              setSelectedPlan(item);
                              setIsModalVisible(false);
                            }}
                          >
                            <CustomText style={styles.modalItemText}>{item.name}</CustomText>
                          </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                          <CustomText style={styles.noPlansText}>No plans available.</CustomText>
                        }
                      />
                    </View>
                  </View>
                </Modal>

                <CustomText type='subheading'>Enter Amount</CustomText>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  placeholderTextColor="#A0AEC0"
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <CustomText style={styles.buttonText}>Calculate ROI</CustomText>
                </TouchableOpacity>

                {estimatedReturns !== null && (
                  <View style={styles.resultContainer}>
                    <CustomText style={styles.resultLabel}>Results:</CustomText>
                    <View style={styles.resultRow}>
                      <CustomText style={styles.resultTextLabel}>Entered Amount:</CustomText>
                      <CustomText style={styles.resultTextValue}>{`$${enteredAmount}`}</CustomText>
                    </View>
                    <View style={styles.resultRow}>
                      <CustomText style={styles.resultTextLabel}>Estimated Returns:</CustomText>
                      <CustomText style={styles.resultTextValue}>{`$${estimatedReturns}`}</CustomText>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </Card>
      </ScrollView>
      <BottomNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <CustomAlert ref={alertRef} />
    </SafeAreaView>
  );
}

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
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#4A5568',
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
    color: '#4A5568',
  },
  button: {
    backgroundColor: colors.purpule,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
  },
  resultLabel: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultTextLabel: {
    fontSize: 16,
    color: '#4A5568',
  },
  resultTextValue: {
    fontSize: 16,
    color: '#4A5568',
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
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#4A5568',
  },
  noPlansText: {
    textAlign: 'center',
    color: '#A0AEC0',
    marginTop: 20,
    fontSize: 16,
  },
});

export default CalculatorScreen;