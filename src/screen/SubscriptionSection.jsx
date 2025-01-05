// src/components/SubscriptionSection.js
import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CustomText from '../components/CustomText';
import { colors } from '../utils/colors';
import PropTypes from 'prop-types';
import SkeletonLoader from '../components/Skeleton';
import { useNavigation }  from '@react-navigation/native';


const SubscriptionSection = ({ 
  loading, 
  error, 
  subscriptionPlans, 
  
}) => {
const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText type='subheading'>Your Subscription</CustomText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SUBSCRIPTION')}
        >
          <CustomText style={styles.addButtonText}>Invest more</CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.subscriptionContainer}>
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <CustomText style={styles.errorText}>{error}</CustomText>
          ) : (
            subscriptionPlans.map((sub, index) => (
              <View key={index} style={styles.subscriptionCard}>
                <CustomText style={styles.subscriptionName}>{sub.name}</CustomText>
                <CustomText style={styles.subscriptionDate}>
                  Payment done: {sub.payment_done_on ? new Date(sub.payment_done_on).toLocaleDateString() : 'N/A'}
                </CustomText>
                <CustomText style={styles.subscriptionPrice}>Price: ${sub.price}</CustomText>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

SubscriptionSection.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  subscriptionPlans: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    payment_done_on: PropTypes.string,
    price: PropTypes.number.isRequired
  })),
  onAddPress: PropTypes.func.isRequired
};

SubscriptionSection.defaultProps = {
  error: null,
  subscriptionPlans: []
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: colors.purpule,
    width: 80,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    padding:2
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
  },
  subscriptionDate: {
    fontSize: 14,
    color: '#888',
  },
  subscriptionPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  }
});

export default SubscriptionSection;