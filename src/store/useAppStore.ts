import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MemorizedAyat {
  surahNumber: number;
  verseNumber: number;
  text: string;
  lastReviewed: Date;
  nextReview: Date;
  proficiency: number; // 0-5, 0=new, 5=mastered
}

interface AppState {
  memorizedAyat: MemorizedAyat[];
  dailyGoal: number;
  addMemorizedAyat: (ayat: Omit<MemorizedAyat, 'lastReviewed' | 'nextReview'>) => void;
  updateProficiency: (surahNumber: number, verseNumber: number, newProficiency: number) => void;
  setDailyGoal: (goal: number) => void;
  getDailyProgress: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      memorizedAyat: [],
      dailyGoal: 5,
      addMemorizedAyat: (ayat) =>
        set((state) => ({
          memorizedAyat: [
            ...state.memorizedAyat,
            {
              ...ayat,
              lastReviewed: new Date(),
              nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day later
            },
          ],
        })),
      updateProficiency: (surahNumber, verseNumber, newProficiency) =>
        set((state) => ({
          memorizedAyat: state.memorizedAyat.map((a) =>
            a.surahNumber === surahNumber && a.verseNumber === verseNumber
              ? { ...a, proficiency: newProficiency, lastReviewed: new Date() }
              : a
          ),
        })),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      getDailyProgress: () => {
        const today = new Date().toDateString();
        return get().memorizedAyat.filter(
          (a) => a.lastReviewed.toDateString() === today
        ).length;
      },
    }),
    {
      name: 'muslim-utility-app-storage',
    }
  )
);
