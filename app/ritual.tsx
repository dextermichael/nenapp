import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated';

export default function RitualScreen() {
  const { mbtiType, nenType } = useLocalSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [phase, setPhase] = useState<'instruction' | 'ritual' | 'complete'>('instruction');
  
  const pulseAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);

  useEffect(() => {
    if (phase === 'ritual') {
      // Start pulsing animation
      pulseAnimation.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );
      
      // Start glow animation
      glowAnimation.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      );

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('complete');
            setTimeout(() => {
              router.push({
                pathname: '/divination',
                params: { mbtiType, nenType }
              });
            }, 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase]);

  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.2]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.7, 1]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(glowAnimation.value, [0, 1], [0.3, 0.8]);
    
    return {
      shadowOpacity,
    };
  });

  const handleStartRitual = () => {
    setPhase('ritual');
  };

  if (phase === 'instruction') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Aura Awakening Ritual</Text>
          <Text style={styles.subtitle}>
            Prepare to focus your life energy and awaken your Nen
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>
            1. Find a quiet space and sit comfortably{'\n'}
            2. Close your eyes and breathe deeply{'\n'}
            3. Focus your mind on your inner energy{'\n'}
            4. Visualize your aura flowing around you{'\n'}
            5. Maintain concentration for 10 seconds
          </Text>
        </View>

        <TouchableOpacity
          style={styles.beginButton}
          onPress={handleStartRitual}
        >
          <Text style={styles.beginButtonText}>Begin Ritual</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'ritual') {
    return (
      <View style={styles.ritualContainer}>
        <Animated.View style={[styles.auraCircle, pulseStyle, glowStyle]}>
          <View style={styles.innerCircle}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        </Animated.View>
        
        <Text style={styles.focusText}>Focus your aura...</Text>
        <Text style={styles.breatheText}>Breathe deeply and concentrate</Text>
      </View>
    );
  }

  return (
    <View style={styles.completeContainer}>
      <Animated.View style={[styles.completeCircle, glowStyle]}>
        <Text style={styles.completeText}>✨</Text>
      </Animated.View>
      <Text style={styles.awakningText}>Aura Awakened!</Text>
      <Text style={styles.proceedText}>Proceeding to water divination...</Text>
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
  instructionBox: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 12,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#9d4edd',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  beginButton: {
    backgroundColor: '#9d4edd',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  ritualContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  auraCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#9d4edd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9d4edd',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 10,
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  focusText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 40,
    fontWeight: '600',
  },
  breatheText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
  },
  completeContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4a9eff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a9eff',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 10,
  },
  completeText: {
    fontSize: 48,
  },
  awakningText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 30,
  },
  proceedText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
  },
});