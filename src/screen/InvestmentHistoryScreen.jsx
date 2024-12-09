import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { getSubscriptionPlan } from '../apiService';
import PropTypes from 'prop-types';
import SkeletonLoader from '../components/Skeleton';
const InvestmentHistory = () => {
  const navigation = useNavigation();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('account');
  useEffect(() => {
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.subscriptionContainer}>
          <Text style={styles.sectionTitle}>Subscriptions</Text>
          {loading ? (
            <SkeletonLoader /> 
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            subscriptionPlans.map((sub, index) => (
              <View key={index} style={styles.subscriptionCard}>
                <Text style={styles.subscriptionName}>{sub.name}</Text>
                <Text style={styles.subscriptionDate}>
                  Purchased: {sub.payment_done_on ? new Date(sub.payment_done_on).toLocaleDateString() : 'N/A'}
                </Text>
                <Text style={styles.subscriptionPrice}>
                  Price: ₹{sub.price}
                </Text>
              </View>
            ))
          )}
        </View>
        {!loading && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('SUBSCRIPTION')}
          >
            <Text style={styles.addButtonText}>ADD INVESTMENT</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom navigation bar */}
      <View style={styles.bottomNavigationContainer}>
        <BottomNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </View>
    </View>
  );
};

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
    backgroundColor: '#F0F0F0',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  subscriptionContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
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
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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