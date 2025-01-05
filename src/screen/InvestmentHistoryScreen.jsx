import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { getSubscriptionPlan } from '../apiService';
import SubscriptionSection from './SubscriptionSection';
import BottomNavigation from '../components/BottomNavigation';


const InvestmentHistory = () => {
 
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('account');

  useEffect(() => {
    setLoading(true);
    const fetchSubscriptionPlans = async () => {
      try {
        const plans = await getSubscriptionPlan();
        setSubscriptionPlans(plans || []);
      } catch (error) {
        setError('Failed to fetch subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  return (
    <View style={styles.container}>
      <SubscriptionSection
      loading={loading}
      error={error}
      subscriptionPlans={subscriptionPlans}
      />  

      {/* Bottom navigation bar */}
      <View style={styles.bottomNavigationContainer}>
        <BottomNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color:  colors.primary,
  },
  addButton: {
    backgroundColor: colors.purpule,
    width: 180,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  subscriptionContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionDate: {
    fontSize: 14,
    color: '#888',
  },
  subscriptionPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default InvestmentHistory;
