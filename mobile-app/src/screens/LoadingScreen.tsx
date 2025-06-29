import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
});
