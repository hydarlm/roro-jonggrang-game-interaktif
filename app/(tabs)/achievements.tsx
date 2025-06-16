import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Crown, Heart, Sword, Book } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'story' | 'quiz' | 'choice' | 'special';
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_chapter',
      title: 'Awal Perjalanan',
      description: 'Selesaikan Chapter 1',
      icon: Book,
      category: 'story',
      isUnlocked: false,
    },
    {
      id: 'perfect_quiz',
      title: 'Cendekia Prambanan',
      description: 'Jawab semua quiz dengan sempurna',
      icon: Star,
      category: 'quiz',
      isUnlocked: false,
      progress: 0,
      maxProgress: 5,
    },
    {
      id: 'wise_choices',
      title: 'Kebijaksanaan Roro',
      description: 'Buat pilihan bijak dalam dialog',
      icon: Crown,
      category: 'choice',
      isUnlocked: false,
      progress: 0,
      maxProgress: 10,
    },
    {
      id: 'romantic_ending',
      title: 'Cinta Sejati',
      description: 'Raih ending romantis',
      icon: Heart,
      category: 'story',
      isUnlocked: false,
    },
    {
      id: 'battle_master',
      title: 'Ahli Strategi',
      description: 'Menangkan semua mini-game battle',
      icon: Sword,
      category: 'special',
      isUnlocked: false,
    },
    {
      id: 'story_master',
      title: 'Master Legenda',
      description: 'Selesaikan semua chapter',
      icon: Trophy,
      category: 'story',
      isUnlocked: false,
    },
  ]);

  const [stats, setStats] = useState({
    totalAchievements: 0,
    unlockedAchievements: 0,
    completionPercentage: 0,
  });

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const savedAchievements = await AsyncStorage.getItem('achievements');
      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        setAchievements(prevAchievements => 
          prevAchievements.map(achievement => ({
            ...achievement,
            isUnlocked: parsed.includes(achievement.id),
          }))
        );
        
        setStats({
          totalAchievements: achievements.length,
          unlockedAchievements: parsed.length,
          completionPercentage: Math.round((parsed.length / achievements.length) * 100),
        });
      }
    } catch (error) {
      console.log('Error loading achievements:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'story': return '#4A90E2';
      case 'quiz': return '#50E3C2';
      case 'choice': return '#F5A623';
      case 'special': return '#D0021B';
      default: return '#D4AF37';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'story': return 'Cerita';
      case 'quiz': return 'Kuis';
      case 'choice': return 'Pilihan';
      case 'special': return 'Spesial';
      default: return 'Lainnya';
    }
  };

  const renderAchievement = (achievement: Achievement, index: number) => {
    const IconComponent = achievement.icon;
    const categoryColor = getCategoryColor(achievement.category);
    
    return (
      <Animated.View
        key={achievement.id}
        entering={FadeInDown.delay(index * 100)}
        style={[
          styles.achievementCard,
          achievement.isUnlocked && styles.unlockedCard,
        ]}
      >
        <View style={styles.achievementContent}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: achievement.isUnlocked ? categoryColor : 'rgba(255,255,255,0.1)' }
          ]}>
            <IconComponent 
              size={24} 
              color={achievement.isUnlocked ? '#FFF' : '#666'} 
            />
          </View>
          
          <View style={styles.achievementInfo}>
            <Text style={[
              styles.achievementTitle,
              !achievement.isUnlocked && styles.lockedText
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDescription,
              !achievement.isUnlocked && styles.lockedText
            ]}>
              {achievement.description}
            </Text>
            
            <View style={styles.achievementMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                <Text style={styles.categoryText}>
                  {getCategoryName(achievement.category)}
                </Text>
              </View>
              
              {achievement.progress !== undefined && (
                <Text style={styles.progressText}>
                  {achievement.progress}/{achievement.maxProgress}
                </Text>
              )}
            </View>
          </View>
          
          {achievement.isUnlocked && (
            <View style={styles.unlockedBadge}>
              <Trophy size={16} color="#D4AF37" />
            </View>
          )}
        </View>
        
        {achievement.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%`,
                    backgroundColor: categoryColor,
                  }
                ]} 
              />
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d1b4e', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galeri Pencapaian</Text>
        <Text style={styles.headerSubtitle}>
          {stats.unlockedAchievements}/{stats.totalAchievements} Terbuka
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Trophy size={20} color="#D4AF37" />
            <Text style={styles.statValue}>{stats.unlockedAchievements}</Text>
            <Text style={styles.statLabel}>Pencapaian</Text>
          </View>
          
          <View style={styles.statCard}>
            <Star size={20} color="#D4AF37" />
            <Text style={styles.statValue}>{stats.completionPercentage}%</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {achievements.map((achievement, index) => renderAchievement(achievement, index))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    padding: 16,
  },
  unlockedCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#FFF',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  lockedText: {
    opacity: 0.5,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'CrimsonText-SemiBold',
    color: '#FFF',
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'CrimsonText-Regular',
    color: '#D4AF37',
  },
  unlockedBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});