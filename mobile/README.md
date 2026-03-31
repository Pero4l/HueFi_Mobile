# HueFi Mobile App

This is the mobile frontend for HueFi, a color staking and guessing application built with Expo and React Native.

## Features

- Color guessing game with 10-second countdown.
- Multi-currency support (SOL and USD).
- Real-time game history.
- Premium dark mode interface.
- Toast notifications for user feedback.

## Installation

1. Install the dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

## Available Scripts

- `npm start`: Starts the Expo development server.
- `npm run ios`: Starts the app in the iOS simulator.
- `npm run android`: Starts the app in the Android emulator.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

- `app/`: Contains the main application screens and layout using file-based routing.
- `components/`: Reusable UI components.
- `constants/`: Theme configuration and other constants.
- `hooks/`: Custom React hooks for theme and state management.
- `utils/`: API utilities and helper functions.

## Development Note

The app is currently in testing mode. Every user is initialized with a balance of $1000 and 50 SOL.
