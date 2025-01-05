import React from 'react';
import { View, StyleSheet } from 'react-native';

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.title} />
      
      <View style={styles.planCard}>
        <View style={styles.planHeader} />
        
        <View style={styles.planDetails}>
          <View style={styles.planName} />
          <View style={styles.planPrice} />
          <View style={styles.planTerm} />
        </View>

        <View style={styles.selectButton} />
      </View>

      <View style={styles.planCard}>
        <View style={styles.planHeader} />
        <View style={styles.planDetails}>
          <View style={styles.planName} />
          <View style={styles.planPrice} />
          <View style={styles.planTerm} />
        </View>
        <View style={styles.selectButton} />
      </View>

     
      <View style={styles.submitButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    width: '60%',
    height: 24,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 6,
  },
  planCard: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  planHeader: {
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  planDetails: {
    marginTop: 10,
  },
  planName: {
    width: '50%',
    height: 20,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
    borderRadius: 4,
  },
  planPrice: {
    width: '40%',
    height: 25,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
    borderRadius: 4,
  },
  planTerm: {
    width: '60%',
    height: 15,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
    borderRadius: 4,
  },
  selectButton: {
    height: 40,
    backgroundColor: '#E0E0E0',
    marginTop: 15,
    borderRadius: 8,
  },
  submitButton: {
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 30,
  },
});

export default SkeletonLoader;