# Android Development Environment Setup Guide

This guide will help you set up Android development environment for React Native on Linux (Ubuntu/Debian).

## Prerequisites

- Ubuntu 22.04 or similar Linux distribution
- At least 8GB RAM (16GB recommended)
- 10GB free disk space

## Step 1: Install Java Development Kit (JDK)

React Native requires JDK 17. Install it using:

```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
```

Verify installation:

```bash
java -version
# Should show: openjdk version "17.x.x"
```

Set JAVA_HOME (add to your `~/.bashrc` or `~/.zshrc`):

```bash
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Step 2: Install Android Studio

### Option A: Using Snap (Easiest)

```bash
sudo snap install android-studio --classic
```

### Option B: Manual Installation

1. Download Android Studio from: https://developer.android.com/studio
2. Extract and run:

```bash
cd ~/Downloads
unzip android-studio-*.zip
cd android-studio/bin
./studio.sh
```

## Step 3: Configure Android Studio

1. **Launch Android Studio** and complete the setup wizard
2. **Install Android SDK:**
   - Go to `Tools` → `SDK Manager`
   - In the `SDK Platforms` tab, check:
     - ✅ Android 13.0 (Tiramisu) - API Level 33
     - ✅ Android 12.0 (S) - API Level 31
   - In the `SDK Tools` tab, check:
     - ✅ Android SDK Build-Tools
     - ✅ Android SDK Command-line Tools
     - ✅ Android SDK Platform-Tools
     - ✅ Android Emulator
     - ✅ Intel x86 Emulator Accelerator (HAXM installer) - if available
   - Click `Apply` and wait for installation

## Step 4: Set Up Environment Variables

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then reload:

```bash
source ~/.bashrc
```

**Note:** If Android Studio was installed via snap, the SDK location might be:

```bash
export ANDROID_HOME=$HOME/snap/android-studio/current/Android/Sdk
```

## Step 5: Verify Installation

Check if everything is set up correctly:

```bash
# Check Java
java -version

# Check Android SDK
echo $ANDROID_HOME
adb version

# Check React Native CLI (if installed globally)
npx react-native --version
```

## Step 6: Create an Android Virtual Device (AVD)

1. Open Android Studio
2. Go to `Tools` → `Device Manager`
3. Click `Create Device`
4. Select a device (e.g., Pixel 5)
5. Select a system image (e.g., Android 13.0 - API 33)
6. Click `Finish`

Or via command line:

```bash
$ANDROID_HOME/emulator/emulator -list-avds
```

## Step 7: Install React Native CLI (Optional but Recommended)

```bash
npm install -g react-native-cli
```

## Step 8: Test Your Setup

1. **Start Metro bundler:**

   ```bash
   npm start
   ```

2. **In another terminal, run the app:**

   ```bash
   npm run android
   ```

   Or if you have an emulator running:

   ```bash
   npx react-native run-android
   ```

## Troubleshooting

### Issue: "ANDROID_HOME is not set"

- Make sure you've added the export statements to `~/.bashrc`
- Run `source ~/.bashrc` or restart your terminal

### Issue: "SDK location not found"

- Check where Android Studio installed the SDK (usually `~/Android/Sdk`)
- Update `ANDROID_HOME` in your `~/.bashrc`

### Issue: "Java version mismatch"

- React Native 0.73 requires JDK 17
- Verify with `java -version`
- If wrong version, install JDK 17 and update `JAVA_HOME`

### Issue: "Emulator not starting"

- Make sure KVM is enabled (for Linux):
  ```bash
  sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
  sudo adduser $USER kvm
  ```
- Log out and log back in

### Issue: "Gradle build failed"

- Make sure you have internet connection
- Try: `cd android && ./gradlew clean`

## Additional Resources

- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
