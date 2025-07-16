import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  constructor() {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // Add your web client ID here
    });
  }

  async signInWithGoogle(): Promise<User | null> {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      return this.formatUser(userCredential.user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return null;
    }
  }

  async signInWithApple(): Promise<User | null> {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const appleCredential = auth.AppleAuthProvider.credential(
          credential.identityToken,
          credential.authorizationCode
        );
        
        const userCredential = await auth().signInWithCredential(appleCredential);
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
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  }

  getCurrentUser(): User | null {
    const user = auth().currentUser;
    return user ? this.formatUser(user) : null;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth().onAuthStateChanged((user) => {
      callback(user ? this.formatUser(user) : null);
    });
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