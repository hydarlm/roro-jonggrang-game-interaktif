# Roro Jonggrang - Game Interaktif

Game interaktif berbasis cerita legenda Roro Jonggrang yang dibangun dengan React Native dan Expo, menampilkan quiz, dialog interaktif, dan ilustrasi scene yang menarik.

## 📱 Fitur

- **Cerita Interaktif**: Pengalaman storytelling legenda Roro Jonggrang
- **Quiz Interaktif**: Komponen quiz untuk menguji pemahaman cerita
- **Dialog Box**: Sistem dialog yang responsif untuk narasi cerita
- **Navigasi Kontrol**: Kontrol navigasi yang mudah digunakan
- **Ilustrasi Scene**: Visualisasi scene cerita yang menarik dan interaktif
- **Tab Navigation**: Navigasi berbasis tab untuk pengalaman pengguna yang lancar

## 🚀 Quick Start

### Prerequisites

Pastikan Anda telah menginstall:
- [Node.js](https://nodejs.org/) (v16 atau lebih tinggi)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Installation

1. Clone repository ini:
```bash
git clone https://github.com/yourusername/roro-jonggrang-game-interaktif.git
cd roro-jonggrang-game-interaktif
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan aplikasi:
```bash
npx expo start
```

4. Scan QR code dengan aplikasi Expo Go (Android/iOS) atau jalankan di emulator.

## 📁 Struktur Proyek

```
├── app/
│   ├── _layout.tsx          # Layout utama aplikasi
│   └── (tabs)/              # Halaman-halaman dengan tab navigation
├── app.json                 # Konfigurasi Expo
├── assets/
│   └── images/              # Asset gambar dan ilustrasi
├── components/
│   ├── DialogueBox.tsx      # Komponen dialog interaktif
│   ├── NavigationControls.tsx # Kontrol navigasi
│   ├── QuizComponent.tsx    # Komponen quiz
│   └── SceneIllustration.tsx # Komponen ilustrasi scene
├── expo-env.d.ts           # Type definitions untuk Expo
├── hooks/
│   └── useFrameworkReady.ts # Custom hook untuk framework readiness
├── package-lock.json       # Lock file dependencies
├── package.json           # Dependencies dan scripts
└── tsconfig.json          # Konfigurasi TypeScript
```

## 🔧 Komponen Utama

### DialogueBox
Komponen untuk menampilkan dialog interaktif dengan animasi dan styling yang mendukung narasi cerita Roro Jonggrang.

### QuizComponent
Sistem quiz yang mendukung berbagai jenis pertanyaan dengan feedback real-time untuk menguji pemahaman tentang legenda Roro Jonggrang.

### NavigationControls
Kontrol navigasi yang intuitif untuk berpindah antar scene atau konten.

### SceneIllustration
Komponen untuk menampilkan ilustrasi scene cerita Roro Jonggrang yang mendukung interaksi pengguna dan visualisasi yang menarik.

## 🛠️ Pengembangan

### Scripts yang Tersedia

```bash
# Menjalankan aplikasi dalam mode development
npm start

# Build aplikasi untuk production
npm run build

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Custom Hooks

#### useFrameworkReady
Hook khusus untuk memastikan framework telah siap sebelum rendering komponen utama.

## 📦 Dependencies

Proyek ini menggunakan beberapa dependencies utama:
- React Native
- Expo
- TypeScript
- React Navigation (Tab Navigation)

Lihat `package.json` untuk daftar lengkap dependencies.

## 🎨 Asset Management

Asset gambar disimpan dalam folder `assets/images/`. Pastikan untuk mengoptimalkan gambar sebelum menambahkannya ke proyek untuk performa yang lebih baik.

## 🔀 Routing & Navigation

Aplikasi menggunakan Expo Router dengan struktur berbasis file. Tab navigation dikonfigurasi dalam folder `(tabs)` dengan layout utama di `_layout.tsx`.

## 🚀 Deployment

### Expo Build Service (EAS)

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Build aplikasi:
```bash
eas build --platform all
```

3. Submit ke app store:
```bash
eas submit --platform all
```

## 👥 Tim Pengembang

Proyek ini dikembangkan oleh tim kolaboratif. Kontribusi dari semua anggota tim sangat dihargai.

### Cara Berkontribusi untuk Tim

1. Clone repository ini
2. Buat branch fitur baru (`git checkout -b feature/NamaFitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin feature/NamaFitur`)
5. Buka Pull Request untuk review tim

## 🤝 Contributing

Untuk kontributor eksternal:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Project Link: [https://github.com/hydarlm/roro-jonggrang-game-interaktif](https://github.com/hydarlm/roro-jonggrang-game-interaktif)

## 🙏 Acknowledgments

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- Legenda Roro Jonggrang - Warisan budaya Indonesia

---

⭐ Jangan lupa untuk memberikan star jika proyek ini membantu Anda mempelajari legenda Roro Jonggrang!