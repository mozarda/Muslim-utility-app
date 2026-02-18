import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function MemorizationScreen() {
  const { memorizedAyat, dailyGoal, addMemorizedAyat, setDailyGoal, getDailyProgress } = useAppStore();
  const [surahInput, setSurahInput] = useState('');
  const [verseInput, setVerseInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [showForm, setShowForm] = useState(false);
  const dailyProgress = getDailyProgress();

  const handleAdd = () => {
    if (!surahInput || !verseInput || !textInput) {
      Alert.alert('Missing info', 'Please fill all fields');
      return;
    }
    addMemorizedAyat({
      surahNumber: parseInt(surahInput, 10),
      verseNumber: parseInt(verseInput, 10),
      text: textInput,
      proficiency: 0,
    });
    setSurahInput('');
    setVerseInput('');
    setTextInput('');
    setShowForm(false);
    Alert.alert('Success', 'Ayat memorized! Keep reviewing.');
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    progress: { fontSize: 16, color: '#2e7d32', marginBottom: 20 },
    goalSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    goalLabel: { marginRight: 10 },
    goalInput: { borderWidth: 1, borderColor: '#ccc', padding: 5, width: 50, textAlign: 'center' },
    listItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    ayatText: { fontSize: 16, marginBottom: 5 },
    meta: { color: '#666', fontSize: 12 },
    button: { backgroundColor: '#2e7d32', padding: 10, borderRadius: 5, marginTop: 10 },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#c62828', marginTop: 10 },
    form: { marginTop: 20, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memorization Tracker</Text>
      <Text style={styles.progress}>Today: {dailyProgress} / {dailyGoal} ayat reviewed</Text>
      <View style={styles.goalSection}>
        <Text style={styles.goalLabel}>Daily goal:</Text>
        <TextInput
          style={styles.goalInput}
          value={dailyGoal.toString()}
          onChangeText={(text) => setDailyGoal(parseInt(text, 10) || 0)}
          keyboardType="number-pad"
        />
      </View>

      {!showForm ? (
        <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
          <Text style={styles.buttonText}>+ Log new ayat</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Surah number"
            value={surahInput}
            onChangeText={setSurahInput}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Verse number"
            value={verseInput}
            onChangeText={setVerseInput}
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Ayat text"
            value={textInput}
            onChangeText={setTextInput}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowForm(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={memorizedAyat.slice().reverse()}
        keyExtractor={(item, index) => `${item.surahNumber}-${item.verseNumber}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.ayatText}>{item.text}</Text>
            <Text style={styles.meta}>
              Surah {item.surahNumber}, Ayah {item.verseNumber} • Proficiency: {item.proficiency}/5
            </Text>
            <Text style={styles.meta}>Last: {item.lastReviewed.toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No ayat logged yet.</Text>}
      />
    </View>
  );
}
