import * as Notifications from 'expo-notifications';
import { PrayerTimes } from 'adhan';
import { getPrayerTimes } from '../utils/prayerTimes';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Schedule notifications for all prayer times for today.
 */
export async function schedulePrayerNotifications(
  latitude: number,
  longitude: number,
  prayerTimes: PrayerTimes
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr.getTime() },
    { name: 'Dhuhr', time: prayerTimes.dhuhr.getTime() },
    { name: 'Asr', time: prayerTimes.asr.getTime() },
    { name: 'Maghrib', time: prayerTimes.maghrib.getTime() },
    { name: 'Isha', time: prayerTimes.isha.getTime() },
  ];

  const now = Date.now();

  for (const prayer of prayers) {
    if (prayer.time > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Prayer Time',
          body: `Time for ${prayer.name}`,
          sound: 'default',
          data: { prayer: prayer.name },
        },
        trigger: { date: new Date(prayer.time) },
      });
    }
  }
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}
