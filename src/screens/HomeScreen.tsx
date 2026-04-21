// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useBackHandler from '../hooks/useBackHandler';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  useBackHandler();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>

      {/* LOGO — centered, bigger size */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../assets/logo.png')} // 👈 your logo path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Bhāva Tech</Text>
      <Text style={styles.subtitle}>Brain & Learning Games</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.btn}
        onPress={() => navigation.navigate('Game')}>
        <Text style={styles.btnText}>🎮 Play Games</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.btnSecondary]}
        onPress={() => navigation.navigate('About')}>
        <Text style={styles.btnText}>ℹ️ About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.btnSecondary]}
        onPress={() => navigation.navigate('Feedback')}>
        <Text style={styles.btnText}>📝 Feedback</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: width * 0.55,
    height: width * 0.55,
  },
  title: {
    fontSize: 28, fontWeight: 'bold',
    color: '#3b5bdb', marginBottom: 4,
  },
  subtitle: {
    fontSize: 15, color: '#888',
    marginBottom: 32,
  },
  btn: {
    backgroundColor: '#3b5bdb', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 32,
    width: '100%', alignItems: 'center',
    marginBottom: 12,
  },
  btnSecondary: { backgroundColor: '#748ffc' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default HomeScreen;