// src/screens/FeedbackScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import useBackHandler from '../hooks/useBackHandler';

type Category = 'Bug' | 'Suggestion' | 'Game Issue' | 'Other';
const CATEGORIES: Category[] = ['Bug', 'Suggestion', 'Game Issue', 'Other'];

const FeedbackScreen = () => {
  useBackHandler(); // back button works properly here too

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<Category>('Suggestion');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      Alert.alert('Missing Fields', 'Please enter your name and message.');
      return;
    }
    setLoading(true);
    try {
      // 👇 Replace this with your actual API endpoint or email service
      await fetch('https://your-api.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, category, message }),
      });
      Alert.alert('Thank You!', 'Your feedback has been submitted.');
      setName(''); setEmail(''); setMessage(''); setCategory('Suggestion');
    } catch {
      Alert.alert('Error', 'Could not submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 Feedback</Text>
      <Text style={styles.subtitle}>Help us improve Bhāva Tech App</Text>

      <Text style={styles.label}>Your Name *</Text>
      <TextInput style={styles.input} value={name}
        onChangeText={setName} placeholder="Enter your name" />

      <Text style={styles.label}>Email (optional)</Text>
      <TextInput style={styles.input} value={email}
        onChangeText={setEmail} placeholder="your@email.com"
        keyboardType="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.catRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catBtn, category === cat && styles.catActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.catText, category === cat && styles.catActiveText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Message *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        placeholder="Describe the issue or suggestion..."
        multiline numberOfLines={5} textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.7 }]}
        onPress={handleSubmit} disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitText}>Submit Feedback</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3b5bdb', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginTop: 14, marginBottom: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, color: '#333',
  },
  textArea: { height: 120 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff',
  },
  catActive: { backgroundColor: '#3b5bdb', borderColor: '#3b5bdb' },
  catText: { fontSize: 13, color: '#555' },
  catActiveText: { color: '#fff', fontWeight: '600' },
  submitBtn: {
    marginTop: 24, backgroundColor: '#3b5bdb',
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default FeedbackScreen;