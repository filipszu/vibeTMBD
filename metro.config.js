const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {getDefaultConfig: getExpoDefaultConfig} = require('expo/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const reactNativeConfig = getDefaultConfig(__dirname);
const expoConfig = getExpoDefaultConfig(__dirname);

const config = mergeConfig(reactNativeConfig, expoConfig);

module.exports = config;

