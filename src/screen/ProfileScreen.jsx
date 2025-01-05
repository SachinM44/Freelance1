import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { getSubscriptionPlan, getUserDetails, getUserSubscribedPlans, getWithdrawal } from '../apiService';
import SkeletonLoader from '../components/Skeleton';
import BottomNavigation from '../components/BottomNavigation';
import CustomText from '../components/CustomText';
import SubscriptionSection from './SubscriptionSection';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: 'Unknown User',
    email: 'No email available',
    phone: 'No phone number available',
    referralCode: 'No referral code available',
  });
  const [selectedTab, setSelectedTab] = useState('account');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await getUserDetails();
        const fetchedEmail = response.user?.email || 'No email available';
        const fetchedName = response.user?.username || 'Unknown User';
        const fetchedPhone = response.user?.phone || 'No phone number available';
        const fetchedReferralCode = response.user?.referral_code || 'No referral code available';

        setUserInfo({
          name: fetchedName,
          email: fetchedEmail,
          phone: fetchedPhone,
          referralCode: fetchedReferralCode,
        });
      } catch (error) {
        setError('Failed to fetch user details. Please try again later.');
      }finally{
        setLoading(false)
      }
    };

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

    fetchUserData();
    fetchSubscriptionPlans();
  }, []);

  const fetchUserSubscribedPlans = async () => {
    try {
      setLoading(true);
      const subscriptions = await getUserSubscribedPlans();
      setUserSubscriptions(subscriptions || []);
    } catch (error) {
      setError('Failed to fetch subscribed plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareReferralCode = async () => {
    try {
      await Share.share({
        message: `Use my referral code ${userInfo.referralCode} to join!`,
      });
    } catch (error) {
      console.error('Error sharing referral code:', error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const userSubscriberId = userSubscriptions[0]?.id; // Example: Fetch the first subscription ID
      if (!userSubscriberId) {
        Alert.alert('No subscriptions found for withdrawal.');
        return;
      }
      const response = await getWithdrawal(userSubscriberId);
      Alert.alert('Withdrawal Success', `Amount withdrawn: ${response.amount}`);
    } catch (error) {
      Alert.alert('Withdrawal Failed', 'Please try again later.');
      console.error('Error processing withdrawal:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      fetchUserSubscribedPlans();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <CustomText style={styles.avatarText}>{userInfo.name ? userInfo.name[0] : 'U'}</CustomText>
        </View>
        <CustomText style={styles.name}>{userInfo.name}</CustomText>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <CustomText style={styles.errorText}>{error}</CustomText>
        ) : (
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="mail-outline" size={24} color={colors.primary} style={styles.icon} />
              <View>
                <CustomText style={styles.label}>Email</CustomText>
                <CustomText style={styles.value}>{userInfo.email}</CustomText>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="call-outline" size={24} color={colors.primary} style={styles.icon} />
              <View>
                <CustomText style={styles.label}>Phone</CustomText>
                <CustomText style={styles.value}>{userInfo.phone}</CustomText>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareReferralCode}>
                <CustomText style={styles.shareButtonText}>Share Referral Code</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={handleWithdrawal}>
                <CustomText style={styles.shareButtonText}>Withdrawal</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <SubscriptionSection
             loading={loading}
             error={error}
             subscriptionPlans={subscriptionPlans}
             />  
      </ScrollView>

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
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.purpule, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  shareButton: {
    backgroundColor: colors.purpule, 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    paddingLeft:10,
    fontWeight: 'bold',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.purpule, 
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom:10,
    borderRadius: 5, 
    paddingLeft:0,
    marginRight: 12, 
    width: 120,
    height: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginLeft: 15,
    marginRight: 15, 
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1, // Ensures the text takes up the remaining space
    paddingLeft: 10, // Ensures the text doesn't get too close to the left edge
  },
  subscriptionContainer: {
    padding: 10,
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
  bottomNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
});

export default ProfileScreen;
