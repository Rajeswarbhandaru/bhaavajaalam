// src/screens/GameScreen.tsx
import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useBackHandler from '../hooks/useBackHandler';
import GameMenu from '../components/GameMenu';

const GameScreen = () => {
  const navigation = useNavigation<any>();

  // Back button: asks before leaving game
  useBackHandler(() => {
    Alert.alert(
      'Leave Game?',
      'Your progress will be lost.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Leave', onPress: () => navigation.navigate('Home') },
      ]
    );
    return true;
  });

  return (
    <View style={styles.container}>

      {/* Floating menu — always visible on top */}
      <GameMenu />

      {/* ✏️ YOUR EXISTING GAME CODE GOES HERE */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default GameScreen;