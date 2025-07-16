import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share } from 'react-native';
import { useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { captureRef } from 'react-native-view-shot';
import nenTypeService, { NenType } from '../services/nenTypeService';
import authService from '../services/authService';

export default function ProfileScreen() {
  const { mbtiType, nenType } = useLocalSearchParams();
  const [sharing, setSharing] = useState(false);
  const profileRef = useRef<View>(null);
  
  const currentNenType = nenType as NenType;
  const profile = nenTypeService.getNenProfile(currentNenType);
  const user = authService.getCurrentUser();

  const getTypeColor = (type: NenType): string => {
    const colors = {
      [NenType.ENHANCER]: '#ff6b6b',
      [NenType.TRANSMUTER]: '#4ecdc4',
      [NenType.CONJURER]: '#45b7d1',
      [NenType.SPECIALIST]: '#96ceb4',
      [NenType.MANIPULATOR]: '#feca57',
      [NenType.EMITTER]: '#ff9ff3',
    };
    return colors[type];
  };

  const handleShare = async () => {
    if (!profileRef.current) return;
    
    setSharing(true);
    try {
      const uri = await captureRef(profileRef.current, {
        format: 'png',
        quality: 0.8,
      });

      const shareOptions = {
        title: 'My Nen Type Result',
        message: `I discovered my Nen type! I'm a ${currentNenType} type. Find out yours!`,
        url: uri,
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share your result');
    } finally {
      setSharing(false);
    }
  };

  const handleRetake = () => {
    router.push('/quiz');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Nen Type</Text>
      </View>

      <View ref={profileRef} style={styles.profileCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.userName}>{user?.displayName || 'Hunter'}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(currentNenType) }]}>
            <Text style={styles.typeText}>{currentNenType}</Text>
          </View>
        </View>

        <View style={styles.mbtiInfo}>
          <Text style={styles.mbtiLabel}>MBTI Type: {mbtiType}</Text>
        </View>

        <Text style={styles.description}>{profile.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Traits</Text>
          {profile.traits.map((trait, index) => (
            <View key={index} style={styles.traitItem}>
              <Text style={styles.traitBullet}>•</Text>
              <Text style={styles.traitText}>{trait}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notable Characters</Text>
          <View style={styles.charactersContainer}>
            {profile.characters.map((character, index) => (
              <View key={index} style={styles.characterChip}>
                <Text style={styles.characterText}>{character}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Nen Ability</Text>
          <View style={styles.abilityContainer}>
            <Text style={styles.abilityText}>{profile.suggestedAbility}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={handleShare}
          disabled={sharing}
        >
          <Text style={styles.shareButtonText}>
            {sharing ? 'Creating...' : '📤 Share Result'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.retakeButton]}
          onPress={handleRetake}
        >
          <Text style={styles.retakeButtonText}>🔄 Retake Test</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your Nen type is determined by your MBTI personality assessment.
          Train your abilities and unlock your full potential!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileCard: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mbtiInfo: {
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  mbtiLabel: {
    color: '#4a9eff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  traitBullet: {
    color: '#4a9eff',
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  traitText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  charactersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  characterChip: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  characterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  abilityContainer: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a9eff',
  },
  abilityText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#4a9eff',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retakeButton: {
    backgroundColor: '#333',
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});