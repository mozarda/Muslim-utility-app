# Development Roadmap: Muslim Utility App

**Goal:** Deployable builds for iOS (TestFlight/App Store) and Android (Google Play) via Expo/EAS.

**Current Status (2025-02-20 Analysis):**
- ✅ Foundation complete: navigation (stack), 4 screens built
- ✅ Core features implemented: prayer times, qibla compass, quran reader (sample), memorization tracker
- ✅ Zustand store with AsyncStorage persistence
- ⚠️ UI/UX basic, not production-ready
- ⚠️ Quran data limited (5 surahs)
- ⚠️ Qibla compass accuracy questionable (magnetometer simplified)
- ⚠️ Missing icons, splash screens, app configuration
- ⚠️ No prayer time notifications
- ❌ Not yet tested on real devices

---

## Phase 1: Critical Bug Fixes & Testing (Day 1) — 2-4 hours

### 1.1 Verify App Runs Without Errors
- Run `npx expo start` in Expo Go (Android/iOS) or web
- Check console for errors/warnings
- Test each screen functionality
- Document any crashes or permission issues

### 1.2 Prayer Times Accuracy
- Verify adhan calculation matches known times (compare with Muslim Pro or Aladhan.com)
- Check timezone handling (use location.timeZone? or system?);
- Add prayer parameters customization (madhab, asr method) if needed
- Ensure next prayer updates correctly at prayer time boundaries

### 1.3 Qibla Compass Reliability
- Test on real device: does needle point reasonably close to Kaaba?
- Current implementation uses Magnetometer directly; may be noisy/unreliable
- Consider switching to `expo-sensors` DeviceMotion (includes absolute heading) or add low-pass filter
- Add magnetic declination correction using `geomagnetic` package or manual calculation
- If unreliable, recommend `react-native-compass` (but may need config plugin)

### 1.4 Permissions & Error Handling
- Ensure graceful degradation if location denied (manual city selection fallback? Show message only)
- Qibla: show "Compass not available" on devices without magnetometer
- Quran Reader: handle empty state if no data
- Add loading states and retry mechanisms

---

## Phase 2: Content & Data (Day 2) — 2-3 hours

### 2.1 Expand Quran Data
**Option A (Recommended):** Integrate Quran API
- Use free API: Quran Cloud (https://api.quran.sad.one/) or Al-Quran Cloud (https://alquran.cloud/)
- Fetch on-demand with caching in AsyncStorage to reduce requests
- Implement pagination for large surahs (e.g., Al-Baqarah)

**Option B:** Bundle full Quran locally
- Add `quran-full.json` (large file ~10-20MB) — not ideal for app store size limits
- Only include Arabic text + basic translation? Or user selects translation API

**Decision:** Implement API with offline cache. Keep sample data as fallback.

### 2.2 Content Quality
- Use reliable translation (e.g., Sahih International) or allow user to choose
- Consider adding multiple languages (stretch)
- Addayah numbers properly displayed

---

## Phase 3: UI/UX Polish (Days 3-4) — 4-6 hours

### 3.1 Visual Design System
- **Color Palette:** Islamic-themed (deep green #2e7d32, gold #d4af37, cream/white backgrounds, dark text)
- **Typography:** Use system fonts; for Arabic, ensure proper rendering (use Noto Sans Arabic or system Arabic font)
- **Icons:** Use `@expo/vector-icons` (MaterialIcons, Ionicons, FontAwesome) or custom SVG icons

### 3.2 Navigation Redesign
- Switch from stack navigator to **bottom tab navigator** for primary screens (Prayer Times, Qibla, Quran, Memorization)
- Keep stack for drilled-down screens (surah detail, ayat detail)
- Improve header titles and back buttons

### 3.3 Screen Layouts
- **Prayer Times:** Card-based layout, highlight next prayer with different color/bold, countdown timer
- **Qibla Compass:** Larger compass, smoother needle animation, calibration instructions
- **Quran Reader:** Better search, surah list with juz info, font size adjustment
- **Memorization:** Improved progress visualization, calendar view for daily goals

### 3.4 Responsive & Accessibility
- Ensure layouts work on all screen sizes (iPhone SE to Android tablets)
- Add Dynamic Type support (text scaling)
- Ensure touch targets ≥44pt

---

## Phase 4: Additional Features (Days 5-6) — 4-5 hours

### 4.1 Prayer Time Notifications
- Use `expo-notifications`
- Schedule local notifications for each prayer time (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Allow user to enable/disable per prayer
- Customize sound/vibration
- Handle timezone changes gracefully

### 4.2 Settings Screen
- Prayer calculation method (Muslim World League, Egyptian, Karachi, etc.)
- Asr calculation (Hanafi/Shafi'i)
- Location: auto vs manual city selection
- Qibla: calibration, declination toggle
- Notifications: on/off, per-prayer toggles
- Data: clear cache, backup/restore memorization

### 4.3 Hijri Calendar (Optional)
- Display current Hijri date
- Show important Islamic dates (Ramadan, Hajj, etc.)
- Could use `moment-hijri` or `dayjs` with hijri plugin

---

## Phase 5: Build Configuration & Deployment (Days 7-8) — 3-4 hours

### 5.1 App Identity
- Generate launcher icons (use Expo's `icon` field in app.json with `expo icon:generate` or online tool)
- Create splash screen (background color + logo)
- Update app.json with proper name, slug, version, description, ios/Android specifics

### 5.2 EAS Build Setup
- Install EAS CLI: `npm install -g eas-cli`
- Run `eas build:configure` to create eas.json
- Choose managed workflow
- Configure build profiles: development, preview, production
- Set up iOS and Android credentials (EAS can auto-manage)

### 5.3 Submit to Stores
- **Android:** Generate keystore (EAS can manage), build APK/AAB, upload to Google Play Console
- **iOS:** Requires Apple Developer account ($99/yr). EAS can manage provisioning profiles. Build IPA, upload to App Store Connect (TestFlight first)

### 5.4 Web Build (Optional)
- `npx expo build:web` or `eas build --platform web`
- Deploy to Cloudflare Pages/Netlify/Vercel

---

## Phase 6: Post-Launch (Stretch Goals)

- Audio recitation (Quran audio API)
- Cloud sync (Firebase/Supabase) for memorization data
- Dark mode
- Multi-language support (Arabic, Indonesian, Urdu, etc.)
- Dua/hadith collection
- Community features (not now)

---

## Estimated Timeline

| Phase | Estimated Time | Who |
|-------|----------------|-----|
| 1. Bug fixes & testing | 2-4h | Dev |
| 2. Quran API integration | 2-3h | Dev |
| 3. UI/UX polish | 4-6h | Dev |
| 4. Notifications + Settings | 4-5h | Dev |
| 5. Build & Deploy | 3-4h | Dev |
| **Total** | **15-22 hours** | **1 person** |

At 1-2h/day, 2-3 weeks. Can compress to 1 week with focused effort.

---

## Immediate Next Steps (First Priority)

1. Run app in Expo Go, test all features, log bugs
2. Fix prayer times accuracy (timezone?)
3. Improve Qibla compass (add smoothing, consider alternative sensor)
4. Integrate Quran API with caching
5. Redesign UI with bottom tabs and Islamic theme
