import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Save, Download, Trash2, X, Calendar } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

interface SaveData {
  id: string;
  chapterId: number;
  sceneIndex: number;
  timestamp: number;
  relationshipScore: number;
  choices: Record<string, string>;
  achievements: string[];
}

interface SaveLoadSystemProps {
  isVisible: boolean;
  onClose: () => void;
  onLoad?: (saveData: SaveData) => void;
  currentSaveData?: Partial<SaveData>;
  mode: 'save' | 'load';
}

export default function SaveLoadSystem({
  isVisible,
  onClose,
  onLoad,
  currentSaveData,
  mode,
}: SaveLoadSystemProps) {
  const [saveSlots, setSaveSlots] = useState<(SaveData | null)[]>(
    Array(6).fill(null)
  );

  useEffect(() => {
    if (isVisible) {
      loadSaveSlots();
    }
  }, [isVisible]);

  const loadSaveSlots = async () => {
    try {
      const saves = await AsyncStorage.getItem('gameSaves');
      if (saves) {
        setSaveSlots(JSON.parse(saves));
      }
    } catch (error) {
      console.log('Error loading save slots:', error);
    }
  };

  const saveToSlot = async (slotIndex: number) => {
    if (!currentSaveData) return;

    const newSave: SaveData = {
      id: `save_${Date.now()}`,
      chapterId: currentSaveData.chapterId || 1,
      sceneIndex: currentSaveData.sceneIndex || 0,
      timestamp: Date.now(),
      relationshipScore: currentSaveData.relationshipScore || 50,
      choices: currentSaveData.choices || {},
      achievements: currentSaveData.achievements || [],
    };

    const newSlots = [...saveSlots];
    newSlots[slotIndex] = newSave;

    try {
      await AsyncStorage.setItem('gameSaves', JSON.stringify(newSlots));
      setSaveSlots(newSlots);
      Alert.alert('Berhasil', 'Game berhasil disimpan!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan game.');
    }
  };

  const loadFromSlot = (slotIndex: number) => {
    const saveData = saveSlots[slotIndex];
    if (saveData && onLoad) {
      onLoad(saveData);
      onClose();
    }
  };

  const deleteSlot = async (slotIndex: number) => {
    Alert.alert('Hapus Save', 'Apakah Anda yakin ingin menghapus save ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const newSlots = [...saveSlots];
          newSlots[slotIndex] = null;

          try {
            await AsyncStorage.setItem('gameSaves', JSON.stringify(newSlots));
            setSaveSlots(newSlots);
          } catch (error) {
            Alert.alert('Error', 'Gagal menghapus save.');
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSaveSlot = (saveData: SaveData | null, index: number) => (
    <Animated.View
      key={index}
      entering={FadeIn.delay(index * 100)}
      style={styles.saveSlot}
    >
      {saveData ? (
        <TouchableOpacity
          style={styles.saveSlotContent}
          onPress={() =>
            mode === 'load' ? loadFromSlot(index) : saveToSlot(index)
          }
        >
          <View style={styles.saveInfo}>
            <Text style={styles.saveTitle}>
              Chapter {saveData.chapterId} - Scene {saveData.sceneIndex + 1}
            </Text>
            <View style={styles.saveDetails}>
              <Calendar size={12} color="#D4AF37" />
              <Text style={styles.saveDate}>
                {formatDate(saveData.timestamp)}
              </Text>
            </View>
            <Text style={styles.saveProgress}>
              Hubungan: {saveData.relationshipScore}% | Pencapaian:{' '}
              {saveData.achievements.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteSlot(index)}
          >
            <Trash2 size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.emptySaveSlot}
          onPress={() => (mode === 'save' ? saveToSlot(index) : undefined)}
          disabled={mode === 'load'}
        >
          <View style={styles.emptySlotIcon}>
            {mode === 'save' ? (
              <Save size={24} color="#666" />
            ) : (
              <Download size={24} color="#666" />
            )}
          </View>
          <Text style={styles.emptySlotText}>
            {mode === 'save' ? 'Slot Kosong' : 'Tidak Ada Save'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          entering={SlideInDown.springify()}
          style={styles.saveLoadContainer}
        >
          <LinearGradient
            colors={[
              'rgba(26,26,26,0.98)',
              'rgba(45,27,78,0.98)',
              'rgba(26,26,26,0.98)',
            ]}
            style={styles.saveLoadContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>
                {mode === 'save' ? 'Simpan Game' : 'Muat Game'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.slotsContainer}
              showsVerticalScrollIndicator={false}
            >
              {saveSlots.map((saveData, index) =>
                renderSaveSlot(saveData, index)
              )}
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  saveLoadContainer: {
    width: '90%',
    maxHeight: '80%',
  },
  saveLoadContent: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
  },
  closeButton: {
    padding: 8,
  },
  slotsContainer: {
    maxHeight: 400,
  },
  saveSlot: {
    marginBottom: 12,
  },
  saveSlotContent: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveInfo: {
    flex: 1,
  },
  saveTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  saveDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  saveDate: {
    fontSize: 12,
    fontFamily: 'CrimsonText-Regular',
    color: '#D4AF37',
    marginLeft: 4,
  },
  saveProgress: {
    fontSize: 12,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    opacity: 0.8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  emptySaveSlot: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotIcon: {
    marginBottom: 8,
  },
  emptySlotText: {
    fontSize: 14,
    fontFamily: 'CrimsonText-Regular',
    color: '#666',
  },
});
