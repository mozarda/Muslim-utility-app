import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function MemorizationScreen() {
  const { memorizedAyat, dailyGoal, defaultTargetRepetitions, addMemorizedAyat, incrementRepetition, setDailyGoal, setDefaultTargetRepetitions, getDailyProgress, resetDailyCounts } = useAppStore();
  const [surahInput, setSurahInput] = useState('');
  const [verseInput, setVerseInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [targetInput, setTargetInput] = useState(defaultTargetRepetitions.toString());
  const [showForm, setShowForm] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [defaultTargetInput, setDefaultTargetInput] = useState(defaultTargetRepetitions.toString());
  const dailyProgress = getDailyProgress();

  // Sync goal input with store when default changes
  useEffect(() => {
    setGoalInput(dailyGoal.toString());
  }, [dailyGoal]);

  // Sync default target input with store when it changes
  useEffect(() => {
    setDefaultTargetInput(defaultTargetRepetitions.toString());
  }, [defaultTargetRepetitions]);

  const validateInputs = useCallback(() => {
    const surah = parseInt(surahInput, 10);
    const verse = parseInt(verseInput, 10);
    const target = parseInt(targetInput, 10);

    if (isNaN(surah) || surah < 1 || surah > 114) {
      Alert.alert('Invalid Input', 'Surah number must be between 1 and 114');
      return false;
    }
    if (isNaN(verse) || verse < 1) {
      Alert.alert('Invalid Input', 'Verse number must be a positive integer');
      return false;
    }
    if (isNaN(target) || target < 1 || target > 1000) {
      Alert.alert('Invalid Input', 'Target repetitions must be between 1 and 1000');
      return false;
    }
    return true;
  }, [surahInput, verseInput, targetInput]);

  const handleAdd = () => {
    if (!surahInput || !verseInput || !textInput) {
      Alert.alert('Missing info', 'Please fill all fields');
      return;
    }
    if (!validateInputs()) return;

    const target = parseInt(targetInput, 10);
    const success = addMemorizedAyat({
      surahNumber: parseInt(surahInput, 10),
      verseNumber: parseInt(verseInput, 10),
      text: textInput,
    }, target);

    if (!success) {
      Alert.alert('Duplicate', 'This ayat already exists in your memorization list');
      return;
    }

    setSurahInput('');
    setVerseInput('');
    setTextInput('');
    setTargetInput(defaultTargetRepetitions.toString());
    setShowForm(false);
    Alert.alert('Success', 'Ayat added. Start repeating!');
  };

  const handleRepeat = (id: string) => {
    incrementRepetition(id);
  };

  const handleDailyGoalBlur = () => {
    const value = parseInt(goalInput, 10);
    if (isNaN(value) || value < 0) {
      setGoalInput(dailyGoal.toString());
    } else {
      setDailyGoal(value);
    }
  };

  const handleDefaultTargetBlur = () => {
    const value = parseInt(defaultTargetInput, 10);
    if (isNaN(value) || value < 1 || value > 1000) {
      setDefaultTargetInput(defaultTargetRepetitions.toString());
    } else {
      setDefaultTargetRepetitions(value);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    progressContainer: { marginBottom: 20, alignItems: 'center' },
    progressText: { fontSize: 16, color: '#2e7d32', marginBottom: 5 },
    progressBar: { width: '100%', height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#2e7d32' },
    goalSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    goalLabel: { marginRight: 10, fontSize: 16 },
    goalInput: { borderWidth: 1, borderColor: '#ccc', padding: 5, width: 60, textAlign: 'center', borderRadius: 4 },
    resetDayButton: { marginLeft: 10, padding: 5, backgroundColor: '#ff9800', borderRadius: 4 },
    resetDayText: { color: 'white', fontSize: 12 },
    listItem: { padding: 15, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 8, elevation: 2 },
    ayatText: { fontSize: 16, marginBottom: 8, lineHeight: 24 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    meta: { color: '#666', fontSize: 12 },
    progressInfo: { fontSize: 12, color: '#2e7d32', marginBottom: 8 },
    repeatButton: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 6, alignItems: 'center' },
    repeatText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    formContainer: { marginTop: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6, backgroundColor: '#fff' },
    formButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    formButton: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center', marginHorizontal: 5 },
    saveButton: { backgroundColor: '#2e7d32' },
    cancelButton: { backgroundColor: '#c62828' },
    formButtonText: { color: 'white', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },
  });

  const totalTarget = memorizedAyat.reduce((sum, a) => sum + a.targetRepetitions, 0);
  const totalProgress = memorizedAyat.reduce((sum, a) => sum + a.repetitionCount, 0);
  const overallPercent = totalTarget > 0 ? totalProgress / totalTarget : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Takrar Memorization</Text>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Today's reps: {dailyProgress} / {dailyGoal}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min((dailyProgress / dailyGoal) * 100, 100)}%` }]} />
        </View>
      </View>

      <View style={styles.goalSection}>
        <Text style={styles.goalLabel}>Daily rep goal:</Text>
        <TextInput
          style={styles.goalInput}
          value={goalInput}
          onChangeText={setGoalInput}
          onBlur={handleDailyGoalBlur}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.resetDayButton} onPress={resetDailyCounts}>
          <Text style={styles.resetDayText}>Reset Day</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.goalSection}>
        <Text style={styles.goalLabel}>Default reps/ayat:</Text>
        <TextInput
          style={styles.goalInput}
          value={defaultTargetInput}
          onChangeText={setDefaultTargetInput}
          onBlur={handleDefaultTargetBlur}
          keyboardType="number-pad"
        />
      </View>

      {!showForm ? (
        <TouchableOpacity style={styles.repeatButton} onPress={() => setShowForm(true)}>
          <Text style={styles.repeatText}>+ Add New Ayat</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.formContainer}>
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
            style={[styles.input, { height: 100 }]}
            placeholder="Ayat text"
            value={textInput}
            onChangeText={setTextInput}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Target repetitions (default: 25)"
            value={targetInput}
            onChangeText={setTargetInput}
            keyboardType="number-pad"
          />
          <View style={styles.formButtons}>
            <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={handleAdd}>
              <Text style={styles.formButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={() => setShowForm(false)}>
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={{ marginTop: 20, marginBottom: 10, fontSize: 18, fontWeight: '600' }}>
        Overall Progress: {totalProgress} / {totalTarget} reps
      </Text>
      <View style={[styles.progressBar, { marginBottom: 20 }]}>
        <View style={[styles.progressFill, { width: `${Math.min(overallPercent * 100, 100)}%` }]} />
      </View>

      <FlatList
        data={memorizedAyat.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const progress = item.repetitionCount / item.targetRepetitions;
          const isComplete = item.repetitionCount >= item.targetRepetitions;
          return (
            <View style={styles.listItem}>
              <Text style={styles.ayatText}>{item.text}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>Surah {item.surahNumber}, Ayah {item.verseNumber}</Text>
                <Text style={[styles.meta, { color: isComplete ? '#2e7d32' : '#f57c00', fontWeight: 'bold' }]}>
                  {item.repetitionCount} / {item.targetRepetitions}
                </Text>
              </View>
              <Text style={styles.progressInfo}>Proficiency: {item.proficiency}/5</Text>
              <Text style={styles.meta}>Today: {item.dailyRepeatCount} reps</Text>
              
              <TouchableOpacity 
                style={[styles.repeatButton, isComplete && { backgroundColor: '#4caf50' }]} 
                onPress={() => handleRepeat(item.id)}
              >
                <Text style={styles.repeatText}>{isComplete ? 'Completed ✓' : `Repeat (${item.repetitionCount})`}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No ayat added yet. Start by adding a verse to memorize.</Text>}
      />
    </View>
  );
}
