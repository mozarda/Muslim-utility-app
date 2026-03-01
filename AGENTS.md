# AGENTS.md for OpenCode

## Project Agent Skills

This project uses OpenCode's agent capabilities for AI-assisted development.

### Available Custom Commands

None yet. You can add custom commands in `~/.config/opencode/commands/` or `./.opencode/commands/`.

### Agent Configuration

Default agent: coder
Default model: minimax/minimax-m2.5:free (or as configured)

### Project-Specific Notes

- React Native + Expo project
- TypeScript strict mode enabled
- Use Zustand for state management
- Prayer times calculation via `adhan` library
- Qibla direction uses magnetometer (requires device sensors)
- Quran reader uses local sample JSON; consider API integration for full text
- Memorization tracker uses AsyncStorage for persistence

### Development Workflow

1. Always run `npm install` after pulling changes
2. Use `npm start` to launch Expo dev server
3. Test on physical device for sensor features (compass, location)
4. Keep changes small and test frequently
5. Follow existing code style: functional components, hooks, TypeScript interfaces

### Important Files

- `src/navigation/AppNavigator.tsx` - main navigation structure
- `src/store/useAppStore.ts` - global state
- `src/utils/prayerTimes.ts` - prayer time calculations
- `src/utils/qibla.ts` - qibla compass logic
- `src/screens/` - all screen components
- `src/data/quran-sample.json` - expand to full Quran

### Linting/Formatting

No explicit linter configured. Use Prettier if installed, otherwise follow standard TypeScript/React conventions.

### Testing

No test suite yet. Consider adding Jest/React Native Testing Library.
