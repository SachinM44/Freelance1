import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

const WaveAnimation = () => {
  // Create animated values for multiple waves
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (value) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start animations with different delays
    Animated.stagger(200, [
      createAnimation(wave1),
      createAnimation(wave2),
      createAnimation(wave3),
    ]).start();
  }, []);

  const waves = [wave1, wave2, wave3].map((wave, index) => ({
    transform: [
      {
        scaleY: wave,
      },
    ],
    opacity: wave,
  }));

  return (
    <View style={styles.container}>
      {waves.map((animatedStyle, index) => (
        <Animated.View
          key={index}
          style={[styles.wave, animatedStyle]}
        />
      ))}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 6,
  },
  wave: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
};

export default WaveAnimation;