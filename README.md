# Muslim Utility App

A cross-platform React Native app (iOS, Android, Web) built with Expo for Islamic daily utilities.

## Features

1. **Prayer Times** - Displays daily prayer times based on current location.
2. **Qibla Compass** - Shows direction to Kaaba using device magnetometer.
3. **Quran Reader** - Browse and read Quran (currently includes sample surahs; expandable).
4. **Memorization Tracker** - Log ayat memorized, set daily goals, track progress.

## Tech Stack

- React Native + Expo
- TypeScript
- React Navigation
- Zustand (state management)
- `adhan` library for prayer times
- Expo Location & Sensors APIs

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator or physical device with Expo Go app

### Installation

```bash
cd repos/muslim-utility-app
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Then press:
# - 'i' for iOS simulator
# - 'a' for Android emulator
# - 'w' for web
```

Or scan the QR code with Expo Go on your phone.

### Project Structure

```
src/
  navigation/    AppNavigator.tsx - Stack navigation for screens
  screens/       PrayerTimesScreen, QiblaCompassScreen, QuranReaderScreen, MemorizationScreen
  store/         useAppStore.ts (Zustand state)
  utils/         prayerTimes.ts, qibla.ts
  data/          quran-sample.json (expand with full Quran)
```

## Notes

- The app requests location permission for accurate prayer times and qibla direction.
- The Quran data is currently a small sample; you can add the full Quran text to `src/data/quran-sample.json` or fetch from an API.
- Memorization progress is persisted locally via AsyncStorage.

## Future Enhancements

- Full Quran text integration (API or local bundle)
- Audio recitation
- Prayer time notifications
- Multi-language support
- More robust compass with declination correction
- Backup/sync memorization data to cloud

## License

MIT
