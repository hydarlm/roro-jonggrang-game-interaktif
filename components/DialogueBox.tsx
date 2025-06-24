import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface DialogueChoice {
  id: string;
  text: string;
  effect?: 'positive' | 'negative' | 'neutral';
}

interface DialogueBoxProps {
  speaker?: string;
  text: string;
  choices?: DialogueChoice[];
  onNext?: () => void;
  onChoice?: (choiceId: string) => void;
  isVisible: boolean;
  autoAdvance?: boolean;
  typingSpeed?: number;
}

export default function DialogueBox({
  speaker,
  text,
  choices,
  onNext,
  onChoice,
  isVisible,
  autoAdvance = false,
  typingSpeed = 50,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);

    let currentIndex = 0;
    const typeText = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      } else {
        setIsTyping(false);
        if (choices && choices.length > 0) {
          setTimeout(() => setShowChoices(true), 500);
        } else if (autoAdvance) {
          setTimeout(() => onNext?.(), 2000);
        }
      }
    };

    typeText();
  }, [text, isVisible, typingSpeed, autoAdvance, choices, onNext]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      if (choices && choices.length > 0) {
        setShowChoices(true);
      }
    } else if (!choices || choices.length === 0) {
      onNext?.();
    }
  };

  const handleChoice = (choiceId: string) => {
    onChoice?.(choiceId);
    setShowChoices(false);
  };

  const getChoiceStyle = (choice: DialogueChoice) => {
    switch (choice.effect) {
      case 'positive':
        return {
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50',
        };
      case 'negative':
        return {
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          borderColor: '#F44336',
        };
      default:
        return {
          backgroundColor: 'rgba(212, 175, 55, 0.2)',
          borderColor: '#D4AF37',
        };
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View entering={SlideInDown.springify()} style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(26,26,26,0.95)', 'rgba(0,0,0,0.9)']}
        style={styles.dialogueBox}
      >
        {speaker && (
          <View style={styles.speakerContainer}>
            <Text style={styles.speakerName}>{speaker}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.textContainer}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.dialogueText}>{displayedText}</Text>

          {!isTyping && !showChoices && (
            <Animated.View
              entering={FadeIn.delay(300)}
              style={styles.continueIndicator}
            >
              <ChevronDown size={16} color="#D4AF37" />
              <Text style={styles.continueText}>Tap untuk lanjut</Text>
            </Animated.View>
          )}
        </TouchableOpacity>

        {showChoices && choices && choices.length > 0 && (
          <Animated.View
            entering={FadeIn.delay(300)}
            style={styles.choicesContainer}
          >
            <Text style={styles.choicesLabel}>Pilih respons:</Text>
            {choices.map((choice, index) => (
              <TouchableOpacity
                key={choice.id}
                style={[styles.choiceButton, getChoiceStyle(choice)]}
                onPress={() => handleChoice(choice.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.choiceText}>{choice.text}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dialogueBox: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D4AF37',
    overflow: 'hidden',
  },
  speakerContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  speakerName: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
  },
  textContainer: {
    padding: 20,
    minHeight: 80,
  },
  dialogueText: {
    fontSize: 16,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    lineHeight: 24,
  },
  continueIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.3)',
  },
  continueText: {
    fontSize: 12,
    fontFamily: 'CrimsonText-Regular',
    color: '#D4AF37',
    marginLeft: 4,
    opacity: 0.8,
  },
  choicesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  choicesLabel: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    marginBottom: 12,
  },
  choiceButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  choiceText: {
    fontSize: 15,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    textAlign: 'center',
  },
});
