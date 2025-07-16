import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import nenTypeService from '../services/nenTypeService';

export default function QuizScreen() {
  const [showWebView, setShowWebView] = useState(false);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleStartQuiz = () => {
    setShowWebView(true);
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'MBTI_RESULT') {
        const mbtiType = data.result;
        const nenType = nenTypeService.mapMBTIToNen(mbtiType);
        
        // Store the result and navigate to ritual
        router.push({
          pathname: '/ritual',
          params: { mbtiType, nenType }
        });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleWebViewError = () => {
    Alert.alert(
      'Connection Error',
      'Unable to load the quiz. Please check your internet connection.',
      [
        { text: 'Retry', onPress: () => setShowWebView(false) },
        { text: 'Cancel', onPress: () => router.back() }
      ]
    );
  };

  if (showWebView) {
    return (
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://devil.ai/mbti-test' }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript={`
            // Listen for quiz completion
            window.addEventListener('message', function(event) {
              if (event.data && event.data.type === 'QUIZ_COMPLETE') {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'MBTI_RESULT',
                  result: event.data.mbtiType
                }));
              }
            });
            
            // Check for result on page load
            setTimeout(() => {
              const result = localStorage.getItem('mbti_result');
              if (result) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'MBTI_RESULT',
                  result: result
                }));
              }
            }, 2000);
          `}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowWebView(false)}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MBTI Personality Assessment</Text>
        <Text style={styles.subtitle}>
          To determine your Nen type, we'll analyze your personality through a 
          comprehensive MBTI assessment powered by Devil.ai
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What to Expect:</Text>
        <Text style={styles.infoText}>
          • 60-80 carefully crafted questions{'\n'}
          • 10-15 minutes to complete{'\n'}
          • Honest answers for accurate results{'\n'}
          • Your Nen type revealed at the end
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartQuiz}
        disabled={loading}
      >
        <Text style={styles.startButtonText}>
          {loading ? 'Loading...' : 'Begin Assessment'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        This assessment uses the scientifically-backed MBTI framework to 
        determine your Hunter × Hunter Nen type affinity
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#4a9eff',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#4a9eff',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});