# Project Memory for OpenCode

## Muslim Utility App

### Overview
Cross-platform React Native app (iOS, Android, Web) built with Expo for Islamic daily utilities.

### Tech Stack
- React Native + Expo
- TypeScript
- React Navigation (stack navigation)
- Zustand (state management)
- `adhan` library for prayer times
- Expo Location & Sensors APIs

### Project Structure
```
src/
  navigation/    AppNavigator.tsx
  screens/       PrayerTimesScreen, QiblaCompassScreen, QuranReaderScreen, MemorizationScreen
  store/         useAppStore.ts (Zustand)
  utils/         prayerTimes.ts, qibla.ts
  data/          quran-sample.json
assets/
App.tsx          Main entry point
index.ts         Entry for Expo
package.json     Dependencies & scripts
app.json         Expo config
tsconfig.json    TypeScript config
```

### Key Dependencies (from package.json)
- expo
- react-native
- @react-navigation/native, stack
- zustand
- adhan
- expo-location, expo-sensors

### Development Commands
```bash
npm install
npm start        # Start Expo dev server (then i/a/w for iOS/Android/Web)
```

### Notes
- Requires location permissions for prayer times and qibla
- Quran data currently sample only; expandable
- Memorization progress persisted via AsyncStorage
- Future: full Quran API integration, audio, notifications, cloud sync
