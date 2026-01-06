#!/bin/bash

# Android Emulator Performance Diagnostic Script
# This script checks your system for common performance issues

echo "🔍 Android Emulator Performance Diagnostic"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check 1: KVM Support
echo "1. Checking KVM (Hardware Acceleration)..."
if grep -E 'vmx|svm' /proc/cpuinfo > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ CPU supports virtualization${NC}"
else
    echo -e "   ${RED}❌ CPU does NOT support virtualization${NC}"
    echo "   → Enable virtualization in BIOS settings"
fi

if lsmod | grep -q kvm; then
    echo -e "   ${GREEN}✅ KVM module is loaded${NC}"
else
    echo -e "   ${YELLOW}⚠️  KVM module not loaded${NC}"
    echo "   → Run: sudo modprobe kvm"
fi

if [ -c /dev/kvm ]; then
    if [ -r /dev/kvm ] && [ -w /dev/kvm ]; then
        echo -e "   ${GREEN}✅ /dev/kvm is accessible${NC}"
    else
        echo -e "   ${YELLOW}⚠️  /dev/kvm exists but permissions may be wrong${NC}"
        echo "   → Run: sudo chmod 666 /dev/kvm"
    fi
else
    echo -e "   ${RED}❌ /dev/kvm not found${NC}"
    echo "   → Install KVM: sudo apt install qemu-kvm"
fi

if groups | grep -q kvm; then
    echo -e "   ${GREEN}✅ User is in kvm group${NC}"
else
    echo -e "   ${YELLOW}⚠️  User is NOT in kvm group${NC}"
    echo "   → Run: sudo usermod -aG kvm $USER"
    echo "   → Then logout and login again"
fi

echo ""

# Check 2: Android SDK
echo "2. Checking Android SDK..."
if [ -z "$ANDROID_HOME" ]; then
    echo -e "   ${YELLOW}⚠️  ANDROID_HOME not set${NC}"
    echo "   → Add to ~/.bashrc: export ANDROID_HOME=\$HOME/Android/Sdk"
else
    echo -e "   ${GREEN}✅ ANDROID_HOME is set: $ANDROID_HOME${NC}"
    
    if [ -d "$ANDROID_HOME/emulator" ]; then
        echo -e "   ${GREEN}✅ Android Emulator found${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Android Emulator not found${NC}"
        echo "   → Install via Android Studio: Tools → SDK Manager → SDK Tools → Android Emulator"
    fi
fi

echo ""

# Check 3: AVD Configuration
echo "3. Checking AVD Configuration..."
if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME/emulator" ]; then
    AVD_LIST=$($ANDROID_HOME/emulator/emulator -list-avds 2>/dev/null)
    if [ -n "$AVD_LIST" ]; then
        echo -e "   ${GREEN}✅ Found AVDs:${NC}"
        echo "$AVD_LIST" | sed 's/^/      - /'
        
        # Check first AVD config
        FIRST_AVD=$(echo "$AVD_LIST" | head -1)
        if [ -n "$FIRST_AVD" ]; then
            AVD_CONFIG="$HOME/.android/avd/${FIRST_AVD}.avd/config.ini"
            if [ -f "$AVD_CONFIG" ]; then
                echo ""
                echo "   Checking AVD: $FIRST_AVD"
                
                # Check for x86_64
                if grep -q "x86_64" "$AVD_CONFIG" 2>/dev/null; then
                    echo -e "      ${GREEN}✅ Using x86_64 architecture (good)${NC}"
                elif grep -q "arm" "$AVD_CONFIG" 2>/dev/null; then
                    echo -e "      ${RED}❌ Using ARM architecture (slow!)${NC}"
                    echo "      → Recreate AVD with x86_64 system image"
                else
                    echo -e "      ${YELLOW}⚠️  Could not determine architecture${NC}"
                fi
                
                # Check RAM
                RAM_SIZE=$(grep "hw.ramSize" "$AVD_CONFIG" 2>/dev/null | cut -d'=' -f2)
                if [ -n "$RAM_SIZE" ]; then
                    RAM_MB=$(echo "$RAM_SIZE" | sed 's/MB//')
                    if [ "$RAM_MB" -ge 4096 ]; then
                        echo -e "      ${GREEN}✅ RAM: ${RAM_SIZE} (good)${NC}"
                    else
                        echo -e "      ${YELLOW}⚠️  RAM: ${RAM_SIZE} (consider 4096 MB or more)${NC}"
                    fi
                fi
                
                # Check GPU
                GPU_MODE=$(grep "hw.gpu.mode" "$AVD_CONFIG" 2>/dev/null | cut -d'=' -f2)
                if [ "$GPU_MODE" = "host" ] || [ "$GPU_MODE" = "auto" ]; then
                    echo -e "      ${GREEN}✅ GPU mode: $GPU_MODE (good)${NC}"
                else
                    echo -e "      ${YELLOW}⚠️  GPU mode: $GPU_MODE (consider 'host' for better performance)${NC}"
                fi
            fi
        fi
    else
        echo -e "   ${YELLOW}⚠️  No AVDs found${NC}"
        echo "   → Create one in Android Studio: Tools → Device Manager → Create Device"
    fi
else
    echo -e "   ${YELLOW}⚠️  Cannot check AVDs (ANDROID_HOME not set or emulator not found)${NC}"
fi

echo ""

# Check 4: System Resources
echo "4. Checking System Resources..."
TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')
AVAIL_RAM=$(free -m | awk '/^Mem:/{print $7}')
echo "   Total RAM: ${TOTAL_RAM} MB"
echo "   Available RAM: ${AVAIL_RAM} MB"

if [ "$TOTAL_RAM" -ge 8192 ]; then
    echo -e "   ${GREEN}✅ Sufficient RAM for emulator${NC}"
elif [ "$TOTAL_RAM" -ge 4096 ]; then
    echo -e "   ${YELLOW}⚠️  Minimum RAM (4GB) - close other apps${NC}"
else
    echo -e "   ${RED}❌ Low RAM - emulator may be very slow${NC}"
fi

CPU_CORES=$(nproc)
echo "   CPU Cores: $CPU_CORES"
if [ "$CPU_CORES" -ge 4 ]; then
    echo -e "   ${GREEN}✅ Good number of CPU cores${NC}"
else
    echo -e "   ${YELLOW}⚠️  Limited CPU cores - emulator may be slower${NC}"
fi

echo ""

# Check 5: Java
echo "5. Checking Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -1)
    echo "   $JAVA_VERSION"
    if echo "$JAVA_VERSION" | grep -q "17"; then
        echo -e "   ${GREEN}✅ Java 17 (recommended)${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Not Java 17 (React Native recommends JDK 17)${NC}"
    fi
else
    echo -e "   ${RED}❌ Java not found${NC}"
fi

echo ""

# Summary and Recommendations
echo "=========================================="
echo "📋 Recommendations:"
echo ""

ISSUES=0

if ! groups | grep -q kvm; then
    echo "1. Add yourself to kvm group:"
    echo "   sudo usermod -aG kvm $USER"
    echo "   (Then logout and login)"
    ISSUES=$((ISSUES + 1))
fi

if [ ! -r /dev/kvm ] || [ ! -w /dev/kvm ]; then
    echo "2. Fix KVM permissions:"
    echo "   sudo chmod 666 /dev/kvm"
    ISSUES=$((ISSUES + 1))
fi

if [ -z "$ANDROID_HOME" ]; then
    echo "3. Set ANDROID_HOME environment variable"
    ISSUES=$((ISSUES + 1))
fi

if [ "$ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✅ Your system looks good!${NC}"
    echo ""
    echo "If emulator is still slow, try:"
    echo "  - Use x86_64 system images (not ARM)"
    echo "  - Launch with: -gpu host -accel on flags"
    echo "  - Consider using a physical device"
    echo ""
    echo "See EMULATOR_PERFORMANCE.md for detailed optimization guide."
else
    echo ""
    echo -e "${YELLOW}⚠️  Found $ISSUES issue(s) that should be fixed${NC}"
    echo ""
    echo "See EMULATOR_PERFORMANCE.md for detailed solutions."
fi
