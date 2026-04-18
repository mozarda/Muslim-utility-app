/**
 * Audio Recorder Utility for Expo/React Native
 * Records audio and converts to base64 for API submission.
 */
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface RecordingResult {
  base64: string;
  durationMs: number;
  uri: string;
}

let currentRecording: Audio.Recording | null = null;

export async function startRecording(): Promise<void> {
  // Request permissions
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Microphone permission denied');
  }

  // Set audio mode for recording
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  // Start recording
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync({
    isMeteringEnabled: false,
    android: {
      extension: '.m4a',
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
      audioQuality: Audio.IOSAudioQuality.LOW,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    web: {
      mimeType: 'audio/webm',
      bitsPerSecond: 128000,
    },
  });

  await recording.startAsync();
  currentRecording = recording;
}

export async function stopRecording(): Promise<RecordingResult> {
  if (!currentRecording) {
    throw new Error('No active recording');
  }

  const recording = currentRecording;
  currentRecording = null;

  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();

  if (!uri) {
    throw new Error('Recording URI is null');
  }

  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });

  // Get duration from status
  const status = await recording.getStatusAsync();
  const durationMs = status.durationMillis || 0;

  return { base64, durationMs, uri };
}

export function cancelRecording(): void {
  if (currentRecording) {
    currentRecording.stopAndUnloadAsync().catch(() => {});
    currentRecording = null;
  }
}

export function isRecording(): boolean {
  return currentRecording !== null;
}
