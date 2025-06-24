import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

import SceneIllustration from '@/components/SceneIllustration';
import DialogueBox from '@/components/DialogueBox';
import NavigationControls from '@/components/NavigationControls';
import QuizComponent from '@/components/QuizComponent';
import DressUpGame from '@/components/DressUpGame';
import BattleGame from '@/components/BattleGame';
import CandiGame from '@/components/CandiGame';

const { width, height } = Dimensions.get('window');

interface Scene {
  id: string;
  type: 'dialogue' | 'choice' | 'illustration' | 'minigame' | 'quiz';
  speaker?: string;
  text?: string;
  imageUrl?: string;
  choices?: Array<{
    id: string;
    text: string;
    effect?: 'positive' | 'negative' | 'neutral';
    nextScene?: string;
  }>;
  gameType?: 'dressup' | 'battle' | 'candi';
  autoAdvance?: boolean;
}

interface ChapterData {
  id: number;
  title: string;
  scenes: Scene[];
  quiz: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

const chapterData: Record<number, ChapterData> = {
  1: {
    id: 1,
    title: 'Kerajaan Prambanan',
    scenes: [
      {
        id: 'opening',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/opening.png'),
      },
      {
        id: 'narrator_intro',
        type: 'dialogue',
        speaker: 'Narator',
        
        text: 'Di masa lampau, berdiri megah Kerajaan Prambanan yang dipimpin oleh Raja Baka. Kerajaan ini terkenal dengan kemakmuran dan keindahan arsitekturnya yang menawan.',
      },
      {
        id: 'roro_intro',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Raja Baka memiliki seorang putri yang cantik jelita bernama Roro Jonggrang. Kecantikannya terkenal hingga ke seluruh nusantara, namun ia juga dikenal memiliki hati yang angkuh.',
      },
      {
        id: 'palace_scene',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/palace_scene.png'),
      },
      {
        id: 'roro_dialogue',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Ayahanda, mengapa banyak pangeran dari kerajaan lain yang datang melamar? Tidak ada yang setara dengan kemuliaan kerajaan kita.',
      },
      {
        id: 'king_response',
        type: 'dialogue',
        speaker: 'Raja Baka',
        text: 'Anakku, kecantikanmu memang tiada tara. Namun ingatlah, sombong bukanlah sifat yang baik untuk seorang putri.',
      },
      {
        id: 'choice_attitude',
        type: 'choice',
        text: 'Bagaimana sikap Roro Jonggrang terhadap nasihat ayahnya?',
        choices: [
          {
            id: 'humble',
            text: 'Mendengarkan dengan rendah hati',
            effect: 'positive',
            nextScene: 'humble_response',
          },
          {
            id: 'defiant',
            text: 'Tetap mempertahankan pendapatnya',
            effect: 'negative',
            nextScene: 'defiant_response',
          },
          {
            id: 'diplomatic',
            text: 'Menjawab dengan diplomatis',
            effect: 'neutral',
            nextScene: 'diplomatic_response',
          },
        ],
      },
      {
        id: 'humble_response',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Maafkan hamba, Ayahanda. Hamba akan lebih bijaksana dalam bersikap.',
      },
      {
        id: 'defiant_response',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Namun Ayahanda, bukankah kebanggaan terhadap kerajaan adalah hal yang wajar?',
      },
      {
        id: 'diplomatic_response',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Hamba mengerti, Ayahanda. Hamba akan mempertimbangkan nasihat Ayahanda dengan baik.',
      },
      {
        id: 'dressup_game',
        type: 'minigame',
        gameType: 'dressup',
      },
      {
        id: 'chapter_end',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Kehidupan damai di Kerajaan Prambanan akan segera berubah dengan kedatangan seorang pangeran perkasa dari kerajaan tetangga...',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Siapa nama raja yang memimpin Kerajaan Prambanan?',
        options: [
          'Raja Baka',
          'Raja Airlangga',
          'Raja Hayam Wuruk',
          'Raja Brawijaya',
        ],
        correctAnswer: 0,
        explanation:
          'Raja Baka adalah pemimpin Kerajaan Prambanan dan ayah dari Roro Jonggrang.',
      },
      {
        id: 'q2',
        question: 'Apa yang membuat Roro Jonggrang terkenal?',
        options: [
          'Kepandaiannya',
          'Kecantikannya',
          'Kekayaannya',
          'Kesaktiannya',
        ],
        correctAnswer: 1,
        explanation:
          'Roro Jonggrang terkenal karena kecantikannya yang tiada tara hingga ke seluruh nusantara.',
      },
      {
        id: 'q3',
        question:
          'Bagaimana sifat Roro Jonggrang yang disebutkan dalam cerita?',
        options: ['Rendah hati', 'Angkuh', 'Pemalu', 'Penyayang'],
        correctAnswer: 1,
        explanation:
          'Meskipun cantik, Roro Jonggrang dikenal memiliki sifat yang angkuh.',
      },
    ],
  },
  2: {
    id: 2,
    title: 'Bandung Bondowoso',
    scenes: [
      {
        id: 'war_scene',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/war_scene.png'),
      },
      {
        id: 'war_intro',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Suatu hari, pasukan besar dari Kerajaan Pengging menyerang Prambanan. Dipimpin oleh pangeran muda yang sakti mandraguna bernama Bandung Bondowoso.',
      },
      {
        id: 'bandung_intro',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Aku datang bukan untuk menghancurkan, melainkan untuk menyatukan kerajaan ini di bawah kekuasaanku!',
      },
      {
        id: 'battle_game',
        type: 'minigame',
        gameType: 'battle',
      },
      {
        id: 'victory_scene',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/victory_scene.png'),
      },
      {
        id: 'defeat_dialogue',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Dengan kekuatan magisnya, Bandung Bondowoso berhasil mengalahkan pasukan Prambanan. Raja Baka tewas dalam pertempuran.',
      },
      {
        id: 'roro_grief',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Ayahanda... Engkau telah membunuh ayahku! Aku tidak akan pernah memaafkanmu!',
      },
      {
        id: 'bandung_response',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Putri, aku menyesal atas kematian ayahmu. Namun dalam perang, hal ini tidak dapat dihindari.',
      },
      {
        id: 'choice_reaction',
        type: 'choice',
        text: 'Bagaimana reaksi Roro Jonggrang terhadap pernyataan Bandung Bondowoso?',
        choices: [
          {
            id: 'angry',
            text: 'Menunjukkan kemarahan yang besar',
            effect: 'negative',
            nextScene: 'angry_response',
          },
          {
            id: 'cold',
            text: 'Bersikap dingin dan diam',
            effect: 'neutral',
            nextScene: 'cold_response',
          },
          {
            id: 'diplomatic',
            text: 'Mencoba memahami situasi',
            effect: 'positive',
            nextScene: 'understanding_response',
          },
        ],
      },
      {
        id: 'angry_response',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Penyesalanmu tidak akan menghidupkan ayahku kembali! Aku benci padamu!',
      },
      {
        id: 'cold_response',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: '...',
      },
      {
        id: 'understanding_response',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Meskipun hatiku hancur, aku mengerti bahwa ini adalah konsekuensi dari perang.',
      },
      {
        id: 'chapter_end',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Bandung Bondowoso kini menguasai Prambanan. Namun hatinya mulai tertarik pada kecantikan Roro Jonggrang...',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Dari kerajaan mana Bandung Bondowoso berasal?',
        options: ['Majapahit', 'Pengging', 'Mataram', 'Singhasari'],
        correctAnswer: 1,
        explanation:
          'Bandung Bondowoso adalah pangeran dari Kerajaan Pengging.',
      },
      {
        id: 'q2',
        question: 'Apa yang membuat Bandung Bondowoso kuat dalam pertempuran?',
        options: [
          'Pasukan yang banyak',
          'Kekuatan magis',
          'Senjata canggih',
          'Strategi perang',
        ],
        correctAnswer: 1,
        explanation:
          'Bandung Bondowoso memiliki kekuatan magis yang membuatnya sakti mandraguna.',
      },
      {
        id: 'q3',
        question: 'Apa yang terjadi pada Raja Baka dalam pertempuran?',
        options: ['Melarikan diri', 'Menyerah', 'Tewas', 'Terluka parah'],
        correctAnswer: 2,
        explanation:
          'Raja Baka tewas dalam pertempuran melawan Bandung Bondowoso.',
      },
    ],
  },
  3: {
    id: 3,
    title: 'Lamaran & Tantangan',
    scenes: [
      {
        id: 'throne_room',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/throne_room.png'),
      },
      {
        id: 'proposal_intro',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Beberapa bulan setelah kemenangan, Bandung Bondowoso memanggil Roro Jonggrang ke ruang singgasana.',
      },
      {
        id: 'bandung_proposal',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Roro Jonggrang, kecantikanmu telah memikat hatiku. Aku ingin menjadikanmu permaisuriku.',
      },
      {
        id: 'roro_shock',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Apa?! Engkau ingin menikahiku setelah membunuh ayahku?',
      },
      {
        id: 'choice_response',
        type: 'choice',
        text: 'Bagaimana Roro Jonggrang merespons lamaran Bandung Bondowoso?',
        choices: [
          {
            id: 'direct_reject',
            text: 'Menolak secara langsung',
            effect: 'negative',
            nextScene: 'direct_rejection',
          },
          {
            id: 'challenge',
            text: 'Memberikan tantangan mustahil',
            effect: 'neutral',
            nextScene: 'impossible_challenge',
          },
          {
            id: 'consider',
            text: 'Meminta waktu untuk berpikir',
            effect: 'positive',
            nextScene: 'time_request',
          },
        ],
      },
      {
        id: 'direct_rejection',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Tidak! Aku tidak akan pernah menikah dengan pembunuh ayahku!',
      },
      {
        id: 'impossible_challenge',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Baiklah, tapi aku punya syarat. Jika engkau bisa memenuhinya, aku akan menjadi istrimu.',
      },
      {
        id: 'time_request',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Ini terlalu mendadak. Berikanlah aku waktu untuk memikirkannya.',
      },
      {
        id: 'challenge_explanation',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Bangunkan seribu candi dalam satu malam. Jika engkau berhasil, aku akan menjadi istrimu.',
      },
      {
        id: 'bandung_confident',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Seribu candi dalam satu malam? Baiklah, aku menerima tantanganmu!',
      },
      {
        id: 'challenge_scene',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/challenge_scene.png'),
      },
      {
        id: 'roro_thought',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: '(Dalam hati) Tidak mungkin dia bisa membangun seribu candi dalam satu malam. Ini adalah cara untuk menolaknya tanpa konfrontasi langsung.',
      },
      {
        id: 'chapter_end',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Tantangan telah diberikan. Akankah Bandung Bondowoso mampu memenuhi permintaan yang tampak mustahil ini?',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Apa yang diinginkan Bandung Bondowoso dari Roro Jonggrang?',
        options: ['Persahabatan', 'Pernikahan', 'Kesetiaan', 'Pengampunan'],
        correctAnswer: 1,
        explanation:
          'Bandung Bondowoso ingin menjadikan Roro Jonggrang sebagai permaisuri.',
      },
      {
        id: 'q2',
        question:
          'Berapa jumlah candi yang harus dibangun menurut tantangan Roro Jonggrang?',
        options: ['500 candi', '750 candi', '1000 candi', '1500 candi'],
        correctAnswer: 2,
        explanation:
          'Roro Jonggrang menantang Bandung Bondowoso untuk membangun seribu candi.',
      },
      {
        id: 'q3',
        question: 'Dalam waktu berapa lama candi harus selesai dibangun?',
        options: ['Satu hari', 'Satu malam', 'Satu minggu', 'Satu bulan'],
        correctAnswer: 1,
        explanation:
          'Tantangannya adalah membangun seribu candi dalam satu malam.',
      },
    ],
  },
  4: {
    id: 4,
    title: 'Pembangunan Candi',
    scenes: [
      {
        id: 'night_scene',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/night_scene.png'),
      },
      {
        id: 'construction_start',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Malam tiba. Bandung Bondowoso mulai menggunakan kekuatan magisnya untuk memanggil para jin dan roh halus membantu pembangunan.',
      },
      {
        id: 'magic_summon',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Wahai para jin dan makhluk halus! Bantulah aku membangun seribu candi sebelum fajar menyingsing!',
      },
      {
        id: 'candi_game',
        type: 'minigame',
        gameType: 'candi',
      },
      {
        id: 'progress_scene',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/progress_scene.png'),
      },
      {
        id: 'roro_worry',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Tidak mungkin! Dia benar-benar bisa membangun candi dengan cepat. Aku harus melakukan sesuatu!',
      },
      {
        id: 'choice_sabotage',
        type: 'choice',
        text: 'Apa yang akan dilakukan Roro Jonggrang?',
        choices: [
          {
            id: 'accept_fate',
            text: 'Menerima kenyataan dan menunggu',
            effect: 'positive',
            nextScene: 'accept_ending',
          },
          {
            id: 'sabotage',
            text: 'Menyabotase pembangunan',
            effect: 'negative',
            nextScene: 'sabotage_plan',
          },
          {
            id: 'negotiate',
            text: 'Mencoba bernegosiasi',
            effect: 'neutral',
            nextScene: 'negotiation_attempt',
          },
        ],
      },
      {
        id: 'accept_ending',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Mungkin ini memang takdir. Jika dia berhasil, aku akan menepati janjiku.',
      },
      {
        id: 'sabotage_plan',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Aku harus membuat ayam berkokok sebelum waktunya agar para jin mengira fajar telah tiba!',
      },
      {
        id: 'negotiation_attempt',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Bandung Bondowoso! Bisakah kita bicara sejenak?',
      },
      {
        id: 'sabotage_action',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Roro Jonggrang menyuruh dayang-dayangnya membakar jerami dan menumbuk lesung untuk meniru suara fajar.',
      },
      {
        id: 'jin_confused',
        type: 'dialogue',
        speaker: 'Jin',
        text: 'Fajar sudah tiba! Kita harus pergi sebelum matahari terbit!',
      },
      {
        id: 'bandung_angry',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Tunggu! Ini belum fajar! Roro Jonggrang, engkau telah menipuku!',
      },
      {
        id: 'chapter_end',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Pembangunan terhenti saat candi ke-999. Kemarahan Bandung Bondowoso akan membawa konsekuensi yang tak terduga...',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Siapa yang membantu Bandung Bondowoso membangun candi?',
        options: [
          'Rakyat Prambanan',
          'Tentara Pengging',
          'Jin dan roh halus',
          'Tukang bangunan',
        ],
        correctAnswer: 2,
        explanation:
          'Bandung Bondowoso menggunakan kekuatan magis untuk memanggil jin dan roh halus.',
      },
      {
        id: 'q2',
        question: 'Bagaimana cara Roro Jonggrang menyabotase pembangunan?',
        options: [
          'Merusak candi',
          'Meniru suara fajar',
          'Mengusir jin',
          'Menyembunyikan bahan',
        ],
        correctAnswer: 1,
        explanation:
          'Roro Jonggrang menyuruh dayang-dayangnya meniru suara fajar agar jin pergi.',
      },
      {
        id: 'q3',
        question: 'Berapa jumlah candi yang berhasil dibangun?',
        options: ['998 candi', '999 candi', '1000 candi', '1001 candi'],
        correctAnswer: 1,
        explanation:
          'Pembangunan terhenti saat candi ke-999, kurang satu dari target.',
      },
    ],
  },
  5: {
    id: 5,
    title: 'Akhir Cerita',
    scenes: [
      {
        id: 'dawn_scene',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/dawn_scene.png'),
      },
      {
        id: 'confrontation',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Roro Jonggrang! Engkau telah menipuku! Aku hampir berhasil menyelesaikan tantanganmu!',
      },
      {
        id: 'roro_defiant',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Aku tidak menipu! Fajar memang sudah tiba, dan engkau gagal menyelesaikan tantangan!',
      },
      {
        id: 'choice_ending',
        type: 'choice',
        text: 'Bagaimana akhir dari konflik ini?',
        choices: [
          {
            id: 'classic_ending',
            text: 'Mengikuti legenda klasik',
            effect: 'neutral',
            nextScene: 'classic_curse',
          },
          {
            id: 'romantic_ending',
            text: 'Akhir yang romantis',
            effect: 'positive',
            nextScene: 'romantic_resolution',
          },
          {
            id: 'peaceful_ending',
            text: 'Resolusi damai',
            effect: 'positive',
            nextScene: 'peaceful_resolution',
          },
        ],
      },
      {
        id: 'classic_curse',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Jika engkau tidak mau menjadi istriku dengan baik, jadilah arca untuk melengkapi candi ke-1000!',
      },
      {
        id: 'classic_transformation',
        type: 'illustration',
        imageUrl: require('../../assets/images/story/classic_transformation.png'),
      },
      {
        id: 'classic_end',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Roro Jonggrang berubah menjadi arca batu yang indah, melengkapi candi Prambanan. Hingga kini, arca tersebut masih berdiri megah sebagai saksi bisu legenda cinta yang tragis.',
      },
      {
        id: 'romantic_resolution',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Roro Jonggrang, aku mengerti kemarahanmu. Maafkan aku atas kematian ayahmu. Aku tidak akan memaksamu.',
      },
      {
        id: 'romantic_response',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Bandung Bondowoso... melihat usahamu yang sungguh-sungguh, hatiku mulai terbuka. Mungkin kita bisa memulai dari awal.',
      },
      {
        id: 'romantic_end',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Cinta sejati mengalahkan dendam. Roro Jonggrang dan Bandung Bondowoso menikah dan memerintah dengan bijaksana, menjadikan Prambanan kerajaan yang damai dan makmur.',
      },
      {
        id: 'peaceful_resolution',
        type: 'dialogue',
        speaker: 'Roro Jonggrang',
        text: 'Bandung Bondowoso, mari kita akhiri permusuhan ini. Aku akan menjadi ratu, tapi sebagai partner, bukan sebagai hadiah.',
      },
      {
        id: 'peaceful_agreement',
        type: 'dialogue',
        speaker: 'Bandung Bondowoso',
        text: 'Aku setuju. Mari kita membangun kerajaan ini bersama-sama, dengan saling menghormati.',
      },
      {
        id: 'peaceful_end',
        type: 'dialogue',
        speaker: 'Narator',
        text: 'Kebijaksanaan mengalahkan ego. Kerajaan Prambanan berkembang menjadi simbol persatuan dan toleransi, dengan 999 candi sebagai monumen perdamaian.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Mengapa Bandung Bondowoso marah kepada Roro Jonggrang?',
        options: [
          'Karena ditolak',
          'Karena ditipu',
          'Karena dihina',
          'Karena diabaikan',
        ],
        correctAnswer: 1,
        explanation:
          'Bandung Bondowoso marah karena merasa ditipu oleh sabotase Roro Jonggrang.',
      },
      {
        id: 'q2',
        question: 'Dalam legenda klasik, apa yang terjadi pada Roro Jonggrang?',
        options: [
          'Melarikan diri',
          'Berubah menjadi arca',
          'Menikah paksa',
          'Diasingkan',
        ],
        correctAnswer: 1,
        explanation:
          'Dalam legenda klasik, Roro Jonggrang dikutuk menjadi arca batu.',
      },
      {
        id: 'q3',
        question: 'Apa pesan moral utama dari legenda Roro Jonggrang?',
        options: [
          'Cinta sejati',
          'Konsekuensi kesombongan',
          'Kekuatan magic',
          'Kesetiaan kerajaan',
        ],
        correctAnswer: 1,
        explanation:
          'Legenda ini mengajarkan tentang konsekuensi dari kesombongan dan pentingnya kebijaksanaan.',
      },
    ],
  },
};

export default function ChapterScreen() {
  const { id } = useLocalSearchParams();
  const chapterId = parseInt(id as string);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [gameChoices, setGameChoices] = useState<Record<string, string>>({});
  const [relationshipScore, setRelationshipScore] = useState(50);
  const [showMinigame, setShowMinigame] = useState(false);
  const [currentGameType, setCurrentGameType] = useState<string>('');

  const chapter = chapterData[chapterId];
  const currentScene = chapter?.scenes[currentSceneIndex];

  useEffect(() => {
    if (!chapter) {
      Alert.alert('Error', 'Chapter tidak ditemukan');
      router.back();
    }
  }, [chapter]);

  const handleNext = () => {
    if (currentSceneIndex < chapter.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handleBack = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const handleChoice = (choiceId: string) => {
    const choice = currentScene?.choices?.find((c) => c.id === choiceId);
    if (choice) {
      setGameChoices({ ...gameChoices, [currentScene.id]: choiceId });

      // Update relationship score based on choice effect
      if (choice.effect === 'positive') {
        setRelationshipScore(Math.min(100, relationshipScore + 10));
      } else if (choice.effect === 'negative') {
        setRelationshipScore(Math.max(0, relationshipScore - 10));
      }

      // Navigate to specific scene if defined
      if (choice.nextScene) {
        const nextSceneIndex = chapter.scenes.findIndex(
          (s) => s.id === choice.nextScene
        );
        if (nextSceneIndex !== -1) {
          setCurrentSceneIndex(nextSceneIndex);
        }
      } else {
        handleNext();
      }
    }
  };

  const handleMinigameStart = (gameType: string) => {
    setCurrentGameType(gameType);
    setShowMinigame(true);
  };

  const handleMinigameComplete = (score: number) => {
    setShowMinigame(false);
    setRelationshipScore(Math.min(100, relationshipScore + score));
    handleNext();
  };

  const handleQuizComplete = async (score: number, answers: number[]) => {
    try {
      const progress = (await AsyncStorage.getItem('chapterProgress')) || '{}';
      const chapterProgress = JSON.parse(progress);

      // Update current chapter progress
      chapterProgress[chapterId] = {
        ...(chapterProgress[chapterId] || {}),
        isCompleted: true,
        score: score,
        relationshipScore: relationshipScore,
        choices: gameChoices,
      };

      // Unlock next chapter
      if (chapterId < 5) {
        chapterProgress[chapterId + 1] = {
          ...(chapterProgress[chapterId + 1] || {}),
          isUnlocked: true,
        };
      }

      await AsyncStorage.setItem(
        'chapterProgress',
        JSON.stringify(chapterProgress)
      );

      // Update achievements
      const achievements = (await AsyncStorage.getItem('achievements')) || '[]';
      const unlockedAchievements: string[] = JSON.parse(achievements);

      if (score >= 80 && !unlockedAchievements.includes('perfect_quiz')) {
        unlockedAchievements.push('perfect_quiz');
      }

      if (chapterId === 1 && !unlockedAchievements.includes('first_chapter')) {
        unlockedAchievements.push('first_chapter');
      }

      await AsyncStorage.setItem(
        'achievements',
        JSON.stringify(unlockedAchievements)
      );

      setShowQuiz(false);
      router.back();
    } catch (error) {
      console.log('Error saving progress:', error);
    }
  };

  if (!chapter) {
    return null;
  }

  return (
    <View style={styles.container}>
      {currentScene?.type === 'illustration' ? (
        <SceneIllustration imageUrl={currentScene.imageUrl!}>
          <NavigationControls
            onBack={handleBack}
            onNext={handleNext}
            showBack={currentSceneIndex > 0}
            showNext={true}
          />
        </SceneIllustration>
      ) : (
        <LinearGradient
          colors={['#1a1a1a', '#2d1b4e', '#1a1a1a']}
          style={styles.container}
        >
          <NavigationControls
            onBack={handleBack}
            onNext={currentScene?.type !== 'choice' ? handleNext : undefined}
            showBack={currentSceneIndex > 0}
            showNext={currentScene?.type !== 'choice'}
          />

          <View style={styles.content}>
            <Animated.View entering={FadeIn} style={styles.chapterHeader}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.sceneProgress}>
                {currentSceneIndex + 1} / {chapter.scenes.length}
              </Text>
            </Animated.View>

            {currentScene?.type === 'minigame' && (
              <Animated.View
                entering={SlideInRight}
                style={styles.minigameContainer}
              >
                <Text style={styles.minigameTitle}>Mini Game</Text>
                <Text style={styles.minigameDescription}>
                  {currentScene.gameType === 'dressup' &&
                    'Bantu Roro Jonggrang memilih pakaian yang tepat'}
                  {currentScene.gameType === 'battle' &&
                    'Pimpin pasukan dalam pertempuran strategis'}
                  {currentScene.gameType === 'candi' &&
                    'Bantu membangun candi dengan cepat'}
                </Text>
                <TouchableOpacity
                  style={styles.startGameButton}
                  onPress={() => handleMinigameStart(currentScene.gameType!)}
                >
                  <Text style={styles.startGameText}>Mulai Permainan</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          <DialogueBox
            speaker={currentScene?.speaker}
            text={currentScene?.text || ''}
            choices={currentScene?.choices}
            onNext={handleNext}
            onChoice={handleChoice}
            isVisible={
              currentScene?.type === 'dialogue' ||
              currentScene?.type === 'choice'
            }
            autoAdvance={currentScene?.autoAdvance}
          />
        </LinearGradient>
      )}

      {/* Relationship Score Indicator */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Hubungan</Text>
        <View style={styles.scoreBar}>
          <View
            style={[styles.scoreFill, { width: `${relationshipScore}%` }]}
          />
        </View>
        <Text style={styles.scoreValue}>{relationshipScore}%</Text>
      </View>

      {/* Quiz Component */}
      <QuizComponent
        questions={chapter.quiz}
        isVisible={showQuiz}
        onComplete={handleQuizComplete}
        onClose={() => setShowQuiz(false)}
        title={`Kuis ${chapter.title}`}
      />

      {/* Minigame Components */}
      {showMinigame && currentGameType === 'dressup' && (
        <DressUpGame
          isVisible={showMinigame}
          onComplete={handleMinigameComplete}
          onClose={() => setShowMinigame(false)}
        />
      )}

      {showMinigame && currentGameType === 'battle' && (
        <BattleGame
          isVisible={showMinigame}
          onComplete={handleMinigameComplete}
          onClose={() => setShowMinigame(false)}
        />
      )}

      {showMinigame && currentGameType === 'candi' && (
        <CandiGame
          isVisible={showMinigame}
          onComplete={handleMinigameComplete}
          onClose={() => setShowMinigame(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },  
  chapterHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  chapterTitle: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    textAlign: 'center',
  },
  sceneProgress: {
    fontSize: 16,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    opacity: 0.8,
    marginTop: 8,
  },
  minigameContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  minigameTitle: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#D4AF37',
    marginBottom: 12,
  },
  minigameDescription: {
    fontSize: 16,
    fontFamily: 'CrimsonText-Regular',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  startGameButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  startGameText: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000',
  },
  scoreContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    minWidth: 120,
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'CrimsonText-Regular',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 4,
  },
  scoreBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 4,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 3,
  },
  scoreValue: {
    fontSize: 12,
    fontFamily: 'CrimsonText-SemiBold',
    color: '#FFF',
    textAlign: 'center',
  },
});
