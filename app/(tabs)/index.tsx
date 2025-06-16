import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Play, Info, Trophy } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [gameProgress, setGameProgress] = useState(0);
  const [totalAchievements, setTotalAchievements] = useState(0);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      const progress = await AsyncStorage.getItem('gameProgress');
      const achievements = await AsyncStorage.getItem('achievements');
      
      if (progress) setGameProgress(parseInt(progress));
      if (achievements) setTotalAchievements(JSON.parse(achievements).length);
    } catch (error) {
      console.log('Error loading game data:', error);
    }
  };

  const startGame = () => {
    router.push('/story');
  };

  const showInfo = () => {
    // Show game information modal
  };

  const showAchievements = () => {
    router.push('/achievements');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(75,0,130,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.titleContainer}>
            <Text style={styles.title}>Roro Jonggrang</Text>
            <Text style={styles.subtitle}>Legenda Candi Prambanan</Text>
            <View style={styles.decorativeLine} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>{gameProgress}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Achievements</Text>
              <Text style={styles.statValue}>{totalAchievements}/20</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
              <Play size={24} color="#000" />
              <Text style={styles.primaryButtonText}>Mulai Petualangan</Text>
            </TouchableOpacity>

            <View style={styles.secondaryButtons}>
              <TouchableOpacity style={styles.secondaryButton} onPress={showAchievements}>
                <Trophy size={20} color="#D4AF37" />
                <Text style={styles.secondaryButtonText}>Galeri</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={showInfo}>
                <Info size={20} color="#D4AF37" />
                <Text style={styles.secondaryButtonText}>Info</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800)} style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Masuki dunia legenda Jawa kuno. Ikuti kisah Roro Jonggrang, 
              putri cantik yang menghadapi tantangan dari pangeran perkasa. 
              Pilihan Anda akan menentukan nasib kerajaan Prambanan.
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  decorativeLine: {
    width: 100,
    height: 2,
    backgroundColor: '#D4AF37',
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    opacity: 0.8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '80%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  secondaryButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'CrimsonText-SemiBold',
    color: '#D4AF37',
    marginLeft: 6,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  description: {
    fontSize: 16,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
});