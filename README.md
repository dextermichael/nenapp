# Nen App - Hunter × Hunter Nen Type Discovery

An Expo React Native app that determines your Hunter × Hunter Nen type through MBTI personality analysis.

## Features

- **SSO Authentication**: Google & Apple sign-in via Firebase
- **MBTI Quiz Integration**: Devil.ai personality assessment
- **Nen Type Mapping**: Scientifically-backed MBTI to Nen type conversion
- **Aura Ritual**: 10-second meditation timer with animations
- **Water Divination**: Type-specific animated reveals
- **Nen Profile**: Detailed character info and ability suggestions
- **Share Feature**: Create and share your Nen type card

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and Android Emulator

### 2. Firebase Configuration

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication and configure sign-in providers:
   - **Google**: Enable Google Sign-In provider
   - **Apple**: Enable Apple Sign-In provider (iOS only)

3. For Expo managed workflow, configure Firebase:
   - Add your Firebase config to `app.json` or use environment variables
   - Update the web client ID in `services/authService.ts`:
   ```typescript
   GoogleSignin.configure({
     webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
   });
   ```

4. For production builds, you'll need to configure:
   - Google Services configuration via EAS Build
   - Apple Services configuration via app.json

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

Start the development server:

```bash
# Start Expo development server
npx expo start
```

Then choose your platform:

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web Browser
npx expo start --web
```

Or use the interactive menu in the terminal after running `npx expo start`.

### 5. Code Quality

Before committing changes, run:

```bash
# Lint and fix code issues
npx expo lint --fix
```

### 6. Building for Production

To create production builds, use EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Nen Type Mapping

The app uses the following MBTI to Nen type mappings:

- **Enhancer**: ExxP (Extraverted Perceivers)
- **Transmuter**: xNxP (Intuitive Perceivers) 
- **Conjurer**: ISxx (Introverted Sensors)
- **Specialist**: IxTx (Introverted Thinkers)
- **Manipulator**: xSxJ (Sensing Judgers)
- **Emitter**: ExxJ (Extraverted Judgers)

## Project Structure

```
app/
├── (tabs)/          # Tab navigation
├── login.tsx        # Authentication screen
├── quiz.tsx         # MBTI quiz integration
├── ritual.tsx       # Aura focusing ritual
├── divination.tsx   # Water divination animation
├── profile.tsx      # Nen type results
└── _layout.tsx      # App navigation

services/
├── authService.ts   # Firebase authentication
└── nenTypeService.ts # MBTI mapping & Nen profiles
```

## Troubleshooting

### Firebase Auth Issues
- Verify web client ID is set in `services/authService.ts`
- Check that Google and Apple auth providers are enabled in Firebase console
- For production builds, ensure Firebase configuration is properly set up in EAS Build

### WebView Issues
- Devil.ai integration may require internet connectivity
- Some MBTI quiz sites may block WebView access
- Ensure `expo-web-browser` is properly configured for OAuth flows

### Development Issues
- Run `expo doctor` to check for common configuration problems
- Clear Expo cache: `expo r -c` or `npx expo start --clear`
- Ensure you're using compatible Expo SDK versions for all dependencies

### Build Issues
- Use EAS Build for production builds instead of `expo build`
- Check `app.json` configuration for proper permissions and Firebase setup
- Ensure all required credentials are configured in EAS

## Phase 2 Roadmap

- Lottie animations for enhanced visual effects
- Sound effects for ritual and divination
- Dark aura theme improvements
- Social features (friend comparisons)
- Advanced sharing options

## Contributing

This app is based on the Hunter × Hunter anime/manga series. All Nen types and character references are from the original work by Yoshihiro Togashi.
