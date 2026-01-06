# Expo Setup Guide

This project has been configured to use Expo SDK alongside React Native. This allows you to use Expo APIs and modules while maintaining full control over your native code.

## What's Been Added

- ✅ Expo SDK (~50.0.0)
- ✅ Expo Constants
- ✅ Expo Status Bar
- ✅ Expo modules core integration
- ✅ Updated Babel configuration
- ✅ Updated Metro configuration
- ✅ Android native code integration

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Expo CLI globally (optional):**
   ```bash
   npm install -g expo-cli
   ```

## Available Commands

### Standard React Native Commands
```bash
npm start          # Start Metro bundler
npm run android    # Run on Android
npm run ios        # Run on iOS
```

### Expo Commands
```bash
npm run expo       # Start Expo dev server
expo start         # Alternative way to start Expo
expo start --android  # Start and open on Android
```

## Using Expo Modules

You can now use any Expo module in your project. For example:

### Example: Using Expo Constants

```javascript
import Constants from 'expo-constants';

console.log(Constants.manifest);
console.log(Constants.deviceName);
```

### Example: Using Expo Status Bar

```javascript
import { StatusBar } from 'expo-status-bar';

// In your component
<StatusBar style="light" />
```

### Installing Additional Expo Modules

To add more Expo modules, simply install them:

```bash
npm install expo-camera
npm install expo-location
npm install expo-notifications
# etc.
```

Then rebuild your app:
```bash
npm run android
```

## Project Structure

The project maintains its existing structure:
- `src/` - Your React Native code
- `android/` - Android native code (with Expo modules integrated)
- `app.json` - Expo configuration

## Important Notes

1. **This is a "bare" React Native workflow** - You have full access to native code
2. **Expo modules are integrated** - You can use Expo APIs without Expo Go
3. **You still need Android Studio** - For building and debugging
4. **Metro bundler handles both** - Works with both React Native and Expo

## Troubleshooting

### Issue: "expo-modules-core not found"
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: Build fails with Expo errors
**Solution:** 
1. Clean build: `cd android && ./gradlew clean`
2. Reinstall: `npm install`
3. Rebuild: `npm run android`

### Issue: Metro bundler conflicts
**Solution:** Make sure you're using the updated `metro.config.js` which merges both configs

## Next Steps

1. Install your dependencies: `npm install`
2. Add your TMDB API key to `src/config/api.js`
3. Run the app: `npm run android`

## Popular Expo Modules You Might Want

- `expo-camera` - Camera functionality
- `expo-location` - Location services
- `expo-notifications` - Push notifications
- `expo-sharing` - Share content
- `expo-file-system` - File system access
- `expo-image-picker` - Image picker
- `expo-av` - Audio/Video playback

Install any of these with: `npm install <module-name>`

