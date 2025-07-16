import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import authService from '../../services/authService';

export default function HomeScreen() {
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.replace('/login');
    }
  }, []);

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nen Discovery</Text>
        <Text style={styles.subtitle}>
          Welcome to the world of Hunter × Hunter
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Discover your Nen type through personality analysis and unlock the secrets of your aura.
        </Text>
        
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartQuiz}
        >
          <Text style={styles.startButtonText}>Discover My Nen Type</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
