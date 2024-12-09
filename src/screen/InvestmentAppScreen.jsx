import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { userHome } from '../apiService';
import { Card } from 'react-native-paper';
import SkeletonLoader from '../components/Skeleton';

const InvestmentApp = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [backendData, setBackendData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userHome();
        console.log('Backend response:', response);
        setBackendData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data from backend');
      }
    };
    fetchData();
  }, []);

  if (!backendData) {
    return <SkeletonLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header navigation={navigation} />
        <PortfolioCard portfolio={backendData.portfolio} navigation={navigation} />
        <InvestmentSummary tradesPerformed={backendData.trades_performed} />
        <StocksAndCrypto />
        <InvestmentDetails />
      </ScrollView>
      <BottomNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} navigation={navigation} />
    </View>
  );
};

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <Text style={styles.userName}>Hello Max</Text>
    <TouchableOpacity>
      <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

Header.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const renderPercentage = (percentage) => {
  const isPositive = parseFloat(percentage) > 0;
  const color = isPositive ? 'green' : 'red';
  const triangle = isPositive ? '▲' : '▼';

  return (
    <Text style={{ color, fontWeight: 'bold', fontSize: 18 }}>
      {triangle} {percentage}
    </Text>
  );
};

const PortfolioCard = ({ portfolio, navigation }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitleTop}>MY PORTFOLIO</Text>
    <Text style={styles.totalInvestment}>₹ {portfolio}</Text>
    <View style={styles.investmentDetails}>
      <View style={styles.investedSection}>
        <Text style={styles.investedAmount}>₹ 10,000</Text>
        <Text style={styles.investedLabel}>INVESTED</Text>
      </View>
      <View style={styles.changeSection}>
        {renderPercentage('-11.05%')}
        <Text style={styles.changeLabel}>Change %</Text>
      </View>
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('SUBSCRIPTION')} style={styles.addButton}>
      <Text style={styles.addButtonText}>ADD INVESTMENT</Text>
    </TouchableOpacity>
  </View>
);

PortfolioCard.propTypes = {
  portfolio: PropTypes.number.isRequired,
  navigation: PropTypes.object.isRequired,
};

const InvestmentSummary = ({ tradesPerformed }) => (
  <View style={styles.card}>
    <View style={styles.investmentDetails}>
      <View style={styles.investedSection}>
        <Text style={styles.investmentLabel}>INVESTED</Text>
        <Text style={styles.investedAmount}>₹ 10,000</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/newimg-removebg-preview.png')} style={styles.tsContainer1} />
      </View>
      <View style={styles.changeSection}>
        <Text style={styles.tradesPerformed1}>TRADES </Text>
        <Text style={styles.tradesPerformed2}> PERFORMED :</Text>
        <Text style={styles.tradesPerformed3}>{tradesPerformed}</Text>
      </View>
    </View>
    {renderPercentage('-11.05%')}
  </View>
);

InvestmentSummary.propTypes = {
  tradesPerformed: PropTypes.number.isRequired,
};

const StocksAndCrypto = () => (
  <View style={styles.card}>
    <View style={styles.rowAligned}>
      <Text style={styles.sectionTitle}>STOCKS & CRYPTO</Text>
      <Image source={require('../assets/newimg-removebg-preview.png')} style={styles.tsContainer2} />
    </View>
  </View>
);

const InvestmentDetails = () => {
 
  const updatedData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [10000, 20000, 30000, 40000, 50000, 60000], 
      },
    ],
  };

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.graphContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <BarChart
            data={updatedData}
            width={800} 
            height={260}
            yAxisLabel="₹"
            yAxisSuffix=""
            yAxisInterval={1} 
            chartConfig={{
              backgroundColor: colors.primary,
              backgroundGradientFrom: colors.primary,
              backgroundGradientTo: colors.primary,
              decimalPlaces: 0, 
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              paddingTop: 16,
              marginVertical: 6,
              borderRadius: 16,
              paddingHorizontal: 6,
            }}
            fromZero 
          />
        </ScrollView>
      </View>
    </Card>
  );
};
const BottomNavigation = ({ selectedTab, setSelectedTab, navigation }) => (
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

BottomNavigation.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    margin: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  totalInvestment: {
    paddingLeft: 120,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitleTop: {
    paddingLeft: 111,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop:0,
    paddingLeft: 0,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  investmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investedSection: {
    alignItems: 'center',
  },
  investedAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  investedLabel: {
    fontSize: 12,
    color: 'gray',
  },
  changeSection: {
    alignItems: 'center',
  },
  changeLabel: {
    fontSize: 12,
    color: 'gray',
  },
  imageContainer: {
    justifyContent: 'center',
  },
  tsContainer1: {
    height: 100,
    width: 100,
    height: 50,
    width: 50,
  },
  tsContainer2: {
    height: 50,
    width: 50,
    marginLeft: 10,  
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowAligned: {
    flexDirection: 'row',   
    justifyContent: 'space-between', 
    alignItems: 'center',  
    paddingHorizontal: 10,  
  },
  tradesPerformed1: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  tradesPerformed2: {
    fontSize: 10,
    color: colors.primary,
  },
  tradesPerformed3: {
    fontWeight: 'bold',
    fontSize: 30,
    color: colors.primary,
  },
  cardContainer: {
    margin: 16,  
    borderRadius: 16,  
    elevation: 4,  
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: colors.primary,
  },
  graphContainer: {
    height: 280,  
    padding: 10,  
    borderRadius: 16,
  },
});

export default InvestmentApp;