# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npx expo start

# Platform-specific development
npx expo start --ios        # iOS simulator
npx expo start --android    # Android emulator
npx expo start --web        # Web browser

# Code quality
npx expo lint               # ESLint validation

# Development Workflow
After making any changes to the code:
1. Format the code: `npx expo lint --fix`
2. Ensure all code has no warnings or errors
```

## Project Architecture

This is a React Native Expo app built with TypeScript that determines Hunter × Hunter Nen types through MBTI personality analysis.

### Core Architecture Patterns

- **File-based routing**: Uses Expo Router with `app/` directory structure
- **Stack navigation**: Main app uses `Stack` navigator with hidden headers
- **Authentication flow**: Firebase Auth with Google/Apple SSO integration
- **Service layer pattern**: Business logic separated into `services/` directory

### Navigation Structure

The app follows this navigation flow:

1. `login.tsx` - Authentication screen (Google/Apple SSO)
2. `quiz.tsx` - MBTI personality quiz integration
3. `ritual.tsx` - 10-second meditation timer
4. `divination.tsx` - Water divination animation reveal
5. `profile.tsx` - Final Nen type results and sharing
6. `(tabs)/` - Tab navigation for main app features

### Key Services

- **`authService.ts`**: Firebase authentication with Google/Apple SSO
  - Requires web client ID configuration in Firebase console
  - Handles auth state persistence across app launches
- **`nenTypeService.ts`**: Core business logic for MBTI to Nen type mapping
  - Uses regex patterns to map 16 MBTI types to 6 Nen categories
  - Provides character profiles, traits, and suggested abilities
  - Implements water divination result logic

### Firebase Setup Requirements

Before development, configure Firebase:

1. Add `google-services.json` to `android/app/`
2. Add `GoogleService-Info.plist` to `ios/YourApp/`
3. Update web client ID in `services/authService.ts:16`
4. Enable Google/Apple authentication providers in Firebase console

### TypeScript Configuration

- Strict mode enabled with path aliases (`@/*` maps to root)
- Expo TypeScript base configuration
- Typed routes experimental feature enabled

### Platform Considerations

- iOS requires `pod install` for native dependencies
- Web uses Metro bundler with static output
- Android uses edge-to-edge display and adaptive icons
- New Architecture enabled for React Native performance
