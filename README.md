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

   Open `src/config/api.js` and replace `YOUR_API_KEY_HERE` with your actual TMDB API key:

   ```javascript
   API_KEY: 'your_actual_api_key_here',
   ```

   Or create a `.env` file in the root directory:

   ```
   TMDB_API_KEY=your_actual_api_key_here
   ```

3. **Run the app on Android:**
   ```bash
   npm run android
   # or
   yarn android
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

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run expo` - Start Expo dev server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Expo Integration

This project includes Expo SDK, allowing you to use Expo modules and APIs while maintaining full control over native code. See [Expo Setup Guide](./docs/EXPO_SETUP.md) for details on using Expo modules.

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

### Development

- **[Expo Setup Guide](./docs/EXPO_SETUP.md)** - Using Expo SDK and modules in this project
  - Expo integration overview
  - Available Expo modules
  - Installing additional modules
  - Using Expo commands

### Deployment

- **[Deploy to Physical Android Device](./docs/DEPLOY_TO_DEVICE.md)** - Step-by-step guide for deploying to your Android phone
  - Enabling USB debugging
  - Connecting your device
  - Building and installing the app
  - Troubleshooting common issues

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
- [ ] Start Metro bundler: `npm start`
- [ ] Run on Android: `npm run android`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
