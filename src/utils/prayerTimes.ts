import { Coordinates, PrayerTimes } from 'adhan';

export function getPrayerTimes(latitude: number, longitude: number): any {
  const coordinates = new Coordinates(latitude, longitude);
  // @ts-ignore - adhan typings may differ; using default constructor
  return new PrayerTimes(coordinates);
}

export function formatTime(prayer: Date): string {
  return prayer.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getNextPrayer(prayerTimes: any): Date | null {
  const now = new Date();
  const prayers = [
    prayerTimes.fajr,
    prayerTimes.dhuhr,
    prayerTimes.asr,
    prayerTimes.maghrib,
    prayerTimes.isha,
  ];
  for (const prayer of prayers) {
    if (prayer && typeof prayer.getTime === 'function' && prayer.getTime() > now.getTime()) {
      return prayer;
    }
  }
  return null;
}
