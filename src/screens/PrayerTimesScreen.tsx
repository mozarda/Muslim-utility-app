import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import * as Location from 'expo-location';
import { getPrayerTimes, formatTime, getNextPrayer } from '../utils/prayerTimes';

export default function PrayerTimesScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<string>('--');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Location needed', 'Please enable location to calculate prayer times.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const times = getPrayerTimes(latitude, longitude);
      setPrayerTimes(times);
      const next = getNextPrayer(times);
      if (next) {
        setNextPrayer(next.getTime().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
  }, [location]);

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    nextPrayer: { fontSize: 18, color: '#2e7d32', marginBottom: 20 },
    error: { color: 'red' },
    prayerRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    prayerName: { fontSize: 18, fontWeight: '500' },
    prayerTime: { fontSize: 18 },
  });

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!prayerTimes) {
    return (
      <View style={styles.container}>
        <Text>Loading prayer times...</Text>
      </View>
    );
  }

  const prayers = [
    { name: 'Fajr', time: formatTime(prayerTimes.fajr) },
    { name: 'Dhuhr', time: formatTime(prayerTimes.dhuhr) },
    { name: 'Asr', time: formatTime(prayerTimes.asr) },
    { name: 'Maghrib', time: formatTime(prayerTimes.maghrib) },
    { name: 'Isha', time: formatTime(prayerTimes.isha) },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prayer Times</Text>
      <Text style={styles.nextPrayer}>Next: {nextPrayer}</Text>
      {prayers.map((p) => (
        <View key={p.name} style={styles.prayerRow}>
          <Text style={styles.prayerName}>{p.name}</Text>
          <Text style={styles.prayerTime}>{p.time}</Text>
        </View>
      ))}
    </View>
  );
}
