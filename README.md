# HueFi - Color Staking Application

HueFi is a premium mobile application that allows users to stake and guess colors to earn rewards. Built with a focus on speed, security, and a high-end dark aesthetic, it provides a seamless experience for staking both Solana (SOL) and USD.

## Key Features

### Color Guessing Game
- Interactive color selection: Red, Blue, Green, or Yellow.
- 10-second countdown before each reveal to build anticipation.
- Fair reveal logic using randomized selection.
- 2x payout for correct guesses.
- Real-time game history tracking each session.

### Wallets and Staking
- Support for multiple currencies: Stake using SOL or USD.
- Real-time balance updates and transaction history.
- Secure wallet connectivity simulation.

### User Interface
- Premium dark mode aesthetic.
- Non-blocking toast notifications for game results and system feedback.
- Clean, high-performance navigation and layout.
- Responsive design across various mobile screen sizes.

## Technology Stack

### Mobile Frontend
- Core: React Native with Expo.
- Styling: NativeWind (Tailwind CSS for React Native).
- Navigation: Expo Router (File-based routing).
- Notifications: react-native-toast-message.
- Animation: react-native-reanimated.

### Backend Infrastructure
- Runtime: Node.js with Express.
- Database: Sequelize ORM.
- Security: JWT-based authentication and CORS-hardened endpoints.

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- Expo Go app on your mobile device (for local development)

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in a `.env` file (Database URL, Port, JWT Secret).
4. Start the server:
   ```bash
   npm start
   ```

### Mobile App Setup
1. Navigate to the `mobile` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with your mobile device to open the app.

## Project Structure

- `mobile/`: Complete React Native application including tabs, components, and hooks.
- `backend/`: Express server logic including routes, models, and controllers.

## License

This project is private and intended for testing and development purposes.
