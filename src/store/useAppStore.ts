import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TajweedMistake {
  start: number;
  end: number;
  text: string;
}

export interface TajweedCheckResult {
  transcription: string;
  isCorrect: boolean;
  mistakes: TajweedMistake[];
  checkedAt?: string; // ISO date string
}

interface MemorizedAyat {
  id: string;
  surahNumber: number;
  verseNumber: number;
  text: string;
  repetitionCount: number;
  targetRepetitions: number;
  lastRepeat: string; // ISO date string (persist-friendly)
  dailyRepeatCount: number;
  proficiency: number;
  lastTajweedCheck: TajweedCheckResult | null;
}

interface AppState {
  memorizedAyat: MemorizedAyat[];
  dailyGoal: number;
  defaultTargetRepetitions: number;
  addMemorizedAyat: (ayat: Omit<MemorizedAyat, 'id' | 'repetitionCount' | 'dailyRepeatCount' | 'lastRepeat' | 'targetRepetitions' | 'proficiency' | 'lastTajweedCheck'>, targetReps?: number) => boolean;
  incrementRepetition: (id: string) => void;
  setDailyGoal: (goal: number) => void;
  setDefaultTargetRepetitions: (target: number) => void;
  getDailyProgress: () => number;
  resetDailyCounts: () => void;
  recordTajweedCheck: (id: string, result: TajweedCheckResult) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      memorizedAyat: [],
      dailyGoal: 20, // 20 repetitions per day as default
      defaultTargetRepetitions: 25, // Default Takrar repetitions per ayat
      addMemorizedAyat: (ayat, targetReps = 25) => {
        const exists = get().memorizedAyat.some(
          (a) => a.surahNumber === ayat.surahNumber && a.verseNumber === ayat.verseNumber
        );
        if (exists) {
          return false;
        }
        const id = `ayat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          memorizedAyat: [
            ...state.memorizedAyat,
            {
              id,
              ...ayat,
              repetitionCount: 0,
              targetRepetitions: targetReps,
              dailyRepeatCount: 0,
              lastRepeat: new Date(0).toISOString(),
              proficiency: 0,
              lastTajweedCheck: null,
            },
          ],
        }));
        return true;
      },
      setDefaultTargetRepetitions: (target) => set({ defaultTargetRepetitions: target }),
      incrementRepetition: (id: string) =>
        set((state) => {
          const ayat = state.memorizedAyat.find((a) => a.id === id);
          if (!ayat) return state;
          const newCount = ayat.repetitionCount + 1;
          const newProficiency = Math.min(5, Math.floor((newCount / ayat.targetRepetitions) * 5));
          return {
            memorizedAyat: state.memorizedAyat.map((a) =>
              a.id === id
                ? {
                    ...a,
                    repetitionCount: newCount,
                    proficiency: newProficiency,
                    lastRepeat: new Date().toISOString(),
                    dailyRepeatCount: a.dailyRepeatCount + 1,
                  }
                : a
            ),
          };
        }),
      recordTajweedCheck: (id: string, result: TajweedCheckResult) => {
        set((state) => ({
          memorizedAyat: state.memorizedAyat.map((a) =>
            a.id === id
              ? {
                  ...a,
                  lastTajweedCheck: {
                    ...result,
                    checkedAt: new Date().toISOString(),
                  },
                }
              : a
          ),
        }));
      },
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      getDailyProgress: () => {
        return get().memorizedAyat.reduce((sum, a) => sum + a.dailyRepeatCount, 0);
      },
      resetDailyCounts: () =>
        set((state) => ({
          memorizedAyat: state.memorizedAyat.map((a) => ({ ...a, dailyRepeatCount: 0, lastRepeat: new Date(0).toISOString() })),
        })),
    }),
    {
      name: 'muslim-utility-app-storage',
    }
  )
);
