import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Play,
  Info,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import { useSoundManager } from '@/components/SoundManager';

export default function HomeScreen() {
  const [gameProgress, setGameProgress] = useState(0);
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [lastPlayedChapter, setLastPlayedChapter] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const { playSound, playMusic, isMusicEnabled, toggleMusic } =
  useSoundManager();

  useEffect(() => {
    loadGameData();
    checkFirstTime();
    playMusic('menu');
  }, []);

  const loadGameData = async () => {
    try {
      const progress = await AsyncStorage.getItem('gameProgress');
      const achievements = await AsyncStorage.getItem('achievements');
      const chapterProgress = await AsyncStorage.getItem('chapterProgress');

      if (progress) setGameProgress(parseInt(progress));
      if (achievements) setTotalAchievements(JSON.parse(achievements).length);

      if (chapterProgress) {
        const chapters = JSON.parse(chapterProgress);
        const lastChapter =
          Math.max(
            ...Object.keys(chapters)
              .map(Number)
              .filter((n) => chapters[n].isCompleted)
          ) + 1;
        setLastPlayedChapter(Math.min(5, lastChapter));
      }
    } catch (error) {
      console.log('Error loading game data:', error);
    }
  };

  const checkFirstTime = async () => {
    try {
      const hasPlayed = await AsyncStorage.getItem('hasPlayedBefore');
      if (!hasPlayed) {
        setShowWelcome(true);
        await AsyncStorage.setItem('hasPlayedBefore', 'true');
      }
    } catch (error) {
      console.log('Error checking first time:', error);
    }
  };

  const startGame = () => {
    playSound('success');
    if (gameProgress > 0) {
      Alert.alert(
        'Lanjutkan Permainan',
        `Anda terakhir bermain di Chapter ${lastPlayedChapter}. Ingin melanjutkan atau mulai dari awal?`,
        [
          { text: 'Mulai Ulang', onPress: () => router.push('/story') },
          {
            text: 'Lanjutkan',
            onPress: () => router.push(`/chapter/${lastPlayedChapter}`),
          },
        ]
      );
    } else {
      router.push('/story');
    }
  };

  const showInfo = () => {
    playSound('click');
    router.push('/not-found'); // Placeholder for info screen
  }; 

  const showAchievements = () => {
    playSound('click');
    router.push('/achievements');
  };

  const showSettings = () => {
    playSound('click');
    router.push('/settings');
  };

  const dismissWelcome = () => {
    playSound('success');
    setShowWelcome(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bghome.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(75,0,130,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        {/* Music Toggle */}
        <TouchableOpacity style={styles.musicToggle} onPress={toggleMusic}>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)']}
            style={styles.musicButton}
          >
            {isMusicEnabled ? (
              <Volume2 size={20} color="#D4AF37" />
            ) : (
              <VolumeX size={20} color="#666" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.container}>
          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.titleContainer}
          >
            <Text style={styles.title}>Roro Jonggrang</Text>
            <Text style={styles.subtitle}>Legenda Candi Prambanan</Text>
            <View style={styles.decorativeLine} />
            <Text style={styles.tagline}>
              "Sebuah kisah tentang cinta, kesombongan, dan takdir"
            </Text>
          </Animated.View>

          <Animated.View
            entering={SlideInLeft.delay(400)}
            style={styles.statsContainer}
          >
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>{gameProgress}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${gameProgress}%` }]}
                />
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pencapaian</Text>
              <Text style={styles.statValue}>{totalAchievements}/20</Text>
              <View style={styles.achievementIcons}>
                {[...Array(Math.min(5, totalAchievements))].map((_, i) => (
                  <Trophy key={i} size={12} color="#D4AF37" />
                ))}
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
              <LinearGradient
                colors={['#D4AF37', '#B8941F']}
                style={styles.primaryButtonGradient}
              >
                <Play size={24} color="#000" />
                <Text style={styles.primaryButtonText}>
                  {gameProgress > 0
                    ? 'Lanjutkan Petualangan'
                    : 'Mulai Petualangan'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Animated.View
              entering={SlideInRight.delay(800)}
              style={styles.secondaryButtons}
            >
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={showAchievements}
              >
                <Trophy size={20} color="#D4AF37" />
                <Text style={styles.secondaryButtonText}>Pencapaian</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={showInfo}
                disabled={showWelcome}
              >
                <Info size={20} color="#D4AF37" />
                <Text style={styles.secondaryButtonText}>Info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={showSettings}
              >
                <Settings size={20} color="#D4AF37" />
                <Text style={styles.secondaryButtonText}>Pengaturan</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(1000)}
            style={styles.descriptionContainer}
          >
            <Text style={styles.description}>
              Masuki dunia legenda Jawa kuno. Ikuti kisah Roro Jonggrang, putri
              cantik yang menghadapi tantangan dari pangeran perkasa. Pilihan
              Anda akan menentukan nasib kerajaan Prambanan.
            </Text>
          </Animated.View>
        </View>

        {/* Welcome Modal */}
        {showWelcome && (
          <View style={styles.welcomeModal}>
            <LinearGradient
              colors={['rgba(26,26,26,0.95)', 'rgba(75,0,130,0.9)']}
              style={styles.welcomeContent}
            >
              <Text style={styles.welcomeTitle}>Selamat Datang!</Text>
              <Text style={styles.welcomeText}>
                Terima kasih telah memilih untuk menjelajahi legenda Roro
                Jonggrang. Game ini menggabungkan cerita tradisional Indonesia
                dengan teknologi modern.
                {'\n\n'}
                Nikmati perjalanan Anda melalui 5 chapter yang penuh dengan
                pilihan moral, mini-games menarik, dan multiple endings.
                {'\n\n'}
                Mari lestarikan budaya Indonesia melalui storytelling
                interaktif!
              </Text>
              <TouchableOpacity
                style={styles.welcomeButton}
                onPress={dismissWelcome}
              >
                <Text style={styles.welcomeButtonText}>Mulai Petualangan</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
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
  musicToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  musicButton: {
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
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
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    minWidth: 120,
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
  progressBar: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  achievementIcons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    width: '85%',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
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
    width: '90%',
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
    minWidth: 90,
  },
  secondaryButtonText: {
    fontSize: 12,
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
  welcomeModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  welcomeContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  welcomeButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  welcomeButtonText: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000',
  },
});
