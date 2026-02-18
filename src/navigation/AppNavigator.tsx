import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import QiblaCompassScreen from '../screens/QiblaCompassScreen';
import QuranReaderScreen from '../screens/QuranReaderScreen';
import MemorizationScreen from '../screens/MemorizationScreen';

export type RootStackParamList = {
  PrayerTimes: undefined;
  QiblaCompass: undefined;
  QuranReader: undefined;
  Memorization: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PrayerTimes">
        <Stack.Screen name="PrayerTimes" component={PrayerTimesScreen} options={{ title: 'Prayer Times' }} />
        <Stack.Screen name="QiblaCompass" component={QiblaCompassScreen} options={{ title: 'Qibla Compass' }} />
        <Stack.Screen name="QuranReader" component={QuranReaderScreen} options={{ title: 'Quran Reader' }} />
        <Stack.Screen name="Memorization" component={MemorizationScreen} options={{ title: 'Memorization' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
