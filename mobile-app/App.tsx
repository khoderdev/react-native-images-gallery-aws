import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ImageGalleryScreen from './src/screens/ImageGalleryScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

const Stack = createStackNavigator();

// Create deep linking configuration with both custom scheme and universal links
const prefix = Linking.createURL('/');

const linking = {
  prefixes: [
    prefix,
    'imagesgallery://',
    'https://imagesgallery.app',
    'http://imagesgallery.app'
  ],
  config: {
    screens: {
      Gallery: '',
      Profile: {
        path: '/profile/:userId',
        parse: {
          userId: (userId: string) => userId,
        },
      },
    },
  },
};

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Gallery" component={ImageGalleryScreen} />
          <Stack.Screen name="Profile" component={UserProfileScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 