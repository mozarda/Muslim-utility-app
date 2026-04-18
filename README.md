# Muslim Utility App

A cross-platform React Native app (iOS, Android, Web) built with Expo for Islamic daily utilities.

## Features

1. **Prayer Times** - Displays daily prayer times based on current location.
2. **Qibla Compass** - Shows direction to Kaaba using device magnetometer.
3. **Quran Reader** - Browse and read Quran (currently includes sample surahs; expandable).
4. **Memorization Tracker (Takrar)** - Log ayat memorized, set daily goals, track progress.
5. **AI Recitation Checker** 🔥 - Record your recitation and get instant Tajweed feedback powered by Voxtral AI. Record yourself reciting an ayat, and the AI will transcribe what you said, compare it to the expected text, and highlight any mistakes. Correct recitations auto-count as a repetition.

## Tech Stack

- React Native + Expo
- TypeScript
- React Navigation
- Zustand (state management)
- `adhan` library for prayer times
- Expo Location & Sensors APIs
- Voxtral AI (Mistral) via OpenRouter for audio analysis

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator or physical device with Expo Go app
- OpenRouter API key (for AI recitation checking)

### Installation

```bash
cd repos/muslim-utility-app
npm install
```

### Environment Setup

Copy the example env file and add your OpenRouter API key:

```bash
cp .env.local.example .env
# Edit .env and add your EXPO_PUBLIC_OPENROUTER_API_KEY
```

Get an API key at [openrouter.ai/keys](https://openrouter.ai/keys). The free tier works fine (~$0.015 per check).

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
  utils/         prayerTimes.ts, qibla.ts, audioRecorder.ts
  services/      quranApi.ts, notifications.ts, recitationCheck.ts
  data/          quran-sample.json (expand with full Quran)
```

## Notes

- The app requests location permission for accurate prayer times and qibla direction.
- The Quran data is currently a small sample; you can add the full Quran text to `src/data/quran-sample.json` or fetch from an API.
- Memorization progress is persisted locally via AsyncStorage.
- Audio recitation checking uses ~10 seconds of audio per check (~$0.015 via OpenRouter).

## License

MIT
