import { Platform } from 'react-native';

// Firebase web configuration
const firebaseWebConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let firebaseApp: any = null;

// Initialize Firebase based on platform
export const initializeFirebase = () => {
  if (Platform.OS === 'web') {
    // Web platform - use Firebase JS SDK
    const { initializeApp } = require('firebase/app');
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseWebConfig);
    }
    return firebaseApp;
  } else {
    // Native platforms (iOS/Android) - use React Native Firebase
    const { default: app } = require('@react-native-firebase/app');
    return app();
  }
};

export const getAuth = () => {
  if (Platform.OS === 'web') {
    const { getAuth } = require('firebase/auth');
    return getAuth(firebaseApp);
  } else {
    const auth = require('@react-native-firebase/auth').default;
    return auth();
  }
};

export default firebaseWebConfig;