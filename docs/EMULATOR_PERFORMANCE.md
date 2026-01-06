# Android Emulator Performance Optimization Guide

This guide will help you fix slow and hanging Android emulator issues on Linux.

## Quick Fixes (Try These First)

### 1. Enable KVM (Kernel-based Virtual Machine) - **MOST IMPORTANT**

KVM provides hardware acceleration which is essential for emulator performance on Linux.

#### Check if KVM is available:

```bash
# Check if your CPU supports virtualization
grep -E 'vmx|svm' /proc/cpuinfo

# Check if KVM module is loaded
lsmod | grep kvm
```

#### Install and enable KVM:

```bash
# Install KVM packages
sudo apt update
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virt-manager -y

# Add your user to kvm group
sudo usermod -aG kvm $USER
sudo usermod -aG libvirt $USER

# Verify KVM is working
sudo chmod 666 /dev/kvm
```

**Important:** After adding yourself to groups, you need to **log out and log back in** (or restart) for changes to take effect.

#### Verify KVM is working:

```bash
# This should return "KVM acceleration can be used"
kvm-ok
```

If you get permission errors, run:

```bash
sudo chmod 666 /dev/kvm
```

### 2. Use x86/x86_64 System Images (Not ARM)

ARM images are **much slower** than x86/x86_64. Always use x86_64 images.

#### Check your current AVD:

```bash
$ANDROID_HOME/emulator/emulator -list-avds
```

#### Create a new AVD with x86_64 image:

1. Open Android Studio
2. Go to **Tools** → **Device Manager**
3. Click **Create Device**
4. Select a device (e.g., Pixel 5)
5. **IMPORTANT:** Select a system image with **x86_64** architecture (not ARM)
   - Look for: "x86_64" in the system image name
   - Recommended: "Tiramisu" (Android 13) x86_64 or "S" (Android 12) x86_64
6. Click **Finish**

#### Or via command line:

```bash
# List available system images
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list | grep "system-images"

# Install x86_64 system image (example for Android 13)
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "system-images;android-33;google_apis;x86_64"

# Create AVD
$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd -n Pixel5_API33 -k "system-images;android-33;google_apis;x86_64" -d "pixel_5"
```

### 3. Optimize Emulator Settings

#### In Android Studio Device Manager:

1. Open **Tools** → **Device Manager**
2. Click the **pencil icon** (Edit) next to your AVD
3. Click **Show Advanced Settings**
4. Adjust these settings:
   - **RAM:** 4096 MB (or more if you have 16GB+ system RAM)
   - **VM heap:** 512 MB
   - **Internal Storage:** 4096 MB
   - **SD Card:** 512 MB (optional)
   - **Graphics:** Select **Hardware - GLES 2.0** (hardware acceleration)
   - **Boot option:** **Cold Boot** (more stable, but slower startup)
   - **Multi-Core CPU:** Set to **4** (or match your CPU cores, max 4)

#### Via AVD config file:

Edit `~/.android/avd/YOUR_AVD_NAME.avd/config.ini`:

```ini
# Increase RAM
hw.ramSize = 4096

# Enable hardware acceleration
hw.gpu.enabled = yes
hw.gpu.mode = host

# Use multiple CPU cores
hw.cpu.ncore = 4

# Use hardware graphics
skin.dynamic = yes
```

### 4. Launch Emulator with Performance Flags

Instead of launching from Android Studio, launch from terminal with optimized flags:

```bash
# Launch with hardware acceleration and performance flags
$ANDROID_HOME/emulator/emulator -avd YOUR_AVD_NAME \
  -gpu host \
  -accel on \
  -memory 4096 \
  -cores 4 \
  -no-snapshot-load \
  -wipe-data
```

**Note:** Replace `YOUR_AVD_NAME` with your actual AVD name (check with `$ANDROID_HOME/emulator/emulator -list-avds`)

#### Create a helper script:

Create `start-emulator.sh` in your project root:

```bash
#!/bin/bash
AVD_NAME=$(basename $(ls -td ~/.android/avd/*.avd | head -1) .avd)
$ANDROID_HOME/emulator/emulator -avd "$AVD_NAME" \
  -gpu host \
  -accel on \
  -memory 4096 \
  -cores 4 \
  -no-snapshot-load
```

Make it executable:

```bash
chmod +x start-emulator.sh
```

### 5. Disable Unnecessary Features

In the emulator settings, disable features you don't need:

- **Location services** (if not needed)
- **Camera** (if not needed)
- **Microphone** (if not needed)
- **Sensors** (if not needed)

### 6. Use Quick Boot (After Initial Setup)

Once your emulator is set up, you can use Quick Boot for faster startup:

1. In AVD settings, set **Boot option** to **Quick Boot**
2. This saves the emulator state for faster restarts

**Note:** If you experience issues, switch back to Cold Boot.

## Alternative Solutions

### Option 1: Use a Physical Device (Fastest)

Physical devices are almost always faster than emulators:

1. Enable USB debugging on your phone
2. Connect via USB
3. Run: `npm run android`

See [Deploy to Physical Android Device](./DEPLOY_TO_DEVICE.md) for detailed instructions.

### Option 2: Use Genymotion (Alternative Emulator)

Genymotion is often faster than the default Android emulator:

1. Download from: https://www.genymotion.com/
2. Install and create a virtual device
3. Use it instead of Android Studio's emulator

### Option 3: Use Android Emulator in Headless Mode

For testing without GUI (faster):

```bash
$ANDROID_HOME/emulator/emulator -avd YOUR_AVD_NAME -no-window
```

Then use ADB to interact:

```bash
adb shell
```

## Troubleshooting

### Issue: "KVM is required to run this AVD"

**Solution:**

```bash
# Check if KVM is available
lsmod | grep kvm

# If not loaded, load it
sudo modprobe kvm
sudo modprobe kvm_intel  # For Intel CPUs
# OR
sudo modprobe kvm_amd    # For AMD CPUs

# Fix permissions
sudo chmod 666 /dev/kvm
```

### Issue: "emulator: ERROR: x86_64 emulation currently requires hardware acceleration"

**Solution:**

1. Make sure KVM is installed and enabled (see step 1)
2. Check BIOS settings - ensure virtualization is enabled
3. Try: `sudo chmod 666 /dev/kvm`

### Issue: Emulator still slow after all optimizations

**Solutions:**

1. **Reduce emulator resolution:** Use a smaller device profile (e.g., Pixel 3 instead of Pixel 5)
2. **Close other applications** to free up RAM
3. **Use a physical device** instead
4. **Check system resources:** `htop` or `free -h` to see available RAM
5. **Try a different Android version:** Older versions (Android 11/12) are often faster than Android 13

### Issue: Emulator hangs/freezes

**Solutions:**

1. **Cold boot:** Use Cold Boot instead of Quick Boot
2. **Wipe data:** Launch with `-wipe-data` flag
3. **Delete and recreate AVD:** Sometimes AVDs get corrupted
4. **Check logs:** `$ANDROID_HOME/emulator/emulator -avd YOUR_AVD -verbose` to see errors
5. **Reduce allocated resources:** Lower RAM/CPU if your system is struggling

### Issue: "Permission denied: /dev/kvm"

**Solution:**

```bash
sudo chmod 666 /dev/kvm
sudo usermod -aG kvm $USER
# Then log out and log back in
```

## Performance Checklist

- [ ] KVM is installed and enabled
- [ ] User is in `kvm` group (logout/login after adding)
- [ ] Using x86_64 system image (not ARM)
- [ ] Hardware graphics acceleration enabled
- [ ] Allocated sufficient RAM (4096 MB recommended)
- [ ] Using multiple CPU cores (2-4 cores)
- [ ] Launched with `-gpu host` and `-accel on` flags
- [ ] Closed unnecessary applications
- [ ] BIOS virtualization is enabled

## Quick Performance Test

After applying optimizations, test the performance:

```bash
# Start emulator with timing
time $ANDROID_HOME/emulator/emulator -avd YOUR_AVD_NAME -gpu host -accel on

# The emulator should boot in under 30 seconds (ideally 10-20 seconds)
```

## Additional Resources

- [Android Emulator Performance](https://developer.android.com/studio/run/emulator-acceleration)
- [KVM Setup Guide](https://help.ubuntu.com/community/KVM/Installation)
- [React Native Performance](https://reactnative.dev/docs/performance)

## Summary

**Most Important Steps:**

1. ✅ Enable KVM (hardware acceleration)
2. ✅ Use x86_64 system images
3. ✅ Enable hardware graphics (GPU)
4. ✅ Allocate sufficient RAM (4GB+)
5. ✅ Use multiple CPU cores

If the emulator is still slow after these steps, consider using a **physical Android device** which is almost always faster and more reliable for development.
