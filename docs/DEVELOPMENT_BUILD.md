# Development Build Setup

This document explains how to set up and run the app using a development build, and why Expo Go cannot be used for this project.

## Why Not Expo Go?

**Expo Go has limitations that prevent this app from working:**

1. **Custom Native Permissions**: This app requires the `DETECT_SCREEN_CAPTURE` permission for `react-native-webview`, which is not available in Expo Go's pre-built binary. Expo Go uses its own AndroidManifest.xml that cannot be modified.

2. **Native Module Restrictions**: Expo Go only includes a limited set of pre-compiled native modules. Custom native configurations (like deep link schemes) may not work as expected.

3. **Build Artifacts**: The app needs custom native code generated from `app.json` (intent filters, permissions, etc.) that requires a full native build.

**Solution**: Use a **development build** which includes your custom native code and permissions.

## Prerequisites

Before building, ensure you have:

- ✅ Android SDK installed and configured
- ✅ Java Development Kit (JDK) installed
- ✅ Android device connected via ADB or emulator running
- ✅ All dependencies installed (`npm install`)

## Building and Running

### Step 1: Generate Native Code

First, generate the native Android and iOS projects from your Expo configuration:

```bash
npx expo prebuild
```

This command:

- Reads your `app.json` configuration
- Generates native Android (`android/`) and iOS (`ios/`) directories
- Applies permissions, intent filters, and other native configurations
- **Note**: If native directories already exist, it will reuse them (use `--clean` to regenerate)

### Step 2: Build and Install on Device

Build the Android app and install it on your connected device:

```bash
npx expo run:android
```

This command:

- Compiles the native Android code
- Builds the APK
- Installs it on your connected device/emulator
- Starts Metro bundler automatically
- Launches the app

**First build time**: ~10-15 minutes (subsequent builds are much faster due to caching)

**Subsequent builds**: ~15-30 seconds (only rebuilds changed native code)

### Step 3: Development Workflow

Once the app is installed:

1. **Metro bundler** will start automatically
2. The app will connect to Metro and load your JavaScript bundle
3. **Hot reloading** works - just save your files and the app updates
4. Press `r` in the Metro terminal to manually reload

## Quick Reference

### Full Clean Build

If you need to regenerate everything from scratch:

```bash
npx expo prebuild --clean
npx expo run:android
```

### Just Reload JavaScript (No Rebuild Needed)

For JavaScript-only changes, just reload:

- Press `r` in Metro terminal, or
- Shake device → "Reload", or
- The app auto-reloads when Metro detects changes

### Rebuild After Native Changes

Rebuild is needed when you:

- Change `app.json` native configuration (schemes, permissions, etc.)
- Add/remove native dependencies
- Modify native code (Java/Kotlin/Objective-C)
- Change AndroidManifest.xml or Info.plist directly

**Rebuild is NOT needed for:**

- JavaScript/TypeScript changes
- React component changes
- Style changes
- Most configuration changes in `app.json` (unless they affect native code)

## Troubleshooting

### Build Fails

1. **Clean and rebuild**:

   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx expo run:android
   ```

2. **Check Java version**: Ensure JDK 17+ is installed and `JAVA_HOME` is set correctly

3. **Check Android SDK**: Verify `ANDROID_HOME` is set and SDK is properly installed

### App Not Installing

1. **Check device connection**:

   ```bash
   adb devices
   ```

   Should show your device listed

2. **Uninstall old version**:
   ```bash
   adb uninstall com.vibetmdb
   ```
   Then rebuild and install

### Permission Errors

If you see permission-related errors:

1. Ensure `app.json` has the required permissions listed
2. Run `npx expo prebuild` to regenerate AndroidManifest.xml
3. Rebuild the app

### Metro Bundler Issues

If Metro doesn't start or connect:

1. Stop Metro: `Ctrl+C`
2. Clear Metro cache: `npx expo start --clear`
3. Rebuild: `npx expo run:android`

## Development Build vs Expo Go

| Feature             | Development Build | Expo Go          |
| ------------------- | ----------------- | ---------------- |
| Custom Permissions  | ✅ Supported      | ❌ Not supported |
| Native Modules      | ✅ All modules    | ⚠️ Limited set   |
| Deep Linking        | ✅ Full support   | ⚠️ Limited       |
| Build Time          | ~10-15 min first  | Instant          |
| Updates             | Fast reload       | Instant          |
| Native Code Changes | Requires rebuild  | Not possible     |

## Alternative: EAS Build

For production builds or CI/CD, consider using [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for Android
eas build --platform android --profile development
```

This builds the app in the cloud and provides a download link.

## Summary

- **Use development build** (`npx expo run:android`) for this project
- **First build takes ~10-15 minutes**, subsequent builds are fast
- **JavaScript changes** don't require rebuild - just reload
- **Native changes** require rebuild
- **Expo Go won't work** due to custom permissions and native requirements

For questions or issues, check the [Expo documentation](https://docs.expo.dev/) or project README.

