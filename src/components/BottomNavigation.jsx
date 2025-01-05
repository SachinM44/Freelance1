import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { colors } from '../utils/colors';

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
          <Icon
            name={icon}
            size={24}
            color={selectedTab === icon ? colors.purpule : 'gray'}
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});

export default BottomNavigation;