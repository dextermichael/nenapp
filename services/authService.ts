import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { getAuth, initializeFirebase } from './firebaseConfig';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  private auth: any;

  constructor() {
    // Initialize Firebase
    initializeFirebase();
    this.auth = getAuth();

    // Configure Google Sign-In only on native platforms
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!, // Add your web client ID here
      });
    }
  }

  async signInWithGoogle(): Promise<User | null> {
    if (Platform.OS === 'web') {
      try {
        const { GoogleAuthProvider, signInWithPopup } = require('firebase/auth');
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.auth, provider);
        return this.formatUser(result.user);
      } catch (error) {
        console.error('Google Sign-In Error (Web):', error);
        return null;
      }
    } else {
      try {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Get the user's ID token
        const signInResponse = await GoogleSignin.signIn();
        const idToken = (signInResponse as any).idToken;

        if (!idToken) {
          throw new Error('Google Sign-In failed: No idToken returned.');
        }

        // Create a Google credential with the token
        const auth = require('@react-native-firebase/auth').default;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        // Sign-in the user with the credential
        const userCredential = await this.auth.signInWithCredential(googleCredential);
        
        return this.formatUser(userCredential.user);
      } catch (error) {
        console.error('Google Sign-In Error (Native):', error);
        return null;
      }
    }
  }

  async signInWithApple(): Promise<User | null> {
    if (Platform.OS === 'web') {
      console.log('Apple Sign-In not supported on web');
      return null;
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const auth = require('@react-native-firebase/auth').default;
        const appleCredential = auth.AppleAuthProvider.credential(
          credential.identityToken,
          credential.authorizationCode
        );
        
        const userCredential = await this.auth.signInWithCredential(appleCredential);
        return this.formatUser(userCredential.user);
      }
      
      return null;
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        const { signOut } = require('firebase/auth');
        await signOut(this.auth);
      } else {
        await this.auth.signOut();
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  }

  getCurrentUser(): User | null {
    const user = this.auth.currentUser;
    return user ? this.formatUser(user) : null;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    if (Platform.OS === 'web') {
      const { onAuthStateChanged } = require('firebase/auth');
      return onAuthStateChanged(this.auth, (user) => {
        callback(user ? this.formatUser(user) : null);
      });
    } else {
      return this.auth.onAuthStateChanged((user) => {
        callback(user ? this.formatUser(user) : null);
      });
    }
  }

  private formatUser(firebaseUser: any): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
  }
}

export default new AuthService();