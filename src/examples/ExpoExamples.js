/**
 * Example file showing how to use Expo modules in this project
 * 
 * This file demonstrates various Expo APIs you can now use.
 * You can import and use these in any of your components.
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import {StatusBar} from 'expo-status-bar';

// Example: Using Expo Constants
export const ExpoConstantsExample = () => {
  return (
    <View style={styles.container}>
      <Text>App Version: {Constants.expoConfig?.version}</Text>
      <Text>Device Name: {Constants.deviceName}</Text>
      <Text>Platform: {Constants.platform?.ios ? 'iOS' : 'Android'}</Text>
    </View>
  );
};

// Example: Using Expo Status Bar
export const ExpoStatusBarExample = () => {
  return (
    <>
      {/* Expo StatusBar - more features than React Native's StatusBar */}
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text>Using Expo StatusBar</Text>
      </View>
    </>
  );
};

// You can now use other Expo modules like:
// - expo-camera: import {Camera} from 'expo-camera'
// - expo-location: import * as Location from 'expo-location'
// - expo-notifications: import * as Notifications from 'expo-notifications'
// - expo-sharing: import * as Sharing from 'expo-sharing'
// - expo-file-system: import * as FileSystem from 'expo-file-system'
// - expo-image-picker: import * as ImagePicker from 'expo-image-picker'
// - expo-av: import {Audio, Video} from 'expo-av'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


