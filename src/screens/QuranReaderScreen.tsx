import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import quranData from '../data/quran-sample.json';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  ayahs: { number: number; text: string }[];
}

export default function QuranReaderScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSurahs(quranData.surahs as Surah[]);
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery
  );

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    searchInput: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
    surahItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    surahName: { fontWeight: 'bold', fontSize: 16 },
    surahInfo: { color: '#666', fontSize: 12, marginTop: 2 },
    verseText: { fontSize: 16, lineHeight: 24, marginVertical: 8, textAlign: 'justify' },
    verseNumber: { fontWeight: 'bold', marginRight: 5 },
    backButton: { padding: 10, backgroundColor: '#2e7d32', color: 'white', borderRadius: 5, marginBottom: 10 },
  });

  if (selectedSurah) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedSurah(null)}>
          <Text style={{ color: 'white' }}>← Back to Surahs</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
          {selectedSurah.englishName} ({selectedSurah.name})
        </Text>
        {selectedSurah.ayahs.map((ayah) => (
          <View key={ayah.number} style={{ marginBottom: 12 }}>
            <Text style={styles.verseText}>
              <Text style={styles.verseNumber}>{ayah.number}.</Text> {ayah.text}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search surah by name or number..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.surahItem} onPress={() => setSelectedSurah(item)}>
            <Text style={styles.surahName}>{item.englishName} ({item.name})</Text>
            <Text style={styles.surahInfo}>{item.numberOfAyahs} ayahs</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
