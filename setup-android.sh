#!/bin/bash

# Android Development Environment Setup Script for React Native
# This script automates the setup process for Ubuntu/Debian systems

set -e

echo "🚀 Setting up Android Development Environment for React Native"
echo "=============================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}❌ This script is designed for Linux systems${NC}"
    exit 1
fi

# Step 1: Install Java JDK 17
echo -e "\n${YELLOW}Step 1: Installing Java JDK 17...${NC}"
if java -version 2>&1 | grep -q "17"; then
    echo -e "${GREEN}✅ Java 17 is already installed${NC}"
else
    echo "Installing OpenJDK 17..."
    sudo apt update
    sudo apt install openjdk-17-jdk -y
    
    # Set JAVA_HOME
    if ! grep -q "JAVA_HOME" ~/.bashrc; then
        echo "" >> ~/.bashrc
        echo "# Java Home" >> ~/.bashrc
        echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> ~/.bashrc
        echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
        echo -e "${GREEN}✅ JAVA_HOME added to ~/.bashrc${NC}"
    fi
    
    source ~/.bashrc
    echo -e "${GREEN}✅ Java 17 installed successfully${NC}"
fi

# Step 2: Check for Android Studio
echo -e "\n${YELLOW}Step 2: Checking Android Studio installation...${NC}"
if command -v android-studio &> /dev/null || [ -d "$HOME/Android/Sdk" ] || [ -d "$HOME/snap/android-studio" ]; then
    echo -e "${GREEN}✅ Android Studio appears to be installed${NC}"
else
    echo -e "${YELLOW}⚠️  Android Studio not found. Please install it:${NC}"
    echo "   Option 1 (Snap): sudo snap install android-studio --classic"
    echo "   Option 2: Download from https://developer.android.com/studio"
    echo ""
    read -p "Do you want to install Android Studio via snap now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo snap install android-studio --classic
        echo -e "${GREEN}✅ Android Studio installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Please install Android Studio manually and run this script again${NC}"
    fi
fi

# Step 3: Set up Android SDK environment variables
echo -e "\n${YELLOW}Step 3: Setting up Android SDK environment variables...${NC}"

# Detect Android SDK location
ANDROID_SDK_PATH=""
if [ -d "$HOME/Android/Sdk" ]; then
    ANDROID_SDK_PATH="$HOME/Android/Sdk"
elif [ -d "$HOME/snap/android-studio/current/Android/Sdk" ]; then
    ANDROID_SDK_PATH="$HOME/snap/android-studio/current/Android/Sdk"
else
    echo -e "${YELLOW}⚠️  Android SDK not found in default locations${NC}"
    read -p "Enter Android SDK path (or press Enter to skip): " ANDROID_SDK_PATH
fi

if [ -n "$ANDROID_SDK_PATH" ] && [ -d "$ANDROID_SDK_PATH" ]; then
    # Add to bashrc if not already present
    if ! grep -q "ANDROID_HOME" ~/.bashrc; then
        echo "" >> ~/.bashrc
        echo "# Android SDK" >> ~/.bashrc
        echo "export ANDROID_HOME=$ANDROID_SDK_PATH" >> ~/.bashrc
        echo "export PATH=\$PATH:\$ANDROID_HOME/emulator" >> ~/.bashrc
        echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.bashrc
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools" >> ~/.bashrc
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools/bin" >> ~/.bashrc
        echo -e "${GREEN}✅ Android SDK environment variables added to ~/.bashrc${NC}"
    else
        echo -e "${GREEN}✅ Android SDK environment variables already in ~/.bashrc${NC}"
    fi
    
    source ~/.bashrc
else
    echo -e "${YELLOW}⚠️  Could not set ANDROID_HOME. Please set it manually.${NC}"
fi


# Add user to kvm group
if ! groups | grep -q kvm; then
    sudo adduser $USER kvm
    echo -e "${GREEN}✅ Added user to kvm group (logout/login required)${NC}"
fi

# Step 5: Verify installations
echo -e "\n${YELLOW}Step 5: Verifying installations...${NC}"

echo -n "Java: "
if java -version 2>&1 | head -n 1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo -n "Android SDK: "
if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✅ ($ANDROID_HOME)${NC}"
else
    echo -e "${YELLOW}⚠️  (Please set ANDROID_HOME)${NC}"
fi

echo -n "ADB: "
if command -v adb &> /dev/null; then
    adb version | head -n 1
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  (ADB not in PATH - may need to source ~/.bashrc)${NC}"
fi

# Step 6: Final instructions
echo -e "\n${GREEN}=============================================================="
echo "Setup Complete!"
echo "==============================================================${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. ${YELLOW}Reload your shell configuration:${NC}"
echo "   source ~/.bashrc"
echo "   # OR restart your terminal"
echo ""
echo "2. ${YELLOW}Open Android Studio and install SDK components:${NC}"
echo "   - Tools → SDK Manager"
echo "   - Install Android 13.0 (API 33) and Android 12.0 (API 31)"
echo "   - Install Android SDK Build-Tools, Platform-Tools, and Emulator"
echo ""
echo "3. ${YELLOW}Create an Android Virtual Device (AVD):${NC}"
echo "   - Tools → Device Manager → Create Device"
echo ""
echo "4. ${YELLOW}Add your TMDB API key to src/config/api.js${NC}"
echo ""
echo "5. ${YELLOW}Install project dependencies:${NC}"
echo "   npm install"
echo ""
echo "6. ${YELLOW}Run the app:${NC}"
echo "   npm run android"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"


