# Android Device Setup & Running with Development Build

This guide will help you connect your Android phone wirelessly and run the app using a development build. **Note:** This app requires a development build and cannot run with Expo Go. See [Development Build Setup](./DEVELOPMENT_BUILD.md) for details.

## Prerequisites

- Android phone with Android 11+ (for wireless debugging)
- Phone and computer on the same Wi-Fi network
- ADB (Android Debug Bridge) installed and in your PATH
- Expo CLI installed (comes with the project dependencies)

## Step 1: Enable Developer Options on Your Phone

1. Open **Settings** on your Android phone
2. Scroll down and tap **About phone** (or **About device**)
3. Find **Build number** and tap it **7 times**
4. You'll see a message saying "You are now a developer!"
5. Go back to Settings
6. You should now see **Developer options** (usually under System or Advanced)

## Step 2: Enable Wireless Debugging

1. Open **Settings** → **Developer options**
2. Enable **Wireless debugging**
3. Tap **Wireless debugging** to open its settings
4. Tap **Pair device with pairing code**
5. You'll see:
   - **IP address and port** (e.g., `192.168.1.100:12345`)
   - **Pairing code** (6-digit code)

**Note these values** - you'll need them in the next step.

## Step 3: Pair Your Device with ADB

On your computer, run:

```bash
adb pair <IP_ADDRESS>:<PORT>
```

Replace `<IP_ADDRESS>` and `<PORT>` with the values from your phone. For example:

```bash
adb pair 192.168.1.100:12345
```

When prompted, enter the **pairing code** from your phone and press Enter.

You should see:

```
Successfully paired to <IP_ADDRESS>:<PORT>
```

## Step 4: Connect to Your Device

After pairing, you need to connect. On your phone, in the **Wireless debugging** settings, you'll see a new entry under "Paired devices" or you'll see the connection details.

Run:

```bash
adb connect <IP_ADDRESS>:<PORT>
```

The port might be different from the pairing port. Check your phone's **Wireless debugging** screen for the current connection port.

For example:

```bash
adb connect 192.168.1.100:45678
```

## Step 5: Verify Connection

Check that your device is connected:

```bash
adb devices
```

You should see your device listed:

```
List of devices attached
192.168.1.100:45678    device
```

## Step 6: Run the App with Expo

1. **Start the Expo development server:**

   ```bash
   npm run expo
   ```

   Or:

   ```bash
   npx expo start
   ```

2. **Open the app on your Android device:**
   - Press `a` in the Expo terminal to open on Android
   - The app will automatically open if you have a development build installed

## Running the App

This app requires a development build. If you haven't built and installed the app yet, see [Development Build Setup](./DEVELOPMENT_BUILD.md) for instructions.

Once you have a development build installed on your device:

```bash
npm run expo
# Then press 'a' to open on Android
```

The app will automatically connect to your device via ADB and launch.

## Troubleshooting

### Issue: "adb: command not found"

**Solution:** Make sure ADB is installed and in your PATH:

```bash
# Check if ADB is available
which adb

# If not found, add Android SDK platform-tools to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Add to ~/.bashrc to make it permanent
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

### Issue: "Unable to connect to <IP>:<PORT>"

**Solutions:**

1. Make sure your phone and computer are on the same Wi-Fi network
2. Check that wireless debugging is still enabled on your phone
3. Try disconnecting and reconnecting:
   ```bash
   adb disconnect
   adb connect <IP_ADDRESS>:<PORT>
   ```
4. Restart wireless debugging on your phone (disable and re-enable)

### Issue: "Pairing code incorrect"

**Solution:**

- Make sure you're using the pairing code from the "Pair device with pairing code" screen
- The pairing code expires quickly - generate a new one if needed
- Make sure you're using the correct IP address and port

### Issue: Device disconnects frequently

**Solutions:**

1. Keep your phone's screen on while developing
2. Disable battery optimization for Developer options
3. Make sure Wi-Fi stays connected (disable Wi-Fi power saving)
4. Reconnect if needed:
   ```bash
   adb connect <IP_ADDRESS>:<PORT>
   ```

### Issue: "No devices found" in Expo

**Solutions:**

1. Verify ADB connection: `adb devices`
2. Make sure the device shows as "device" (not "unauthorized")
3. Try restarting Expo: `npm run expo`
4. Check that your device is on the same network as your computer

### Issue: App doesn't load or crashes

**Solutions:**

1. Make sure you have a development build installed (see [Development Build Setup](./DEVELOPMENT_BUILD.md))
2. Check that your phone and computer are on the same network
3. Try using USB connection instead (see alternative method below)
4. Check Expo logs for errors
5. Rebuild the app if you've made native configuration changes: `npx expo run:android`

## Alternative: USB Connection

If wireless debugging doesn't work, you can use USB:

1. Connect your phone via USB
2. Enable **USB debugging** in Developer options
3. Accept the USB debugging prompt on your phone
4. Verify connection: `adb devices`
5. Run Expo: `npm run expo`

## Disconnecting

To disconnect your device:

```bash
adb disconnect <IP_ADDRESS>:<PORT>
```

Or disconnect all devices:

```bash
adb disconnect
```

## Quick Reference

```bash
# Pair device (first time)
adb pair <IP>:<PAIRING_PORT>

# Connect to device
adb connect <IP>:<CONNECTION_PORT>

# Check connected devices
adb devices

# Start Expo
npm run expo

# Disconnect
adb disconnect
```

## Next Steps

- See [Android Emulator Performance Optimization](./EMULATOR_PERFORMANCE.md) if you prefer using an emulator
- See [Android Development Environment Setup](./SETUP_ANDROID.md) for setting up your development environment
