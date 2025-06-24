import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameStats {
  totalPlayTime: number;
  chaptersCompleted: number;
  achievementsUnlocked: number;
  choicesMade: number;
  minigamesPlayed: number;
  bestScores: Record<string, number>;
  endings: string[];
  favoriteCharacter: string;
  relationshipScores: Record<string, number>;
}

interface ProgressContextType {
  gameStats: GameStats;
  updatePlayTime: (minutes: number) => void;
  completeChapter: (chapterId: number, score: number) => void;
  unlockAchievement: (achievementId: string) => void;
  recordChoice: (choiceId: string, chapterId: number) => void;
  recordMinigame: (gameType: string, score: number) => void;
  recordEnding: (endingType: string) => void;
  updateRelationship: (character: string, score: number) => void;
  getCompletionPercentage: () => number;
  getPlayTimeFormatted: () => string;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgressTracker = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressTracker must be used within ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: React.ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPlayTime: 0,
    chaptersCompleted: 0,
    achievementsUnlocked: 0,
    choicesMade: 0,
    minigamesPlayed: 0,
    bestScores: {},
    endings: [],
    favoriteCharacter: '',
    relationshipScores: {
      roro_jonggrang: 50,
      bandung_bondowoso: 50,
      raja_baka: 50,
    },
  });

  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    loadGameStats();
    setSessionStartTime(Date.now());

    // Track session time
    const interval = setInterval(() => {
      const sessionTime = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
      if (sessionTime > 0) {
        updatePlayTime(sessionTime);
        setSessionStartTime(Date.now());
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadGameStats = async () => {
    try {
      const statsString = await AsyncStorage.getItem('gameStats');
      if (statsString) {
        const stats = JSON.parse(statsString);
        setGameStats(stats);
      }
    } catch (error) {
      console.log('Error loading game stats:', error);
    }
  };

  const saveGameStats = async (newStats: GameStats) => {
    try {
      await AsyncStorage.setItem('gameStats', JSON.stringify(newStats));
      setGameStats(newStats);
    } catch (error) {
      console.log('Error saving game stats:', error);
    }
  };

  const updatePlayTime = (minutes: number) => {
    const newStats = {
      ...gameStats,
      totalPlayTime: gameStats.totalPlayTime + minutes,
    };
    saveGameStats(newStats);
  };

  const completeChapter = (chapterId: number, score: number) => {
    const newStats = {
      ...gameStats,
      chaptersCompleted: Math.max(gameStats.chaptersCompleted, chapterId),
      bestScores: {
        ...gameStats.bestScores,
        [`chapter_${chapterId}`]: Math.max(
          gameStats.bestScores[`chapter_${chapterId}`] || 0,
          score
        ),
      },
    };
    saveGameStats(newStats);
  };

  const unlockAchievement = (achievementId: string) => {
    const newStats = {
      ...gameStats,
      achievementsUnlocked: gameStats.achievementsUnlocked + 1,
    };
    saveGameStats(newStats);
  };

  const recordChoice = (choiceId: string, chapterId: number) => {
    const newStats = {
      ...gameStats,
      choicesMade: gameStats.choicesMade + 1,
    };
    saveGameStats(newStats);
  };

  const recordMinigame = (gameType: string, score: number) => {
    const newStats = {
      ...gameStats,
      minigamesPlayed: gameStats.minigamesPlayed + 1,
      bestScores: {
        ...gameStats.bestScores,
        [gameType]: Math.max(gameStats.bestScores[gameType] || 0, score),
      },
    };
    saveGameStats(newStats);
  };

  const recordEnding = (endingType: string) => {
    if (!gameStats.endings.includes(endingType)) {
      const newStats = {
        ...gameStats,
        endings: [...gameStats.endings, endingType],
      };
      saveGameStats(newStats);
    }
  };

  const updateRelationship = (character: string, score: number) => {
    const newStats = {
      ...gameStats,
      relationshipScores: {
        ...gameStats.relationshipScores,
        [character]: score,
      },
    };

    // Determine favorite character
    const highestScore = Math.max(
      ...Object.values(newStats.relationshipScores)
    );
    const favoriteChar =
      Object.keys(newStats.relationshipScores).find(
        (char) => newStats.relationshipScores[char] === highestScore
      ) || '';

    newStats.favoriteCharacter = favoriteChar;
    saveGameStats(newStats);
  };

  const getCompletionPercentage = (): number => {
    const totalContent = 5; // 5 chapters
    const totalAchievements = 20;
    const totalEndings = 3;

    const chapterProgress = (gameStats.chaptersCompleted / totalContent) * 40;
    const achievementProgress =
      (gameStats.achievementsUnlocked / totalAchievements) * 40;
    const endingProgress = (gameStats.endings.length / totalEndings) * 20;

    return Math.round(chapterProgress + achievementProgress + endingProgress);
  };

  const getPlayTimeFormatted = (): string => {
    const hours = Math.floor(gameStats.totalPlayTime / 60);
    const minutes = gameStats.totalPlayTime % 60;

    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const value: ProgressContextType = {
    gameStats,
    updatePlayTime,
    completeChapter,
    unlockAchievement,
    recordChoice,
    recordMinigame,
    recordEnding,
    updateRelationship,
    getCompletionPercentage,
    getPlayTimeFormatted,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
