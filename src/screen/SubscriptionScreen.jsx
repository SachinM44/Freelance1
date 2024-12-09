import React, { useState, useEffect } from 'react';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getPlans, addUserSubscription } from '../apiService';
import SkeletonLoader from '../components/Skeleton';

const SubscriptionPlans = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fontsLoaded] = useFonts({ Poppins_600SemiBold });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getPlans();
        setPlans(plansData);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId) => {
    if (submitting) return; // Prevent selecting if already submitting

    setSubmitting(true);
    setSelectedPlanId(planId);

    try {
      const payload = { subscription_plan: planId };
      await addUserSubscription(payload);
      Alert.alert('Success', 'Subscription added successfully!');
      navigation.navigate('USERHOME');
    } catch (error) {
      Alert.alert('Error', 'Failed to add subscription. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!fontsLoaded || loading) {
    return <SkeletonLoader />;
  }

  const renderPlan = (plan) => {
    const isSelected = selectedPlanId === plan.plan_id;
    return (
      <View key={plan.plan_id} style={styles.planCard}>
        <View style={styles.planDetails}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}></Text>
          <Text style={styles.planPrice}>
            ${plan.price / 100}
            <Text style={styles.perMonth}>/month</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.selectButton,
            isSelected && styles.selectedButton, // Apply selected styles if selected
          ]}
          onPress={() => handleSelectPlan(plan.plan_id)}
          accessibilityLabel={`Select ${plan.name} plan`}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.selectButtonText,
              isSelected && styles.selectedButtonText, // Apply selected text styles
            ]}
          >
            {isSelected ? '✓' : '>'} {/* Toggle between checkmark and arrow */}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.title}>Choose Your Subscription Plan</Text>
      {plans.length > 0 ? (
        plans.map(renderPlan)
      ) : (
        <Text style={styles.noPlansText}>No subscription plans available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 5,
    paddingTop: 7,
    paddingHorizontal: 20,
  },
  title: {
    paddingTop: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  planDetails: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF', // Match the purple text
    marginBottom: 5,
  },
  planDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  perMonth: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#777',
  },
  selectButton: {
    backgroundColor: '#FFD3D6',
    borderRadius: 50,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FF4081',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#6C63FF',
  },
  selectedButtonText: {
    color: '#FFF',
  },
});

export default SubscriptionPlans;
