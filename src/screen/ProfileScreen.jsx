import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { getSubscriptionPlan, getUserDetails } from '../apiService';
import PropTypes from 'prop-types';
import SkeletonLoader from '../components/Skeleton';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: 'Unknown User',
    email: 'No email available',
    phone: 'No phone number available',
    referralCode: 'No referral code available'  
  });
  const [selectedTab, setSelectedTab] = useState('account'); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserDetails();
        console.log("User Details Response:", response); 

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
        console.error("Error fetching user details:", error);
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

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={24} color={colors.primary} style={styles.icon} />
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );

  const handleShareReferralCode = async () => {
    try {
      await Share.share({
        message: `Use my referral code ${userInfo.referralCode} to join!`,
      });
    } catch (error) {
      console.error("Error sharing referral code:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInfo.name ? userInfo.name[0] : 'U'}</Text>
          </View>
          <Text style={styles.name}>{userInfo.name}</Text>
        </View>

        {loading ? ( 
          <SkeletonLoader />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <View style={styles.infoContainer}>
              <InfoItem icon="mail-outline" label="Email" value={userInfo.email} />
              <InfoItem icon="call-outline" label="Phone" value={userInfo.phone} />
              <InfoItem icon="gift-outline" label="Referral Code" value={userInfo.referralCode} />
              {/* Share Button for Referral Code */}
              <TouchableOpacity style={styles.shareButton} onPress={handleShareReferralCode}>
                <Text style={styles.shareButtonText}>Share Referral Code</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.subscriptionContainer}>
              <Text style={styles.sectionTitle}>Subscriptions</Text>
              {subscriptionPlans.map((sub, index) => (
                <View key={index} style={styles.subscriptionCard}>
                  <Text style={styles.subscriptionName}>{sub.name}</Text>
                  <Text style={styles.subscriptionDate}>
                    Purchased: {sub.payment_done_on ? new Date(sub.payment_done_on).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('SUBSCRIPTION')}
            >
              <Text style={styles.addButtonText}>ADD INVESTMENT</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

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
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
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
    marginRight: 15,
  },
  label: {
    fontSize: 14,
    color: '#888888',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
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
   subscriptionName:{
     fontSize :16 ,
     fontWeight:'bold'
   },

   subscriptionDate:{
     fontSize :14 ,
     color:'#888'
   },

   addButton:{
     backgroundColor :colors.primary ,
     padding :15 ,
     borderRadius :10 ,
     alignItems:'center' ,
     marginHorizontal :20 ,
     marginVertical :20
   },

   addButtonText:{
     color:'#FFFFFF' ,
     fontSize :16 ,
     fontWeight:'bold'
   },

   bottomNav:{
     flexDirection:'row' ,
     justifyContent:'space-around' ,
     padding :8 ,
     backgroundColor:'white' ,
     borderTopLeftRadius :20 ,
     borderTopRightRadius :20 ,
   },
   shareButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;