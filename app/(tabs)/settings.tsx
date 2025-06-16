import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Volume2, VolumeX, RefreshCw, Info, Settings as SettingsIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    autoAdvance: false,
    textSpeed: 1,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('gameSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem('gameSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Apakah Anda yakin ingin menghapus semua progress game? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['gameProgress', 'chapterProgress', 'achievements']);
              Alert.alert('Berhasil', 'Progress game telah direset.');
            } catch (error) {
              Alert.alert('Error', 'Gagal mereset progress game.');
            }
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'Tentang Game',
      'Roro Jonggrang: Legenda Candi Prambanan\n\nSebuah visual novel interaktif yang mengisahkan legenda terkenal dari Jawa Tengah. Game ini menggabungkan storytelling tradisional dengan gameplay modern.\n\nDikembangkan dengan penuh cinta untuk melestarikan budaya Indonesia.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: any,
    index: number
  ) => {
    const IconComponent = icon;
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        style={styles.settingItem}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingIcon}>
            <IconComponent size={24} color="#D4AF37" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            <Text style={styles.settingDescription}>{description}</Text>
          </View>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#767577', true: '#D4AF37' }}
            thumbColor={value ? '#FFF' : '#f4f3f4'}
          />
        </View>
      </Animated.View>
    );
  };

  const renderActionItem = (
    title: string,
    description: string,
    onPress: () => void,
    icon: any,
    index: number,
    isDestructive = false
  ) => {
    const IconComponent = icon;
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        style={styles.settingItem}
      >
        <TouchableOpacity style={styles.settingContent} onPress={onPress}>
          <View style={styles.settingIcon}>
            <IconComponent size={24} color={isDestructive ? '#FF6B6B' : '#D4AF37'} />
          </View>
          <View style={styles.settingText}>
            <Text style={[
              styles.settingTitle,
              isDestructive && styles.destructiveText
            ]}>
              {title}
            </Text>
            <Text style={styles.settingDescription}>{description}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d1b4e', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <Text style={styles.headerSubtitle}>Sesuaikan pengalaman bermain Anda</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          {renderSettingItem(
            'Efek Suara',
            'Aktifkan suara untuk interaksi dan efek',
            settings.soundEnabled,
            (value) => saveSettings({ ...settings, soundEnabled: value }),
            settings.soundEnabled ? Volume2 : VolumeX,
            0
          )}
          
          {renderSettingItem(
            'Musik Latar',
            'Mainkan musik tradisional selama permainan',
            settings.musicEnabled,
            (value) => saveSettings({ ...settings, musicEnabled: value }),
            settings.musicEnabled ? Volume2 : VolumeX,
            1
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permainan</Text>
          
          {renderSettingItem(
            'Auto Advance',
            'Dialog berlanjut otomatis setelah beberapa detik',
            settings.autoAdvance,
            (value) => saveSettings({ ...settings, autoAdvance: value }),
            SettingsIcon,
            2
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lainnya</Text>
          
          {renderActionItem(
            'Tentang Game',
            'Informasi tentang developer dan game',
            showAbout,
            Info,
            3
          )}
          
          {renderActionItem(
            'Reset Progress',
            'Hapus semua progress dan mulai dari awal',
            resetProgress,
            RefreshCw,
            4,
            true
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Roro Jonggrang v1.0.0
        </Text>
        <Text style={styles.footerSubtext}>
          Dibuat dengan ❤️ untuk melestarikan budaya Indonesia
        </Text>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 12,
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#FFF',
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    opacity: 0.8,
    marginTop: 2,
  },
  destructiveText: {
    color: '#FF6B6B',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.3)',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'CrimsonText-SemiBold',
    color: '#D4AF37',
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
});