# Vibe TMDB - React Native Android App

A beautiful React Native Android application for browsing movies and TV shows using The Movie Database (TMDB) API.

## Features

- 🎬 Browse popular and trending movies
- 🔍 Search for movies and TV shows
- 📱 Beautiful, modern UI with dark theme
- 🎯 Movie details with cast, ratings, and recommendations
- 📺 Support for both movies and TV shows

## Prerequisites

- Node.js (>= 18)
- React Native development environment set up
- Android Studio and Android SDK
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

## Installation

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up your TMDB API key:**

   Create a `.env` file in the root directory (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your TMDB API key:

   ```
   TMDB_API_KEY=your_actual_api_key_here
   ```

   **Important:** Never commit the `.env` file to git. It's already in `.gitignore`.

3. **Run the app on Android:**

   This app requires a development build (cannot use Expo Go). See [Development Build Setup](./docs/DEVELOPMENT_BUILD.md) for complete instructions.

   Quick start:

   ```bash
   npx expo prebuild
   npx expo run:android
   ```

## Project Structure

```
vibeTMBD/
├── android/              # Android native code
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── MovieCard.js
│   │   └── Header.js
│   ├── config/          # Configuration files
│   │   └── api.js       # TMDB API configuration
│   ├── navigation/      # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/         # App screens
│   │   ├── HomeScreen.js
│   │   ├── MovieDetailsScreen.js
│   │   └── SearchScreen.js
│   ├── services/        # API services
│   │   └── tmdbApi.js
│   └── App.js           # Main app component
├── index.js             # App entry point
└── package.json
```

## Available Scripts

- `npm run expo` - Start Expo dev server (recommended for development)
- `npm start` - Start Metro bundler (for React Native CLI)
- `npm run android` - Run on Android using React Native CLI
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Expo Integration

This project uses Expo for development and deployment. We use Expo's development server to run the app on Android devices wirelessly or via USB.

**To run the app:**

```bash
npm run expo
```

Then press `a` to open on Android. See [Android Device Setup](./docs/ANDROID_DEVICE_SETUP.md) for detailed instructions on connecting your device and running the app. **Note:** This app requires a development build and cannot run with Expo Go. See [Development Build Setup](./docs/DEVELOPMENT_BUILD.md) for details.

## API Endpoints Used

The app uses the following TMDB API endpoints:

- `/movie/popular` - Popular movies
- `/movie/top_rated` - Top rated movies
- `/movie/now_playing` - Now playing movies
- `/trending/movie/{time_window}` - Trending movies
- `/movie/{id}` - Movie details
- `/search/movie` - Search movies
- `/tv/popular` - Popular TV shows
- `/search/tv` - Search TV shows

## Technologies Used

- React Native 0.73
- Expo SDK 50 (for Expo modules and APIs)
- React Navigation 6
- Axios for API calls
- React Native Fast Image (optional, for better image performance)

## Getting Your TMDB API Key

1. Create an account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to [Settings > API](https://www.themoviedb.org/settings/api)
3. Request an API key
4. Copy your API key and add it to the configuration

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

### Setup & Installation

- **[Android Development Environment Setup](./docs/SETUP_ANDROID.md)** - Complete guide for setting up Android development environment on Linux (Ubuntu/Debian)
  - Installing Java JDK
  - Setting up Android Studio
  - Configuring environment variables
  - Creating Android Virtual Devices (AVD)

- **[Android Device Setup & Running with Expo](./docs/ANDROID_DEVICE_SETUP.md)** - Connect your Android phone wirelessly and run the app
  - Pairing device using `adb pair`
  - Connecting wirelessly via Wi-Fi
  - Running the app with Expo
  - Troubleshooting connection issues

- **[Development Build Setup](./docs/DEVELOPMENT_BUILD.md)** - Build and run the app with custom native code
  - Why a development build is required (custom permissions, native modules)
  - How to use `npx expo prebuild` and `npx expo run:android`
  - Development workflow and troubleshooting
  - When to rebuild vs. when to just reload

### Performance & Troubleshooting

- **[Android Emulator Performance Optimization](./docs/EMULATOR_PERFORMANCE.md)** - Fix slow and hanging emulator issues
  - Enabling KVM hardware acceleration
  - Optimizing emulator settings
  - Using x86_64 system images
  - Performance troubleshooting

## Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up Android development environment (see [SETUP_ANDROID.md](./docs/SETUP_ANDROID.md))
- [ ] Add your TMDB API key to `src/config/api.js`
- [ ] Connect your Android device (see [ANDROID_DEVICE_SETUP.md](./docs/ANDROID_DEVICE_SETUP.md))
- [ ] Build and run the app: `npx expo prebuild && npx expo run:android` (see [DEVELOPMENT_BUILD.md](./docs/DEVELOPMENT_BUILD.md))

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
