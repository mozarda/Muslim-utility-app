import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>The app encountered an unexpected error.</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  errorTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#c62828' },
  errorText: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
  retryButton: { padding: 12, backgroundColor: '#2e7d32', borderRadius: 6 },
  retryText: { color: 'white', fontWeight: 'bold' },
});

export default function App() {
  return (
    <ErrorBoundary>
      <AppNavigator />
    </ErrorBoundary>
  );
}
