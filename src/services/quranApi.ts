import AsyncStorage from '@react-native-async-storage/async-storage';
import quranSample from '../data/quran-sample.json';

const QURAN_CACHE_KEY = 'quran_full_cache';
const QURAN_CACHE_TIMESTAMP_KEY = 'quran_cache_timestamp';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

interface Ayah {
  number: number;
  text: string;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface QuranData {
  surahs: Surah[];
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: number | null): boolean {
  if (!timestamp) return false;
  const now = Date.now();
  return now - timestamp < CACHE_TTL;
}

/**
 * Fetch full Quran data from API and cache it.
 * Uses Quran Cloud API (https://api.quran.sad.one/)
 */
export async function fetchQuranFromAPI(): Promise<QuranData> {
  try {
    const response = await fetch('https://api.quran.sad.one/quran?language=en');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data: Surah[] = await response.json();

    // Normalize to our format (some APIs have different structure)
    const normalized: Surah[] = data.map((s) => ({
      number: s.number,
      name: s.name,
      englishName: s.englishName || s.name,
      numberOfAyahs: s.numberOfAyahs || s.ayahs?.length || 0,
      ayahs: s.ayahs?.map((a: { number: number; text: string; translation?: { text: string } }) => ({
        number: a.number,
        text: a.translation?.text || a.text,
      })) || [],
    }));

    const quranData: QuranData = { surahs: normalized };

    // Cache with timestamp
    await AsyncStorage.multiSet([
      [QURAN_CACHE_KEY, JSON.stringify(quranData)],
      [QURAN_CACHE_TIMESTAMP_KEY, Date.now().toString()],
    ]);

    return quranData;
  } catch (error) {
    console.error('Failed to fetch Quran from API:', error);
    throw error;
  }
}

/**
 * Get cached Quran data if available
 */
async function getCachedQuran(): Promise<QuranData | null> {
  try {
    const values = await AsyncStorage.multiGet([QURAN_CACHE_KEY, QURAN_CACHE_TIMESTAMP_KEY]);
    const cachedData = values[0][1];
    const timestampStr = values[1][1];
    const timestamp = timestampStr ? parseInt(timestampStr, 10) : null;

    if (cachedData && isCacheValid(timestamp)) {
      return JSON.parse(cachedData) as QuranData;
    }
    return null;
  } catch (error) {
    console.warn('Failed to read Quran cache:', error);
    return null;
  }
}

/**
 * Get Quran data: try cache first, then fetch, then fallback to sample.
 */
export async function getQuranData(forceRefresh = false): Promise<QuranData> {
  if (!forceRefresh) {
    const cached = await getCachedQuran();
    if (cached) {
      console.log('Quran cache hit');
      return cached;
    }
  }

  console.log('Fetching Quran from API...');
  try {
    const fresh = await fetchQuranFromAPI();
    return fresh;
  } catch (error) {
    console.warn('API failed, falling back to sample data');
    return quranSample as QuranData;
  }
}

/**
 * Clear Quran cache (e.g., for refresh)
 */
export async function clearQuranCache(): Promise<void> {
  await AsyncStorage.multiRemove([QURAN_CACHE_KEY, QURAN_CACHE_TIMESTAMP_KEY]);
}
