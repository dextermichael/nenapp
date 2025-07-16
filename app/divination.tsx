import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import nenTypeService, { NenType } from '../services/nenTypeService';

export default function DivinationScreen() {
  const { mbtiType, nenType } = useLocalSearchParams();
  const [phase, setPhase] = useState<'setup' | 'animation' | 'result'>('setup');
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const glassOpacity = useSharedValue(0);
  const waterLevel = useSharedValue(0);
  const leafRotation = useSharedValue(0);
  const particleScale = useSharedValue(0);
  const colorOpacity = useSharedValue(0);

  const currentNenType = nenType as NenType;
  const divinationResult = nenTypeService.getWaterDivinationResult(currentNenType);

  useEffect(() => {
    if (phase === 'animation') {
      startAnimation();
    }
  }, [phase]);

  const startAnimation = () => {
    // Show glass first
    glassOpacity.value = withTiming(1, { duration: 500 });
    
    // Fill with water
    setTimeout(() => {
      waterLevel.value = withTiming(0.6, { duration: 1500 });
    }, 500);

    // Start type-specific animation after water fills
    setTimeout(() => {
      switch (currentNenType) {
        case NenType.ENHANCER:
          // Water overflows
          waterLevel.value = withSequence(
            withTiming(1.2, { duration: 1000 }),
            withSpring(1.0, { damping: 8 })
          );
          break;
          
        case NenType.TRANSMUTER:
          // Color changes (simulate taste change)
          colorOpacity.value = withSequence(
            withTiming(0.8, { duration: 1000 }),
            withTiming(0.3, { duration: 500 }),
            withTiming(1, { duration: 500 })
          );
          break;
          
        case NenType.CONJURER:
          // Particles appear (impurities)
          particleScale.value = withSequence(
            withTiming(1, { duration: 800 }),
            withSpring(1.2, { damping: 4 })
          );
          break;
          
        case NenType.SPECIALIST:
          // Unique effect - glass itself changes
          glassOpacity.value = withSequence(
            withTiming(0.3, { duration: 500 }),
            withTiming(1, { duration: 500 }),
            withTiming(0.7, { duration: 300 }),
            withTiming(1, { duration: 300 })
          );
          break;
          
        case NenType.MANIPULATOR:
          // Leaf moves
          leafRotation.value = withSequence(
            withTiming(180, { duration: 1000 }),
            withTiming(360, { duration: 1000 }),
            withSpring(270, { damping: 6 })
          );
          break;
          
        case NenType.EMITTER:
          // Water color changes (energy emission)
          colorOpacity.value = withSequence(
            withTiming(1, { duration: 800 }),
            withTiming(0.5, { duration: 400 }),
            withTiming(1, { duration: 400 })
          );
          break;
      }
      
      // Complete animation after 3 seconds
      setTimeout(() => {
        runOnJS(setAnimationComplete)(true);
      }, 3000);
    }, 2000);
  };

  const handleContinue = () => {
    router.push({
      pathname: '/profile',
      params: { mbtiType, nenType }
    });
  };

  const glassStyle = useAnimatedStyle(() => ({
    opacity: glassOpacity.value,
  }));

  const waterStyle = useAnimatedStyle(() => ({
    height: `${Math.min(waterLevel.value * 100, 100)}%`,
  }));

  const leafStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${leafRotation.value}deg` }],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: particleScale.value }],
    opacity: particleScale.value,
  }));

  const colorOverlayStyle = useAnimatedStyle(() => ({
    opacity: colorOpacity.value,
  }));

  if (phase === 'setup') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Water Divination</Text>
          <Text style={styles.subtitle}>
            Place your hands around the glass and focus your aura into the water
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            This ancient technique will reveal your Nen type through the water's reaction to your aura.
            Each type produces a unique change in the water.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setPhase('animation')}
        >
          <Text style={styles.startButtonText}>Begin Divination</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'animation') {
    return (
      <View style={styles.animationContainer}>
        <Text style={styles.concentrateText}>Focus your aura...</Text>
        
        <View style={styles.divinationSetup}>
          <Animated.View style={[styles.glass, glassStyle]}>
            <Animated.View style={[styles.water, waterStyle]}>
              {/* Color overlay for Transmuter/Emitter */}
              <Animated.View style={[styles.colorOverlay, colorOverlayStyle, {
                backgroundColor: currentNenType === NenType.TRANSMUTER ? '#4a9eff' : 
                              currentNenType === NenType.EMITTER ? '#ff6b6b' : 'transparent'
              }]} />
              
              {/* Particles for Conjurer */}
              {currentNenType === NenType.CONJURER && (
                <Animated.View style={[styles.particles, particleStyle]}>
                  <View style={[styles.particle, { top: '20%', left: '30%' }]} />
                  <View style={[styles.particle, { top: '50%', left: '60%' }]} />
                  <View style={[styles.particle, { top: '70%', left: '25%' }]} />
                </Animated.View>
              )}
            </Animated.View>
            
            {/* Leaf for Manipulator */}
            {currentNenType === NenType.MANIPULATOR && (
              <Animated.View style={[styles.leaf, leafStyle]}>
                <Text style={styles.leafEmoji}>🍃</Text>
              </Animated.View>
            )}
          </Animated.View>
        </View>

        {animationComplete && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{divinationResult}</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Reveal My Nen Type</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return null;
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
    borderLeftColor: '#4a9eff',
  },
  instructionText: {
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
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  animationContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  concentrateText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
    fontWeight: '600',
  },
  divinationSetup: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  glass: {
    width: 120,
    height: 160,
    borderWidth: 3,
    borderColor: '#fff',
    borderTopWidth: 1,
    borderRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  water: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#87ceeb',
  },
  colorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  leaf: {
    position: 'absolute',
    top: 20,
    left: 45,
    zIndex: 10,
  },
  leafEmoji: {
    fontSize: 24,
  },
  resultContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#4a9eff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});