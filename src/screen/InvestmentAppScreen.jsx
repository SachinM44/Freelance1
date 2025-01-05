import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, RefreshControl } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { userHome } from '../apiService';
import { Card } from 'react-native-paper';
import SkeletonLoader from '../components/Skeleton';
import CustomText from '../components/CustomText';
import { Logger } from '../config/sentryLoggin';
import WaveAnimation from '../components/WaveAnimation';
import StocksAndCrypto from './StockCrypto';

const InvestmentApp = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [backendData, setBackendData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const response = await userHome();
      console.info("API respnse", response.responseData)
      setBackendData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data from backend');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (!backendData) {
    return <SkeletonLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.purpule}
            colors={[colors.purpule]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <Header navigation={navigation} />
        <PortfolioCard portfolio={backendData.portfolio} total_invested={backendData.invested} earnings_in_percentage={backendData.earnings_in_percentage} navigation={navigation} />
        <InvestmentSummary tradesPerformed={backendData.trades_performed} total_invested={backendData.invested} earnings_in_percentage={backendData.earnings_in_percentage} />
        <StocksAndCrypto />
        <InvestmentDetails graph={backendData.graph} />
      </ScrollView>
      <BottomNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} navigation={navigation} />
    </View>
  );
};

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <CustomText style={styles.userName}>Hello Max</CustomText>
    <TouchableOpacity>
      <Icon name="bell-outline" size={24} color="white" />
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
    <CustomText style={{ color, fontWeight: 'bold', fontSize: 18 }}>
      {triangle} {percentage}
    </CustomText>
  );
};

const PortfolioCard = ({ portfolio,total_invested, earnings_in_percentage,navigation }) => (
  <View style={styles.card}>
    <CustomText type="heading" style={styles.sectionTitleTop}>MY PORTFOLIO</CustomText>
    <CustomText type="heading" style={styles.totalInvestment}>$ {portfolio}</CustomText>
    <View style={styles.investmentDetails}>
      <View style={styles.investedSection}>
        <CustomText style={styles.investedAmount}>$ {total_invested}</CustomText>
        <CustomText style={styles.investedLabel}>INVESTED</CustomText>
      </View>
      <View style={styles.changeSection}>
        {renderPercentage(earnings_in_percentage)}
        <CustomText style={styles.changeLabel}>Change %</CustomText>
      </View>
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('SUBSCRIPTION')} style={styles.addButton}>
      <CustomText style={styles.addButtonText}>ADD INVESTMENT</CustomText>
    </TouchableOpacity>
  </View>
);

PortfolioCard.propTypes = {
  portfolio: PropTypes.number.isRequired,
  navigation: PropTypes.object.isRequired,
};

const InvestmentSummary = ({ tradesPerformed , total_invested, earnings_in_percentage }) => (
  <View style={styles.card}>
    <View style={styles.investmentDetails}>
      <View style={styles.investedSection}>
        <CustomText style={styles.tradesPerformed1}>INVESTED</CustomText>
        <CustomText style={styles.tradesPerformed1}>$ {total_invested}</CustomText>
      </View>
      <View style={styles.imageContainer}>
        <WaveAnimation />
      </View>
      <View style={styles.changeSection}>
        <CustomText style={styles.tradesPerformed1}>TRADES PERFORMED :</CustomText>
        <CustomText style={styles.tradesPerformed1}>{tradesPerformed}</CustomText>
      </View>
    </View>
    {renderPercentage(earnings_in_percentage)}
  </View>
);

InvestmentSummary.propTypes = {
  tradesPerformed: PropTypes.number.isRequired,
};

// const StocksAndCrypto = () => (
//   <View style={styles.card2}>
//     <View style={styles.rowAligned}>
//       <CustomText style={styles.sectionTitle2}>STOCKS & CRYPTO</CustomText>
//       <Image source={require('../assets/newimg-removebg-preview.png')} style={styles.tsContainer2} />
//     </View>
//   </View>
// );

const InvestmentDetails = ({graph}) => {


  const updatedData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      data: graph.map(item => item.amount),
    }],
  };

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.graphContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <BarChart
            data={updatedData}
            width={700}
            height={260}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: colors.purpule,
              backgroundGradientFrom: colors.purpule,
              backgroundGradientTo: colors.purpule,
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
            formatYLabel={(value) => `${parseInt(value, 10) / 1000}k`}
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
        <Icon
          name={icon}
          size={24}
          color={selectedTab === icon ? colors.purpule : 'gray'}
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
  card2: {
    backgroundColor: '#000050',
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
    color: 'white',
    marginLeft: 10,
  },
  totalInvestment: {
    paddingLeft: 140,
    fontSize: 20,
  },
  sectionTitleTop: {
    paddingLeft: 111,
    fontSize: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 0,
    paddingLeft: 0,
    fontSize: 18,
    marginBottom: 0,
  },
  sectionTitle2: {
    marginTop: 0,
    color: 'white',
    paddingLeft: 0,
    fontSize: 18,
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
    backgroundColor: colors.purpule,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
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
    height: 50,
    width: 50,
  },
  tsContainer2: {
    height: 50,
    width: 50,
    marginLeft: 10,
  },
  rowAligned: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tradesPerformed1: {
    color: colors.primary,
    fontSize: 10,
  },
  tradesPerformed2: {
    fontSize: 10,
    color: colors.primary,
  },
  tradesPerformed3: {
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
    backgroundColor: colors.purpule,
  },
  graphContainer: {
    height: 280,
    padding: 10,
    borderRadius: 16,
  },
});

export default InvestmentApp;