// src/components/LogoHeader.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const LogoHeader = () => (
  <View style={styles.wrapper}>
    <Image
      source={require('../assets/logo.png')} // 👈 update your actual path
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',   // centers vertically
    alignItems: 'center',        // centers horizontally
    paddingVertical: 20,
  },
  logo: {
    width: width * 0.65,         // 65% of screen width — adjust as needed
    height: width * 0.65,
  },
});

export default LogoHeader;