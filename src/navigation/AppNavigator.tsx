import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import QiblaCompassScreen from '../screens/QiblaCompassScreen';
import QuranReaderScreen from '../screens/QuranReaderScreen';
import MemorizationScreen from '../screens/MemorizationScreen';

export type RootTabParamList = {
  PrayerTimes: undefined;
  QiblaCompass: undefined;
  QuranReader: undefined;
  Memorization: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap = 'home';
            if (route.name === 'PrayerTimes') {
              iconName = 'schedule';
            } else if (route.name === 'QiblaCompass') {
              iconName = 'explore';
            } else if (route.name === 'QuranReader') {
              iconName = 'menu-book';
            } else if (route.name === 'Memorization') {
              iconName = 'bookmarks';
            }
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2e7d32',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        <Tab.Screen name="PrayerTimes" component={PrayerTimesScreen} options={{ title: 'Prayer Times' }} />
        <Tab.Screen name="QiblaCompass" component={QiblaCompassScreen} options={{ title: 'Qibla' }} />
        <Tab.Screen name="QuranReader" component={QuranReaderScreen} options={{ title: 'Quran' }} />
        <Tab.Screen name="Memorization" component={MemorizationScreen} options={{ title: 'Memorize' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
