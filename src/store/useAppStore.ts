import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MemorizedAyat {
  surahNumber: number;
  verseNumber: number;
  text: string;
  repetitionCount: number; // How many times repeated (Takrar method)
  targetRepetitions: number; // Usually 40
  lastRepeat: Date;
  dailyRepeatCount: number; // How many times repeated today
  proficiency: number; // 0-5, derived or manual override
}

interface AppState {
  memorizedAyat: MemorizedAyat[];
  dailyGoal: number; // Target repetitions per day (total across all ayat)
  defaultTargetRepetitions: number; // Default repetitions per ayat (Takrar count)
  addMemorizedAyat: (ayat: Omit<MemorizedAyat, 'repetitionCount' | 'dailyRepeatCount' | 'lastRepeat' | 'targetRepetitions'>, targetReps?: number) => void;
  incrementRepetition: (surahNumber: number, verseNumber: number) => void;
  setDailyGoal: (goal: number) => void;
  setDefaultTargetRepetitions: (target: number) => void;
  getDailyProgress: () => number; // Total repetitions done today
  resetDailyCounts: () => void; // Call at start of day to reset dailyRepeatCount
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      memorizedAyat: [],
      dailyGoal: 20, // 20 repetitions per day as default
      defaultTargetRepetitions: 25, // Default Takrar repetitions per ayat
      addMemorizedAyat: (ayat, targetReps = 25) =>
        set((state) => ({
          memorizedAyat: [
            ...state.memorizedAyat,
            {
              ...ayat,
              repetitionCount: 0,
              targetRepetitions: targetReps,
              dailyRepeatCount: 0,
              lastRepeat: new Date(0), // epoch
              proficiency: 0,
            },
          ],
        })),
      setDefaultTargetRepetitions: (target) => set({ defaultTargetRepetitions: target }),
      incrementRepetition: (surahNumber, verseNumber) =>
        set((state) => ({
          memorizedAyat: state.memorizedAyat.map((a) => {
            if (a.surahNumber === surahNumber && a.verseNumber === verseNumber) {
              const newCount = a.repetitionCount + 1;
              const newProficiency = newCount >= 40 ? 5 : Math.min(5, Math.floor((newCount / 40) * 5));
              return {
                ...a,
                repetitionCount: newCount,
                proficiency: newProficiency,
                lastRepeat: new Date(),
                dailyRepeatCount: a.dailyRepeatCount + 1,
              };
            }
            return a;
          }),
        })),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      getDailyProgress: () => {
        return get().memorizedAyat.reduce((sum, a) => sum + a.dailyRepeatCount, 0);
      },
      resetDailyCounts: () =>
        set((state) => ({
          memorizedAyat: state.memorizedAyat.map((a) => ({ ...a, dailyRepeatCount: 0 })),
        })),
    }),
    {
      name: 'muslim-utility-app-storage',
    }
  )
);
