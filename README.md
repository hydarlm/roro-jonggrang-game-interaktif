# 📱 Roro Jonggrang Interactive App

A mobile interactive storytelling app built with **React Native**, **Expo**, and **TypeScript**, inspired by the Indonesian folklore legend *Roro Jonggrang*. This app combines beautiful illustrations, narrative dialogue, and quiz interactions for an engaging educational experience.

---

## 🗂️ Folder Structure

.
├── app
│   ├── _layout.tsx                  # Root layout configuration for navigation
│   └── (tabs)                       # Screens or tabs used in the app
├── app.json                         # Expo configuration
├── assets
│   └── images                       # Image assets (illustrations, icons, etc.)
├── components
│   ├── DialogueBox.tsx             # Component for displaying character dialogue
│   ├── NavigationControls.tsx      # Controls to navigate between story parts
│   ├── QuizComponent.tsx           # Multiple-choice or interactive quiz component
│   └── SceneIllustration.tsx       # Component to display scene images
├── expo-env.d.ts                   # Type definitions for Expo
├── hooks
│   └── useFrameworkReady.ts        # Custom hook for ensuring app readiness
├── package-lock.json
├── package.json
└── tsconfig.json                   # TypeScript configuration

---

## 🚀 Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/your-username/roro-jonggrang-game-interaktif.git
cd roro-jonggrang-game-interaktif

2. Install dependencies

npm install

3. Run the app with Expo

npm run dev
# or
npx expo start

Scan the QR code using the Expo Go app on your mobile device, or run it in an Android/iOS emulator.

⸻

✨ Features
	•	🎭 Story-Based Navigation — Follow an interactive storyline inspired by folklore.
	•	🧠 Quizzes — Answer questions related to the story.
	•	🎨 Illustrated Scenes — Experience the story visually with detailed illustrations.
	•	⚙️ Modular Codebase — Clean architecture using components and hooks.

⸻

📋 Requirements
	•	Node.js & npm
	•	Expo CLI (npm install -g expo-cli)
	•	Android/iOS device with Expo Go app or emulator

⸻

👤 Author

Developed by [Kelompok 2] — inspired by the legendary tale of Roro Jonggrang 🇮🇩
Feel free to fork or contribute to this project!

---
