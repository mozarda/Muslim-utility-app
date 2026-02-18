import { PrayerTimes, Coordinates, Prayer } from 'adhan';

export function getPrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): PrayerTimes {
  const coordinates = new Coordinates(latitude, longitude);
  const params = PrayerTimes.getParameters();
  // You can customize params here (madhab, asr calculation, etc.)
  return new PrayerTimes(coordinates, params, date);
}

export function formatTime(prayer: Prayer): string {
  return prayer.getTime().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getNextPrayer(prayerTimes: PrayerTimes): Prayer | null {
  const now = new Date();
  const prayers = [
    prayerTimes.fajr,
    prayerTimes.dhuhr,
    prayerTimes.asr,
    prayerTimes.maghrib,
    prayerTimes.isha,
  ];
  for (const prayer of prayers) {
    if (prayer.getTime() > now) {
      return prayer;
    }
  }
  return null; // All prayers passed today, could return tomorrow's fajr
}
