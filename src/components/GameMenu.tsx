// src/components/GameMenu.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GameMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <>
      {/* ☰ Floating menu button — top right corner */}
      <TouchableOpacity style={styles.menuBtn} onPress={() => setVisible(true)}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Popup menu */}
      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menuBox}>
            <Text style={styles.menuTitle}>Menu</Text>

            <TouchableOpacity
              style={styles.item}
              onPress={() => { setVisible(false); navigation.navigate('Home'); }}
            >
              <Text style={styles.itemText}>🏠 Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => { setVisible(false); navigation.navigate('About'); }}
            >
              <Text style={styles.itemText}>ℹ️ About</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => { setVisible(false); navigation.navigate('Feedback'); }}
            >
              <Text style={styles.itemText}>📝 Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.item, styles.closeItem]}
              onPress={() => setVisible(false)}
            >
              <Text style={[styles.itemText, { color: '#e53' }]}>✕ Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 99,
    backgroundColor: '#3b5bdb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  menuIcon: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  menuBox: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 20, width: 240, elevation: 8,
  },
  menuTitle: {
    fontSize: 18, fontWeight: 'bold',
    marginBottom: 12, textAlign: 'center', color: '#333',
  },
  item: {
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  closeItem: { borderBottomWidth: 0 },
  itemText: { fontSize: 16, color: '#333' },
});

export default GameMenu;