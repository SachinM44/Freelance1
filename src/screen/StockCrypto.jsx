import React, { useState, useEffect } from 'react';
import { colors } from "../utils/colors";
import { View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CustomText from '../components/CustomText';
import WaveAnimation from '../components/WaveAnimation';
import { TrendingUp, TrendingDown } from 'lucide-react-native';



const StocksAndCrypto = () => {
    const [prices, setPrices] = useState({
      AAPL: { price: 0, change: 0 },
      BTC: { price: 0, change: 0 },
      ETH: { price: 0, change: 0 }
    });
    const [loading, setLoading] = useState(true);
  
    const fetchPrices = async () => {
      try {
        const symbols = ['AAPL', 'BTC-USD', 'ETH-USD'];
        const requests = symbols.map(symbol => 
          axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
            params: {
              range: '1d',
              interval: '1m',
            },
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
        );
  
        const responses = await Promise.all(requests);
        
        const newPrices = {
          AAPL: { price: 0, change: 0 },
          BTC: { price: 0, change: 0 },
          ETH: { price: 0, change: 0 }
        };
  
        responses.forEach((response, index) => {
          const data = response.data.chart.result[0];
          const quote = data.indicators.quote[0];
          const prices = quote.close;
          const currentPrice = prices[prices.length - 1];
          const openPrice = prices[0];
          const priceChange = ((currentPrice - openPrice) / openPrice) * 100;
  
          const symbol = symbols[index].replace('-USD', '');
          newPrices[symbol] = {
            price: currentPrice,
            change: priceChange
          };
        });
  
        setPrices(newPrices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);
  
    const formatPrice = (price) => {
      if (!price) return '$0.00';
      return `$${price.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    };
  
    const formatChange = (change) => {
      if (!change) return '0.00%';
      const isPositive = change >= 0;
      return `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
    };
  
    if (loading) {
      return (
        <View style={styles.card2}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      );
    }

    const renderAssetRow = (symbol, name, price, change) => (
        <View style={styles.assetRow}>
          <View style={styles.assetInfo}>
            <CustomText style={styles.assetSymbol}>{symbol}</CustomText>
            <CustomText style={styles.assetName}>{name}</CustomText>
          </View>
          <View style={styles.priceInfo}>
            <CustomText style={styles.price}>
              ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CustomText>
            <View style={styles.changeContainer}>
              {change >= 0 ? 
                <TrendingUp size={16} color="#4CAF50" /> : 
                <TrendingDown size={16} color="#FF5252" />
              }
              <CustomText style={[
                styles.changeText,
                { color: change >= 0 ? '#4CAF50' : '#FF5252' }
              ]}>
                {change?.toFixed(2)}%
              </CustomText>
            </View>
          </View>
        </View>
      );
  
      return (
        <View style={styles.card}>
        <View style={styles.headerRow}>
            <CustomText style={styles.cardTitle}>STOCKS & CRYPTO</CustomText>
            {/* <WaveAnimation /> */}
        </View>
          
        {renderAssetRow('AAPL', 'Apple Inc.', prices.AAPL.price, prices.AAPL.change)}
       
        {renderAssetRow('BTC', 'Bitcoin', prices.BTC.price, prices.BTC.change)}
       
        {renderAssetRow('ETH', 'Ethereum', prices.ETH.price, prices.ETH.change)}
        </View>
      );
};

const styles = {
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    card: {
      backgroundColor: '#000050',
      borderRadius: 12,
      padding: 16,
      margin: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',  // Changed to white
     
    },
    divider: {
      height: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: 12,
    },
    assetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    assetInfo: {
      flex: 1,
    },
    assetSymbol: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',  // Changed to white
      marginBottom: 4,
    },
    assetName: {
      fontSize: 14,
      color: '#FFFFFF',  // Changed to white
    },
    priceInfo: {
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',  // Changed to white
      marginBottom: 4,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    changeText: {
      fontSize: 14,
      fontWeight: '500',
    }
  };
  
  export default StocksAndCrypto;