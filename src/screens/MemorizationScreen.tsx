import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { checkRecitation, TajweedCheckResult } from '../services/recitationCheck';
import { startRecording, stopRecording, isRecording as isCurrentlyRecording } from '../utils/audioRecorder';

type RecordingState = 'idle' | 'recording' | 'checking';

interface ActiveRecording {
  ayatId: string;
  state: RecordingState;
  result: TajweedCheckResult | null;
}

export default function MemorizationScreen() {
  const { memorizedAyat, dailyGoal, defaultTargetRepetitions, addMemorizedAyat, incrementRepetition, setDailyGoal, setDefaultTargetRepetitions, getDailyProgress, resetDailyCounts, recordTajweedCheck } = useAppStore();
  const [surahInput, setSurahInput] = useState('');
  const [verseInput, setVerseInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [targetInput, setTargetInput] = useState(defaultTargetRepetitions.toString());
  const [showForm, setShowForm] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [defaultTargetInput, setDefaultTargetInput] = useState(defaultTargetRepetitions.toString());
  const [activeRecording, setActiveRecording] = useState<ActiveRecording | null>(null);
  const dailyProgress = getDailyProgress();

  const handleRecordPress = async (id: string, ayatText: string) => {
    // If already recording this ayat, stop and check
    if (activeRecording?.ayatId === id && activeRecording.state === 'recording') {
      try {
        setActiveRecording({ ayatId: id, state: 'checking', result: null });
        const { base64 } = await stopRecording();
        const result = await checkRecitation(base64, ayatText);
        
        // Save the check result to store
        recordTajweedCheck(id, result);
        
        // If correct, auto-count the repetition
        if (result.isCorrect) {
          incrementRepetition(id);
        }

        setActiveRecording({ ayatId: id, state: 'idle', result });
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Recording failed');
        setActiveRecording(null);
      }
      return;
    }

    // If showing result for this ayat, dismiss
    if (activeRecording?.ayatId === id && activeRecording.state === 'idle' && activeRecording.result) {
      setActiveRecording(null);
      return;
    }

    // If recording a different ayat, cancel that first
    if (activeRecording && isCurrentlyRecording()) {
      // Can't record two at once
      Alert.alert('Busy', 'Finish the current recording first');
      return;
    }

    // Start new recording
    try {
      await startRecording();
      setActiveRecording({ ayatId: id, state: 'recording', result: null });
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not start recording');
    }
  };

  const handleRepeat = (id: string) => {
    incrementRepetition(id);
  };

  const handleAdd = () => {
    if (!surahInput || !verseInput || !textInput) {
      Alert.alert('Missing info', 'Please fill all fields');
      return;
    }
    const surah = parseInt(surahInput, 10);
    const verse = parseInt(verseInput, 10);
    const target = parseInt(targetInput, 10);

    if (isNaN(surah) || surah < 1 || surah > 114) {
      Alert.alert('Invalid Input', 'Surah number must be between 1 and 114');
      return;
    }
    if (isNaN(verse) || verse < 1) {
      Alert.alert('Invalid Input', 'Verse number must be a positive integer');
      return;
    }
    if (isNaN(target) || target < 1 || target > 1000) {
      Alert.alert('Invalid Input', 'Target repetitions must be between 1 and 1000');
      return;
    }

    const success = addMemorizedAyat({
      surahNumber: surah,
      verseNumber: verse,
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
    ayatText: { fontSize: 18, marginBottom: 8, lineHeight: 28 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    meta: { color: '#666', fontSize: 12 },
    progressInfo: { fontSize: 12, color: '#2e7d32', marginBottom: 4 },
    buttonRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    repeatButton: { flex: 1, backgroundColor: '#2e7d32', padding: 12, borderRadius: 6, alignItems: 'center' },
    repeatText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    recordButton: { flex: 1, backgroundColor: '#1565c0', padding: 12, borderRadius: 6, alignItems: 'center' },
    recordButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    recordButtonRecording: { backgroundColor: '#c62828' },
    recordButtonChecking: { backgroundColor: '#6a1b9a' },
    formContainer: { marginTop: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6, backgroundColor: '#fff' },
    formButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    formButton: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center', marginHorizontal: 5 },
    saveButton: { backgroundColor: '#2e7d32' },
    cancelButton: { backgroundColor: '#c62828' },
    formButtonText: { color: 'white', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },
    resultContainer: { marginTop: 8, padding: 10, borderRadius: 6, backgroundColor: '#f5f5f5' },
    resultCorrect: { backgroundColor: '#e8f5e9' },
    resultIncorrect: { backgroundColor: '#ffebee' },
    resultError: { backgroundColor: '#fff3e0' },
    resultText: { fontSize: 14, color: '#333' },
    transcriptionText: { fontSize: 16, color: '#1565c0', marginTop: 4, lineHeight: 24 },
    mistakeText: { fontSize: 14, color: '#c62828', marginTop: 4 },
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
          const isActive = activeRecording?.ayatId === item.id;
          const lastCheck = item.lastTajweedCheck;

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
              
              {/* Tajweed check result */}
              {isActive && activeRecording?.result && (
                <View style={[
                  styles.resultContainer,
                  activeRecording.result.isCorrect ? styles.resultCorrect : activeRecording.result.error ? styles.resultError : styles.resultIncorrect,
                ]}>
                  {activeRecording.result.isCorrect && (
                    <Text style={[styles.resultText, { color: '#2e7d32', fontWeight: 'bold' }]}>
                      ✅ Correct recitation! (Repetition counted)
                    </Text>
                  )}
                  {!activeRecording.result.isCorrect && !activeRecording.result.error && (
                    <>
                      <Text style={[styles.resultText, { color: '#c62828', fontWeight: 'bold' }]}>
                        ❌ Needs correction
                      </Text>
                      {activeRecording.result.transcription && (
                        <Text style={styles.transcriptionText}>You said: {activeRecording.result.transcription}</Text>
                      )}
                      {activeRecording.result.mistakes.length > 0 && (
                        <Text style={styles.mistakeText}>
                          {activeRecording.result.mistakes.length} mistake(s) found
                        </Text>
                      )}
                    </>
                  )}
                  {activeRecording.result.error && (
                    <Text style={[styles.resultText, { color: '#e65100' }]}>
                      ⚠️ {activeRecording.result.error}
                    </Text>
                  )}
                </View>
              )}

              {/* Previous check result (when not actively recording) */}
              {!isActive && lastCheck && (
                <View style={[
                  styles.resultContainer,
                  lastCheck.isCorrect ? styles.resultCorrect : styles.resultIncorrect,
                ]}>
                  <Text style={[styles.resultText, { fontSize: 12 }]}>
                    {lastCheck.isCorrect ? '✅ Last check: Correct' : '❌ Last check: Needs work'}
                    {lastCheck.transcription ? ` — "${lastCheck.transcription}"` : ''}
                  </Text>
                </View>
              )}
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.repeatButton, isComplete && { backgroundColor: '#4caf50' }]} 
                  onPress={() => handleRepeat(item.id)}
                >
                  <Text style={styles.repeatText}>{isComplete ? 'Completed ✓' : `Tap Repeat (${item.repetitionCount})`}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.recordButton,
                    isActive && activeRecording?.state === 'recording' && styles.recordButtonRecording,
                    isActive && activeRecording?.state === 'checking' && styles.recordButtonChecking,
                  ]}
                  onPress={() => handleRecordPress(item.id, item.text)}
                  disabled={isActive && activeRecording?.state === 'checking'}
                >
                  {isActive && activeRecording?.state === 'recording' ? (
                    <Text style={styles.recordButtonText}>🔴 Tap to Stop</Text>
                  ) : isActive && activeRecording?.state === 'checking' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.recordButtonText}>🎤 Check Recitation</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No ayat added yet. Start by adding a verse to memorize.</Text>}
      />
    </View>
  );
}
