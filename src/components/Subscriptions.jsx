import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import SkeletonLoader from '../components/Skeleton';
import { getSubscriptionPlan } from '../apiService';
import PropTypes from 'prop-types';

const Subscriptions = ({ onAddPress }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Your Subscription</Text>
        {onAddPress && (
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.subscriptionContainer}>
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            subscriptionPlans.map((sub, index) => (
              <View key={index} style={styles.subscriptionCard}>
                <Text style={styles.subscriptionName}>{sub.name}</Text>
                <Text style={styles.subscriptionDate}>
                  Created: {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                </Text>
                <Text style={styles.subscriptionPrice}>Price: ₹{sub.price}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

Subscriptions.propTypes = {
  onAddPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#6A0DAD',
    width: 40,
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
    paddingBottom: 20,
  },
  subscriptionContainer: {
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
});

export default Subscriptions;
