import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { calculateQiblaDirection } from '../utils/qibla';

export default function QiblaCompassScreen() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [currentPos, setCurrentPos] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location needed',
          'Please enable location to calculate Qibla direction.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // @ts-ignore: expo-location openSettingsAsync exists at runtime
                Location.openSettingsAsync().catch(() => {
                  Alert.alert('Error', 'Could not open settings');
                });
              }
            },
          ]
        );
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        setCurrentPos({ lat: latitude, lon: longitude });
        setQiblaDirection(calculateQiblaDirection(latitude, longitude));
      } catch (err) {
        Alert.alert('Error', 'Could not get location. Please try again.');
      }
    })();
  }, []);

  useEffect(() => {
    if (!currentPos) return;
    
    let subscription: any = null;
    try {
      Magnetometer.setUpdateInterval(100);
      subscription = Magnetometer.addListener((magnetometerData) => {
        const { x, y } = magnetometerData;
        const heading = Math.atan2(y, x) * (180 / Math.PI);
        setHeading(heading);
      });
    } catch (err) {
      console.error('Failed to start magnetometer:', err);
      Alert.alert('Compass Error', 'Could not start compass. Make sure device has a magnetometer.');
      return;
    }

    return () => {
      if (subscription) {
        try {
          subscription.remove();
        } catch (e) {
          // ignore
        }
      }
      // Fallback cleanup
      Magnetometer.removeAllListeners();
    };
  }, [currentPos]);

  const angleToKaaba = qiblaDirection !== null ? qiblaDirection - heading : 0;

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    directionText: { fontSize: 18, marginBottom: 10 },
    compass: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#ddd', borderWidth: 4, borderColor: '#333', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    needle: { width: 4, height: 100, backgroundColor: '#e53935', borderRadius: 2, position: 'absolute' },
    kaabaMarker: { width: 20, height: 20, backgroundColor: '#2e7d32', borderRadius: 10, position: 'absolute', top: 10, left: '50%', marginLeft: -10, zIndex: 1 },
    centerDot: { width: 12, height: 12, backgroundColor: '#333', borderRadius: 6, zIndex: 2 },
    info: { marginTop: 20, fontSize: 14, color: '#666' },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qibla Compass</Text>
      {qiblaDirection === null ? (
        <Text>Calculating...</Text>
      ) : (
        <>
          <Text style={styles.directionText}>Qibla direction: {Math.round(qiblaDirection)}° from North</Text>
          <View style={styles.compass}>
            <View style={[styles.needle, { transform: [{ rotate: `${heading}deg` }] }]} />
            <View style={styles.kaabaMarker} />
            <View style={styles.centerDot} />
          </View>
          <Text style={styles.info}>Point the red needle toward the green dot</Text>
          <Text style={styles.info}>Rotate: {angleToKaaba.toFixed(0)}°</Text>
        </>
      )}
    </View>
  );
}
