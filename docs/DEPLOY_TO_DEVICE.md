# Deploy to Physical Android Device

This guide will help you deploy your React Native app to your physical Android phone.

## Prerequisites

- Android phone with Android 6.0 (API 23) or higher
- USB cable to connect your phone to your computer
- USB Debugging enabled on your phone
- ADB (Android Debug Bridge) installed and working

## Step 1: Enable Developer Options on Your Phone

1. Open **Settings** on your Android phone
2. Scroll down and tap **About phone** (or **About device**)
3. Find **Build number** and tap it **7 times**
4. You'll see a message saying "You are now a developer!"
5. Go back to Settings
6. You should now see **Developer options** (usually under System or Advanced)

## Step 2: Enable USB Debugging

1. Open **Settings** → **Developer options**
2. Enable **USB debugging**
3. (Optional) Enable **Stay awake** (keeps screen on while charging)
4. (Optional) Enable **Install via USB** (if available)

## Step 3: Connect Your Phone to Computer

1. Connect your phone to your computer using a USB cable
2. On your phone, you may see a popup asking "Allow USB debugging?"
   - Check **"Always allow from this computer"**
   - Tap **OK**

## Step 4: Verify Connection

Open a terminal and run:

```bash
adb devices
```

You should see your device listed, for example:

```
List of devices attached
ABC123XYZ    device
```

If you see "unauthorized", check your phone and accept the USB debugging prompt.

## Step 5: Install Dependencies (if not done)

```bash
cd /home/filipszu/projects/vibeTMBD
npm install
```

## Step 6: Add Your TMDB API Key

Make sure you've added your TMDB API key to `src/config/api.js`:

```javascript
API_KEY: 'your_actual_api_key_here',
```

## Step 7: Deploy to Your Phone

### Option A: Using npm script (Recommended)

```bash
npm run android
```

### Option B: Using React Native CLI directly

````bash
npx react-native run-android
```YOUR_API_KEY_HERE

### Option C: Build and install manually
```bash
cd android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
````

## Step 8: Start Metro Bundler

If Metro bundler doesn't start automatically, open a new terminal and run:

```bash
npm start
```

Or:

```bash
npx react-native start
```

## Troubleshooting

### Issue: "adb: command not found"

**Solution:** Make sure ANDROID_HOME is set and ADB is in your PATH:

```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
source ~/.bashrc
```

### Issue: "No devices found" or "adb devices" shows nothing

**Solutions:**

1. Check USB cable (try a different cable)
2. Make sure USB debugging is enabled
3. Try different USB port
4. On your phone: Settings → Developer options → Revoke USB debugging authorizations, then reconnect
5. Check if phone is in "File Transfer" or "MTP" mode (not "Charge only")

### Issue: "Device unauthorized"

**Solution:**

1. On your phone, revoke USB debugging authorizations
2. Disconnect and reconnect USB cable
3. Accept the USB debugging prompt on your phone
4. Check "Always allow from this computer"

### Issue: "INSTALL_FAILED_INSUFFICIENT_STORAGE"

**Solution:** Free up space on your phone

### Issue: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"

**Solution:** Uninstall the existing app from your phone first:

```bash
adb uninstall com.vibetmdb
```

### Issue: App crashes immediately after launch

**Solutions:**

1. Check Metro bundler is running: `npm start`
2. Check device logs: `adb logcat | grep ReactNativeJS`
3. Make sure API key is set correctly
4. Check internet connection on phone

### Issue: "Could not connect to development server"

**Solutions:**

1. Make sure phone and computer are on the same Wi-Fi network
2. Shake your phone to open developer menu
3. Tap "Settings" → "Debug server host & port for device"
4. Enter your computer's IP address: `192.168.x.x:8081`
   - Find your IP: `ip addr show` or `ifconfig`
5. Or use USB connection method (see below)

### Using USB Connection (Alternative to Wi-Fi)

If Wi-Fi connection doesn't work, you can use USB:

```bash
# Forward port from device to computer
adb reverse tcp:8081 tcp:8081

# Then run the app
npm run android
```

## Running on Device Without USB (Wi-Fi Debugging)

### Android 11+ (Wireless Debugging)

1. On your phone: Settings → Developer options
2. Enable **Wireless debugging**
3. Tap **Wireless debugging** → **Pair device with pairing code**
4. Note the IP address and port (e.g., `192.168.1.100:12345`)
5. On your computer:
   ```bash
   adb pair 192.168.1.100:12345
   # Enter the pairing code when prompted
   ```
6. Then connect:
   ```bash
   adb connect 192.168.1.100:XXXXX
   # Use the IP and port shown on your phone
   ```

### Older Android Versions

1. Connect via USB first
2. Enable TCP/IP debugging:
   ```bash
   adb tcpip 5555
   ```
3. Find your phone's IP: Settings → About phone → Status → IP address
4. Disconnect USB
5. Connect via Wi-Fi:
   ```bash
   adb connect YOUR_PHONE_IP:5555
   ```

## Quick Checklist

- [ ] Developer options enabled
- [ ] USB debugging enabled
- [ ] Phone connected via USB
- [ ] `adb devices` shows your device
- [ ] TMDB API key added to `src/config/api.js`
- [ ] Dependencies installed (`npm install`)
- [ ] Metro bundler running (`npm start`)
- [ ] App deployed (`npm run android`)

## Testing the App

Once deployed:

1. The app should open automatically on your phone
2. If it doesn't, find "Vibe TMDB" in your app drawer
3. Make sure your phone has internet connection
4. The app should load movies from TMDB API

## Building Release APK (Optional)

To create a release build for distribution:

```bash
cd android
./gradlew assembleRelease
```

The APK will be at:

```
android/app/build/outputs/apk/release/app-release.apk
```

**Note:** You'll need to configure signing for release builds. See Android documentation for details.

## Additional Resources

- [React Native Running on Device](https://reactnative.dev/docs/running-on-device)
- [Android Developer - USB Debugging](https://developer.android.com/studio/run/device)
