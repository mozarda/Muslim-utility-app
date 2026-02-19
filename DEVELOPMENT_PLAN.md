# Development Plan: Muslim Utility App

## Overview
Build a cross-platform Islamic utility app (iOS, Android, Web) using React Native + Expo. Features: Prayer times, Qibla compass, Quran reader, memorization tracker.

**Timeline**: 2-3 weeks part-time (~1-2 hours/day)

---

## Phase 1: Foundation (Days 1-3) ✅ DONE

- [x] Initialize Expo project with TypeScript template
- [x] Set up navigation stack (React Navigation)
- [x] Create basic screen components (placeholders)
- [x] Install core dependencies: adhan, expo-location, expo-sensors, zustand
- [x] Configure Git and push to GitHub
- [x] Write initial README

---

## Phase 2: Prayer Times (Days 4-6)

### Day 4: Location & Basic UI
- [ ] Implement location permission flow in PrayerTimesScreen
- [ ] Show loading/error states
- [ ] Display current coordinates for debugging

### Day 5: Prayer Calculation
- [ ] Integrate `adhan` library to compute times
- [ ] Display all 5 prayer times in a list
- [ ] Format times correctly for local timezone

### Day 6: Next Prayer Countdown
- [ ] Determine next upcoming prayer
- [ ] Add countdown timer (or at least highlight next prayer)
- [ ] Test on device (Expo Go)

---

## Phase 3: Qibla Compass (Days 7-9)

### Day 7: Qibla Calculation
- [ ] Implement `calculateQiblaDirection` function
- [ ] Request location, compute angle to Kaaba
- [ ] Display numeric direction (e.g., "234°")

### Day 8: Compass UI
- [ ] Create visual compass component with rotating needle
- [ ] Hook into `expo-sensors` Magnetometer
- [ ] Show Kaaba direction marker

### Day 9: Polish & Accuracy
- [ ] Smooth needle movement (debounce/filter)
- [ ] Consider magnetic declination (optional advanced)
- [ ] Test outdoors with phone

---

## Phase 4: Quran Reader (Days 10-13)

### Day 10: Data Setup
- [ ] Add more sample surahs (at least 10) to `quran-sample.json`
- [ ] Create simple data structure for surahs/ayahs
- [ ] Build list view with search/filter

### Day 11: Reader View
- [ ] Implement surah detail screen with all ayahs
- [ ] Add back navigation
- [ ] Style text for readability (font size, line height)

### Day 12: Enhancements
- [ ] Bookmark last read position (store in AsyncStorage)
- [ ] Add Arabic font support (optional)
- [ ] Consider API integration for full Quran (QuranCloud, Al-Quran Cloud) as alternative to local JSON

### Day 13: Testing
- [ ] Test navigation between screens
- [ ] Verify search works
- [ ] Check performance with larger surahs

---

## Phase 5: Memorization Tracker (Days 14-16)

### Day 14: State Management
- [ ] Zustand store already done? Review/finalize: addMemorizedAyat, updateProficiency, setDailyGoal, getDailyProgress
- [ ] Implement form to add new ayat (surah, ayah, text)
- [ ] Persist store with zustand/middleware

### Day 15: List & Progress
- [ ] Display list of memorized ayat (reverse chronological)
- [ ] Show daily progress vs goal
- [ ] Add ability to edit daily goal

### Day 16: Proficiency Cycling
- [ ] Add buttons to increase/decrease proficiency (0→5 scale)
- [ ] Implement spaced repetition logic: nextReview date based on proficiency
- [ ] Show upcoming reviews (optional)

---

## Phase 7: Polish & Pre-Launch (Days 18-20)

### Day 18: UI Polish
- [ ] Consistent color scheme (Islamic-themed? Greens, golds, whites)
- [ ] Improved icons for tabs (if converting to tab navigator) or bottom menu
- [ ] Responsive layout for different screen sizes
- [ ] Loading skeletons/placeholders

### Day 19: Permissions & Edge Cases
- [ ] Handle location permission denied gracefully (fallback manual city selection?)
- [ ] Handle compass unavailable on some devices
- [ ] Add pull-to-refresh on prayer times
- [ ] Test on both iOS and Android (real devices)

### Day 20: Testing & Bug Fixes
- [ ] Walk through all features, note bugs
- [ ] Fix critical issues
- [ ] Add analytics/crash reporting? (Optional)

---

## Phase 8: Build & Publish (Days 21-22)

### Day 21: Build Preparation
- [ ] Update app.json with proper name, icon, splash screen
- [ ] Generate icons (use expo-image-picker or online tool)
- [ ] Test production build locally (`expo build:android` / `expo build:ios` via EAS)

### Day 22: Stores Submission
- [ ] Create Apple Developer account ($99/yr) if targeting iOS
- [ ] Create Google Play Console account ($25 one-time) if targeting Android
- [ ] Build and upload binaries
- [ ] Fill store listings (screenshots, descriptions)

---

## Stretch Goals (Post-Launch)

- Audio recitation (MP3 from QuranAudio or similar)
- Prayer time notifications (local push notifications)
- Hijri calendar
- Dua/hadith collection
- Cloud sync for memorization data (Firebase/Supabase)
- Web version improvements (PWA)
- Dark mode
- Multiple languages (Arabic, Indonesian, etc.)

---

## Notes

- Work incrementally. Test on device after each feature.
- Keep commits small and meaningful.
- Update README as you go with setup instructions.
- Consider privacy: location stays on-device, no data collection.
