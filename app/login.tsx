import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import authService from '../services/authService';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      if (user) {
        router.replace('/quiz');
      } else {
        Alert.alert('Sign-in failed', 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const user = await authService.signInWithApple();
      if (user) {
        router.replace('/quiz');
      } else {
        Alert.alert('Sign-in failed', 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Apple');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Your Nen Type</Text>
        <Text style={styles.subtitle}>
          Unlock the power within through the ancient art of Nen
        </Text>
      </View>

      <View style={styles.authButtons}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        {AppleAuthentication.isAvailableAsync() && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}
      </View>

      <Text style={styles.disclaimer}>
        By continuing, you agree to discover your Nen affinity through MBTI analysis
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  authButtons: {
    gap: 16,
    marginBottom: 40,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285f4',
  },
  appleButton: {
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});